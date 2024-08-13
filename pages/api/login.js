import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const { db } = await connectToDatabase();

      console.log(`[LOGIN] Attempting login for email: ${email}`);

      // Search for user in both 'users' and 'clients' collections
      let user = await db.collection('users').findOne({ email });
      if (!user) {
        console.log(`[LOGIN] Email not found in 'users' collection, checking 'clients' collection.`);
        user = await db.collection('clients').findOne({ email });
      }

      if (!user) {
        console.error(`[LOGIN] Invalid email: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      console.log(`[LOGIN] User found: ${user.email} (ID: ${user._id})`);

      // Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`[LOGIN] Password comparison result for user ${user.email}: ${isPasswordValid}`);

      if (!isPasswordValid) {
        console.error(`[LOGIN] Invalid password for email: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // If it's the first login, redirect to the password reset page
      if (user.firstLogin) {
        console.log(`[LOGIN] First login detected for user: ${user.email}`);
        return res.status(200).json({ firstLogin: true, clientId: user._id });
      }

      // Create a JWT token
      const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log(`[LOGIN] JWT token generated for user: ${user.email}`);

      res.status(200).json({ token, role: user.role, clientId: user._id });
    } catch (error) {
      console.error(`[LOGIN] Login error for email: ${email}`, error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    console.error(`[LOGIN] Invalid request method: ${req.method}`);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
