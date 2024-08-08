import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, licenseValidFrom, assistant, organization } = req.body;

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('clients').insertOne({
        name,
        email,
        phone,
        licenseValidFrom,
        assistant,
        organization,
      });
      res.status(201).json({ id: result.insertedId, name, email, phone, licenseValidFrom, assistant, organization });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const clients = await db.collection('clients').find({}).toArray();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
