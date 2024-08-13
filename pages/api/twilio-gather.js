//bot2
import { connectToDatabase } from '../../lib/db';
import OpenAI from 'openai';
import twilio from 'twilio';
import { ObjectId } from 'mongodb';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { SpeechResult } = req.body;
  const { assistantId } = req.query;

  console.log('twilio calling');
  console.log(`Connected to AI Assistant ID: ${assistantId}`);
  console.log(`User Response: ${SpeechResult}`);

  try {
    const { db } = await connectToDatabase();
    const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

    if (!assistant) {
      const twiml = new twilio.twiml.VoiceResponse();
      twiml.say('Sorry, no assistant is available for this number.');
      res.setHeader('Content-Type', 'text/xml');
      return res.send(twiml.toString());
    }

    // Generate a response from OpenAI
    let aiResponse;
    try {
      aiResponse = await openai.chat.completions.create({
        model: assistant.model,
        messages: [
          { role: 'system', content: assistant.instructions },
          { role: 'user', content: SpeechResult },
        ],
        max_tokens: assistant.settings.maxTokens,
        temperature: assistant.settings.temperature,
      });
    } catch (error) {
      throw error;
    }

    const botMessage = aiResponse.choices[0].message.content.trim();
    console.log(`Assistant Response: ${botMessage}`);

    try {
      await db.collection('messages').insertMany([
        {
          assistantId: new ObjectId(assistant._id),
          sender: 'user',
          content: SpeechResult,
          timestamp: new Date(),
        },
        {
          assistantId: new ObjectId(assistant._id),
          sender: 'assistant',
          content: botMessage,
          timestamp: new Date(),
        }
      ]);
    } catch (error) {
      throw error;
    }

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: 'man' }, botMessage);

    // Gather again for continuous conversation
    const gatherUrl = `https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}`;
    twiml.gather({
      input: 'speech',
      action: gatherUrl,
      method: 'POST',
    }).say({ voice: 'man' }, `You can continue speaking...`);

    // Save call end message
    await db.collection('messages').insertOne({
      assistantId: new ObjectId(assistant._id),
      sender: 'system',
      content: 'call ended',
      timestamp: new Date(),
    });

    console.log('call ended');

    res.setHeader('Content-Type', 'text/xml');
    res.send(twiml.toString());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
