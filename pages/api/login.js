import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.status(200).json({ role: user.role });
}
