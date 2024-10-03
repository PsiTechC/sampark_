// C:\Users\***REMOVED*** kale\botGIT\pages\api\register\verify_email.js
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user to mark as verified
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { verified: true } }
    );

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
