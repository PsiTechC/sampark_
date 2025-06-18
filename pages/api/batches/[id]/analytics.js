// // pages/api/batches/[id]/analytics.js
// import { connectToDatabase } from "../../../../lib/db";

// export default async function handler(req, res) {
//   const { id } = req.query;
//   const { db } = await connectToDatabase();

//   const batch = await db.collection("batches").findOne({ batch_id: id });
//   if (!batch) return res.status(404).json({ message: "Not found" });

//   const summary = batch.summary;
//   const total   = summary.length;
//   const ended   = summary.filter(c=>c.status==="ended").length;
//   const avgRetries = summary.reduce((sum,c)=> sum + (c.retryCount||0), 0) / total;

//   // maybe also distribution by status
//   const byStatus = summary.reduce((acc,c)=> {
//     acc[c.status] = (acc[c.status]||0)+1; return acc;
//   }, {});

//   return res.json({ batchId: id, total, ended, successRate: ended/total, avgRetries, byStatus });
// }



// // C:\sanket\psitech\sampark_\pages\api\batches\[id]\analytics.js
// import { connectToDatabase } from "../../../../lib/db";



// export default async function handler(req, res) {
//   const { id } = req.query;
//   const { db } = await connectToDatabase();

//   const batch = await db.collection("batches").findOne({ batch_id: id });
//   if (!batch) return res.status(404).json({ message: "Not found" });

//   const summary = batch.summary;

//   if (!Array.isArray(summary)) {
//     return res.status(400).json({ message: "Invalid or missing summary array" });
//   }

//   const total = summary.length;
//   if (!Array.isArray(summary)) {
//   return res.status(400).json({ message: "Invalid or missing summary array" });
// }

//   const ended = summary.filter(c => c.status === "ended").length;
//   const avgRetries = total > 0
//     ? summary.reduce((sum, c) => sum + (c.retryCount || 0), 0) / total
//     : 0;

//   const byStatus = summary.reduce((acc, c) => {
//     acc[c.status] = (acc[c.status] || 0) + 1;
//     return acc;
//   }, {});

//   return res.json({
//     batchId: id,
//     total,
//     ended,
//     successRate: total > 0 ? ended / total : 0,
//     avgRetries,
//     byStatus
//   });
// }





// import { connectToDatabase } from "../../../../lib/db";

// export default async function handler(req, res) {
//   const { id } = req.query;
//   const { db } = await connectToDatabase();

//   const batch = await db.collection("batches").findOne({ batch_id: id });
//   if (!batch) return res.status(404).json({ message: "Not found" });

//   const summary = batch.summary;

//   if (!Array.isArray(summary)) {
//     return res.status(400).json({ message: "Invalid or missing summary array" });
//   }

//   const total = summary.length;
//   const ended = summary.filter(c => c.status === "ended").length;
//   const avgRetries = total > 0
//     ? summary.reduce((sum, c) => sum + (c.retryCount || 0), 0) / total
//     : 0;

//   const byStatus = summary.reduce((acc, c) => {
//     acc[c.status] = (acc[c.status] || 0) + 1;
//     return acc;
//   }, {});

//   const byErrorReason = summary.reduce((acc, c) => {
//     if (c.status !== "ended") {
//       const reason = c.endedReason || "unknown";
//       acc[reason] = (acc[reason] || 0) + 1;
//     }
//     return acc;
//   }, {});

//   const byRetryCount = summary.reduce((acc, c) => {
//     const r = c.retryCount || 0;
//     acc[r] = (acc[r] || 0) + 1;
//     return acc;
//   }, {});

//   // NEW: detailed call records
//   const calls = summary.map(c => ({
//     callId: c.callId || "—",
//     duration: typeof c.duration === "number" ? c.duration : null,
//     cost: typeof c.cost === "number" ? c.cost : 0,
//     status: c.status,
//     endedReason: c.endedReason || "—",
//     retryCount: c.retryCount || 0,
//     recordingUrl: c.recordingUrl || null,
//     transcript: c.transcript || null,
//     summary: c.summary || null,
//     timestamp: c.timestamp || c.createdAt || null,
//     customerName: c.customer?.name || null,
//     customerNumber: c.customer?.number || null
//   }));

//   return res.json({
//     batchId: id,
//     total,
//     ended,
//     successRate: total > 0 ? ended / total : 0,
//     avgRetries,
//     byStatus,
//     byErrorReason,
//     byRetryCount,
//     calls // 👈 NEW: full call data array
//   });
// }


// C:\sanket\psitech\sampark_\pages\api\batches\[id]\analytics.js
import { connectToDatabase } from "../../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  const { db } = await connectToDatabase();
  const batch = await db.collection("batches").findOne({ batch_id: id });

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  const summary = batch.summary;

  if (!Array.isArray(summary)) {
    return res.status(400).json({ message: "Invalid or missing summary array" });
  }

  // Extract unique call IDs
  const callIds = summary.map(c => c.callId).filter(Boolean);

  // Fetch detailed call data from Vapi
  const calls = await Promise.all(
    callIds.map(async (callId, i) => {
      try {
        const vapiRes = await fetch(`https://api.vapi.ai/call/${callId}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`
          }
        });

        if (!vapiRes.ok) {
          console.error(`[VAPI ERROR] Call ${callId} failed with status ${vapiRes.status}`);
          return {
            callId,
            status: 'unknown',
            cost: 0,
            customerNumber: '—',
            duration: null,
            endedReason: 'fetch-failed'
          };
        }

        const call = await vapiRes.json();

        const duration = call.startedAt && call.endedAt
          ? (new Date(call.endedAt) - new Date(call.startedAt)) / 1000
          : null;

        const cost = typeof call.cost === 'number' ? call.cost : 0;

    return {
  callId: call.id,
  status: call.status || 'unknown',
  cost: typeof call.cost === 'number' ? call.cost : 0,
  duration,
  customerNumber: call.customer?.number || '—',
  customerName: call.customer?.name || null,
  endedReason: call.endedReason || '—',
  recordingUrl: call.recordingUrl || null,
  transcript: call.transcript || null,
  summary: call.summary || null,
  timestamp: call.startedAt || call.createdAt || null
};

      } catch (err) {
        console.error(`[VAPI FETCH ERROR] Call ${callId}:`, err);
        return {
          callId,
          status: 'error',
          cost: 0,
          customerNumber: '—',
          duration: null,
          endedReason: 'exception'
        };
      }
    })
  );

  const total = calls.length;
  const ended = calls.filter(c => c.status === "ended").length;
  const avgRetries = summary.reduce((acc, c) => acc + (c.retryCount || 0), 0) / total;

  const byStatus = calls.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const byErrorReason = calls.reduce((acc, c) => {
    if (c.status !== 'ended') {
      const reason = c.endedReason || 'unknown';
      acc[reason] = (acc[reason] || 0) + 1;
    }
    return acc;
  }, {});

  const byRetryCount = summary.reduce((acc, c) => {
    const retry = c.retryCount || 0;
    acc[retry] = (acc[retry] || 0) + 1;
    return acc;
  }, {});

  return res.status(200).json({
    batchId: id,
    total,
    ended,
    successRate: total > 0 ? ended / total : 0,
    avgRetries,
    byStatus,
    byErrorReason,
    byRetryCount,
    calls
  });
}
