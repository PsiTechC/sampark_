import { DateTime } from "luxon";
import CorsMiddleware from "../../../lib/cors-middleware";
import { connectToDatabase } from "../../../lib/db";

const API_KEY_VAPI = process.env.NEXT_PUBLIC_API_TOKEN_VAPI;
const PHONE_NUMBER_ID = "4519aa32-fcb2-4bf6-9200-53a6959258e1"; 

// ➕ Utility: Get current time in given timezone
function getCurrentTimeInZone(timezone) {
  try {
    return DateTime.now().setZone(timezone);
  } catch (error) {
    console.warn(`⚠️ Invalid timezone provided: ${timezone}`);
    return null;
  }
}

// ➕ Utility: Format Duration as readable string
function formatDuration(duration) {
  const parts = [];
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  if (duration.seconds) parts.push(`${Math.floor(duration.seconds)}s`);
  return parts.join(" ");
}

// ➕ Function to initiate call via Vapi
async function initiateVapiCall(assistantId, customerNumber) {
  try {
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY_VAPI}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumberId: PHONE_NUMBER_ID,
        assistantId,
        customer: {
          number: customerNumber,
          extension: "",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Call failed for ${customerNumber}:`, data);
      return false;
    }

    console.log(`✅ Call initiated for ${customerNumber}: Execution ID: ${data.id || data.execution_id}`);
    return true;
  } catch (err) {
    console.error("❌ Error initiating call:", err.message);
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
    const collection = db.collection("userdatafromcallwithsentiment");

    const cursor = await collection.find({});
    const allDocs = await cursor.toArray();

    for (const doc of allDocs) {
      const assistantId = doc.assistantId || "-";
      const dataEntries = doc.data || {};

      for (const [callId, callData] of Object.entries(dataEntries)) {
        const callTimeRaw = callData.callTime;
        const timezone = callData.timezone;
        const customerNumber = callData.customerNumber;
        const isCallInitiated = callData.isCallInitiated === true;
      
        // Skip entries without callTime or timezone or customer number
        if (!callTimeRaw || callTimeRaw === "-" || !timezone || !customerNumber) {
        //   console.log(`⏭️ Skipping call ${callId} due to missing data.`);
          continue;
        }
      
        // Skip if already initiated
        if (isCallInitiated) {
        //   console.log(`⏭️ Skipping call ${callId} — already initiated.`);
          continue;
        }
      
        const now = getCurrentTimeInZone(timezone);
        const callTime = DateTime.fromISO(callTimeRaw).setZone(timezone);
      
        if (!now.isValid || !callTime.isValid) {
          console.warn(`⚠️ Invalid datetime for call ${callId}`);
          continue;
        }
      
        if (callTime > now) {
          const diff = callTime.diff(now, ["hours", "minutes", "seconds"]);
          console.log(`⏳ Time left to call (${callId}): ${formatDuration(diff)}`);
        } else {
          const passed = now.diff(callTime, ["hours", "minutes", "seconds"]);
          console.log(`📞 Time to call passed for ${callId}: ${formatDuration(passed)} ago`);
      
          const success = await initiateVapiCall(assistantId, customerNumber);
          if (success) {
            await collection.updateOne(
              { assistantId },
              {
                $set: {
                  [`data.${callId}.isCallInitiated`]: true,
                  [`data.${callId}.callInitiatedAt`]: new Date(),
                },
              }
            );
            console.log(`✅ Marked isCallInitiated = true for call ${callId}`);
          }
        }
      
        console.log("----------------------------------------------------");
      }
      
    }

    return res.status(200).json({ message: "Call schedule check complete." });
  } catch (err) {
    console.error("❌ Error in handler:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
