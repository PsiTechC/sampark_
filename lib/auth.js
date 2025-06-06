import jwt from 'jsonwebtoken';
import cookie from 'cookie'; // if you're parsing cookies manually

export function authenticateToken(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const parsed = cookie.parse(cookies);
  const token = parsed.token;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}