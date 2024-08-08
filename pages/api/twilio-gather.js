//trail 1 at 2:03
// import { connectToDatabase } from '../../lib/db';
// import OpenAI from 'openai';
// import twilio from 'twilio';
// import { ObjectId } from 'mongodb';

// const openai = new OpenAI(process.env.OPENAI_API_KEY);
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// export default async function handler(req, res) {
//   const { SpeechResult } = req.body;
//   const { assistantId } = req.query;

//   console.log(`SpeechResult: ${SpeechResult}`);
//   console.log(`assistantId: ${assistantId}`);

//   try {
//     const db = await connectToDatabase();
//     const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

//     if (!assistant) {
//       const twiml = new twilio.twiml.VoiceResponse();
//       twiml.say('Sorry, no assistant is available for this number.');
//       res.setHeader('Content-Type', 'text/xml');
//       return res.send(twiml.toString());
//     }

//     const aiResponse = await openai.Completions.create({
//       model: assistant.model,
//       prompt: `${assistant.instructions}\nUser: ${SpeechResult}\nAssistant:`,
//       max_tokens: assistant.settings.maxTokens,
//       temperature: assistant.settings.temperature,
//     });

//     const botMessage = aiResponse.choices[0].text.trim();

//     await db.collection('messages').insertMany([
//       {
//         assistantId: new ObjectId(assistant._id),
//         sender: 'user',
//         content: SpeechResult,
//         timestamp: new Date(),
//       },
//       {
//         assistantId: new ObjectId(assistant._id),
//         sender: 'assistant',
//         content: botMessage,
//         timestamp: new Date(),
//       }
//     ]);

//     const twiml = new twilio.twiml.VoiceResponse();
//     twiml.say({ voice: assistant.voice }, botMessage);
//     const redirectUrl = `https://${req.headers.host}/api/twilio-webhook`;
//     twiml.redirect(redirectUrl);

//     res.setHeader('Content-Type', 'text/xml');
//     res.send(twiml.toString());
//   } catch (error) {
//     console.error('Error processing gather:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }

