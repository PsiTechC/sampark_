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


// pages/api/chat.js
import pool from '../../lib/db';
import axios from 'axios';

export default async function handler(req, res) {
  const { message, assistantId } = req.body;

  if (!message || !assistantId) {
    return res.status(400).json({ error: 'Message and assistantId are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM assistants WHERE id = $1', [assistantId]);
    const assistant = result.rows[0];

    if (!assistant) {
      return res.status(404).json({ error: 'Assistant not found' });
    }

    // Use the correct OpenAI API endpoint for GPT-4
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: assistant.instructions },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: assistant.temperature,
      top_p: assistant.top_p
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const botMessage = response.data.choices[0].message.content.trim();

    // Save user and bot messages to the database
    await pool.query(
      'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
      [assistantId, 'user', message]
    );
    await pool.query(
      'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
      [assistantId, 'assistant', botMessage]
    );

    res.status(200).json({ message: botMessage });
  } catch (error) {
    console.error('Error handling chat:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
