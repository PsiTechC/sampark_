
// // C:\Users\***REMOVED*** kale\botGIT\pages\api\register\registeration.js
// import { connectToDatabase } from '../../../lib/db';
// import bcrypt from 'bcryptjs';
// import nodemailer from 'nodemailer'; // For sending emails
// import rateLimit from 'express-rate-limit';

// // Rate limiter middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 requests per windowMs
//   message: 'Too many registration attempts, please try again later.',
// });

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     limiter(req, res, async () => { // Apply rate limiter

//       const { email, password, captchaToken } = req.body;

//       // reCAPTCHA validation
//       // const isCaptchaValid = await validateCaptcha(captchaToken);
//       // if (!isCaptchaValid) {
//       //   return res.status(400).json({ message: 'Invalid reCAPTCHA' });
//       // }

//       try {
//         const { db } = await connectToDatabase();

//         // Check if user exists
//         const existingUser = await db.collection('users').findOne({ email });
//         if (existingUser) {
//           return res.status(400).json({ message: 'Email already in use' });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create user
//         const newUser = await db.collection('users').insertOne({
//           email,
//           password: hashedPassword,
//           role: 'client',
//           firstLogin: true,
//           verified: false, // Mark as unverified
//         });

//         // Send verification email
//         await sendVerificationEmail(email, newUser.insertedId);

//         res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//       }
//     });
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
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

// // reCAPTCHA validation function
// async function validateCaptcha(captchaToken) {
//   const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//   const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`, {
//     method: 'POST',
//   });
//   const data = await response.json();
//   return data.success;
// }




// // C:\Users\***REMOVED*** kale\botGIT\pages\api\register\registeration.js
// import { connectToDatabase } from '../../../lib/db';
// import bcrypt from 'bcryptjs';
// import rateLimit from 'express-rate-limit';

// // Rate limiter middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 requests per windowMs
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
//       const newUser = await db.collection('users').insertOne({
//         email,
//         password: hashedPassword,
//         role: 'client',
//         firstLogin: true,
//         // verified: false, // Mark as unverified (commented out)
//       });

//       // Commented out the email verification logic
//       // await sendVerificationEmail(email, newUser.insertedId);

//       res.status(201).json({ message: 'User registered successfully.' });
//     } catch (error) {
//       console.error('Error during registration:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
// }

// // Commented out the helper function for sending verification email
// // async function sendVerificationEmail(email, userId) {
// //   const transporter = nodemailer.createTransport({
// //     service: 'Gmail',
// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS,
// //     },
// //   });

// //   const verifyLink = `https://your-domain.com/api/verify-email?userId=${userId}`;
// //   await transporter.sendMail({
// //     from: 'noreply@your-domain.com',
// //     to: email,
// //     subject: 'Verify Your Email',
// //     html: `<p>Please verify your email by clicking <a href="${verifyLink}">here</a>.</p>`,
// //   });
// // }




import { connectToDatabase } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many registration attempts, please try again later.',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  limiter(req, res, async () => {
    const { email, password } = req.body;

    try {
      const { db } = await connectToDatabase();

      // Check if user exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      await db.collection('users').insertOne({
        email,
        password: hashedPassword,
        role: 'client',
        firstLogin: true,
        verified: false, // Initially unverified
      });

      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}









