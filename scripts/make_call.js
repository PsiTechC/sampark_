const twilio = require('twilio');

const accountSid = '***REMOVED***';
const authToken = '***REMOVED***';
const client = new twilio(accountSid, authToken);

const twilioPhoneNumber = '***REMOVED***'; 

//const userPhoneNumber = '+917977096749'; 

const twimlUrl = ' https://652b-203-194-97-235.ngrok-free.app/api/twilio-webhook'; 

//outbound call
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