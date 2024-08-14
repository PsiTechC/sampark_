

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


// const express = require('express');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// const SMARTFLO_API_KEY = process.env.SMARTFLO_API_KEY;
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// app.post('/incoming-call', async (req, res) => {
//     const { caller, called_number } = req.body;

//     try {
//         console.log(`Incoming call from ${caller} to ${called_number}`);

//         // Fetch the assistant details from your database based on the number
//         const db = await connectToDatabase();
//         const assistant = await db.collection('assistants').findOne({ phoneNumber: called_number });

//         if (!assistant) {
//             return res.status(404).send('Assistant not found');
//         }

//         // Automatically answer and handle the call with IVR
//         const ivrResponse = await axios.post(
//             'https://api-smartflo.tatateleservices.com/v1/ivr',
//             {
//                 // Auto-answer logic with the assistant's name
//                 greeting: `Hello, this is ${assistant.name}. How can I assist you today?`,
//                 action: {
//                     type: "gather",
//                     input: "speech",
//                     next_action: "/process-speech"
//                 }
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${SMARTFLO_API_KEY}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         console.log('IVR flow triggered:', ivrResponse.data);
//         res.status(200).send('Call handled');
//     } catch (error) {
//         console.error('Error handling call:', error);
//         res.status(500).send('Error handling call');
//     }
// });

// // Endpoint to process speech input
// app.post('/process-speech', async (req, res) => {
//     const { speech_text } = req.body;

//     try {
//         console.log(`Received speech: ${speech_text}`);
        
//         const openaiResponse = await axios.post(
//             'https://api.openai.com/v1/completions',
//             {
//                 model: 'text-davinci-003',
//                 prompt: `User: ${speech_text}\nAssistant:`,
//                 max_tokens: 150,
//                 temperature: 0.7,
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${OPENAI_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 }
//             }
//         );

//         const aiResponse = openaiResponse.data.choices[0].text.trim();
//         console.log('AI Response:', aiResponse);

//         res.status(200).json({ message: aiResponse });
//     } catch (error) {
//         console.error('Error processing speech:', error);
//         res.status(500).send('Error processing speech');
//     }
// });

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });
