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
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { assistantId, sender, content } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO messages (assistant_id, sender, content, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [assistantId, sender, content]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else if (req.method === 'GET') {
    const { assistantId } = req.query;
    try {
      const result = await pool.query('SELECT * FROM messages WHERE assistant_id = $1 ORDER BY timestamp ASC', [assistantId]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
