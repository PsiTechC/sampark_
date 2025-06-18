// C:\sanket\psitech\sampark_\pages\api\batches\[id]\call_logs_for_batches.js
import { connectToDatabase } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { db } = await connectToDatabase();

  const batch = await db.collection("batches").findOne({ batch_id: id });

  if (!batch || !Array.isArray(batch.summary)) {
    return res.status(404).json({ message: "Batch not found or invalid" });
  }

  const callIds = batch.summary.map(c => c.callId).filter(Boolean);

  const callDetails = await Promise.all(
    callIds.map(async callId => {
      try {
        const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`
          }
        });

        if (!response.ok) throw new Error(`Failed for call ${callId}`);
        const data = await response.json();

        return {
          callId,
          duration:
            data.startedAt && data.endedAt
              ? (new Date(data.endedAt) - new Date(data.startedAt)) / 1000
              : null,
          status: data.status || "unknown",
          customerName: data.customer?.name || "—",
          customerNumber: data.customer?.number || "—",
          endedReason: data.endedReason || "—",
          cost: data.cost ?? 0,
          transcript: data.transcript || null,
          recordingUrl: data.recordingUrl || null,
          summary: data.summary || null,
          timestamp: data.startedAt || data.createdAt || null
        };
      } catch (err) {
        console.error(`[VAPI FETCH ERROR] ${callId}:`, err.message);
        return { callId, error: true };
      }
    })
  );

  res.status(200).json(callDetails);
}
