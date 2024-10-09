import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb

export default async function handler(req, res) {
  const { campaignId } = req.query;

  // Check if campaignId exists and is a valid ObjectId
  if (!campaignId || !ObjectId.isValid(campaignId)) {
    return res.status(400).json({ message: 'Invalid or missing campaign ID' });
  }

  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      
      // Convert campaignId to ObjectId and fetch the campaign
      const campaign = await db.collection('campaigns').findOne({ _id: new ObjectId(campaignId) });

      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      return res.status(200).json(campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
    