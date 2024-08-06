// // pages/api/chat.js
// import pool from '../../lib/db';
// import axios from 'axios';

// export default async function handler(req, res) {
//   const { message, assistantId } = req.body;

//   try {
//     const result = await pool.query('SELECT * FROM assistants WHERE id = $1', [assistantId]);
//     const assistant = result.rows[0];

//     if (!assistant) {
//       return res.status(404).json({ error: 'Assistant not found' });
//     }

//     // Use the correct OpenAI API endpoint for GPT-4
//     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//       model: 'gpt-4',
//       messages: [
//         { role: 'system', content: assistant.instructions },
//         { role: 'user', content: message }
//       ],
//       max_tokens: 150,
//       temperature: assistant.temperature,
//       top_p: assistant.top_p
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const botMessage = response.data.choices[0].message.content.trim();

//     res.status(200).json({ message: botMessage });
//   } catch (error) {
//     console.error('Error handling chat:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }


// pages/api/chat.js
// import pool from '../../lib/db';
// import axios from 'axios';

// export default async function handler(req, res) {
//   const { message, assistantId } = req.body;

//   try {
//     const result = await pool.query('SELECT * FROM assistants WHERE id = $1', [assistantId]);
//     const assistant = result.rows[0];

//     if (!assistant) {
//       return res.status(404).json({ error: 'Assistant not found' });
//     }

//     // Use the correct OpenAI API endpoint for GPT-4
//     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//       model: 'gpt-4',
//       messages: [
//         { role: 'system', content: assistant.instructions },
//         { role: 'user', content: message }
//       ],
//       max_tokens: 150,
//       temperature: assistant.temperature,
//       top_p: assistant.top_p
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const botMessage = response.data.choices[0].message.content.trim();

//     res.status(200).json({ message: botMessage });
//   } catch (error) {
//     console.error('Error handling chat:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }


// pages/api/chat.js without errors
// import pool from '../../lib/db';
// import axios from 'axios';

// export default async function handler(req, res) {
//   const { message, assistantId } = req.body;

//   if (!message || !assistantId) {
//     return res.status(400).json({ error: 'Message and assistantId are required' });
//   }

//   try {
//     const result = await pool.query('SELECT * FROM assistants WHERE id = $1', [assistantId]);
//     const assistant = result.rows[0];

//     if (!assistant) {
//       return res.status(404).json({ error: 'Assistant not found' });
//     }

//     // Use the correct OpenAI API endpoint for GPT-4
//     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//       model: 'gpt-4',
//       messages: [
//         { role: 'system', content: assistant.instructions },
//         { role: 'user', content: message }
//       ],
//       max_tokens: 150,
//       temperature: assistant.temperature,
//       top_p: assistant.top_p
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const botMessage = response.data.choices[0].message.content.trim();

//     // Save user and bot messages to the database
//     await pool.query(
//       'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
//       [assistantId, 'user', message]
//     );
//     await pool.query(
//       'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
//       [assistantId, 'assistant', botMessage]
//     );

//     res.status(200).json({ message: botMessage });
//   } catch (error) {
//     console.error('Error handling chat:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }

// /pages/api/chat.js
//some questions like 'who made you' are added
// import pool from '../../lib/db';
// import axios from 'axios';

// export default async function handler(req, res) {
//   const { message, assistantId } = req.body;

//   if (!message || !assistantId) {
//     return res.status(400).json({ error: 'Message and assistantId are required' });
//   }

//   try {
//     const result = await pool.query('SELECT * FROM assistants WHERE id = $1', [assistantId]);
//     const assistant = result.rows[0];

//     if (!assistant) {
//       return res.status(404).json({ error: 'Assistant not found' });
//     }

//     // Keywords or phrases to check
//     const keywords = [
//       'who made you',
//       'who is your creator',
//       'who created you',
//       'who built you',
//       'who developed you',
//       'who designed you',
//       'who programmed you',
//       'who is your maker',
//       'who is your designer',
//       'who is your developer',
//       'who is your programmer',
//       'who is your inventor',
//       'who invented you',
//       'who is the team behind you',
//       'who is the company behind you',
//       'who made this assistant',
//       'who built this assistant',
//       'who developed this assistant',
//       'who designed this assistant',
//       'who programmed this assistant',
//       'who created this assistant',
//       'who is behind you',
//       'who is behind this assistant',
//       'who is responsible for you',
//       'who is responsible for this assistant',
//       'who constructed you',
//       'who constructed this assistant',
//       'who engineered you',
//       'who engineered this assistant',
//       'who manufactured you',
//       'who manufactured this assistant',
//       'who produced you',
//       'who produced this assistant',
//       'who brought you into existence',
//       'who brought this assistant into existence',
//       'who was the creator of you',
//       'who was the creator of this assistant',
//       'what company made you',
//       'what company built you',
//       'what company developed you',
//       'what company designed you',
//       'what company programmed you',
//       'what company created you',
//       'what team made you',
//       'what team built you',
//       'what team developed you',
//       'what team designed you',
//       'what team programmed you',
//       'what team created you',
//       'which company made you',
//       'which company built you',
//       'which company developed you',
//       'which company designed you',
//       'which company programmed you',
//       'which company created you',
//       'which team made you',
//       'which team built you',
//       'which team developed you',
//       'which team designed you',
//       'which team programmed you',
//       'which team created you'
//     ];
    

