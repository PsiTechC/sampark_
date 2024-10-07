



// import { connectToDatabase } from '../../../lib/db';
// import bcrypt from 'bcryptjs';
// import rateLimit from 'express-rate-limit';

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5,
//   message: 'Too many registration attempts, please try again later.',
// });

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   limiter(req, res, async () => {
//     const { email, password } = req.body;

//     try {
//       const { db } = await connectToDatabase();

//       // Check if user exists
//       const existingUser = await db.collection('users').findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already in use' });
//       }

//       // Hash password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Create user
//       await db.collection('users').insertOne({
//         email,
//         password: hashedPassword,
//         role: 'client',
//         firstLogin: true,
//         verified: false, // Initially unverified
//       });

//       res.status(201).json({ message: 'User registered successfully.' });
//     } catch (error) {
//       console.error('Error during registration:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
// }




// import { connectToDatabase } from '../../../lib/db';
// import bcrypt from 'bcryptjs';
// import nodemailer from 'nodemailer';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { email, password } = req.body;

//   try {
//     const { db } = await connectToDatabase();

//     // Check if user exists
//     const existingUser = await db.collection('users').findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const newUser = await db.collection('users').insertOne({
//       email,
//       password: hashedPassword,
//       role: 'client',
//       firstLogin: true,
//       verified: false, // Initially unverified
//     });

//     // Send verification email
//     await sendVerificationEmail(email, newUser.insertedId);

//     res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

// // Helper function to send verification email
// async function sendVerificationEmail(email, userId) {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const verifyLink = `https://your-domain.com/api/verify-email?userId=${userId}`;
//   await transporter.sendMail({
//     from: 'noreply@your-domain.com',
//     to: email,
//     subject: 'Verify Your Email',
//     html: `<p>Please verify your email by clicking <a href="${verifyLink}">here</a>.</p>`,
//   });
// }


//C:\botGIT\botGIT-main\pages\api\register\registeration.js
import { connectToDatabase } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Helper function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

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
    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      role: 'client',
      firstLogin: true,
      verified: false, // Set the account to unverified initially
      otp: otp, // Store OTP in the database for verification later
    });

    // Send the OTP to the user's email
    await sendOTPEmail(email, otp);

    res.status(201).json({ message: 'User registered successfully. Please check your email for the OTP to verify your account.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Helper function to send OTP via email
async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: 'mail.samparkai.com', // Your SMTP server (from your earlier credentials)
    port: 587, // Using port 587 for TLS
    secure: false, // Use false for TLS, true for SSL
    auth: {
      user: process.env.EMAIL_USER, // Your email user from environment variables
      pass: process.env.EMAIL_PASS, // Your email password from environment variables
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
  });

  // Send the email
  await transporter.sendMail({
    from: '***REMOVED***', // Sender address (your SMTP email)
    to: email, // Receiver address
    subject: 'Your OTP for Email Verification', // Subject line
    html: `<p>Your OTP for verifying your email is: <strong>${otp}</strong></p>`, // HTML body
  });
}

