import { connectToDatabase } from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email } = decoded;

      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!user.verified) {
        return res.status(403).json({ message: 'Email not verified', isVerified: false });
      }

      return res.status(200).json({ message: 'User verified', isVerified: true });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
