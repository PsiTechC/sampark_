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

