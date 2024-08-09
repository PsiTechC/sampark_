import { connectToDatabase } from '../../lib/db';  // Server-side only
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const { db } = await connectToDatabase();

    let user = await db.collection('users').findOne({ email });

    if (!user) {
      user = await db.collection('clients').findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokenPayload = { email: user.email, clientId: user._id, role: user.role || 'client' };

    res.status(200).json({
      token: jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' }),
      role: user.role || 'client',
      clientId: user._id,
    });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
