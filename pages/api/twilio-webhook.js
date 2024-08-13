

import { connectToDatabase } from '../../lib/db';
import twilio from 'twilio';
import { ObjectId } from 'mongodb';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { From, To } = req.body;

    console.log('twilio calling');
    console.log(`Incoming call from ${From} to ${To}`);

    try {
      const { db } = await connectToDatabase(); // Destructure to get db object
      const assistant = await db.collection('assistants').findOne({ phoneNumber: To });

      if (!assistant) {
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Sorry, no assistant is available for this number.');
        res.setHeader('Content-Type', 'text/xml');
        return res.send(twiml.toString());
      }

      const twiml = new twilio.twiml.VoiceResponse();
      const gatherUrl = `https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}`;

      twiml.gather({
        input: 'speech',
        action: gatherUrl,
        method: 'POST',
      }).say({ voice: 'alice' }, `Hello, you are connected to ${assistant.name}. How can I assist you today?`);

      // Save call start message
      await db.collection('messages').insertOne({
        assistantId: new ObjectId(assistant._id),
        sender: 'system',
        content: `call started with ${From}`,
        timestamp: new Date(),
      });

      res.setHeader('Content-Type', 'text/xml');
      res.send(twiml.toString());
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
