// // Import the Twilio module
// const twilio = require('twilio');

// // Twilio credentials from environment variables or hardcoded
// const accountSid = '***REMOVED***'; // Your Account SID
// const authToken = '***REMOVED***';  // Your Auth Token
// const client = new twilio(accountSid, authToken);

// // Your Twilio phone number
// const fromPhoneNumber = '***REMOVED***'; // Your Twilio Phone Number

// // Function to make an outbound call
// function makeCall(toPhoneNumber) {
//   client.calls
//     .create({
//       to: toPhoneNumber,  // The phone number to call (in E.164 format)
//       from: fromPhoneNumber,  // Your Twilio phone number
//       twiml: `
//         <Response>
//           <Say language="en-US">
//             Hello new number activated praveen sir and this is a demo call with paid account. The next msg is in nepali language 
//           </Say>
         
//           <Say language="ne-NP">
//             यो एउटा महत्त्वपूर्ण सन्देश हो, कृपया ध्यान दिनुहोस्।
//           </Say>
//         </Response>
//       ` // This is TwiML (Twilio Markup Language) to handle the call
//     })
//     .then(call => console.log(`Call SID: ${call.sid}`))
//     .catch(error => console.error('Error making the call:', error));
// }

// // Trigger the call by passing the recipient's phone number
// makeCall('+917977743973'); // Replace with the phone number you want to call







// // Import the Twilio module
// const twilio = require('twilio');

// // Twilio credentials from environment variables or hardcoded
// const accountSid = '***REMOVED***'; // Your Account SID
// const authToken = '***REMOVED***';  // Your Auth Token
// const client = new twilio(accountSid, authToken);

// // Your Twilio phone number
// const fromPhoneNumber = '***REMOVED***'; // Your Twilio Phone Number

// // Function to make an outbound call
// function makeCall(toPhoneNumber) {
//   return client.calls
//     .create({
//       to: toPhoneNumber,  // The phone number to call (in E.164 format)
//       from: fromPhoneNumber,  // Your Twilio phone number
//       twiml: `
//         <Response>
//           <Say language="en-US">
//            Welcome to Media Nucleus, press 1 or say yes to receive a payment link. Please wait while we generate a payment link for you. Thank you, we have sent you WhatsApp with payment link.
//           </Say>
          
//         </Response>
//       `
//     })
//     .then(call => {
//       console.log(`Call to ${toPhoneNumber} succeeded with SID: ${call.sid}`);
//     })
//     .catch(error => {
//       console.error(`Error making the call to ${toPhoneNumber}:`, error);
//     });
// }

// // List of phone numbers to call (add your own phone numbers here)
// const phoneNumbers = ['+917977743973','+919004501105','+91 90045 01105'];

// // Option 1: Sequential Calls (one after another)
// function makeSequentialCalls() {
//   phoneNumbers.forEach(number => {
//     makeCall(number);
//   });
// }

// // Option 2: Simultaneous Calls (all at the same time)
// function makeSimultaneousCalls() {
//   Promise.all(
//     phoneNumbers.map(number => makeCall(number)) // Trigger all calls in parallel
//   )
//   .then(results => {
//     console.log('All calls initiated successfully.');
//   })
//   .catch(error => {
//     console.error('Error initiating one or more calls:', error);
//   });
// }

// // Uncomment one of the following lines depending on the desired calling strategy:

// // Sequential Calls (Uncomment to use)
// // makeSequentialCalls();

// // Simultaneous Calls (Uncomment to use)
// makeSimultaneousCalls();




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
  return client.calls
    .create({
      to: toPhoneNumber,  // The phone number to call (in E.164 format)
      from: fromPhoneNumber,  // Your Twilio phone number
      twiml: `
        <Response>
          <Say language="en-US">
            Welcome to Media Nucleus, press 1 or say yes to receive a payment link. Please wait while we generate a payment link for you. Thank you, we have sent you WhatsApp with the payment link.
          </Say>
          <Gather input="speech" timeout="5" speechTimeout="auto" action="/process-speech" method="POST">
            
          </Gather>
          
          <Record 
            maxLength="20" 
            playBeep="true" 
            finishOnKey="*" 
            action="/process-recording" 
            method="POST"
          />
        </Response>
      `,  // This TwiML plays a message, gathers user input, and records the call
    })
    .then(call => {
      console.log(`Call to ${toPhoneNumber} succeeded with SID: ${call.sid}`);
    })
    .catch(error => {
      console.error(`Error making the call to ${toPhoneNumber}:`, error);
    });
}

// List of phone numbers to call (add your own phone numbers here)
// const phoneNumbers = ['+917977743973', '+919004501105', '+91 90045 01105'];
const phoneNumbers = ['+917977743973'];

// Option 1: Sequential Calls (one after another)
function makeSequentialCalls() {
  phoneNumbers.forEach(number => {
    makeCall(number);
  });
}

// Option 2: Simultaneous Calls (all at the same time)
function makeSimultaneousCalls() {
  Promise.all(
    phoneNumbers.map(number => makeCall(number)) // Trigger all calls in parallel
  )
  .then(results => {
    console.log('All calls initiated successfully.');
  })
  .catch(error => {
    console.error('Error initiating one or more calls:', error);
  });
}

// Uncomment one of the following lines depending on the desired calling strategy:

// Sequential Calls (Uncomment to use)
// makeSequentialCalls();

// Simultaneous Calls (Uncomment to use)
makeSimultaneousCalls();
//***REMOVED*** kale