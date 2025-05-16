// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";

// // 📤 Function to send WhatsApp message with brochure URL
// async function sendingWhatsapp(number, pdfUrl) {
//   console.log(`📤 Sending WA message via BhashSMS to ${number}..., url ${pdfUrl} `);

//   const url = 'https://bhashsms.com/api/sendmsg.php';

//   const params = new URLSearchParams({
//     user: 'BhashWAPAi',
//     pass: 'Bwa@123',
//     sender: 'BUZWAP',
//     phone: number,
//     text: 'test_may04',
//     priority: 'wa',
//     stype: 'normal',
//     params: 'ABC',
//     htype: 'document',
//     fname: 'Project Brochure',
//     url: pdfUrl,
//   });

//   try {
//     const response = await fetch(`${url}?${params.toString()}`, {
//       method: 'GET',
//     });

//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     const result = await response.text();
//     console.log(`✅ Message sent successfully to ${number}:`, result);
//     return { status: "success", result };
//   } catch (error) {
//     console.error('❌ Error sending message:', error);
//     return { status: "error", error };
//   }
// }

// // 🧠 Main API Handler
// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   await CorsMiddleware(req, res);

//   try {
//     const { db } = await connectToDatabase();

//     const whatsappCollection = db.collection("forwhatsappbolna");
//     const s3pdfCollection = db.collection("s3pdfstore");

//     const allDocs = await whatsappCollection.find({}).toArray();

//     for (const doc of allDocs) {
//       const { assistantId, data } = doc;

//       // 📁 Get the PDF URL for the assistantId
//       const s3doc = await s3pdfCollection.findOne({ agentId: assistantId });
//       const pdfUrl = s3doc?.url;
      
//       if (!pdfUrl) {
//         console.warn(`❌ No brochure URL found in s3pdfstore for assistantId ${assistantId}`);
//         continue;
//       }

//       for (const [callId, callData] of Object.entries(data || {})) {
//         if (callData?.isUserAskedForBrochure === true) {
//           console.log(`📣 Brochure requested in call ID: ${callId} (Assistant: ${assistantId})`);

//           try {
//             const response = await fetch(`https://api.bolna.dev/executions/${callId}`, {
//               headers: {
//                 Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//               },
//             });

//             if (!response.ok) {
//               console.warn(`⚠️ Failed to fetch execution details for call ${callId}`);
//               continue;
//             }

//             const executionDetails = await response.json();
//             const phone = executionDetails?.context_details?.recipient_phone_number || "-";
//             console.log(`📞 Recipient phone for call ID ${callId}: ${phone}`);

//             const result = await sendingWhatsapp(phone, pdfUrl);

//             if (result.status === "success") {
//               console.log(`✅ WhatsApp message sent to ${phone}. Updating database...`);
//               await whatsappCollection.updateOne(
//                 { assistantId },
//                 { $set: { [`data.${callId}.isUserAskedForBrochure`]: false } }
//               );
//             }
//           } catch (err) {
//             console.error(`❌ Failed to fetch recipient phone for call ${callId}:`, err);
//           }
//         }
//       }
//     }

//     return res.status(200).json({ message: "WhatsApp messages sent and DB updated." });
//   } catch (error) {
//     console.error("❌ Error in sendWS handler:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";

// 📤 Function to send WhatsApp message with brochure URL (updated to use custom API)
export async function sendingWhatsapp(number, pdfUrl) {
  console.log(`📤 Sending WA message via your API to ${number}..., url ${pdfUrl}`);

  const apiUrl = 'https://whatsapp-api-backend-production.up.railway.app/api/send-message';

  const requestBody = {
    toNumber: number,
    parameters: [pdfUrl],
    templateId: "ava_psitech_template",
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WHATSAPP_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    console.log(`✅ Message sent successfully to ${number}:`, result);
    return { status: "success", result };
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return { status: "error", error };
  }
}

// 🧠 Main API Handler
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await CorsMiddleware(req, res);

  try {
    const { db } = await connectToDatabase();

    const whatsappCollection = db.collection("forwhatsappbolna");
    const s3pdfCollection = db.collection("s3pdfstore");

    const allDocs = await whatsappCollection.find({}).toArray();

    for (const doc of allDocs) {
      const { assistantId, data } = doc;

      // 📁 Get the PDF URL for the assistantId
      const s3doc = await s3pdfCollection.findOne({ agentId: assistantId });
      const pdfUrl = s3doc?.url;

      if (!pdfUrl) {
        console.warn(`❌ No brochure URL found in s3pdfstore for assistantId ${assistantId}`);
        continue;
      }

      for (const [callId, callData] of Object.entries(data || {})) {
        if (callData?.isUserAskedForBrochure === true) {
          console.log(`📣 Brochure requested in call ID: ${callId} (Assistant: ${assistantId})`);

          try {
            const response = await fetch(`https://api.bolna.dev/executions/${callId}`, {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
              },
            });

            if (!response.ok) {
              console.warn(`⚠️ Failed to fetch execution details for call ${callId}`);
              continue;
            }

            const executionDetails = await response.json();
            const phone = executionDetails?.context_details?.recipient_phone_number || "-";
            console.log(`📞 Recipient phone for call ID ${callId}: ${phone}`);

            const result = await sendingWhatsapp(phone, pdfUrl);

            if (result.status === "success") {
              console.log(`✅ WhatsApp message sent to ${phone}. Updating database...`);
              await whatsappCollection.updateOne(
                { assistantId },
                { $set: { [`data.${callId}.isUserAskedForBrochure`]: false } }
              );
            }
          } catch (err) {
            console.error(`❌ Failed to fetch recipient phone for call ${callId}:`, err);
          }
        }
      }
    }

    return res.status(200).json({ message: "WhatsApp messages sent and DB updated." });
  } catch (error) {
    console.error("❌ Error in sendWS handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
