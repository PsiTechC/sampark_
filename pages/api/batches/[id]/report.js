// pages/api/batches/[id]/report.js
import axios from "axios";
import { connectToDatabase } from "../../../../lib/db";

// 🕓 Utility to convert UTC string to formatted IST string
function formatToIST(dateStr) {
  if (!dateStr) return "-";
  const ist = new Date(dateStr).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return ist;
}

export default async function handler(req, res) {
  // Allow only GET requests
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id: batchId } = req.query;
  const { db } = await connectToDatabase();

  // ✅ Step 1: Fetch batch document
  const batch = await db
    .collection("batches")
    .findOne(
      { batch_id: batchId },
      { projection: { summary: 1, counts: 1, status: 1 } }
    );

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  // ✅ Step 2: Enrich each summary row
  const enriched = await Promise.all(
    batch.summary.map(async (entry) => {
      const [firstName, ...rest] = (entry.name || "").split(" ");
      const lastName = rest.join(" ");

      let duration = null;
      let transcript = null;
      let monitorListenUrl = null;
      let monitorControlUrl = null;
      let callSid = null;
      let recordingUrl = null;
      let summary = "-";
      let name = "-";
      let email = "-";

      let appointmentDate = "-";
      let purpose = "-";
      let budget = "-";
      let timeline = "-";
      let sentiment = "no_response";

      if (entry.callId) {
        // 🔁 Step 2.1: Fetch metadata from VAPI
        try {
          const { data } = await axios.get(
            `https://api.vapi.ai/call/${entry.callId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
              },
            }
          );

          // 🕓 Duration logic
          duration = data.duration ?? null;
          summary = data.summary || "-";

          // ⏱️ If duration not provided, calculate from timestamps
          if (!duration && data.startedAt && data.endedAt) {
            duration = Math.floor(
              (new Date(data.endedAt) - new Date(data.startedAt)) / 1000
            );
          }

          // ❌ If customer didn't answer, set duration to 0
          if (data.endedReason === "customer-did-not-answer") {
            duration = 0;
          }

          // Other metadata
          transcript = data.transcript ?? null;
          monitorListenUrl = data.monitor?.listenUrl ?? null;
          monitorControlUrl = data.monitor?.controlUrl ?? null;
          callSid = data.transport?.callSid ?? null;
          recordingUrl = data.recordingUrl ?? null;
        } catch (err) {
          console.error(`Error fetching VAPI call ${entry.callId}:`, err.message);
        }

        // 🧠 Step 2.2: Fetch extracted info from sentiment DB
        try {
          const customerDoc = await db
            .collection("userdatafromcallwithsentiment")
            .findOne({ [`data.${entry.callId}`]: { $exists: true } });

          const data = customerDoc?.data?.[entry.callId];

          if (data) {
            // 📅 Format appointment date to IST if present
            appointmentDate =
              data.appointmentDate &&
              !["", "null", "undefined"].includes(data.appointmentDate)
                ? formatToIST(data.appointmentDate)
                : "-";

            // 🧾 Other transcript-extracted values
            purpose = data.purpose || "-";
            budget = data.budget || "-";
            timeline = data.timeline || "-";
            sentiment = data.sentiment || "no_response";
            name = data.name || "-";
            email = data.email || "-";
          }
        } catch (err) {
          console.error(
            `Error fetching transcript-extracted data for ${entry.callId}:`,
            err.message
          );
        }
      }

      // 📦 Final enriched row
      return {
        row: entry.row,
        firstName,
        lastName,
        callId: entry.callId,
        customerNumber: entry.customerNumber,
        timezone: entry.timezone,
        status: entry.status,
        endedReason: entry.endedReason || null,
        retryCount: entry.retryCount || 0,

        duration,          // ✅ duration in seconds
        summary,           // ✅ extracted or "-" if not available
        appointmentDate,   // ✅ formatted to IST or "-"
        purpose,
        sentiment,
        name,
        email,
      };
    })
  );

  // ✅ Step 3: Return enriched batch report
  res.status(200).json({
    batch_id: batchId,
    status: batch.status,
    counts: batch.counts || {},
    summary: enriched,
  });
}