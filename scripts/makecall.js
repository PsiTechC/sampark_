// // require('dotenv').config();  // Load environment variables from .env

// // const twilio = require('twilio');

// // // Use environment variables for credentials
// // const accountSid = 'AC47e8fc4a96506ab035d57bf787730ac9';
// // const authToken = "e5e335b79278d226f0fbbc36b75e0575";
// // const client = twilio(accountSid, authToken);

// // const fromPhoneNumber = +15417255475 ;
// // const toPhoneNumber = '+919131296862';  // Example Indian phone number in E.164 format

// // const twimlMessage = `
// // <Response>
// //   <Say>
// //     Namaste! Welcome to the Siv Sena Group. We are honored to have you with us.
// //     Together, we strive for the pride and progress of our community.
// //     Jai Hind! Jai Maharashtra!
// //   </Say>
// // </Response>
// // `;

// // client.calls
// //   .create({
// //     to: toPhoneNumber,
// //     from: fromPhoneNumber,
// //     twiml: twimlMessage,
// //   })
// //   .then((call) => console.log(`Call initiated with SID: ${call.sid}`))
// //   .catch((error) => console.error('Error making call:', error));



// require('dotenv').config();  // Load environment variables from .env

// const twilio = require('twilio');

// // Use environment variables for credentials
// const accountSid = 'AC47e8fc4a96506ab035d57bf787730ac9';
// const authToken = "e5e335b79278d226f0fbbc36b75e0575";
// const client = twilio(accountSid, authToken);

// const fromPhoneNumber = '+15417255475';  // Ensure this is a string
// const toPhoneNumber = '+919131296862';  // Example Indian phone number in E.164 format

// const twimlMessage = `
// <Response>
//   <Say language="mr-IN">
//   मी आपल्याशी भारतशेट गोगावले यांच्या प्रचारासाठी बोलत आहे. महाराष्ट्राच्या विधानसभेत महाड मतदारसंघाचे प्रतिनिधित्व करणारे आपलेच उमेदवार, भारतशेट गोगावले, यांना आगामी निवडणुकीत तुमचा मोलाचा पाठिंबा द्या.

//   </Say>
//   <Say language="hi-IN">
//    मी आपल्याशी भारतशेट गोगावले यांच्या प्रचारासाठी बोलत आहे. महाराष्ट्राच्या विधानसभेत महाड मतदारसंघाचे प्रतिनिधित्व करणारे आपलेच उमेदवार, भारतशेट गोगावले, यांना आगामी निवडणुकीत तुमचा मोलाचा पाठिंबा द्या.

//   </Say>
  
// </Response>
// `;

// client.calls
//   .create({
//     to: toPhoneNumber,
//     from: fromPhoneNumber,
//     twiml: twimlMessage,
//   })
//   .then((call) => console.log(`Call initiated with SID: ${call.sid}`))
//   .catch((error) => console.error('Error making call:', error));





require('dotenv').config();  // Load environment variables from .env

const twilio = require('twilio');

// Use environment variables for credentials
const accountSid = 'AC47e8fc4a96506ab035d57bf787730ac9';
const authToken = "e5e335b79278d226f0fbbc36b75e0575";
const client = twilio(accountSid, authToken);

const fromPhoneNumber = '+15417255475';  // Ensure this is a string
const toPhoneNumber = '+919930555002';  // Example Indian phone number in E.164 format

const twimlMessage = `
<Response>

  <Say voices="man" language="hi-IN" rate="medium" volume="soft">
"महाडच्या प्रगतीसाठी भारत गोगावले यांना साथ द्या, प्रजाच महाडचा उज्वल भविष्य घडवेल!"
 "प्रजेकडून भारत गोगावले यांना विश्वास देऊया, महाडच्या विकासाचा मार्ग सुलभ करूया!"
 "महाडच्या प्रत्येक घराचं भविष्य उज्वल करायला, प्रजेकडून भारत गोगावले यांना साथ द्या!"
 "महाडचा विकास, भारत गोगावले यांचा विश्वास - प्रजेच्या मतांनी होऊ द्या विजय निश्चित!"
  </Say>
</Response>
`;



client.calls
  .create({
    to: toPhoneNumber,
    from: fromPhoneNumber,
    twiml: twimlMessage,
  })
  .then((call) => console.log(`Call initiated with SID: ${call.sid}`))
  .catch((error) => console.error('Error making call:', error));
