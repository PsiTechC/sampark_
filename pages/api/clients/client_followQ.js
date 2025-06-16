// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";
// import nodemailer from "nodemailer";

// const user = process.env.EMAIL_USER;
// const pass = process.env.EMAIL_PASS;

// async function sendFollowUpEmail(recipientEmail, questionsArray) {
//   const transporter = nodemailer.createTransport({
//     host: 'mail.samparkai.com',
//     port: 587,
//     secure: false,
//     auth: { user, pass },
//     tls: { rejectUnauthorized: false },
//   });

//   const questionList = questionsArray.map((q, i) => `<li>${q}</li>`).join("");
//   const htmlContent = `
//     <p>These are the follow-up questions the user asked during the call:</p>
//     <ul>${questionList}</ul>
//   `;

//   const mailOptions = {
//     from: `"Follow-up Questions" ${user}`,
//     to: recipientEmail,
//     subject: "User Follow-up Questions from Your Assistant Call",
//     text: `These are the follow-up questions the user asked during the call:\n\n${questionsArray.join("\n")}`,
//     html: htmlContent,
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
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   await CorsMiddleware(req, res);

//   try {
//     const { db } = await connectToDatabase();

//     const unansweredCollection = db.collection("user_unanswered_ques");
//     const userAgentMapCollection = db.collection("useragentmapping");
//     const usersCollection = db.collection("users");

//     const allDocs = await unansweredCollection.find({}).toArray();

//     for (const doc of allDocs) {
//       const assistantId = doc.assistantId;
//       const data = doc.data;

//       if (!assistantId || !data || typeof data !== "object") {
//         console.warn(`⚠️ Skipping invalid doc structure: ${doc._id}`);
//         continue;
//       }

//       const internalIds = Object.keys(data);

//       for (const internalId of internalIds) {
//         const entry = data[internalId];
//         if (entry.isFollowUpMailSend === true) {
//           console.log(`⏭️ Skipping ${internalId} — follow-up already sent.`);
//           continue;
//         }

//         const mapping = await userAgentMapCollection.findOne({ assistants: assistantId });
//         if (!mapping?.userId) {
//           console.warn(`❌ No mapping found for assistantId: ${assistantId}`);
//           continue;
//         }

//         const userDoc = await usersCollection.findOne({ _id: mapping.userId });
//         if (!userDoc?.email) {
//           console.warn(`❌ No user found for userId: ${mapping.userId}`);
//           continue;
//         }

//         const recipientEmail = userDoc.email;
//         const questions = Array.isArray(entry.questions) ? entry.questions : [];

//         if (questions.length === 0) {
//           console.warn(`⚠️ No questions found for internalId ${internalId}, skipping email.`);
//           continue;
//         }

//         const emailSent = await sendFollowUpEmail(recipientEmail, questions);
//         if (emailSent) {
//           await unansweredCollection.updateOne(
//             { _id: doc._id },
//             { $set: { [`data.${internalId}.isFollowUpMailSend`]: true } }
//           );
//           console.log(`✅ Marked isFollowUpMailSend: true for internalId ${internalId}`);
//         }
//       }
//     }

//     return res.status(200).json({ message: "Follow-up emails processed successfully" });
//   } catch (error) {
//     console.error("❌ Server error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import nodemailer from "nodemailer";

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

async function sendFollowUpEmail(recipientEmail, questionsArray, customerNumber, summary) {
  const transporter = nodemailer.createTransport({
    host: 'mail.samparkai.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const questionList = questionsArray.map((q, i) => `<li>${q}</li>`).join("");

  const htmlContent = `
    <p>Dear Team,</p>

    <p>Following up on a recent interaction, here are the questions raised by the user during the call:</p>
    <ul>${questionList}</ul>

    <p><strong>Customer Number:</strong> ${customerNumber || "N/A"}</p>
    <p><strong>Call Summary:</strong> ${summary || "N/A"}</p>

    <p>Please ensure appropriate follow-up or action is taken.</p>

  `;

  const mailOptions = {
    from: `"Follow-up Questions" ${user}`,
    to: recipientEmail,
    subject: "Follow-up Questions from Assistant Call",
    text: `Follow-up Questions:\n\n${questionsArray.join("\n")}\n\nCustomer Number: ${customerNumber}\nSummary: ${summary}`,
    html: htmlContent,
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
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await CorsMiddleware(req, res);

  try {
    const { db } = await connectToDatabase();

    const unansweredCollection = db.collection("user_unanswered_ques");
    const userAgentMapCollection = db.collection("useragentmapping");
    const usersCollection = db.collection("users");
    const callDataCollection = db.collection("userdatafromcallwithsentiment");

    const allDocs = await unansweredCollection.find({}).toArray();

    for (const doc of allDocs) {
      const assistantId = doc.assistantId;
      const data = doc.data;

      if (!assistantId || !data || typeof data !== "object") {
        console.warn(`⚠️ Skipping invalid doc structure: ${doc._id}`);
        continue;
      }

      const internalIds = Object.keys(data);

      for (const internalId of internalIds) {
        const entry = data[internalId];
        if (entry.isFollowUpMailSend === true) {
          // console.log(`⏭️ Skipping ${internalId} — follow-up already sent.`);
          continue;
        }

        const mapping = await userAgentMapCollection.findOne({ assistants: assistantId });
        if (!mapping?.userId) {
          console.warn(`❌ No mapping found for assistantId: ${assistantId}`);
          continue;
        }

        const userDoc = await usersCollection.findOne({ _id: mapping.userId });
        if (!userDoc?.email) {
          console.warn(`❌ No user found for userId: ${mapping.userId}`);
          continue;
        }

        const recipientEmail = userDoc.email;
        const questions = Array.isArray(entry.questions) ? entry.questions : [];

        if (questions.length === 0) {
          console.warn(`⚠️ No questions found for internalId ${internalId}, skipping email.`);
          continue;
        }

        // Get customer details from userdatafromcallwithsentiment
        const callDoc = await callDataCollection.findOne({ assistantId });
        const callEntry = callDoc?.data?.[internalId];

        const customerNumber = callEntry?.customerNumber || "-";
        const summary = callEntry?.summary || "-";

        const emailSent = await sendFollowUpEmail(
          recipientEmail,
          questions,
          customerNumber,
          summary
        );

        if (emailSent) {
          await unansweredCollection.updateOne(
            { _id: doc._id },
            { $set: { [`data.${internalId}.isFollowUpMailSend`]: true } }
          );
          console.log(`✅ Marked isFollowUpMailSend: true for internalId ${internalId}`);
        }
      }
    }

    return res.status(200).json({ message: "Follow-up emails processed successfully" });
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
