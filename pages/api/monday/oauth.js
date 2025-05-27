import axios from 'axios';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { connectToDatabase } from '../../../lib/db';

const client_id = process.env.MONDAY_CLIENT_ID;
const client_secret = process.env.MONDAY_CLIENT_SECRET;
const redirect_uri = process.env.MONDAY_REDIRECT_URI; // Must match the one in Monday Developer Console
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function handler(req, res) {
  const { code } = req.query; // Monday redirects with ?code=...

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await axios.post('https://auth.monday.com/oauth2/token', null, {
      params: {
        code,
        client_id,
        client_secret,
        redirect_uri,
      },
    });

    const { access_token } = tokenRes.data;
    console.log(`✅ Monday Access Token: ${access_token}`);

    // Step 2: Extract user from httpOnly cookie
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      console.warn('No auth token found in cookies');
      return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=missing_token`);
    }

    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = decoded.email;
    } catch (err) {
      console.error('❌ Invalid JWT:', err.message);
      return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=invalid_token`);
    }

    // Step 3: Store Monday access token in DB
    const { db } = await connectToDatabase();
    const updateRes = await db.collection('users').updateOne(
      { email },
      {
        $set: {
          mondayAccessToken: access_token,
        },
      }
    );

    if (updateRes.matchedCount === 0) {
      return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=user_not_found`);
    }

    // ✅ Redirect back to frontend
    return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?success=monday_connected`);
  } catch (err) {
    console.error('❌ Monday token exchange error:', err.response?.data || err.message);
    return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=monday_token_failed`);
  }
}
