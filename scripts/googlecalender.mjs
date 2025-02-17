import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import open from 'open';

// Load client secrets from file
const CREDENTIALS_PATH = "C:\\botGIT\\botGIT-main\\client_secret_190706595224-pkkgcipmr0m6ada7gq0clvva7bdo6htt.apps.googleusercontent.com.json";

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

function loadOAuthClient() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    
    // Ensure JSON has 'web' section
    if (!credentials.web) {
        console.error("Error: Invalid client_secret.json file. Missing 'web' object.");
        process.exit(1);
    }

    const { client_secret, client_id, token_uri } = credentials.web;
    const redirect_uris = credentials.web.redirect_uris || ["http://localhost"];
    
    if (!client_secret || !client_id || !redirect_uris.length) {
        console.error("Error: Missing client credentials in JSON.");
        process.exit(1);
    }

    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log("Open this URL in your browser to authorize the app:", authUrl);
    open(authUrl); // Opens the link in default browser

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Enter the code from the browser: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error("Error retrieving access token:", err);
                return;
            }
            oAuth2Client.setCredentials(token);
            fs.writeFileSync('token.json', JSON.stringify(token));
            console.log("Token stored in token.json");
            fetchCalendarEvents(oAuth2Client);
        });
    });
}

async function fetchCalendarEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });

    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items;
        if (events.length) {
            console.log("Upcoming events:");
            events.forEach(event => {
                console.log(`- ${event.summary} (${event.start.dateTime || event.start.date})`);
            });
        } else {
            console.log("No upcoming events found.");
        }
    } catch (error) {
        console.error("Error fetching calendar events:", error.message);
    }
}

const oAuth2Client = loadOAuthClient();
fs.readFile('token.json', (err, token) => {
    if (err) {
        getAccessToken(oAuth2Client);
    } else {
        oAuth2Client.setCredentials(JSON.parse(token));
        fetchCalendarEvents(oAuth2Client);
    }
});
