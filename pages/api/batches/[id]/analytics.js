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



// C:\sanket\psitech\sampark_\pages\api\batches\[id]\analytics.js
import { connectToDatabase } from "../../../../lib/db";



export default async function handler(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  const batch = await db.collection("batches").findOne({ batch_id: id });
  if (!batch) return res.status(404).json({ message: "Not found" });

  const summary = batch.summary;

  if (!Array.isArray(summary)) {
    return res.status(400).json({ message: "Invalid or missing summary array" });
  }

  const total = summary.length;
  if (!Array.isArray(summary)) {
  return res.status(400).json({ message: "Invalid or missing summary array" });
}

  const ended = summary.filter(c => c.status === "ended").length;
  const avgRetries = total > 0
    ? summary.reduce((sum, c) => sum + (c.retryCount || 0), 0) / total
    : 0;

  const byStatus = summary.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return res.json({
    batchId: id,
    total,
    ended,
    successRate: total > 0 ? ended / total : 0,
    avgRetries,
    byStatus
  });
}
