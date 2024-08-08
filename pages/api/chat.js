// import { connectToDatabase } from '../../lib/db';
// import axios from 'axios';
// import { ObjectId } from 'mongodb';
// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = new twilio(accountSid, authToken);

// export default async function handler(req, res) {
//   const { message, assistantId } = req.body;

//   console.log('Received message:', message);
//   console.log('Received assistantId:', assistantId);

//   if (!message || !assistantId) {
//     return res.status(400).json({ error: 'Message and assistantId are required' });
//   }

//   try {
//     const db = await connectToDatabase();
//     const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

//     if (!assistant) {
//       return res.status(404).json({ error: 'Assistant not found' });
//     }

//     if (!assistant.settings) {
//       return res.status(500).json({ error: 'Assistant settings not found' });
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

import { connectToDatabase } from '../../lib/db';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

export default async function handler(req, res) {
  const { message, assistantId } = req.body;

  console.log('Received message:', message);
  console.log('Received assistantId:', assistantId);

  if (!message || !assistantId) {
    return res.status(400).json({ error: 'Message and assistantId are required' });
  }

  try {
    const { db } = await connectToDatabase(); // Destructure to get db object
    const collection = db.collection('assistants');

    const assistant = await collection.findOne({ _id: new ObjectId(assistantId) });

    if (!assistant) {
      return res.status(404).json({ error: 'Assistant not found' });
    }

    if (!assistant.settings) {
      return res.status(500).json({ error: 'Assistant settings not found' });
    }

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

    const botMessage = response.data.choices[0].message.content.trim();

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
