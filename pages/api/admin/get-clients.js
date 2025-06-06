// pages/api/admin/get-clients.js

import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const clients = await db
      .collection('users')
      .find({ role: 'client' })
      .project({ password: 0, googleAccessToken: 0, googleRefreshToken: 0 }) // exclude sensitive fields
      .toArray();

    res.status(200).json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
