const fs = require('fs');
const { google } = require('googleapis');
const open = (...args) => import('open').then(m => m.default(...args));
const readline = require('readline');

// Your OAuth2 client credentials
const CLIENT_ID = '85257203632-k6m0vkbbr747pgrajqjjhu5m7gluui0c.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate the auth URL
const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Opening browser for authentication...');
open(authUrl);

// Read the code from the user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Paste the code from the browser here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    // Save tokens for later use
    fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));
    console.log('Tokens saved to tokens.json');

    rl.close();
  } catch (err) {
    console.error('Error retrieving access token:', err);
    rl.close();
  }
});
