// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";
// import nodemailer from "nodemailer";

// const user = process.env.EMAIL_USER;
// const pass = process.env.EMAIL_PASS;

// // Email sending function
// async function sendEmailNotification(recipientEmail, appointmentDate) {
//   const transporter = nodemailer.createTransport({
//     host: 'mail.samparkai.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: user,
//       pass: pass,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   const mailOptions = {
//     from: `"Upcoming Appointment Notification" <${user}>`,
//     to: recipientEmail,
//     subject: "Your Appointment Details & Meeting Link",
//     text: `These are your appointment details and online meeting link.\n\nAppointment Date and Time: ${appointmentDate}\nMeeting Link: https://meet.samparkai.com/random-link`,
//     html: `
//       <p>These are your appointment details and online meeting link.</p>
//       <p><strong>Appointment Date and Time:</strong> ${appointmentDate}</p>
//       <p><strong>Meeting Link:</strong> <a href="https://meet.samparkai.com/random-link">https://meet.samparkai.com/random-link</a></p>
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

// export default async function handler(req, res) {
//   CorsMiddleware(req, res); // Keep as-is

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { db } = await connectToDatabase();
//     const collection = db.collection("userdatafromcallwithsentiment");

//     const allData = await collection.find({}).toArray();

//     for (const doc of allData) {
//       const assistantId = doc.assistantId;
//       const callData = doc.data || {};
//       const callIds = Object.keys(callData);

//       for (const callId of callIds) {
//         const call = callData[callId];
//         const email = (call.email || "").trim();
//         const appointmentDate = call.appointmentDate || "-";

//         // Skip if no valid email or already mailed
//         if (!email || email === "-" || call.isMailSend === true) {
//           continue;
//         }

//         console.log(`📞 Execution ID: ${callId}`);
//         console.log("📧 Data:", call);

//         // Try sending the email
//         const emailSent = await sendEmailNotification(email, appointmentDate);

//         if (emailSent) {
//           // Update isMailSend flag in the DB
//           await collection.updateOne(
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

//     return res.status(200).json({ message: "Processed calls and updated mail status" });

//   } catch (error) {
//     console.error("❌ Failed to fetch or process data:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import nodemailer from "nodemailer";

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

  const mailOptions = {
    from: `"Upcoming Appointment Notification" <${user}>`,
    to: recipientEmail,
    subject: "Your Appointment Details & Meeting Link",
    text: `These are your appointment details and online meeting link.\n\nAppointment Date and Time: ${appointmentDate}\nMeeting Link: ${meetingLink}`,
    html: `
      <p>These are your appointment details and online meeting link.</p>
      <p><strong>Appointment Date and Time:</strong> ${appointmentDate}</p>
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

export default async function handler(req, res) {
  CorsMiddleware(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const callCollection = db.collection("userdatafromcallwithsentiment");
    const meetLinksCollection = db.collection("meetlinks");

    const allData = await callCollection.find({}).toArray();

    for (const doc of allData) {
      const assistantId = doc.assistantId;
      const callData = doc.data || {};
      const callIds = Object.keys(callData);

      for (const callId of callIds) {
        const call = callData[callId];
        const email = (call.email || "").trim();
        const appointmentDate = call.appointmentDate || "-";

        // Skip if no valid email or already mailed
        if (!email || email === "-" || call.isMailSend === true || !appointmentDate || appointmentDate === "-") {
          continue;
        }

        console.log(`📞 Execution ID: ${callId}`);
        console.log("📧 Data:", call);

        // Look up meeting link from meetlinks collection
        const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
        const meetingLink = meetLinkDoc?.meetLink || "https://meet.samparkai.com/random-link"; // fallback

        // Send email
        const emailSent = await sendEmailNotification(email, appointmentDate, meetingLink);

        if (emailSent) {
          // Mark mail as sent
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

    return res.status(200).json({ message: "Processed calls and updated mail status" });

  } catch (error) {
    console.error("❌ Failed to fetch or process data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
