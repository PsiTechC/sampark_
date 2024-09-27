// import { connectToDatabase } from '../../lib/db';
// // import OpenAI from 'openai';
// const OpenAI = require('openai');
// import twilio from 'twilio';
// import { ObjectId } from 'mongodb';

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export default async function handler(req, res) {
//   const { SpeechResult } = req.body;
//   const { assistantId } = req.query;

//   console.log('twilio calling');
//   console.log(`Connected to AI Assistant ID: ${assistantId}`);
//   console.log(`User Response: ${SpeechResult}`);

//   try {
//     const { db } = await connectToDatabase();
//     const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

//     if (!assistant) {
//       const twiml = new twilio.twiml.VoiceResponse();
//       twiml.say('Sorry, no assistant is available for this number.');
//       res.setHeader('Content-Type', 'text/xml');
//       return res.send(twiml.toString());
//     }

//     // Generate a response from OpenAI
//     let aiResponse;
//     try {
//       aiResponse = await openai.chat.completions.create({
//         model: assistant.model,
//         messages: [
//           { role: 'system', content: assistant.instructions },
//           { role: 'user', content: SpeechResult },
//         ],
//         max_tokens: assistant.settings.maxTokens,
//         temperature: assistant.settings.temperature,
//       });
//     } catch (error) {
//       throw error;
//     }

//     const botMessage = aiResponse.choices[0].message.content.trim();
//     console.log(`Assistant Response: ${botMessage}`);

//     try {
//       await db.collection('messages').insertMany([
//         {
//           assistantId: new ObjectId(assistant._id),
//           sender: 'user',
//           content: SpeechResult,
//           timestamp: new Date(),
//         },
//         {
//           assistantId: new ObjectId(assistant._id),
//           sender: 'assistant',
//           content: botMessage,
//           timestamp: new Date(),
//         }
//       ]);
//     } catch (error) {
//       throw error;
//     }

//     const twiml = new twilio.twiml.VoiceResponse();
//     twiml.say({ voice: 'man' }, botMessage);

//     // Gather again for continuous conversation
//     const gatherUrl = `https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}`;
//     twiml.gather({
//       input: 'speech',
//       action: gatherUrl,
//       method: 'POST',
//       language: 'en-US',
//       timeout: 10,         
//       speechTimeout: 'auto',
//       hints: [
//         'booking', 'reservation', 'check-in', 'check-out', 'cancel', 'amenities', 'spa', 
//         'restaurant', 'dining', 'breakfast', 'lunch', 'dinner', 'room service', 'parking', 
//         'wifi', 'internet', 'conference', 'meeting', 'event', 'suite', 'luxury', 'view', 
//         'airport shuttle', 'gym', 'fitness center', 'pool', 'laundry', 'dry cleaning', 
//         'late checkout', 'early check-in', 'upgrade', 'loyalty program', 'rewards', 'complaint'
//       ],  
//       speechModel: 'phone_call',
//       profanityFilter: "true",
//       playBeep: "true",
//     }).say({ voice: 'alice' }, `You can continue speaking...`);


    
//     // Save call end message
//     await db.collection('messages').insertOne({
//       assistantId: new ObjectId(assistant._id),
//       sender: 'system',
//       content: 'call ended',
//       timestamp: new Date(),
//     });

//     console.log('call ended');

//     res.setHeader('Content-Type', 'text/xml');
//     res.send(twiml.toString());
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }
//above







