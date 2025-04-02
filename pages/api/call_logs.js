// C:\botGIT\botGIT-main\pages\api\call-logs.js



// pages/api/call-logs.js

// pages/api/call-logs.js

import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection('call-logs');

  switch (method) {
    case 'GET':
      try {
        const logs = await collection.find({}).toArray();
        res.status(200).json({ success: true, data: logs });
      } catch (error) {
        console.error('Error fetching call logs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch call logs.' });
      }
      break;

    case 'POST':
      try {
        const newLog = req.body;
        const result = await collection.insertOne(newLog);
        res.status(201).json({ success: true, data: result.ops[0] });
      } catch (error) {
        console.error('Error adding call log:', error); // Log the error
        res.status(500).json({ success: false, message: 'Failed to add call log.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
