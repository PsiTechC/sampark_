import { connectToDatabase } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';


const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
// Helper function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, companyName, phoneNumber } = req.body;

  try {
    const { db } = await connectToDatabase();

    // Check if the user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Generate a hashed password and OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // Create user with OTP (initially unverified)
    const newUser = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      role: 'client',
      firstLogin: true,
      verified: false, // Set the account to unverified initially
      otp: otp, // Store OTP in the database for verification later
      companyName,
      phoneNumber
    });

    // Send the OTP to the user's email
    await sendOTPEmailWithRetry(email, otp);

    // Redirect user to verify-email page
    res.status(201).json({
      message: 'User registered successfully. Please check your email for the OTP to verify your account.',
      userId: newUser.insertedId
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Helper function to send OTP via email with retry logic
async function sendOTPEmailWithRetry(email, otp, retries = 3, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'mail.samparkai.com', 
        port: 587,
        secure: false,
        auth: {
          user,
          pass 
        },
        tls: {
          rejectUnauthorized: false, 
        },
      });

      // Send the email
      await transporter.sendMail({
        from: `${user}`, // Sender address
        to: email, // Receiver address
        subject: 'Welcome to SamparkAI! Verify Your Email', // Subject line
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Welcome to SamparkAI!</h2>
            <p>Dear User,</p>
            <p>Thank you for registering with SamparkAI. We are excited to have you on board and look forward to providing you with the best AI-driven solutions to enhance your experience.</p>
            <p>To complete your registration, please verify your email by entering the OTP provided below:</p>
            <h3>Your OTP: <strong>${otp}</strong></h3>
            <p>Alternatively, you can click the link below to verify your email directly:</p>
            <a href="http://localhost:3000/verify-email?email=${email}&otp=${otp}" style="color: #1a73e8;">Verify Email</a>
            <br><br>
            <p>If you didn’t register on SamparkAI, please ignore this email.</p>
            <p>Best regards,<br>The SamparkAI Team</p>
          </div>
        `, // HTML body with welcome message and link
      });
      
      

      console.log(`OTP email sent successfully to ${email} on attempt ${attempt}`);
      return; // If email is sent successfully, exit the function
    } catch (error) {
      console.error(`Attempt ${attempt} failed to send email to ${email}:`, error.message);

      // If we've exhausted all retries, throw the error
      if (attempt === retries) {
        throw new Error('Failed to send OTP after multiple attempts.');
      }

      // Wait for the specified delay before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
