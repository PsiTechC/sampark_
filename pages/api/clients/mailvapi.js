// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";
// import nodemailer from "nodemailer";
// const chrono = require("chrono-node");


// const user = process.env.EMAIL_USER;
// const pass = process.env.EMAIL_PASS;

// async function sendEmailNotification(recipientEmail, appointmentDate, meetingLink) {
//   const transporter = nodemailer.createTransport({
//     host: 'mail.samparkai.com',
//     port: 587,
//     secure: false,
//     auth: { user, pass },
//     tls: { rejectUnauthorized: false },
//   });

//   const readableDate = new Intl.DateTimeFormat('en-IN', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: '2-digit',
//     hour12: true,
//     timeZoneName: 'short'
//   }).format(new Date(appointmentDate));

//   const mailOptions = {
//     from: `"Upcoming Appointment Notification" ${user}`,
//     to: recipientEmail,
//     subject: "Your Appointment Details & Meeting Link",
    
//     text: `These are your appointment details and online meeting link.\n\nAppointment Date and Time: ${readableDate}\nMeeting Link: ${meetingLink}`,
//     html: `
//       <p>These are your appointment details and online meeting link.</p>
//       <p><strong>Appointment Date and Time:</strong> ${readableDate}</p>
//       <p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent to ${recipientEmail}: ${info.messageId}`);
//     return true;
//   } catch (err) {
//     console.error(`❌ Failed to send email to ${recipientEmail}:`, err.message);
//     return false;
//   }
// }

// function parseAppointmentDateToISOString(dateString) {
//   try {
//     const parsedDate = chrono.parseDate(dateString, { timezone: 'Asia/Kolkata' });
//     if (!parsedDate) return null;
//     return parsedDate.toISOString();
//   } catch (e) {
//     console.error("❌ Error parsing appointment date:", e.message);
//     return null;
//   }
// }
// async function refreshAccessToken(refreshToken) {
//   try {
//     const res = await fetch("https://oauth2.googleapis.com/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         refresh_token: refreshToken,
//         grant_type: "refresh_token",
//       }),
//     });

//     const data = await res.json();
//     if (!res.ok) {
//       throw new Error(data.error_description || "Failed to refresh token");
//     }

//     return data.access_token;
//   } catch (err) {
//     console.error("❌ Failed to refresh access token:", err.message);
//     return null;
//   }
// }

// async function createGoogleCalendarEvent(accessToken, eventDetails, refreshToken, userId, db) {
//   const { name, email, customerNumber, appointmentDate, meetLink, purpose } = eventDetails;

//   const startTime = appointmentDate;
//   if (!startTime || !startTime.includes("T")) {
//     console.error("❌ Invalid ISO format appointmentDate:", appointmentDate);
//     return false;
//   }

//   const endTime = new Date(new Date(startTime).getTime() + 30 * 60000).toISOString();

//   const event = {
//     summary: `Meeting with ${name}`,
//     description: `Purpose: ${purpose || "N/A"}\nCustomer Number: ${customerNumber}`,
//     start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
//     end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
//     attendees: [{ email }],
//     location: meetLink,
//   };

//   let res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(event),
//   });

//   if (res.status === 401 && refreshToken) {
//     console.warn("🔁 Access token expired. Attempting refresh...");

//     const newAccessToken = await refreshAccessToken(refreshToken);
//     if (!newAccessToken) return false;

//     await db.collection("users").updateOne(
//       { _id: userId },
//       { $set: { googleAccessToken: newAccessToken } }
//     );

//     res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${newAccessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(event),
//     });
//   }

//   const data = await res.json();
//   if (!res.ok) {
//     console.error("❌ Calendar API error:", data.error || data);
//     return false;
//   }

//   console.log("📅 Google Calendar event created:", data.id);
//   return true;
// }



// export default async function handler(req, res) {
//   await CorsMiddleware(req, res);

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { db } = await connectToDatabase();
//     const callCollection = db.collection("userdatafromcallwithsentiment");
//     const meetLinksCollection = db.collection("meetlinks");
//     const userCollection = db.collection("users");

//     const user = await userCollection.findOne({
//       googleAccessToken: { $exists: true, $ne: null },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "No user found with connected Google Calendar" });
//     }

//     const allData = await callCollection.find({}).toArray();

//     for (const doc of allData) {
//       const assistantId = doc.assistantId;
//       const callData = doc.data || {};
//       const callIds = Object.keys(callData);