//working call feature with very much delay
// import { connectToDatabase } from '../../lib/db';
// import OpenAI from 'openai';
// import twilio from 'twilio';
// import { ObjectId } from 'mongodb';

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export default async function handler(req, res) {
//   console.log('twilio calling');

//   const { SpeechResult } = req.body;
//   const { assistantId } = req.query;

//   console.log(`User Response: ${SpeechResult}`);
//   console.log(`Connected to AI Assistant ID: ${assistantId}`);

//   try {
//     const db = await connectToDatabase();
//     const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

//     if (!assistant) {
//       console.log('Assistant not found:', assistantId);
//       const twiml = new twilio.twiml.VoiceResponse();
//       twiml.say('Sorry, no assistant is available for this number.');
//       res.setHeader('Content-Type', 'text/xml');
//       return res.send(twiml.toString());
//     }

//     console.log('Assistant found');

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
//       console.log('AI Response:', aiResponse.choices[0].message.content);
//     } catch (error) {
//       console.error('Error generating AI response:', error);
//       throw error;
//     }

//     const botMessage = aiResponse.choices[0].message.content.trim();
//     console.log(`AI Response: ${botMessage}`);

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
//       console.log('Messages saved to database');
//     } catch (error) {
//       console.error('Error saving messages to database:', error);
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

//     res.setHeader('Content-Type', 'text/xml');
//     res.send(twiml.toString());
//   } catch (error) {
//     console.error('Error processing gather:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
//   console.log('Call ended');
// }

//working
// import { connectToDatabase } from '../../lib/db';
// import OpenAI from 'openai';
// import twilio from 'twilio';
// import { ObjectId } from 'mongodb';

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export default async function handler(req, res) {
//   console.log('twilio calling');

//   const { SpeechResult } = req.body;
//   const { assistantId } = req.query;

//   console.log(`User Response: ${SpeechResult}`);
//   console.log(`Connected to AI Assistant ID: ${assistantId}`);

//   try {
//     const db = await connectToDatabase();
//     const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

//     if (!assistant) {
//       console.log('Assistant not found:', assistantId);
//       const twiml = new twilio.twiml.VoiceResponse();
//       twiml.say('Sorry, no assistant is available for this number.');
//       res.setHeader('Content-Type', 'text/xml');
//       return res.send(twiml.toString());
//     }

//     console.log('Assistant found');

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
//       console.log('AI Response:', aiResponse.choices[0].message.content);
//     } catch (error) {
//       console.error('Error generating AI response:', error);
//       throw error;
//     }

//     const botMessage = aiResponse.choices[0].message.content.trim();
//     console.log(`AI Response: ${botMessage}`);

//     try {
//       await db.collection('messages').insertMany([
//         {
//           assistantId: new ObjectId(assistant._id),
//           sender: 'user',
//           content: SpeechResult,
//           timestamp: new Date().toISOString(),
//         },
//         {
//           assistantId: new ObjectId(assistant._id),
//           sender: 'assistant',
//           content: botMessage,
//           timestamp: new Date().toISOString(),
//         }
//       ]);
//       console.log('Messages saved to database');
//     } catch (error) {
//       console.error('Error saving messages to database:', error);
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

//     res.setHeader('Content-Type', 'text/xml');
//     res.send(twiml.toString());

//     // Add call end message to the database
//     try {
//       await db.collection('messages').insertOne({
//         assistantId: new ObjectId(assistantId),
//         sender: 'system',
//         content: 'call ended',
//         timestamp: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error('Error saving call end message to database:', error);
//     }

//   } catch (error) {
//     console.error('Error processing gather:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }

//   console.log('Call ended');
// }




// import { connectToDatabase } from '../../lib/db';
// import OpenAI from 'openai';
// import twilio from 'twilio';
// import { ObjectId } from 'mongodb';

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export default async function handler(req, res) {
//   console.log('twilio-gather called');
//   console.log('Request body:', req.body);
//   console.log('Request query:', req.query);

//   const { SpeechResult } = req.body;
//   const { assistantId } = req.query;

//   console.log(`SpeechResult: ${SpeechResult}`);
//   console.log(`assistantId: ${assistantId}`);

//   try {
//     const { db } = await connectToDatabase();
//     const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

//     if (!assistant) {
//       console.log('Assistant not found:', assistantId);
//       const twiml = new twilio.twiml.VoiceResponse();
//       twiml.say('Sorry, no assistant is available for this number.');
//       res.setHeader('Content-Type', 'text/xml');
//       return res.send(twiml.toString());
//     }

//     console.log('Assistant found:', assistant);

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
//       console.log('AI Response:', aiResponse.choices[0].message.content);
//     } catch (error) {
//       console.error('Error generating AI response:', error);
//       throw error;
//     }

//     const botMessage = aiResponse.choices[0].message.content.trim();
//     console.log('AI Response message:', botMessage);

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
//       console.log('Messages saved to database');
//     } catch (error) {
//       console.error('Error saving messages to database:', error);
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

//     res.setHeader('Content-Type', 'text/xml');
//     res.send(twiml.toString());
//   } catch (error) {
//     console.error('Error processing gather:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }


import { connectToDatabase } from '../../lib/db';
import OpenAI from 'openai';
import twilio from 'twilio';
import { ObjectId } from 'mongodb';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  console.log('twilio-gather called');
  console.log('Request body:', req.body);
  console.log('Request query:', req.query);

  const { SpeechResult } = req.body;
  const { assistantId } = req.query;

  console.log(`SpeechResult: ${SpeechResult}`);
  console.log(`assistantId: ${assistantId}`);

  try {
    const { db } = await connectToDatabase();
    const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(assistantId) });

    if (!assistant) {
      console.log('Assistant not found:', assistantId);
      const twiml = new twilio.twiml.VoiceResponse();
      twiml.say('Sorry, no assistant is available for this number.');
      res.setHeader('Content-Type', 'text/xml');
      return res.send(twiml.toString());
    }

    console.log('Assistant found:', assistant);

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
      console.log('AI Response:', aiResponse.choices[0].message.content);
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }

    const botMessage = aiResponse.choices[0].message.content.trim();
    console.log('AI Response message:', botMessage);

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
      console.log('Messages saved to database');
    } catch (error) {
      console.error('Error saving messages to database:', error);
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

    res.setHeader('Content-Type', 'text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error processing gather:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
