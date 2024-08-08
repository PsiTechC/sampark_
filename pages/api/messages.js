// // // pages/api/messages.js
// // //E:\my_***REMOVED***\***REMOVED***\pages\api\messages.js
// // import pool from '../../lib/db';

// // export default async function handler(req, res) {
// //   const { assistantId } = req.query;

// //   try {
// //     const result = await pool.query('SELECT * FROM messages WHERE assistant_id = $1 ORDER BY timestamp ASC', [assistantId]);
// //     res.status(200).json(result.rows);
// //   } catch (error) {
// //     console.error('Error fetching messages:', error);
// //     res.status(500).json({ error: 'Internal Server Error', details: error.message });
// //   }
// // }

// // pages/api/messages.js


// // E:\my_***REMOVED***\***REMOVED***\pages\api\messages.js
// // pages/api/messages.js
// import pool from '../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { assistantId, sender, content } = req.body;

//     try {
//       const result = await pool.query(
//         'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3) RETURNING *',
//         [assistantId, sender, content]
//       );
//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error saving message:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'GET') {
//     const { assistantId } = req.query;
//     try {
//       const result = await pool.query('SELECT * FROM messages WHERE assistant_id = $1 ORDER BY timestamp ASC', [assistantId]);
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }
// pages/api/messages.js
// import pool from '../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { assistantId, sender, content } = req.body;

//     try {
//       const result = await pool.query(
//         'INSERT INTO messages (assistant_id, sender, content, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *',
//         [assistantId, sender, content]
//       );
//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error saving message:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'GET') {
//     const { assistantId } = req.query;
//     try {
//       const result = await pool.query('SELECT * FROM messages WHERE assistant_id = $1 ORDER BY timestamp ASC', [assistantId]);
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }



// pages/api/messages.js
// import { connectToDatabase } from '../../lib/db';

// export default async function handler(req, res) {
//   try {
//     const db = await connectToDatabase();
//     const collection = db.collection('messages');

//     if (req.method === 'POST') {
//       const { assistantId, sender, content } = req.body;
//       try {
//         const result = await collection.insertOne({
//           assistantId,
//           sender,
//           content,
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
//         const messages = await collection.find({ assistantId }).sort({ timestamp: 1 }).toArray();
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







// everything working before twilio
// import { connectToDatabase } from '../../lib/db';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//   try {
//     const db = await connectToDatabase();
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


// import { connectToDatabase } from '../../lib/db';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//   try {
//     const db = await connectToDatabase();
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
    const { db } = await connectToDatabase(); // Destructure to get db object
    const collection = db.collection('messages');

    if (req.method === 'POST') {
      const { message, assistantId, sender } = req.body;
      try {
        const result = await collection.insertOne({
          assistantId: new ObjectId(assistantId),
          sender,
          content: message,
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
        const messages = await collection.find({ assistantId: new ObjectId(assistantId) }).sort({ timestamp: 1 }).toArray();
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
