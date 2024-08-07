// // 

// import { connectToDatabase } from '../../lib/db';
// import bcrypt from 'bcryptjs';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { email, password } = req.body;

//   try {
//     const { db } = await connectToDatabase();
//     const user = await db.collection('users').findOne({ email });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // If successful, respond with a success message
//     res.status(200).json({ message: 'Login successful' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }


// pages/api/login.js

import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the user is a super admin
    if (user.role !== 'superadmin') {
      console.log('User is not a superadmin');
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate a token
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
