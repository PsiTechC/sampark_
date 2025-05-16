import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";

// WhatsApp sender function
async function sendingWhatsapp(number, appointmentDate) {
  console.log(`📤 Sending WA message to ${number} with appointment on ${appointmentDate}`);

  const apiUrl = 'https://whatsapp-api-backend-production.up.railway.app/api/send-message';

  const requestBody = {
    toNumber: number,
    parameters: [
      `These are your appointment details and online meeting link.\n\nAppointment Date and Time: ${appointmentDate}\nMeeting Link: https://meet.samparkai.com/random-link`
    ],
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
    console.error('❌ Error sending WhatsApp message:', error.message);
    return { status: "error", error };
  }
}

export default async function handler(req, res) {
  CorsMiddleware(req, res); // Keep as-is

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("userdatafromcallwithsentiment");

    const allData = await collection.find({}).toArray();

    for (const doc of allData) {
      const assistantId = doc.assistantId;
      const callData = doc.data || {};
      const callIds = Object.keys(callData);

      for (const callId of callIds) {
        const call = callData[callId];
        const appointmentDate = (call.appointmentDate || "").trim();
        const phoneNumber = (call.customerNumber || "").trim();

        // Skip if already sent or missing required data
        if (call.iswsSend === true) {
          console.log(`⏭️ Skipping ${callId}: WhatsApp already sent.`);
          continue;
        }

        if (!appointmentDate || appointmentDate === "-") {
          console.warn(`⚠️ Skipping ${callId}: Missing appointment date`);
          continue;
        }

        if (!phoneNumber || phoneNumber === "-") {
          console.warn(`⚠️ Skipping ${callId}: Missing customer number`);
          continue;
        }

        console.log(`📞 Execution ID: ${callId}`);
        console.log("📲 Customer Number:", phoneNumber);
        console.log("📅 Appointment Date:", appointmentDate);

        const result = await sendingWhatsapp(phoneNumber, appointmentDate);

        if (result.status === "success") {
          await collection.updateOne(
            { assistantId },
            {
              $set: {
                [`data.${callId}.iswsSend`]: true,
              },
            }
          );
          console.log(`📝 Marked iswsSend: true for call ${callId}`);
        }
      }
    }

    return res.status(200).json({ message: "WhatsApp messages sent successfully where applicable." });

  } catch (error) {
    console.error("❌ Failed to fetch or process WhatsApp sends:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
