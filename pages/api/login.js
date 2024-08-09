// C:\Users\***REMOVED*** kale\botGIT\pages\api\login.js

import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  console.log("Login attempt received");

  if (req.method !== 'POST') {
    console.log("Invalid request method:", req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  console.log("Received email:", email);

  try {
    const { db } = await connectToDatabase();

    // Look for the user in both users and clients collections
    let user = await db.collection('users').findOne({ email });

    if (!user) {
      user = await db.collection('clients').findOne({ email });
      console.log("User not found in 'users', checking 'clients'");
    }

    if (!user) {
      console.log("User not found in both 'users' and 'clients'");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if it's the first login
    if (user.firstLogin) {
      console.log("First login detected, redirecting to password reset");
      return res.status(200).json({
        firstLogin: true,
        clientId: user._id,
      });
    }

    // If not the first login, proceed with generating a token
    const tokenPayload = { email: user.email, clientId: user._id, role: user.role || 'client' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Login successful, returning token");

    res.status(200).json({
      token,
      role: user.role || 'client',
      clientId: user._id,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
