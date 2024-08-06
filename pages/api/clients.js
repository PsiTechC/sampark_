import { connectToDatabase } from '../../lib/db';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const clients = await db.collection('clients').find({}).toArray();
    res.json(clients);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    const newClient = await db.collection('clients').insertOne({ name });
    res.json(newClient.ops[0]);
  } else {
    res.status(405).end();
  }
};
