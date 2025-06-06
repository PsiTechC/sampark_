import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { clientId } = req.query;

    if (!clientId) {
      return res.status(400).json({ message: 'Missing clientId' });
    }

    const { db } = await connectToDatabase();
    const mapping = await db.collection('useragentmapping').findOne({
      userId: new ObjectId(clientId)
    });

    if (!mapping || !Array.isArray(mapping.assistants)) {
      return res.status(200).json({ bots: [] });
    }

    // You might later want to populate bot details from another collection.
    // For now, we return bot IDs
    res.status(200).json({ bots: mapping.assistants });
  } catch (err) {
    console.error("Failed to fetch bots:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
