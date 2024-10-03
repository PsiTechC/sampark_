// C:\Users\***REMOVED*** kale\botGIT\pages\api\auth\google.js
import { OAuth2Client } from 'google-auth-library';
import { connectToDatabase } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  const { tokenId } = req.body;

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    const { db } = await connectToDatabase();

    // Check if user already exists
    let user = await db.collection('users').findOne({ email });

    if (!user) {
      // If user does not exist, create a new user
      const newUser = await db.collection('users').insertOne({
        email,
        name,
        picture,
        role: 'client',
        verified: true, // Mark as verified since authenticated by Google
      });
      user = newUser.ops[0];
    }

    // Generate JWT token
    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Google auth failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
 