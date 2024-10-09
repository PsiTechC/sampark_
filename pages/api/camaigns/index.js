// pages/api/campaigns/index.js

import { connectToDatabase } from '../../../lib/db'; // Import the db connection utility

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase(); // Connect to the database
      const campaigns = await db.collection('campaigns').find().toArray(); // Fetch all campaigns from 'campaigns' collection

      // Return the campaigns as a JSON response
      res.status(200).json(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({ message: 'Failed to load campaigns' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
