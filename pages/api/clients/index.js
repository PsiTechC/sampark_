// pages/api/clients/index.js

import { connectToDatabase } from '../../../lib/db';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, licenseValidFrom, licenseValidTo, organization, purpose } = req.body;

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('clients').insertOne({
        name,
        email,
        phone,
        licenseValidFrom,
        licenseValidTo,
        organization,
        purpose,
      });

      // Create transporter for nodemailer
      const transporter = nodemailer.createTransport({
        host: 'smtp.samparkai.com', // e.g., 'smtp.yourdomain.com'
        port: 587, // or 465 for SSL
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // your email
          pass: process.env.EMAIL_PASS, // your email password
        },
      });

      // Generate initial password
      const initialPassword = Math.random().toString(36).slice(-8); // Simple random password generator

      // Send email to the client
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Our Service',
        text: `Dear ${name},\n\nWelcome to our service. Your initial credentials are:\n\nEmail: ${email}\nPassword: ${initialPassword}\n\nPlease log in to ${process.env.LOGIN_PAGE_URL} to change your password.\n\nBest regards,\nYour Company`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ id: result.insertedId, name, email, phone, licenseValidFrom, licenseValidTo, organization, purpose });
    } catch (error) {
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
