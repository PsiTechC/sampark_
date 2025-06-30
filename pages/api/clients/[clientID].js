import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  console.log(`[REQUEST HANDLER] Received request with query: ${JSON.stringify(req.query)}`);

  const { clientID } = req.query;

  console.log(`[REQUEST HANDLER] Extracted clientID: ${clientID}`);

  if (!clientID) {
    console.error(`[REQUEST HANDLER] clientID is undefined or missing`);
    return res.status(400).json({ message: 'clientID is required' });
  }

  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const objectId = new ObjectId(clientID);

      const client = await db.collection('users').findOne({ _id: objectId }); // Changed from 'clients' to 'users'
      if (!client) {
        console.error(`[GET CLIENT] Client not found for ID: ${clientID}`);
        return res.status(404).json({ message: 'Client not found' });
      }

      console.log(`[GET CLIENT] Retrieved client: ${JSON.stringify(client)}`);
      return res.status(200).json(client);
    } catch (error) {
      console.error(`[GET CLIENT] Internal server error while fetching data for client: ${clientID}`, error);
      return res.status(500).json({ message: 'Internal server error occurred while fetching client data.' });
    }
  } else {
    console.error(`[REQUEST HANDLER] Invalid method: ${req.method}`);
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
