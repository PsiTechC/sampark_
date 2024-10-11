import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { clientId } = req.query; // Get clientId from query params

  if (!clientId) {
    return res.status(400).json({ message: 'clientId is required' });
  }

  try {
    const { db } = await connectToDatabase();

    // Fetch campaigns associated with the clientId
    const campaigns = await db.collection('campaigns').find({ clientId }).toArray();

    if (campaigns.length === 0) {
      return res.status(404).json({ message: 'No campaigns found for this client' });
    }

    return res.status(200).json(campaigns); // Return the campaigns
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
