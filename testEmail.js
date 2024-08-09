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
    to: 'sanketkkapoor07@gmail.com',
    subject: 'Welcome to SamparkAI! sanket',
    text: `Dear User,
    
Welcome to SamparkAI! We are thrilled to have you on board.
    
At SamparkAI, we strive to provide the best AI-powered solutions to enhance your productivity and streamline your operations. We believe in the power of technology to transform lives and businesses, and we are excited to have you join us on this journey.   
Should you have any questions or need assistance, please do not hesitate to reach out to our support team. We are here to help you every step of the way.   
Thank you for choosing SamparkAI. We look forward to a successful and productive partnership.

  ( this is a test email)
    
Best regards,
The SamparkAI Team`,
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
