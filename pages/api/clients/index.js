
// C:\Users\***REMOVED*** kale\botGIT\pages\api\clients\index.js
// pages/api/clients/index.js

import { connectToDatabase } from '../../../lib/db';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, licenseValidFrom, licenseValidTo, organization, purpose } = req.body;

    try {
      const { db } = await connectToDatabase();
      
      // Generate a random password
      const initialPassword = Math.random().toString(36).slice(-8);

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(initialPassword, 10);

      // Insert the new client with the hashed password
      const result = await db.collection('clients').insertOne({
        name,
        email,
        phone,
        licenseValidFrom,
        licenseValidTo,
        organization,
        purpose,
        password: hashedPassword,
        firstLogin: true, // Flag to indicate it's the first login
      });

      // Configure the email transporter
      const transporter = nodemailer.createTransport({
        host: 'mail.samparkai.com', // Example: 'smtp.yourdomain.com'
        port: 587, // or 465 for SSL
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // your email
          pass: process.env.EMAIL_PASS, // your email password
        },
        tls: {
          rejectUnauthorized: false, // Disable SSL validation
        },


      });

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to SamparkAI',
        text: `Dear ${name},\n\nWelcome to SamparkAI. Your login credentials are as follows:\n\nEmail: ${email}\nPassword: ${initialPassword}\n\nPlease log in to ${process.env.LOGIN_PAGE_URL} to change your password.\n\nBest regards,\nSamparkAI Team`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(201).json({ id: result.insertedId, name, email, phone, licenseValidFrom, licenseValidTo, organization, purpose });
    } catch (error) {
      console.error('Error saving client or sending email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const clients = await db.collection('clients').find({}).toArray();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
