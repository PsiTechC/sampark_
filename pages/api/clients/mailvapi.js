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

async function sendWhatsAppConfirmation(phoneNumber, email, name) {
  const apiUrl = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";

  const payload = {
    to_number: phoneNumber,
    template_name: "emai_confirm_v2",
    whatsapp_request_type: "TEMPLATE",
    parameters: [email, name],
  };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.WHATSAPP_API_KEY,
        "Authorization": `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("❌ Failed to send WhatsApp confirmation:", result.message || result);
      return false;
    }

    console.log("✅ WhatsApp confirmation sent:", result);
    return true;
  } catch (error) {
    console.error("❌ Error in sendWhatsAppConfirmation:", error.message);
    return false;
  }
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
    const whatsappResponsesCollection = db.collection("whatsappresponses");
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

        // 📌 CASE: WhatsApp already sent, but email not sent yet
        if (call.isMailSend === true && call.isUserCorrectedMailSend !== true) {
          const { appointmentDate, name, customerNumber, email, purpose, summary } = call;
          const timezone = call.timezone || "Asia/Kolkata";

          const validDate =
            appointmentDate &&
            typeof appointmentDate === "string" &&
            appointmentDate !== "-" &&
            appointmentDate.includes("T") &&
            !isNaN(Date.parse(appointmentDate));

          if (!validDate || !customerNumber || customerNumber === "-") {
            console.warn(`⚠️ Skipping retry email for call ${callId} — invalid date or number`);
            continue;
          }

          const cleanNumber = customerNumber.startsWith("+") ? customerNumber.slice(1) : customerNumber;
          const responseDoc = await whatsappResponsesCollection.findOne({
            customer_number: cleanNumber,
          });

          if (responseDoc?.raw_response_json) {
            try {
              console.log(`🔁 Retry path: checking response for ${customerNumber}`);

              const parsed = JSON.parse(responseDoc.raw_response_json);
              const emailCandidate = Object.values(parsed).find(
                (val) => typeof val === "string" && val.includes("@")
              );

              if (emailCandidate) {
                const extractedEmail = emailCandidate.trim();
                console.log(`📧 Retried extracted email for ${customerNumber}: ${extractedEmail}`);

                const emailSent = await sendEmailNotification(
                  extractedEmail,
                  appointmentDate,
                  "https://meet.google.com/default-link", // optional: you can fetch meetLink again if needed
                  timezone
                );

                if (emailSent) {
                  await whatsappResponsesCollection.updateOne(
                    { _id: responseDoc._id },
                    { $set: { isMailExtracted: true } }
                  );
                  console.log(`✅ Retried email sent and isMailExtracted marked true for ${customerNumber}`);

                  await callCollection.updateOne(
                    { assistantId },
                    { $set: { [`data.${callId}.isUserCorrectedMailSend`]: true } }
                  );
                  console.log(`✅ Retried marked isUserCorrectedMailSend: true for call ${callId}`);
                } else {
                  console.warn(`⚠️ Retry: failed to send email to ${extractedEmail}`);
                }
              } else {
                console.warn(`⚠️ Retry: no email found in WhatsApp response for ${customerNumber}`);
              }
            } catch (err) {
              console.error(`❌ Retry: failed to parse WhatsApp response for ${customerNumber}:`, err.message);
            }
          } else {
            console.warn(`⚠️ Retry: no WhatsApp response found for ${customerNumber}`);
          }

          continue; // ✅ Skip rest of processing for this call
        }

        if (call.isMailSend === true && call.isUserCorrectedMailSend === true) {
          // console.log(`⏭️ Skipping call ${callId} — already handled`);
          continue;
        }

        const { appointmentDate, name, customerNumber, email, purpose, summary } = call;
        // console.log(`📞 Execution ID: ${callId}`);
        // console.log("📧 Data:", call);

        let timezone = call.timezone || "Asia/Kolkata";

        const validDate =
          appointmentDate &&
          typeof appointmentDate === "string" &&
          appointmentDate !== "-" &&
          appointmentDate.includes("T") &&
          !isNaN(Date.parse(appointmentDate));

        if (!validDate) {
          console.warn(`⚠️ Skipping ${callId} due to invalid appointmentDate: ${appointmentDate}`);
          continue;
        }

        const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
        const meetingLink = meetLinkDoc?.meetLink && meetLinkDoc.meetLink !== "-" ? meetLinkDoc.meetLink : "https://meet.google.com/default-link";

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

        if (call.isMailSend !== true && customerNumber && customerNumber !== "-") {
          const whatsappSent = await sendWhatsAppNotification(
            customerNumber,
            appointmentDate,
            meetingLink,
            timezone,
            companyName,
            companyPhone,
            10
          );

          if (whatsappSent) {
            // ✅ Update isMailSend: true
            await callCollection.updateOne(
              { assistantId },
              { $set: { [`data.${callId}.isMailSend`]: true } }
            );
            console.log(`📝 Marked isMailSend: true for call ${callId}`);

            // 📝 Initially mark isUserCorrectedMailSend as false (will be set to true if email succeeds)
            await callCollection.updateOne(
              { assistantId },
              { $set: { [`data.${callId}.isUserCorrectedMailSend`]: false } }
            );
            console.log(`📝 Initially marked isUserCorrectedMailSend: false for call ${callId}`);


            const cleanNumber = customerNumber.startsWith("+") ? customerNumber.slice(1) : customerNumber;

            const responseDoc = await whatsappResponsesCollection.findOne({
              customer_number: cleanNumber,
            });

            let extractedEmail = null;
            if (responseDoc?.raw_response_json) {
              try {
                console.log(`📦 Found response for ${customerNumber}:`, responseDoc.raw_response_json);

                const parsed = JSON.parse(responseDoc.raw_response_json);
                const emailCandidate = Object.values(parsed).find(
                  (val) => typeof val === "string" && val.includes("@")
                );

                if (emailCandidate) {
                  extractedEmail = emailCandidate.trim();
                  console.log(`📧 Extracted email for ${customerNumber}: ${extractedEmail}`);

                  const emailSent = await sendEmailNotification(
                    extractedEmail,
                    appointmentDate,
                    meetingLink,
                    timezone
                  );

                  if (emailSent) {
                    await whatsappResponsesCollection.updateOne(
                      { _id: responseDoc._id },
                      { $set: { isMailExtracted: true } }
                    );
                    console.log(`✅ Email sent and marked isMailExtracted: true for ${customerNumber}`);
                    await callCollection.updateOne(
                      { assistantId },
                      { $set: { [`data.${callId}.isUserCorrectedMailSend`]: true } }
                    );
                    console.log(`✅ Marked isUserCorrectedMailSend: true for call ${callId}`);
                  } else {
                    console.warn(`⚠️ Failed to send email to extracted address for ${customerNumber}`);
                  }
                } else {
                  console.warn(`⚠️ No email found in parsed response for ${customerNumber}`);
                  await sendWhatsAppConfirmation(customerNumber, email, name);
                }
              } catch (err) {
                console.error(`❌ Failed to parse raw_response_json for ${customerNumber}:`, err.message);
              }
            } else {
              console.warn(`⚠️ No raw_response_json found for ${customerNumber}`);
              await sendWhatsAppConfirmation(customerNumber, email, name);
            }



            // ✅ Always create Calendar event
            await createGoogleCalendarEvent(
              user.googleAccessToken,
              {
                name,
                email: extractedEmail || email,
                customerNumber,
                appointmentDate,
                purpose,
                meetLink: meetingLink,
                summary,
                timezone,
              },
              user.googleRefreshToken,
              user._id,
              db
            );
          }
        } else {
          console.warn(`⚠️ Skipping WhatsApp + Email + Calendar for ${callId} — Missing/invalid customerNumber`);
        }
      }
    }

    return res.status(200).json({ message: "Notifications and calendar events processed successfully" });

  } catch (error) {
    console.error("❌ Failed to process calls:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}






// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";
// import nodemailer from "nodemailer";


// const user = process.env.EMAIL_USER;
// const pass = process.env.EMAIL_PASS;

// import { DateTime } from "luxon";


// async function sendEmailNotification(recipientEmail, appointmentDate, meetingLink, timezone = "Asia/Kolkata") {
//   const dt = DateTime.fromISO(appointmentDate, { zone: 'utc' }).setZone(timezone);

//   const readableDate = dt.toFormat("d LLLL yyyy 'at' h:mm a"); // Don't override time zone

//   const transporter = nodemailer.createTransport({
//     host: 'mail.samparkai.com',
//     port: 587,
//     secure: false,
//     auth: { user, pass },
//     tls: { rejectUnauthorized: false },
//   });

//   const mailOptions = {
//     from: `"Upcoming Appointment Notification" ${user}`,
//     to: recipientEmail,
//     subject: "Your Appointment Details & Meeting Link",
//     text: `These are your appointment details and online meeting link.\n\nAppointment Date and Time: ${readableDate} (${timezone} timezone)\nMeeting Link: ${meetingLink}`,
//     html: `
//       <p>These are your appointment details and online meeting link.</p>
//       <p><strong>Appointment Date and Time:</strong> ${readableDate} (${timezone} timezone)</p>
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

// async function sendWhatsAppNotification(phoneNumber, appointmentDate, meetingLink, timezone = "Asia/Kolkata", companyName, companyPhone, maxRetries = 10) {
//   const dt = DateTime.fromISO(appointmentDate, { zone: 'utc' }).setZone(timezone);
//   const readableDate = dt.toFormat("d LLLL yyyy 'at' h:mm a");

//   const apiUrl = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";
//   const apiKey = process.env.WHATSAPP_API_KEY;

//   const payload = {
//     to_number: phoneNumber,
//     template_name: "appointment_v3",
//     whatsapp_request_type: "TEMPLATE",
//     parameters: [
//       companyName,
//       `${readableDate} (${timezone} timezone)`,
//       meetingLink,
//       companyPhone,
//     ],
//   };

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const res = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": apiKey,
//           'Authorization': `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         console.error(`❌ Attempt ${attempt} failed:`, data.message || data);
//         console.error("🔍 Full API response:", data);


//         // Retry only for specific error message
//         if (
//           attempt < maxRetries &&
//           typeof data.message === "string" &&
//           data.message.includes("Application failed to respond")
//         ) {
//           const waitTime = 1000 * 2 ** (attempt - 1); // exponential backoff
//           console.warn(`⏳ Retrying in ${waitTime / 1000}s...`);
//           await new Promise(resolve => setTimeout(resolve, waitTime));
//           continue;
//         }

//         return false;
//       }

//       console.log("📲 WhatsApp message sent successfully:", data);
//       return true;
//     } catch (err) {
//       console.error(`❌ Attempt ${attempt} failed due to error:`, err.message);

//       if (attempt < maxRetries) {
//         const waitTime = 1000 * 2 ** (attempt - 1);
//         console.warn(`⏳ Retrying in ${waitTime / 1000}s...`);
//         await new Promise(resolve => setTimeout(resolve, waitTime));
//       } else {
//         return false;
//       }
//     }
//   }

//   return false;
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
//   const { name, email, customerNumber, appointmentDate, meetLink, purpose, summary, timezone } = eventDetails;

//   const eventTimeZone = timezone && typeof timezone === "string" ? timezone : "Asia/Kolkata";
//   const startTime = appointmentDate;
//   if (!startTime || !startTime.includes("T")) {
//     console.error("❌ Invalid ISO format appointmentDate:", appointmentDate);
//     return false;
//   }

//   const endTime = new Date(new Date(startTime).getTime() + 30 * 60000).toISOString();

//   const event = {
//     summary: `Meeting with ${name}`,
//     description: `Purpose: ${purpose || "N/A"}\nCustomer Number: ${customerNumber}\n\nSummary: ${summary || "N/A"}`,
//     start: { dateTime: startTime, timeZone: eventTimeZone },
//     end: { dateTime: endTime, timeZone: eventTimeZone },
//     location: meetLink,
//   };

//   if (email && email !== "-" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     event.attendees = [{ email }];
//   }


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

//   let data;
//   try {
//     data = await res.json();
//   } catch (e) {
//     data = { error: 'Invalid JSON response', statusText: res.statusText };
//   }

//   if (!res.ok) {
//     console.error("❌ Calendar API error:", data.error || data);
//     return false;
//   }

//   console.log("📅 Google Calendar event created:", data.id);
//   return true;
// }

// async function sendWhatsAppConfirmation(phoneNumber, email, name) {
//   const apiUrl = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";

//   const payload = {
//     to_number: phoneNumber,
//     template_name: "emai_confirm_v2",
//     whatsapp_request_type: "TEMPLATE",
//     parameters: [email, name],
//   };

//   try {
//     const res = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.WHATSAPP_API_KEY,
//         "Authorization": `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       console.error("❌ Failed to send WhatsApp confirmation:", result.message || result);
//       return false;
//     }

//     console.log("✅ WhatsApp confirmation sent:", result);
//     return true;
//   } catch (error) {
//     console.error("❌ Error in sendWhatsAppConfirmation:", error.message);
//     return false;
//   }
// }

// async function isSlotBusy(token, slotStartISO, slotEndISO, timezone, db, userId) {
//   const requestBody = {
//     timeMin: slotStartISO,
//     timeMax: slotEndISO,
//     timeZone: timezone,
//     items: [{ id: "primary" }],
//   };

//   let accessToken = token.accessToken;
//   let res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestBody),
//   });

//   if (res.status === 401 && token.refreshToken) {
//     console.warn(`🔁 Access token expired for calendar ${token.tokenKey}, attempting refresh...`);
//     const newAccessToken = await refreshAccessToken(token.refreshToken);

//     if (newAccessToken) {
//       accessToken = newAccessToken;

//       if (token.tokenKey === "") {
//         await db.collection("users").updateOne({ _id: userId }, { $set: { googleAccessToken: newAccessToken } });
//       } else {
//         await db.collection("users").updateOne({ _id: userId }, { $set: { [`googleAccessToken${token.tokenKey}`]: newAccessToken } });
//       }

//       res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });
//     } else {
//       console.error(`❌ Failed to refresh token for calendar ${token.tokenKey}`);
//       return true; // Assume busy if we can't verify
//     }
//   }

//   const data = await res.json();
//   const busy = data?.calendars?.primary?.busy || [];
//   return busy.length > 0;
// }

// async function bookInAvailableCalendar(user, eventDetails, timezone, db) {
//   const { appointmentDate } = eventDetails;

//   const dt = new Date(appointmentDate);
//   const startRFC3339 = dt.toISOString();

//   const googleTokens = Object.entries(user)
//     .filter(([key, val]) => key.startsWith("googleAccessToken") && val)
//     .map(([key]) => {
//       const index = key === "googleAccessToken" ? "" : key.replace("googleAccessToken", "");
//       return {
//         accessToken: user[`googleAccessToken${index}`],
//         refreshToken: user[`googleRefreshToken${index}`],
//         tokenKey: index,
//       };
//     });

//   // 1. Try the originally requested slot
//   const endDt = new Date(dt.getTime() + 30 * 60000);
//   const endRFC3339 = endDt.toISOString();

//   const bodyTemplate = {
//     timeMin: startRFC3339,
//     timeMax: endRFC3339,
//     timeZone: timezone,
//     items: [{ id: "primary" }],
//   };

//   for (const token of googleTokens) {
//     const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(bodyTemplate),
//     });

//     const availability = await res.json();
//     const isBusy = availability?.calendars?.primary?.busy?.length > 0;

//     if (!isBusy) {
//       const calendarEventCreated = await createGoogleCalendarEvent(
//         token.accessToken,
//         eventDetails,
//         token.refreshToken,
//         user._id,
//         db
//       );

//       if (calendarEventCreated) {
//         return { success: true, calendarIndex: token.tokenKey };
//       }
//     }
//   }

//   // 2. No calendar was available — Suggest 5 free slots (across all calendars)
//   const availableSlots = [];
//   let currentDate = new Date(appointmentDate);
//   // Move to next day 8 AM only if we've passed 6 PM on the current day
// if (currentDate.getHours() >= 18) {
//   currentDate.setDate(currentDate.getDate() + 1);
//   currentDate.setHours(8, 0, 0, 0);
// } else {
//   // Start from current time but move to next 30-minute slot
//   let min = currentDate.getMinutes();
//   if (min < 30) currentDate.setMinutes(30, 0, 0);
//   else {
//     currentDate.setHours(currentDate.getHours() + 1, 0, 0, 0);
//   }
// }


//   while (availableSlots.length < 5) {
//     let startHour = currentDate.getHours();
//     let startMinute = currentDate.getMinutes();
    
//     for (let hour = startHour; hour < 18; hour++) {
//       for (let minute of [0, 30]) {
//         if (hour === startHour && minute < startMinute) continue;
    
//         const slotStart = new Date(currentDate);
//         slotStart.setHours(hour, minute, 0, 0);
//         const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

//         const slotStartISO = slotStart.toISOString();
//         const slotEndISO = slotEnd.toISOString();

//         let allBusy = false;

//         for (const token of googleTokens) {
//           const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${token.accessToken}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               timeMin: slotStartISO,
//               timeMax: slotEndISO,
//               timeZone: timezone,
//               items: [{ id: "primary" }],
//             }),
//           });

//           const data = await res.json();
//           const busy = data?.calendars?.primary?.busy || [];
//           if (busy.length > 0) {
//             allBusy = true;
//             break;
//           }
//         }

//         if (!allBusy) {
//           availableSlots.push(slotStartISO);
//           if (availableSlots.length === 5) break;
//         }
//       }

//       if (availableSlots.length === 5) break;
//     }

//     currentDate.setDate(currentDate.getDate() + 1);
//     currentDate.setHours(8, 0, 0, 0); // reset to 8 AM for next day
//   }

//   console.log("🕒 Suggested Available Slots:");
//   availableSlots.forEach((slot, idx) => {
//     const dt = DateTime.fromISO(slot, { zone: 'utc' }).setZone(timezone);
//     console.log(`🟢 Slot ${idx + 1}: ${dt.toFormat("d LLL yyyy, h:mm a")} (${timezone})`);
//   });

//   return { success: false };
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
//     const whatsappResponsesCollection = db.collection("whatsappresponses");
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

//         if (call.isMailSend === true && call.isUserCorrectedMailSend !== true) {
//           // (this block stays untouched)
//           continue;
//         }

//         if (call.isMailSend === true && call.isUserCorrectedMailSend === true) {
//           continue;
//         }

//         const { appointmentDate, name, customerNumber, email, purpose, summary } = call;
//         const timezone = call.timezone || "Asia/Kolkata";

//         const validDate =
//           appointmentDate &&
//           typeof appointmentDate === "string" &&
//           appointmentDate !== "-" &&
//           appointmentDate.includes("T") &&
//           !isNaN(Date.parse(appointmentDate));

//         if (!validDate) {
//           console.warn(`⚠️ Skipping ${callId} due to invalid appointmentDate: ${appointmentDate}`);
//           continue;
//         }

//         const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
//         const meetingLink = meetLinkDoc?.meetLink && meetLinkDoc.meetLink !== "-" ? meetLinkDoc.meetLink : "https://meet.google.com/default-link";

//         const userAgentMapping = await db.collection("useragentmapping").findOne({ assistants: assistantId });

//         let companyName = "SamparkAI";
//         let companyPhone = "+91XXXXXXXXXX";

//         if (userAgentMapping && userAgentMapping.userId) {
//           const userDoc = await db.collection("users").findOne({ _id: userAgentMapping.userId });
//           if (userDoc) {
//             companyName = userDoc.companyName || companyName;
//             companyPhone = userDoc.phoneNumber || companyPhone;
//           }
//         }

//         if (call.isMailSend !== true && customerNumber && customerNumber !== "-") {
//           // ✅ BOOK calendar before sending anything
//           const bookingResult = await bookInAvailableCalendar(
//             user,
//             {
//               name,
//               email,
//               customerNumber,
//               appointmentDate,
//               purpose,
//               meetLink: meetingLink,
//               summary,
//               timezone,
//             },
//             timezone,
//             db
//           );

//           if (!bookingResult.success) {
//             console.warn(`❌ No calendars have the requested slot available. Skipping call ${callId}.`);
//             continue;
//           }

//           // ✅ THEN send WhatsApp
//           const whatsappSent = await sendWhatsAppNotification(
//             customerNumber,
//             appointmentDate,
//             meetingLink,
//             timezone,
//             companyName,
//             companyPhone,
//             10
//           );

//           if (whatsappSent) {
//             await callCollection.updateOne(
//               { assistantId },
//               { $set: { [`data.${callId}.isMailSend`]: true } }
//             );

//             await callCollection.updateOne(
//               { assistantId },
//               { $set: { [`data.${callId}.isUserCorrectedMailSend`]: false } }
//             );

//             const cleanNumber = customerNumber.startsWith("+") ? customerNumber.slice(1) : customerNumber;
//             const responseDoc = await whatsappResponsesCollection.findOne({ customer_number: cleanNumber });

//             let extractedEmail = null;
//             if (responseDoc?.raw_response_json) {
//               try {
//                 const parsed = JSON.parse(responseDoc.raw_response_json);
//                 const emailCandidate = Object.values(parsed).find(
//                   (val) => typeof val === "string" && val.includes("@")
//                 );

//                 if (emailCandidate) {
//                   extractedEmail = emailCandidate.trim();

//                   const emailSent = await sendEmailNotification(
//                     extractedEmail,
//                     appointmentDate,
//                     meetingLink,
//                     timezone
//                   );

//                   if (emailSent) {
//                     await whatsappResponsesCollection.updateOne(
//                       { _id: responseDoc._id },
//                       { $set: { isMailExtracted: true } }
//                     );

//                     await callCollection.updateOne(
//                       { assistantId },
//                       { $set: { [`data.${callId}.isUserCorrectedMailSend`]: true } }
//                     );
//                   }
//                 } else {
//                   await sendWhatsAppConfirmation(customerNumber, email, name);
//                 }
//               } catch (err) {
//                 console.error(`❌ Failed to parse raw_response_json for ${customerNumber}:`, err.message);
//               }
//             } else {
//               await sendWhatsAppConfirmation(customerNumber, email, name);
//             }
//           }
//         } else {
//           console.warn(`⚠️ Skipping WhatsApp + Email + Calendar for ${callId} — Missing/invalid customerNumber`);
//         }
//       }
//     }

//     return res.status(200).json({ message: "Notifications and calendar events processed successfully" });
//   } catch (error) {
//     console.error("❌ Failed to process calls:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }



