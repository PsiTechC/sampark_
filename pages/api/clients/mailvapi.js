
import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import nodemailer from "nodemailer";


const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

import { DateTime } from "luxon";


async function sendEmailNotification(recipientEmail, appointmentDate, meetingLink, timezone = "Asia/Kolkata") {
  const dt = DateTime.fromISO(appointmentDate, { zone: 'utc' }).setZone(timezone);

  const readableDate = dt.toFormat("d LLLL yyyy 'at' h:mm a"); // Don't override time zone

  const transporter = nodemailer.createTransport({
    host: 'mail.samparkai.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: `"Upcoming Appointment Notification" ${user}`,
    to: recipientEmail,
    subject: "Your Appointment Details & Meeting Link",
    text: `These are your appointment details and online meeting link.\n\nAppointment Date and Time: ${readableDate} (${timezone} timezone)\nMeeting Link: ${meetingLink}`,
    html: `
      <p>These are your appointment details and online meeting link.</p>
      <p><strong>Appointment Date and Time:</strong> ${readableDate} (${timezone} timezone)</p>
      <p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipientEmail}: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to send email to ${recipientEmail}:`, err.message);
    return false;
  }
}

async function sendWhatsAppNotification(phoneNumber, appointmentDate, meetingLink, timezone = "Asia/Kolkata", companyName, companyPhone, maxRetries = 10) {
  const dt = DateTime.fromISO(appointmentDate, { zone: 'utc' }).setZone(timezone);
  const readableDate = dt.toFormat("d LLLL yyyy 'at' h:mm a");

  const apiUrl = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";
  const apiKey = process.env.WHATSAPP_API_KEY;

  const payload = {
    to_number: phoneNumber,
    template_name: "appointment_v3",
    whatsapp_request_type: "TEMPLATE",
    parameters: [
      companyName,
      `${readableDate} (${timezone} timezone)`,
      meetingLink,
      companyPhone,
    ],
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          'Authorization': `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(`❌ Attempt ${attempt} failed:`, data.message || data);
        console.error("🔍 Full API response:", data);


        // Retry only for specific error message
        if (
          attempt < maxRetries &&
          typeof data.message === "string" &&
          data.message.includes("Application failed to respond")
        ) {
          const waitTime = 1000 * 2 ** (attempt - 1); // exponential backoff
          console.warn(`⏳ Retrying in ${waitTime / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        return false;
      }

      console.log("📲 WhatsApp message sent successfully:", data);
      return true;
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed due to error:`, err.message);

      if (attempt < maxRetries) {
        const waitTime = 1000 * 2 ** (attempt - 1);
        console.warn(`⏳ Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        return false;
      }
    }
  }

  return false;
}



async function refreshAccessToken(refreshToken) {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error_description || "Failed to refresh token");
    }

    return data.access_token;
  } catch (err) {
    console.error("❌ Failed to refresh access token:", err.message);
    return null;
  }
}

async function createGoogleCalendarEvent(accessToken, eventDetails, refreshToken, userId, db) {
  const { name, email, customerNumber, appointmentDate, meetLink, purpose, summary, timezone } = eventDetails;

  const eventTimeZone = timezone && typeof timezone === "string" ? timezone : "Asia/Kolkata";
  const startTime = appointmentDate;
  if (!startTime || !startTime.includes("T")) {
    console.error("❌ Invalid ISO format appointmentDate:", appointmentDate);
    return false;
  }

  const endTime = new Date(new Date(startTime).getTime() + 30 * 60000).toISOString();

  const event = {
    summary: `Meeting with ${name}`,
    description: `Purpose: ${purpose || "N/A"}\nCustomer Number: ${customerNumber}\n\nSummary: ${summary || "N/A"}`,
    start: { dateTime: startTime, timeZone: eventTimeZone },
    end: { dateTime: endTime, timeZone: eventTimeZone },
    location: meetLink,
  };

  if (email && email !== "-" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    event.attendees = [{ email }];
  }


  let res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (res.status === 401 && refreshToken) {
    console.warn("🔁 Access token expired. Attempting refresh...");

    const newAccessToken = await refreshAccessToken(refreshToken);
    if (!newAccessToken) return false;

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { googleAccessToken: newAccessToken } }
    );

    res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { error: 'Invalid JSON response', statusText: res.statusText };
  }

  if (!res.ok) {
    console.error("❌ Calendar API error:", data.error || data);
    return false;
  }

  console.log("📅 Google Calendar event created:", data.id);
  return true;
}



export default async function handler(req, res) {
  await CorsMiddleware(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const callCollection = db.collection("userdatafromcallwithsentiment");
    const meetLinksCollection = db.collection("meetlinks");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({
      googleAccessToken: { $exists: true, $ne: null },
    });

    if (!user) {
      return res.status(400).json({ message: "No user found with connected Google Calendar" });
    }

    const allData = await callCollection.find({}).toArray();

    for (const doc of allData) {
      const assistantId = doc.assistantId;
      const callData = doc.data || {};
      const callIds = Object.keys(callData);

      for (const callId of callIds) {
        const call = callData[callId];
        const { email, appointmentDate, name, customerNumber, purpose } = call;

        if (call.isMailSend === true || !appointmentDate || appointmentDate === "-") {
          continue;
        }
        if (
          !appointmentDate ||
          appointmentDate === "-" ||
          !appointmentDate.includes("T") ||
          isNaN(Date.parse(appointmentDate))
        ) {
          console.warn(`⚠️ Skipping call ${callId} — invalid or missing appointmentDate: ${appointmentDate}`);
          continue;
        }

        if ((!email || email === "-") && (!customerNumber || customerNumber === "-")) {
          console.warn(`⚠️ Skipping call ${callId} — No email or phone to notify.`);
          continue;
        }

        console.log(`📞 Execution ID: ${callId}`);
        console.log("📧 Data:", call);

        const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
        const meetingLink = meetLinkDoc?.meetLink || "-";

        let emailSent = false;
        let whatsappSent = false;


        const userAgentMapping = await db.collection("useragentmapping").findOne({
          assistants: assistantId,
        });

        let companyName = "SamparkAI";
        let companyPhone = "+91XXXXXXXXXX";

        if (userAgentMapping && userAgentMapping.userId) {
          const userDoc = await db.collection("users").findOne({ _id: userAgentMapping.userId });
          if (userDoc) {
            companyName = userDoc.companyName || companyName;
            companyPhone = userDoc.phoneNumber || companyPhone;
          }
        }

        if (email && email !== "-") {
          emailSent = await sendEmailNotification(email, appointmentDate, meetingLink, call.timezone);
        }

        if (customerNumber && customerNumber !== "-") {
          whatsappSent = await sendWhatsAppNotification(customerNumber, appointmentDate, meetingLink, call.timezone, companyName, companyPhone);
        }

        if (!emailSent && !whatsappSent) {
          console.warn(`⚠️ No successful notification for call ${callId}`);
        }

        const eventCreated = await createGoogleCalendarEvent(
          user.googleAccessToken,
          { name, email, customerNumber, appointmentDate, purpose, meetLink: meetingLink, summary: call.summary, timezone: call.timezone },
          user.googleRefreshToken,
          user._id,
          db
        );

        if (emailSent || whatsappSent || eventCreated) {
          await callCollection.updateOne(
            { assistantId },
            {
              $set: {
                [`data.${callId}.isMailSend`]: true,
              },
            }
          );
          console.log(`📝 Marked isMailSend: true for call ${callId}`);
        }

      }
    }

    return res.status(200).json({ message: "Emails sent and calendar events added" });

  } catch (error) {
    console.error("❌ Failed to process calls:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

