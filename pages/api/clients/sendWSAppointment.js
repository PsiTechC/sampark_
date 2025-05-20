import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";

export async function sendingWhatsapp(number, appointmentDate, meetingLink) {
    console.log(`📤 Sending WA message via your API to ${number}...`);
  
    const apiUrl = 'https://whatsapp-api-backend-production.up.railway.app/api/send-message';
  
    const requestBody = {
      toNumber: '9131296862',
      templateId: "appointment_test2",
      parameters: [appointmentDate, meetingLink] 
    };
  
    try {
      console.log("📦 Payload:", JSON.stringify(requestBody, null, 2));
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key' : process.env.WHATSAPP_API_KEY,
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Raw response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log(`✅ Message sent successfully to ${number}:`, result);
      return { status: "success", result };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return { status: "error", error };
    }
  }
  
  
  
  
  

// 🧠 Main Handler
export default async function handler(req, res) {
  await CorsMiddleware(req, res);

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
        let customerNumber = (call.customerNumber || "").trim();
        const appointmentDate = call.appointmentDate || "-";

        // Validate customer number
        if (!customerNumber || customerNumber === "-" || customerNumber.length < 10) {
          console.warn(`⏭️ Skipping call ${callId} — invalid or missing customerNumber`);
          continue;
        }

        // Add +91 if not already present
        if (!customerNumber.startsWith("+")) {
          customerNumber = `+91${customerNumber}`;
        }

        // Skip if already sent or no appointment
        if (call.isWASent === true || appointmentDate === "-") {
          continue;
        }

        console.log(`📞 Execution ID: ${callId}`);
        console.log("📲 Preparing WhatsApp send for:", customerNumber);

        const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
        const meetingLink = meetLinkDoc?.meetLink || "-";

        const result = await sendingWhatsapp(customerNumber, appointmentDate, meetingLink);

        if (result.status === "success") {
          await callCollection.updateOne(
            { assistantId },
            { $set: { [`data.${callId}.isWASent`]: true } }
          );
          console.log(`📝 Marked isWASent: true for call ${callId}`);
        }
      }
    }

    return res.status(200).json({ message: "Processed calls and sent WhatsApp notifications" });

  } catch (error) {
    console.error("❌ Error processing WhatsApp sends:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
