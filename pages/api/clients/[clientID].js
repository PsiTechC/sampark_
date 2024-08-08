// C:\Users\***REMOVED*** kale\botGIT\pages\api\clients\[clientID].js

// pages/api/clients/[clientId].js

import { connectToDatabase } from '../../../lib/db';
import { verifyToken } from '../../../helpers/jwt';

export default async function handler(req, res) {
  const { clientId } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    const decoded = verifyToken(token);

    if (decoded.role !== 'client' || decoded.clientId !== clientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { db } = await connectToDatabase();
    const client = await db.collection('clients').findOne({ _id: clientId });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
