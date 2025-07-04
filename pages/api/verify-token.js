import { connectToDatabase } from '../../lib/db';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

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

      // ✅ Return role info
      return res.status(200).json({
        message: 'User verified',
        isVerified: true,
        role: user.role,
      });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