//     // Check if the message contains any of the keywords
//     const containsKeyword = keywords.some(keyword =>
//       message.toLowerCase().includes(keyword)
//     );

//     if (containsKeyword) {
//       // Respond with the predefined message
//       const predefinedResponse = 'Made by PSI Consultancy Service using OpenAI';
      
//       // Save user and predefined bot messages to the database
//       await pool.query(
//         'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
//         [assistantId, 'user', message]
//       );
//       await pool.query(
//         'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
//         [assistantId, 'assistant', predefinedResponse]
//       );

//       return res.status(200).json({ message: predefinedResponse });
//     }

//     // Use the correct OpenAI API endpoint for GPT-4
//     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//       model: 'gpt-4',
//       messages: [
//         { role: 'system', content: assistant.instructions },
//         { role: 'user', content: message }
//       ],
//       max_tokens: 150,
//       temperature: assistant.temperature,
//       top_p: assistant.top_p
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const botMessage = response.data.choices[0].message.content.trim();

//     // Save user and bot messages to the database
//     await pool.query(
//       'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
//       [assistantId, 'user', message]
//     );
//     await pool.query(
//       'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
//       [assistantId, 'assistant', botMessage]
//     );

//     res.status(200).json({ message: botMessage });
//   } catch (error) {
//     console.error('Error handling chat:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }


// import { connectToDatabase } from '../../lib/db';
// import axios from 'axios';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//   const { message, assistantId } = req.body;

//   console.log('Received message:', message);  // Debug log
//   console.log('Received assistantId:', assistantId);  // Debug log

//   if (!message || !assistantId) {
//     return res.status(400).json({ error: 'Message and assistantId are required' });
//   }

//   try {
//     const db = await connectToDatabase();
//     const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

//     if (!assistant) {
//       return res.status(404).json({ error: 'Assistant not found' });
//     }

//     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//       model: 'gpt-4-turbo',
//       messages: [
//         { role: 'system', content: assistant.instructions },
//         { role: 'user', content: message }
//       ],
//       max_tokens: assistant.settings.maxTokens,
//       temperature: assistant.settings.temperature,
//       top_p: assistant.settings.topP,
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const botMessage = response.data.choices[0].message.content.trim();

//     await db.collection('messages').insertMany([
//       {
//         assistantId: new ObjectId(assistantId),
//         sender: 'user',
//         content: message,
//         timestamp: new Date()
//       },
//       {
//         assistantId: new ObjectId(assistantId),
//         sender: 'assistant',
//         content: botMessage,
//         timestamp: new Date()
//       }
//     ]);

//     res.status(200).json({ message: botMessage });
//   } catch (error) {
//     console.error('Error handling chat:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }
 

// chat.js (API endpoint)
import { connectToDatabase } from '../../lib/db';
import axios from 'axios';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { message, assistantId } = req.body;

  console.log('Received message:', message);  // Debug log
  console.log('Received assistantId:', assistantId);  // Debug log

  if (!message || !assistantId) {
    return res.status(400).json({ error: 'Message and assistantId are required' });
  }

  try {
    console.log('Connecting to database...');
    const db = await connectToDatabase();
    console.log('Connected to database.');
    const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

    if (!assistant) {
      console.error('Assistant not found:', assistantId);
      return res.status(404).json({ error: 'Assistant not found' });
    }

    if (!assistant.settings) {
      console.error('Assistant settings not found for assistant:', assistant);
      return res.status(500).json({ error: 'Assistant settings not found' });
    }

    console.log('Assistant settings:', assistant.settings);

    console.log('Sending request to OpenAI API...');
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: assistant.instructions },
        { role: 'user', content: message }
      ],
      max_tokens: assistant.settings.maxTokens,
      temperature: assistant.settings.temperature,
      top_p: assistant.settings.topP,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('OpenAI API response received.');
    const botMessage = response.data.choices[0].message.content.trim();

    console.log('Inserting messages into database...');
    await db.collection('messages').insertMany([
      {
        assistantId: new ObjectId(assistantId),
        sender: 'user',
        content: message,
        timestamp: new Date()
      },
      {
        assistantId: new ObjectId(assistantId),
        sender: 'assistant',
        content: botMessage,
        timestamp: new Date()
      }
    ]);

    res.status(200).json({ message: botMessage });
  } catch (error) {
    console.error('Error handling chat:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
