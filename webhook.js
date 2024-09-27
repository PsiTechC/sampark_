// const twilio = require('twilio');
// const dotenv = require('dotenv');

// // Load environment variables from .env
// dotenv.config();

// const accountSid = 'AC47e8fc4a96506ab035d57bf787730ac9';
// const authToken = 'e5e335b79278d226f0fbbc36b75e0575';
// const fromPhoneNumber = '+15417255475'; // Your Twilio number
// const toPhoneNumber = '+919131296862';  // The user's phone number

// const client = new twilio(accountSid, authToken);

// // Use the ngrok URL as the host
// const ngrokUrl = 'https://7225-2401-4900-1c94-5be9-501c-340-9006-d735.ngrok-free.app';

// client.calls.create({
//   to: toPhoneNumber,
//   from: fromPhoneNumber,
//   url: ${ngrokUrl}/api/twilio-webhook, // Updated to use ngrok URL
// })
// .then((call) => console.log(Call initiated with SID: ${call.sid}))
// .catch((error) => console.error('Error making call:', error));

// C:\Users\***REMOVED*** kale\botGIT\webhook.js
// import twilio from 'twilio';
const twilio = require('twilio');

const accountSid = '***REMOVED***';
const authToken = '***REMOVED***';
const client = new twilio(accountSid, authToken);

const twilioPhoneNumber = '***REMOVED***'; 
const userPhoneNumber = '+917977743973'; 

const twimlUrl = 'https://872f-103-58-153-143.ngrok-free.app/api/twilio-webhook';


// Outbound call
async function makeCall() {
  try {
    const call = await client.calls.create({
      url: twimlUrl,
      to: userPhoneNumber,
      from: twilioPhoneNumber,
    });

    console.log(`Call initiated with SID: ${call.sid}`);
  } catch (error) {
    console.error('Error making outbound call:', error.message);
  }
}

makeCall();
