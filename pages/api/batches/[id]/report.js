// // pages/api/batches/[id]/report.js
// import { connectToDatabase } from "../../../../lib/db";
// import { parse } from "json2csv";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { id: batchId, format } = req.query;
//   const { db } = await connectToDatabase();

//   // Fetch the full batch document
//   const batch = await db.collection("batches").findOne({ batch_id: batchId });
//   if (!batch) {
//     return res.status(404).json({ message: "Batch not found" });
//   }

//   // Build detailed summary entries
//   const detailedSummary = batch.summary.map(entry => {
//     const [firstName, ...rest] = (entry.name || "").split(" ");
//     const lastName = rest.join(" ");
//     return {
//       row: entry.row,
//       firstName,
//       lastName,
//       callId: entry.callId,
//       customerNumber: entry.customerNumber,
//       timezone: entry.timezone,
//       status: entry.status,
//       endedReason: entry.endedReason || "",
//       retryCount: entry.retryCount || 0,
//       monitorListenUrl: entry.monitor?.listenUrl || "",
//       monitorControlUrl: entry.monitor?.controlUrl || "",
//       callSid: entry.transport?.callSid || "",
//       recordingUrl: entry.recordingUrl || ""
//     };
//   });

//   // If client requests CSV via ?format=csv, stream CSV
//   if (format === 'csv') {
//     const fields = [
//       'row','firstName','lastName','callId','customerNumber','timezone','status',
//       'endedReason','retryCount','monitorListenUrl','monitorControlUrl','callSid','recordingUrl'
//     ];
//     const csv = parse(detailedSummary, { fields });
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', `attachment; filename="batch_${batchId}_report.csv"`);
//     return res.send(csv);
//   }

//   // Otherwise, return full JSON report
//   return res.status(200).json({
//     batch_id: batch.batch_id,
//     file_name: batch.file_name,
//     created_at: batch.created_at,
//     status: batch.status,
//     counts: batch.counts,
//     summary: detailedSummary
//   });
// }





// pages/api/batches/[id]/report.js
import axios from "axios";
import { connectToDatabase } from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id: batchId } = req.query;
  const { db } = await connectToDatabase();

  // 1) pull the raw batch doc
  const batch = await db
    .collection("batches")
    .findOne(
      { batch_id: batchId },
      { projection: { summary: 1, counts: 1, status: 1 } }
    );

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  // 2) enrich each summary row
  const enriched = await Promise.all(
    batch.summary.map(async (entry) => {
      // split name → firstName / lastName
      const [firstName, ...rest] = (entry.name || "").split(" ");
      const lastName = rest.join(" ");

      // placeholder for any VAPI-side details
      let duration = null;
      let transcript = null;
      let monitorListenUrl = null;
      let monitorControlUrl = null;
      let callSid = null;
      let recordingUrl = null;

      if (entry.callId) {
        try {
          const { data } = await axios.get(
            `https://api.vapi.ai/call/${entry.callId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
              },
            }
          );
          duration = data.duration ?? null;
          transcript = data.transcript ?? null;
          monitorListenUrl = data.monitor?.listenUrl ?? null;
          monitorControlUrl = data.monitor?.controlUrl ?? null;
          callSid = data.transport?.callSid ?? null;
          recordingUrl = data.recordingUrl ?? null;
        } catch (err) {
          console.error(
            `Error fetching VAPI call ${entry.callId}:`,
            err.message
          );
        }
      }

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

        // VAPI-fetched fields
        duration,
        transcript,
        monitorListenUrl,
        monitorControlUrl,
        callSid,
        recordingUrl,
      };
    })
  );

  // 3) return everything the front end needs
  res.status(200).json({
    batch_id: batchId,
    status: batch.status,
    counts: batch.counts || {},
    summary: enriched,
  });
}
