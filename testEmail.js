const nodemailer = require('nodemailer');
require('dotenv').config();

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
    to: 'kale***REMOVED***980@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email sent from your Node.js application!',
  };

  console.log('Mail options:', mailOptions);

  try {
    console.log('Sending email...');
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

sendTestEmail();
