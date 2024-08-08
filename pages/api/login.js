// pages/api/login.js

import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a token
    const token = jwt.sign({ email: user.email, role: user.role, clientId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user role
    res.status(200).json({ token, role: user.role, clientId: user._id });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
