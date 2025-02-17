// Import the Twilio library
const twilio = require('twilio');

// Twilio account credentials
const accountSid = '***REMOVED***'; // Replace with your Account SID
const authToken = '***REMOVED***'; // Replace with your Auth Token
const fromPhone = '***REMOVED***'; // Replace with your Twilio phone number
const toPhone = '+917977743973'; // Replace with the recipient's phone number

// Create a Twilio client
const client = twilio(accountSid, authToken);

// Define the message to be spoken
const messageToSay = 'Hello, this is a test call from your Twilio account. Have a great day!';

// Place a call
client.calls
  .create({
    to: toPhone,
    from: fromPhone,
    twiml: `<Response><Say voice='alice' language='en-US'>${messageToSay}</Say></Response>`
  })
  .then(call => console.log(`Call initiated. SID: ${call.sid}`))
  .catch(err => console.error('Error initiating call:', err));
