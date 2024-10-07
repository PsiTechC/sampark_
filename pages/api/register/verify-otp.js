import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  try {
    const { db } = await connectToDatabase();
    
    // Find user by email
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the provided OTP matches the one stored in the database
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update the user status to verified and remove the OTP
    await db.collection('users').updateOne(
      { email },
      { $set: { verified: true }, $unset: { otp: '' } }
    );

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
