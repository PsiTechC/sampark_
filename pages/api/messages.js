// // C:\botGIT\botGIT-main\pages\api\messages.js

// import { connectToDatabase } from '../../lib/db';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//   try {
//     const { db } = await connectToDatabase(); // Destructure to get db object
//     const collection = db.collection('messages');

//     if (req.method === 'POST') {
//       const { message, assistantId, sender } = req.body;
//       try {
//         const result = await collection.insertOne({
//           assistantId: new ObjectId(assistantId),
//           sender,
//           content: message,
//           timestamp: new Date(),
//         });
//         res.status(201).json({ insertedId: result.insertedId });
//       } catch (error) {
//         console.error('Error saving message:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     } else if (req.method === 'GET') {
//       const { assistantId } = req.query;
//       try {
//         const messages = await collection.find({ assistantId: new ObjectId(assistantId) }).sort({ timestamp: 1 }).toArray();
//         res.status(200).json(messages);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     } else {
//       res.setHeader('Allow', ['GET', 'POST']);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
//   } catch (err) {
//     console.error('Database connection error:', err);
//     res.status(500).json({ error: 'Internal Server Error', details: 'Database connection failed' });
//   }
// }


import { connectToDatabase } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('messages');

    if (req.method === 'POST') {
      const { message, assistantId, sender } = req.body;
      try {
        const result = await collection.insertOne({
          assistantId: new ObjectId(assistantId),
          sender,
          content: Buffer.from(message, "utf-8").toString(), // Ensure UTF-8 encoding
          timestamp: new Date(),
        });
        res.status(201).json({ insertedId: result.insertedId });
      } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    } else if (req.method === 'GET') {
      const { assistantId } = req.query;
      
      try {
        let query = {};

        // Handle cases where assistantId is stored as a string
        if (ObjectId.isValid(assistantId)) {
          query = { assistantId: new ObjectId(assistantId) };
        } else {
          query = { assistantId };
        }

        let messagesCursor = collection.find(query).sort({ timestamp: 1 });

        let messages = [];
        while (await messagesCursor.hasNext()) {
          try {
            let msg = await messagesCursor.next();
            JSON.stringify(msg); // Try to encode message
            messages.push(msg);
          } catch (error) {
            console.warn("Skipping corrupt message:", error.message);
          }
        }

        res.status(200).json(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: 'Database connection failed' });
  }
}
