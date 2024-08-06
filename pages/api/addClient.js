import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const db = await connectToDatabase();
  await db.collection('users').insertOne({ email, password: hashedPassword, role });

  res.status(200).json({ message: 'Client added successfully' });
}