//       for (const callId of callIds) {
//         const call = callData[callId];
//         const { email, appointmentDate, name, customerNumber, purpose } = call;

//         if (!email || email === "-" || call.isMailSend === true || !appointmentDate || appointmentDate === "-") {
//           continue;
//         }

//         console.log(`📞 Execution ID: ${callId}`);
//         console.log("📧 Data:", call);

//         const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
//         const meetingLink = meetLinkDoc?.meetLink || "-";

//         const emailSent = await sendEmailNotification(email, appointmentDate, meetingLink);

//         const eventCreated = await createGoogleCalendarEvent(
//           user.googleAccessToken,
//           { name, email, customerNumber, appointmentDate, purpose, meetLink: meetingLink },
//           user.googleRefreshToken,
//           user._id,
//           db
//         );
        

//         if (emailSent && eventCreated) {
//           await callCollection.updateOne(
//             { assistantId },
//             {
//               $set: {
//                 [`data.${callId}.isMailSend`]: true,
//               },
//             }
//           );
//           console.log(`📝 Marked isMailSend: true for call ${callId}`);
//         }
//       }
//     }

//     return res.status(200).json({ message: "Emails sent and calendar events added" });

//   } catch (error) {
//     console.error("❌ Failed to process calls:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }



import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import nodemailer from "nodemailer";
const chrono = require("chrono-node");


const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

async function sendEmailNotification(recipientEmail, appointmentDate, meetingLink) {
  const transporter = nodemailer.createTransport({
    host: 'mail.samparkai.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const readableDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }).format(new Date(appointmentDate));

  const mailOptions = {
    from: `"Upcoming Appointment Notification" ${user}`,
    to: recipientEmail,
    subject: "Your Appointment Details & Meeting Link",
    
    text: `These are your appointment details and online meeting link.\n\nAppointment Date and Time: ${readableDate}\nMeeting Link: ${meetingLink}`,
    html: `
      <p>These are your appointment details and online meeting link.</p>
      <p><strong>Appointment Date and Time:</strong> ${readableDate}</p>
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


async function sendWhatsAppNotification(phoneNumber, appointmentDate, meetingLink) {
  const apiUrl = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";
  const apiKey = process.env.WHATSAPP_API_KEY;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        to_number: phoneNumber,
        template_name: "appointment_test2",
        whatsappRequestType: "TEMPLATE",
        parameters: [
          new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZoneName: "short"
          }).format(new Date(appointmentDate)),
          meetingLink
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Failed to send WhatsApp message:", data.message || data);
      return false;
    }

    console.log("📲 WhatsApp message sent successfully:", data);
    return true;
  } catch (err) {
    console.error("❌ WhatsApp message error:", err.message);
    return false;
  }
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
  const { name, email, customerNumber, appointmentDate, meetLink, purpose, summary } = eventDetails;

  const startTime = appointmentDate;
  if (!startTime || !startTime.includes("T")) {
    console.error("❌ Invalid ISO format appointmentDate:", appointmentDate);
    return false;
  }

  const endTime = new Date(new Date(startTime).getTime() + 30 * 60000).toISOString();

  const event = {
    summary: `Meeting with ${name}`,
    description: `Purpose: ${purpose || "N/A"}\nCustomer Number: ${customerNumber}\n\nSummary: ${summary || "N/A"}`,
    start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
    end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
    attendees: [{ email }],
    location: meetLink,
  };

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

  const data = await res.json();
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

        if (!email || email === "-" || call.isMailSend === true || !appointmentDate || appointmentDate === "-") {
          continue;
        }

        console.log(`📞 Execution ID: ${callId}`);
        console.log("📧 Data:", call);

        const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
        const meetingLink = meetLinkDoc?.meetLink || "-";

        const emailSent = await sendEmailNotification(email, appointmentDate, meetingLink);
        const whatsappSent = await sendWhatsAppNotification(customerNumber, appointmentDate, meetingLink);
        
        if (!whatsappSent) {
          console.warn(`⚠️ Failed to send WhatsApp to ${customerNumber}`);
        }

        const eventCreated = await createGoogleCalendarEvent(
          user.googleAccessToken,
          { name, email, customerNumber, appointmentDate, purpose, meetLink: meetingLink,  summary: call.summary },
          user.googleRefreshToken,
          user._id,
          db
        );
        

        if (emailSent && eventCreated) {
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