// import { connectToDatabase } from '../../lib/db';
// import OpenAI from 'openai';
// import twilio from 'twilio';
// import { ObjectId } from 'mongodb';

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export default async function handler(req, res) {
//   try {
//     const { SpeechResult } = req.body;
//     const { assistantId } = req.query;

//     console.log('twilio calling');
//     console.log(`Connected to AI Assistant ID: ${assistantId}`);
//     console.log(`User Response: ${SpeechResult}`);
//     console.log('Received assistantId:', assistantId);

//     let objectId;
//     if (assistantId.length === 24) {
//       try {
//           objectId = mongoose.Types.ObjectId(assistantId); // Alternative approach
//         } catch (e) {
//           console.error('Error converting assistantId to ObjectId:', e.message);
//           return res.status(400).json({ error: 'Invalid assistantId format' });
//         }
//       } else {
//         console.error('Error: assistantId is not the correct length.');
//         console.log('Converted ObjectId:', objectId);
//       return res.status(400).json({ error: 'Invalid assistantId format' });
//   }

//     // Connect to the database
//     const { db } = await connectToDatabase();
//     const assistant = await db.collection('assistants').findOne({ _id: objectId });

//     if (!assistant) {
//       const twiml = new twilio.twiml.VoiceResponse();
//       twiml.say('Sorry, no assistant is available for this number.');
//       res.setHeader('Content-Type', 'text/xml');
//       return res.send(twiml.toString());
//     }

//     // Generate a response from OpenAI
//     let aiResponse;
//     try {
//       aiResponse = await openai.chat.completions.create({
//         model: assistant.model,
//         messages: [
//           { role: 'system', content: assistant.instructions },
//           { role: 'user', content: SpeechResult },
//         ],
//         max_tokens: assistant.settings.maxTokens,
//         temperature: assistant.settings.temperature,
//       });
//     } catch (error) {
//       throw error;
//     }

//     const botMessage = aiResponse.choices[0].message.content.trim();
//     console.log(`Assistant Response: ${botMessage}`);

//     // Save user and assistant messages to the database
//     try {
//       await db.collection('messages').insertMany([
//         {
//           assistantId: objectId,
//           sender: 'user',
//           content: SpeechResult,
//           timestamp: new Date(),
//         },
//         {
//           assistantId: objectId,
//           sender: 'assistant',
//           content: botMessage,
//           timestamp: new Date(),
//         }
//       ]);
//     } catch (error) {
//       throw error;
//     }

//     const twiml = new twilio.twiml.VoiceResponse();
//     twiml.say({ voice: 'man' }, botMessage);

//     // Gather again for continuous conversation
//     const gatherUrl = `https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}`;
//     twiml.gather({
//       input: 'speech',
//       action: gatherUrl,
//       method: 'POST',
//     }).say({ voice: 'man' }, `You can continue speaking...`);

//     // Save call end message
//     await db.collection('messages').insertOne({
//       assistantId: objectId,
//       sender: 'system',
//       content: 'call ended',
//       timestamp: new Date(),
//     });

//     console.log('call ended');

//     res.setHeader('Content-Type', 'text/xml');
//     res.send(twiml.toString());
//   } catch (error) {
//     console.error('Error during webhook processing:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }



import { connectToDatabase } from '../../lib/db';
const OpenAI = require('openai');
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
      console.error("OpenAI API error: ", error.message);
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
      console.error("Database insert error: ", error.message);
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
      language: 'en-US',
      timeout: 15,  
      speechTimeout: 'auto',
      hints: [
        'Taj Mahal Palace', 'Taj Lands End', 'Taj Santacruz', 'Taj Wellington Mews', 
        'Taj Bengal', 'Taj Krishna', 'Taj Deccan', 'Taj Coromandel', 'Taj West End', 
        'Taj Yeshwantpur', 'Rambagh Palace', 'Taj Lake Palace', 'Umaid Bhawan Palace', 
        'Taj Exotica', 'Taj Green Cove', 'Taj Madikeri Resort', 'Taj Malabar Resort', 
        'Taj Rishikesh', 'Taj Nadesar Palace', 'Taj Ganges'
      ],
      speechModel: 'phone_call',
      profanityFilter: "true",
      playBeep: "true",
      enhanced: true  
    }).say({ voice: 'man' }, `Please continue speaking.`);
    


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
    console.error("Handler error: ", error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
