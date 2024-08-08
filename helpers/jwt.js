//C:\Users\***REMOVED*** kale\botGIT\helpers\jwt.js
// helpers/jwt.js
import jwt from 'jsonwebtoken';

export function generateToken(user) {
  console.log('Generating token for user:', user);
  try {
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token);
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

export function verifyToken(token) {
  console.log('Verifying token:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}
