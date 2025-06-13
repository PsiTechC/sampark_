import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Log the incoming email and password
    console.log('Incoming login request:', { email, password });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const { db } = await connectToDatabase();

      // Find the user by email
      const user = await db.collection('users').findOne({ email });
      console.log('Database lookup result:', user); // Log the result from the database

      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
      if (!isPasswordValid) {
        console.log('Password does not match for user:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      console.log('Login attempt successful for user:', email);

      // Check if the user is verified
      if (!user.verified) {
        console.log('User not verified:', email);
        return res.status(403).json({ message: 'Please verify your email first.' });
      }

      // Generate a JWT token
      const token = jwt.sign({ email: user.email, clientId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log('Token generated for user:', email);

      // Respond with the token and redirect URL


      // Set the cookie in the response
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 1 hour
          sameSite: 'lax',
          path: '/',
        })
      );
      
      // return res.status(200).json({ redirectUrl: `/client-dashboard/${user._id}`, clientId: user._id });
      
      let redirectUrl;
if (user.role === 'admin') {
  redirectUrl = '/agents/Admin_Panel/Admin_page';

} else {
  redirectUrl = `/client-dashboard/${user._id}`;
}

return res.status(200).json({ redirectUrl, clientId: user._id });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
