const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

async function sendTestEmail() {
  console.log('Creating transporter...');
  const transporter = nodemailer.createTransport({
    host: 'mail.samparkai.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log('Transporter created:', transporter);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'shantman011@gmail.com',
    subject: 'Welcome to SamparkAI!',
    text: `Dear Shantanu Deshmukh,
    
I hope this message finds you well.

I am writing to request the purchase of a new monitor for our software development team. Given the nature of our work, a high-resolution monitor will significantly enhance our productivity by providing better visibility and workspace for coding and testing.

I would appreciate your approval to proceed with this order at your earliest convenience. Here is the link https://www.lg.com/in/monitors/gaming/27gl650f-b/?srsltid=AfmBOoofNomdrPhjRD28EL4HLXejg-Tmp8dywCVRKVpYU5XdxrE7UQRM
    
Best regards,
The SamparkAI Software Development Team`,
  };

  
  try {
    console.log('Sending email...');
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

sendTestEmail();
