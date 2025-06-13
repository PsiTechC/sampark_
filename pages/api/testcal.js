// import axios from 'axios';
// import jwt from 'jsonwebtoken';
// import cookie from 'cookie';
// import { connectToDatabase } from '../../lib/db';

// const client_id = process.env.GOOGLE_CLIENT_ID;
// const client_secret = process.env.GOOGLE_CLIENT_SECRET;
// const redirect_uri = process.env.GOOGLE_REDIRECT_URI; // Should match what’s registered in Google Console
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export default async function handler(req, res) {
//   const { code } = req.query; // ✅ Google sends code as query param

//   if (!code) {
//     return res.status(400).json({ error: 'Missing authorization code' });
//   }

//   try {
//     // Exchange code for access & refresh tokens
//     const tokenRes = await axios.post('https://oauth2.googleapis.com/token', null, {
//       params: {
//         code,
//         client_id,
//         client_secret,
//         redirect_uri,
//         grant_type: 'authorization_code',
//       },
//     });

//     const { access_token, refresh_token } = tokenRes.data;
//     console.log(`✅ Access Token: ${access_token}`);
//     console.log(`✅ Refresh Token: ${refresh_token}`);

//     // Read and verify JWT from httpOnly cookie
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const token = cookies.token;

//     if (!token) {
//       console.warn('No auth token found in cookies');
//       return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=missing_token`);
//     }

//     let email;
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       email = decoded.email;
//     } catch (err) {
//       console.error('❌ Invalid JWT:', err.message);
//       return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=invalid_token`);
//     }

//     // Save tokens in the database
//     const { db } = await connectToDatabase();
//     const updateRes = await db.collection('users').updateOne(
//       { email },
//       {
//         $set: {
//           googleAccessToken: access_token,
//           googleRefreshToken: refresh_token,
//         },
//       }
//     );

//     if (updateRes.matchedCount === 0) {
//       return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=user_not_found`);
//     }

//     // ✅ Redirect back to frontend
//     return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?success=true`);
//   } catch (err) {
//     console.error('❌ Token exchange error or DB save failure:', err.response?.data || err.message);
//     return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=token_exchange_failed`);
//   }
// }


import axios from 'axios';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { connectToDatabase } from '../../lib/db';

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = process.env.GOOGLE_REDIRECT_URI; // Should match what’s registered in Google Console
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function handler(req, res) {
  const { code } = req.query; // ✅ Google sends code as query param

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // Exchange code for access & refresh tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      },
    });

    const { access_token, refresh_token } = tokenRes.data;
    console.log(`✅ Access Token: ${access_token}`);
    console.log(`✅ Refresh Token: ${refresh_token}`);

    // Read and verify JWT from httpOnly cookie
    const cookies = cookie.parse(req.headers.cookie || '');
    let calendarName = cookies.pendingCalendarName;

if (!calendarName) {
  const nameKey = index === 0 ? "calendarMeta" : `calendarMeta${index}`;
  calendarName = userDoc[nameKey] || `Calendar ${index + 1}`;
}

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

    const { db } = await connectToDatabase();
    const userDoc = await db.collection("users").findOne({ email });

    if (!userDoc) {
      return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=user_not_found`);
    }

    // Determine the next available index
    let index = 0;
    while (
      userDoc[`googleAccessToken${index}`] !== undefined ||
      (index === 0 && userDoc.googleAccessToken)
    ) {
      index++;
    }

    const accessTokenKey = index === 0 ? "googleAccessToken" : `googleAccessToken${index}`;
    const refreshTokenKey = index === 0 ? "googleRefreshToken" : `googleRefreshToken${index}`;

    const calendarMetaKey = index === 0 ? "calendarMeta" : `calendarMeta${index}`;

    const updateRes = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          [accessTokenKey]: access_token,
          [refreshTokenKey]: refresh_token,
          [calendarMetaKey]: calendarName, // store the calendar name
        },
      }
    );
    
    
    if (updateRes.matchedCount === 0) {
      return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=user_not_found`);
    }
    

    // ✅ Redirect back to frontend
    return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?success=true`);
  } catch (err) {
    console.error('❌ Token exchange error or DB save failure:', err.response?.data || err.message);
    return res.redirect(302, `${BASE_URL}/agents/ConnectCalender?error=token_exchange_failed`);
  }
}

