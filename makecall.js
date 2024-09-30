// Import the Twilio module
const twilio = require('twilio');

// Twilio credentials from environment variables or hardcoded
const accountSid = '***REMOVED***'; // Your Account SID
const authToken = '***REMOVED***';  // Your Auth Token
const client = new twilio(accountSid, authToken);

// Your Twilio phone number
const fromPhoneNumber = '***REMOVED***'; // Your Twilio Phone Number

// Function to make an outbound call
function makeCall(toPhoneNumber) {
  client.calls
    .create({
      to: toPhoneNumber,  // The phone number to call (in E.164 format)
      from: fromPhoneNumber,  // Your Twilio phone number
      twiml: `
        <Response>
          <Say language="en-US">
            Hello new number activated praveen sir and this is a demo call with paid account. The next msg is in nepali language 
          </Say>
         
          <Say language="ne-NP">
            यो एउटा महत्त्वपूर्ण सन्देश हो, कृपया ध्यान दिनुहोस्।
          </Say>
        </Response>
      ` // This is TwiML (Twilio Markup Language) to handle the call
    })
    .then(call => console.log(`Call SID: ${call.sid}`))
    .catch(error => console.error('Error making the call:', error));
}

// Trigger the call by passing the recipient's phone number
makeCall('+917977743973'); // Replace with the phone number you want to call
