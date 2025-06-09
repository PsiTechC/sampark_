import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";


export async function sendingWhatsapp(number, pdfUrl, companyName, companyPhone) {
  console.log(`📤 Sending WA message with document to ${number}... URL: ${pdfUrl}`);

  const apiUrl = 'https://whatsapp-api-backend-production.up.railway.app/api/send-message';

  const requestBody = {
    to_number: number,
    media_url: pdfUrl,
    media_name: "Project Brochure",
    parameters: [companyName, companyPhone],
    messages: null,
    template_name: "pdf_req_v1",
    whatsapp_request_type: "TEMPLATE_WITH_DOCUMENT",
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WHATSAPP_API_KEY,
        'Authorization': `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    console.log(`✅ Document message sent successfully to ${number}:`, result);
    return { status: "success", result };
  } catch (error) {
    console.error('❌ Error sending document message:', error);
    return { status: "error", error };
  }
}



export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await CorsMiddleware(req, res);

  try {
    const { db } = await connectToDatabase();

    const whatsappCollection = db.collection("forwhatsapp");
    const s3pdfCollection = db.collection("s3pdfstore");

    // Fetch assistants
    const assistantsRes = await fetch("https://api.vapi.ai/assistant", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
      },
    });

    if (!assistantsRes.ok) {
      console.error("❌ Failed to fetch assistants");
      return res.status(500).json({ message: "Failed to fetch assistants" });
    }

    const assistants = await assistantsRes.json();

    for (const assistant of assistants) {
      const assistantId = assistant.id;

      const whatsappDoc = await whatsappCollection.findOne({ assistantId });
      if (!whatsappDoc || !whatsappDoc.data) continue;
      const pdfDocs = await s3pdfCollection.find({ agentId: assistantId }).toArray();

      if (!pdfDocs.length) {
        console.warn(`❌ No brochure PDFs for assistantId ${assistantId}`);
        continue;
      }
      

      // Fetch all calls for this assistant
      const callsRes = await fetch(`https://api.vapi.ai/call?assistantId=${assistantId}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
        },
      });

      if (!callsRes.ok) {
        console.warn(`⚠️ Failed to fetch calls for assistant ${assistantId}`);
        continue;
      }

      const calls = await callsRes.json();

      for (const call of calls) {
        const callId = call.id;

        if (call.status !== "ended") continue;

        const callData = whatsappDoc.data[callId];
        if (!callData?.isUserAskedForBrochure) continue;

        const phone = call?.customer?.number || "-";

        if (!phone || phone === "-") {
          console.warn(`❌ Missing phone for call ${callId}`);
          continue;
        }

        console.log(`📣 Sending brochure for call ${callId} to ${phone}`);

        // Step 1: Get userId from useragentmapping
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

        let allSent = true;

        for (const pdf of pdfDocs) {
          const result = await sendingWhatsapp(phone, pdf.url, companyName, companyPhone);
          if (result.status === "error") {
            allSent = false;
            console.warn(`❌ Failed to send ${pdf.name} to ${phone}:`, result.error);
          }
        }
        
        // ✅ After attempting all PDFs
        console.log(`📤 Finished brochure attempts for call ${callId}`);
        await whatsappCollection.updateOne(
          { assistantId },
          { $set: { [`data.${callId}.isUserAskedForBrochure`]: false } }
        );
        
      }
    }

    return res.status(200).json({ message: "Brochures sent via WhatsApp (Vapi style)" });
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
