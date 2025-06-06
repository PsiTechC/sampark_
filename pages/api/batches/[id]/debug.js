// pages/api/batches/[id]/debug.js
import { connectToDatabase } from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { db } = await connectToDatabase();
  const batchId = req.query.id;

  const batch = await db.collection("batches").findOne({ batch_id: batchId });
  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  const statusMap = {};
  const reasonMap = {};

  for (const row of batch.summary || []) {
    const s = row.status || "missing";
    const r = row.endedReason || "none";

    statusMap[s] = (statusMap[s] || 0) + 1;
    reasonMap[r] = (reasonMap[r] || 0) + 1;
  }

  return res.json({
    totalRows: batch.summary?.length || 0,
    statusCounts: statusMap,
    endedReasonCounts: reasonMap,
    unknownReasonRows: batch.summary?.filter(
      r => r.status !== "ended" && (!r.endedReason || r.endedReason === "")
    )
  });
}
