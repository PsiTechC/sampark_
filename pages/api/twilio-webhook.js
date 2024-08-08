//working call feature with very much delay
// import { connectToDatabase } from '../../lib/db';
// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// export default async function handler(req, res) {
//   console.log('twilio-webhook called');

//   if (req.method === 'POST') {
//     const { From, To } = req.body;

//     console.log(`Incoming call from ${From} to ${To}`);

//     try {
//       const db = await connectToDatabase();
//       const assistant = await db.collection('assistants').findOne({ phoneNumber: To });

//       if (!assistant) {
//         console.log('Assistant not found for number:', To);
//         const twiml = new twilio.twiml.VoiceResponse();
//         twiml.say('Sorry, no assistant is available for this number.');
//         res.setHeader('Content-Type', 'text/xml');
//         return res.send(twiml.toString());
//       }

//       const twiml = new twilio.twiml.VoiceResponse();
//       const gatherUrl = `https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}`;

//       console.log(`Gather URL: ${gatherUrl}`);

//       twiml.gather({
//         input: 'speech',
//         action: gatherUrl,
//         method: 'POST',
//       }).say({ voice: 'alice' }, `Hello, you are connected to ${assistant.name}. How can I assist you today?`);

//       res.setHeader('Content-Type', 'text/xml');
//       res.send(twiml.toString());
//     } catch (error) {
//       console.error('Error handling incoming call:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


// import { connectToDatabase } from '../../lib/db';
// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// export default async function handler(req, res) {
//   console.log('twilio calling');

//   if (req.method === 'POST') {
//     const { From, To } = req.body;

//     console.log(`Incoming call from ${From} to ${To}`);

//     try {
//       const db = await connectToDatabase();
//       const assistant = await db.collection('assistants').findOne({ phoneNumber: To });

//       if (!assistant) {
//         console.log('Assistant not found for number:', To);
//         const twiml = new twilio.twiml.VoiceResponse();
//         twiml.say('Sorry, no assistant is available for this number.');
//         res.setHeader('Content-Type', 'text/xml');
//         return res.send(twiml.toString());
//       }

//       const twiml = new twilio.twiml.VoiceResponse();
//       const gatherUrl = `https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}`;

//       console.log(`Connected to AI Assistant ID: ${assistant._id}`);
//       const greetingMessage = `Hello, you are connected to ${assistant.name}. How can I assist you today?`;
//       console.log(`AI Greeting: ${greetingMessage}`);

//       twiml.gather({
//         input: 'speech',
//         action: gatherUrl,
//         method: 'POST',
//       }).say({ voice: 'alice' }, greetingMessage);

//       res.setHeader('Content-Type', 'text/xml');
//       res.send(twiml.toString());
//     } catch (error) {
//       console.error('Error handling incoming call:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


import { connectToDatabase } from '../../lib/db';
import twilio from 'twilio';
import { ObjectId } from 'mongodb'; // Ensure this line is present

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export default async function handler(req, res) {
  console.log('twilio calling');

  if (req.method === 'POST') {
    const { From, To } = req.body;

    console.log(`Incoming call from ${From} to ${To}`);

    try {
      const db = await connectToDatabase();
      const assistant = await db.collection('assistants').findOne({ phoneNumber: To });

      if (!assistant) {
        console.log('Assistant not found for number:', To);
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Sorry, no assistant is available for this number.');
        res.setHeader('Content-Type', 'text/xml');
        return res.send(twiml.toString());
      }

      // Add call start message to the database
      await db.collection('messages').insertOne({
        assistantId: new ObjectId(assistant._id),
        sender: 'system',
        content: `call started with ${From}`,
        timestamp: new Date().toISOString()
      });

      const twiml = new twilio.twiml.VoiceResponse();
      const gatherUrl = `https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}`;

      console.log(`Connected to AI Assistant ID: ${assistant._id}`);
      const greetingMessage = `Hello, you are connected to ${assistant.name}. How can I assist you today?`;
      console.log(`AI Greeting: ${greetingMessage}`);

      twiml.gather({
        input: 'speech',
        action: gatherUrl,
        method: 'POST',
      }).say({ voice: 'alice' }, greetingMessage);

      res.setHeader('Content-Type', 'text/xml');
      res.send(twiml.toString());
    } catch (error) {
      console.error('Error handling incoming call:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
