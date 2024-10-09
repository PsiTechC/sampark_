import { connectToDatabase } from '../../../lib/db'; // Adjust the path to your db.js

export default async function handler(req, res) {
  const { clientId } = req.query; // Extract the clientId from the URL

  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase(); // Connect to the database

      // Fetch all campaigns for the given clientId
      const campaigns = await db.collection('campaigns').find({ clientId: clientId }).toArray();

      if (!campaigns || campaigns.length === 0) {
        return res.status(404).json({ message: 'No campaigns found for this client' });
      }

      // Successfully return the campaign data
      return res.status(200).json(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
