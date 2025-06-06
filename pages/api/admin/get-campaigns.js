import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { botId } = req.query;

    if (!botId) {
      return res.status(400).json({ message: 'Missing botId' });
    }

    const { db } = await connectToDatabase();
    const campaigns = await db.collection('campaigns')
      .find({ botId: new ObjectId(botId) })
      .toArray();

    res.status(200).json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
