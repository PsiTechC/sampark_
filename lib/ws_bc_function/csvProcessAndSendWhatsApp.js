import fs from "fs";
import csv from "csv-parser";
import fetch from "node-fetch";
import { connectToDatabase } from "../db"; 

const WHATSAPP_API_URL = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";

export async function csvProcessAndSendWhatsApp(filePath, companyName, assistantId, maxRetries = 20) {
  console.log("📤 Processing CSV for WhatsApp Broadcast:");
  console.log("• File path:", filePath);
  console.log("• Company name:", companyName);

  const { db } = await connectToDatabase();

  const mappingCollection = db.collection("client_user_assistant_and_wsmap");
  const docs = await mappingCollection.find({}).toArray();
  console.log("📄 Existing WS map docs:", docs.map(d => ({ assistantId: d.assistantId, idCount: d.id?.length || 0 })));

  const sendWithRetry = async (number) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(WHATSAPP_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.WHATSAPP_API_KEY,
            Authorization: `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
          },
          body: JSON.stringify({
            to_number: number,
            template_name: "user_call_confirm_v1",
            whatsapp_request_type: "TEMPLATE",
            parameters: [companyName],
          }),
        });

        const result = await response.json();
        const mssgId = result?.metaResponse?.messages?.[0]?.id;
        console.log(`🆔 Message ID for ${number} (attempt ${attempt}):`, mssgId);
        
        if (!response.ok) {
          console.error(`❌ Attempt ${attempt} failed for ${number}:`, result.message || result);

          if (
            attempt < maxRetries &&
            typeof result.message === "string" &&
            result.message.includes("Application failed to respond")
          ) {
            const waitTime = 1000 * 2 ** (attempt - 1);
            console.warn(`⏳ Retrying ${number} in ${waitTime / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }

          return false;
        }

        const msgId = result?.metaResponse?.messages?.[0]?.id;

        if (typeof msgId === 'string' && typeof assistantId === 'string' && assistantId.trim()) {
          const cleanAssistantId = assistantId.trim();
          console.log(`🔍 Looking for doc with assistantId = "${cleanAssistantId}"`);
        
          let existingDoc = await mappingCollection.findOne({ assistantId: cleanAssistantId });
        
          if (!existingDoc) {
            await mappingCollection.insertOne({
              assistantId: cleanAssistantId,
              id: [msgId],
            });
            console.log(`🆕 Inserted new doc for assistantId "${cleanAssistantId}"`);
          } else {
            const updateResult = await mappingCollection.updateOne(
              { assistantId: cleanAssistantId },
              {
                $set: { assistantId: cleanAssistantId },
                $push: { id: msgId },
              }
            );
          }
        
          console.log("📄 Updated doc state:");
        }
        
        
        



        console.log(`✅ WhatsApp message sent to ${number}`);
        return true;
      } catch (err) {
        console.error(`❌ Attempt ${attempt} failed for ${number}:`, err.message);

        if (attempt < maxRetries) {
          const waitTime = 1000 * 2 ** (attempt - 1);
          console.warn(`⏳ Retrying ${number} in ${waitTime / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          return false;
        }
      }
    }

    return false;
  };

  return new Promise((resolve, reject) => {
    const numbers = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const rawNumber = row["Contact Number"];
        if (typeof rawNumber === "string") {
          const cleanNumber = rawNumber.replace(/\s+/g, "");
          if (cleanNumber && /^\d{10,}$/.test(cleanNumber.slice(-10))) {
            numbers.push(`+${cleanNumber}`);
          }
        }
      })
      .on("end", async () => {
        console.log(`📦 Sending messages to ${numbers.length} users...`);

        for (const number of numbers) {
          await sendWithRetry(number);
        }

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`⚠️ Failed to delete file ${filePath}:`, err.message);
          } else {
            console.log(`🗑️ CSV file deleted: ${filePath}`);
          }
        });

        resolve();
      })
      .on("error", (err) => {
        console.error("❌ Error reading CSV:", err.message);
        reject(err);
      });
  });
}
