// import { connectToDatabase } from '../../lib/db';
// import twilio from 'twilio';
// import { ObjectId } from 'mongodb';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = new twilio(accountSid, authToken);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { From, To } = req.body;

//     console.log('twilio calling');
//     console.log(`Incoming call from ${From} to ${To}`);

//     try {
//       const { db } = await connectToDatabase(); 
//       const assistant = await db.collection('assistants').findOne({ phoneNumber: To });

//       if (!assistant) {
//         const twiml = new twilio.twiml.VoiceResponse();
//         twiml.say('Sorry, no assistant is available for this number.');
//         res.setHeader('Content-Type', 'text/xml');
//         return res.send(twiml.toString());
//       }

//       const twiml = new twilio.twiml.VoiceResponse();
//       const gatherUrl = `https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}`;

//       twiml.gather({
//         input: 'speech',
//         action: gatherUrl,
//         method: 'POST',
//       }).say({ voice: 'alice' }, `Hello, you are connected to ${assistant.name}. How can I assist you today?`);

//       // Save call start message
//       await db.collection('messages').insertOne({
//         assistantId: new ObjectId(assistant._id),
//         sender: 'system',
//         content: `call started with ${From}`,
//         timestamp: new Date(),
//       });

//       res.setHeader('Content-Type', 'text/xml');
//       res.send(twiml.toString());
//     } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }



// import { connectToDatabase } from '../../lib/db';
// import twilio from 'twilio';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { From, To } = req.body;

//     console.log('Webhook received. From:', From, 'To:', To);

//     try {
//       const { db } = await connectToDatabase();
//       console.log('Connected to database:', db.databaseName);

//       const assistant = await db.collection('assistants').findOne({ phoneNumber: From });

//       if (!assistant) {
//         console.log('No assistant found for phoneNumber:', To);
//         const twiml = new twilio.twiml.VoiceResponse();
//         twiml.say('Sorry, no assistant is available for this number.');
//         res.setHeader('Content-Type', 'text/xml');
//         return res.send(twiml.toString());
//       }

//       const accountSid = 'AC47e8fc4a96506ab035d57bf787730ac9';
//       const authToken = "e5e335b79278d226f0fbbc36b75e0575";
//       const client = twilio(accountSid, authToken);

//       const fromPhoneNumber = '+15417255475';  // Ensure this is a string
//       const toPhoneNumber = '+919131296862';  // Example Indian phone number in E.164 format

//       const twimlMessage = `
//       <Response>
//         <Say voices="man" language="hi-IN">
//         "महाडच्या प्रगतीसाठी भारत गोगावले यांना साथ द्या"
//         </Say>
//         <Gather input="speech" action="https://${req.headers.host}/api/twilio-gather?assistantId=${assistant._id}" method="POST">
//           <Say voice="man" language="hi-IN">Please say something after the beep.</Say>
//         </Gather>
//       </Response>
//       `;

//       client.calls
//         .create({
//           to: toPhoneNumber,
//           from: fromPhoneNumber,
//           twiml: twimlMessage,
//         })
//         .then((call) => {
//           console.log(`Call initiated with SID: ${call.sid}`);
//           // Save call start message
//           db.collection('messages').insertOne({
//             assistantId: new ObjectId(assistant._id),
//             sender: 'system',
//             content: `Call started with ${From}`,
//             timestamp: new Date(),
//           });
//           res.status(200).json({ message: 'Call initiated successfully', callSid: call.sid });
//         })
//         .catch((error) => {
//           console.error('Error making call:', error);
//           res.status(500).json({ error: 'Failed to initiate call', details: error.message });
//         });

//     } catch (error) {
//       console.error('Error during webhook processing:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }




import { connectToDatabase } from '../../lib/db';
import twilio from 'twilio';
import { ObjectId } from 'mongodb';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { From, To, Direction } = req.body;

    console.log('twilio calling');
    console.log(`Call from ${From} to ${To}, Direction: ${Direction}`);

    try {
      const { db } = await connectToDatabase();
      const phoneNumberKey = Direction === 'inbound' ? To : From;
      const assistant = await db.collection('assistants').findOne({ phoneNumber: phoneNumberKey });

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
      }).say({ voice: 'man' }, `Hello, you are connected to ${assistant.name}. Welcome to Taj by Raheja Builders, Vashi—a premium ready-to-move-in residential project offering luxurious 2BHK & 3BHK homes with world-class amenities in a prime Navi Mumbai location. Will you be interested in knowing more? If you have any questions, feel free to ask!`);

      // Save call start message
      await db.collection('messages').insertOne({
        assistantId: new ObjectId(assistant._id),
        sender: 'system',
        content: `Call started with ${From}, direction: ${Direction}`,
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
