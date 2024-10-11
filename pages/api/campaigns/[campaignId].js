//C:\botGIT\botGIT-main\pages\api\campaigns\[campaignId].js

// import { connectToDatabase } from '../../../lib/db';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//   const { campaignId } = req.query;

//   // Log the received campaignId for debugging
//   console.log('Campaign ID received:', campaignId);

//   // Check if campaignId exists and is a valid ObjectId
//   if (!campaignId || !ObjectId.isValid(campaignId)) {
//     return res.status(400).json({ message: 'Invalid or missing campaign ID' });
//   }

//   if (req.method === 'GET') {
//     try {
//       const { db } = await connectToDatabase();

//       // Fetch the campaign with the given campaignId
//       const campaign = await db.collection('campaigns').findOne({ _id: new ObjectId(campaignId) });

//       // If no campaign is found, return a 404
//       if (!campaign) {
//         return res.status(404).json({ message: 'Campaign not found' });
//       }

//       // Return the campaign details
//       return res.status(200).json(campaign);
//     } catch (error) {
//       console.error('Error fetching campaign:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     // If the method is not GET, return a 405 (Method Not Allowed)
//     return res.status(405).json({ message: 'Method not allowed' });
//   }


// }




import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

// A helper function to parse JSON body manually
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

export default async function handler(req, res) {
  const { campaignId } = req.query;

  if (req.method === 'GET') {
    console.log('Campaign ID received:', campaignId);

    if (!campaignId || !ObjectId.isValid(campaignId)) {
      return res.status(400).json({ message: 'Invalid or missing campaign ID' });
    }

    try {
      const { db } = await connectToDatabase();
      const campaign = await db.collection('campaigns').findOne({ _id: new ObjectId(campaignId) });

      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      return res.status(200).json(campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      // Parse the body manually
      const body = await parseBody(req);
      
      // Log the parsed body for debugging
      console.log('Parsed body:', body);

      const { clientId, name, startDate, status, totalInteractions } = body;

      // Ensure required fields are provided
      if (!clientId || !name || !startDate || !status) {
        console.error('Required fields are missing:', { clientId, name, startDate, status });
        return res.status(400).json({ message: 'clientId, name, startDate, and status are required' });
      }

      const { db } = await connectToDatabase();

      const result = await db.collection('campaigns').insertOne({
        clientId,
        name,
        startDate,
        status,
        totalInteractions: totalInteractions || 0,
      });

      return res.status(201).json({ message: 'Campaign created', campaignId: result.insertedId });
    } catch (error) {
      console.error('Error creating campaign:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
