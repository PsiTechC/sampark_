// // C:\sanket\psitech\sampark_\pages\api\analyticsBatches.js
// import { connectToDatabase } from "../../lib/db";
// import { authenticateToken } from '../../lib/auth';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {

//   const user = authenticateToken(req);
// if (!user) return res.status(401).json({ message: "Unauthorized" });

//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { db } = await connectToDatabase();

//   // ❶ pull only what we need
//   const cursor = db.collection("batches").find(
//      { user_id: new ObjectId(user.clientId) },
//     { projection: { summary: 1 } }
//   );

//   // accumulators
//   let totalBatches   = 0;
//   let totalCalls     = 0;
//   let endedCalls     = 0;
//   let retrySum       = 0;
//   const byStatus       = {};
// const byErrorReason  = {}; // e.g. { ended:123, failed:7, queued:4 }

// //   await cursor.forEach(({ summary }) => {
// //     totalBatches += 1;
// //     totalCalls   += summary.length;

// // for (const row of summary) {
// //   const { status, retryCount = 0, endedReason = "" } = row;

// //   if (status === "ended") {
// //     endedCalls += 1;
// //   } else {
// //     const key = endedReason || "unknown";
// //     byErrorReason[key] = (byErrorReason[key] || 0) + 1;
// //   }

// //   retrySum += retryCount;
// //   byStatus[status] = (byStatus[status] || 0) + 1;// success counters


// //       // global retry average
// //       retrySum += retryCount;

// //       // histogram
// //       byStatus[status] = (byStatus[status] || 0) + 1;
// //     }
// //   });



// await cursor.forEach(({ summary }) => {
//   totalBatches += 1;

//   if (Array.isArray(summary)) {
//     totalCalls += summary.length;

//     for (const row of summary) {
//       const { status, retryCount = 0, endedReason = "" } = row;

//       if (status === "ended") {
//         endedCalls += 1;
//       } else {
//         const key = endedReason || "unknown";
//         byErrorReason[key] = (byErrorReason[key] || 0) + 1;
//       }

//       retrySum += retryCount;
//       byStatus[status] = (byStatus[status] || 0) + 1;
//     }
//   } else {
//     // Optional: log or count malformed summaries
//     console.warn("Missing or invalid summary in document");
//   }
// });




//   const successRate   = totalCalls ? endedCalls / totalCalls : 0;
//   const avgRetries    = totalCalls ? retrySum   / totalCalls : 0;

//   return res.json({
//     totalBatches,
//     totalCalls,
//     successRate,
//     avgRetries,
//     byStatus,
//     byErrorReason            // 👈 expose in payload
//   });
// }
// C:\sanket\psitech\sampark_\pages\api\analyticsBatches.js
import { connectToDatabase } from "../../lib/db";
import { authenticateToken } from '../../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {

  const user = authenticateToken(req);
if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { db } = await connectToDatabase();

  // ❶ pull only what we need
  const cursor = db.collection("batches").find(
     { user_id: new ObjectId(user.clientId) },
    { projection: { summary: 1 } }
  );

  // accumulators
  let totalBatches   = 0;
  let totalCalls     = 0;
  let endedCalls     = 0;
  let retrySum       = 0;
  const byStatus       = {};
const byErrorReason  = {}; // e.g. { ended:123, failed:7, queued:4 }

//   await cursor.forEach(({ summary }) => {
//     totalBatches += 1;
//     totalCalls   += summary.length;

// for (const row of summary) {
//   const { status, retryCount = 0, endedReason = "" } = row;

//   if (status === "ended") {
//     endedCalls += 1;
//   } else {
//     const key = endedReason || "unknown";
//     byErrorReason[key] = (byErrorReason[key] || 0) + 1;
//   }

//   retrySum += retryCount;
//   byStatus[status] = (byStatus[status] || 0) + 1;// success counters


//       // global retry average
//       retrySum += retryCount;

//       // histogram
//       byStatus[status] = (byStatus[status] || 0) + 1;
//     }
//   });



await cursor.forEach(({ summary }) => {
  totalBatches += 1;

  if (Array.isArray(summary)) {
    totalCalls += summary.length;

    for (const row of summary) {
      const { status, retryCount = 0, endedReason = "" } = row;

      if (status === "ended") {
        endedCalls += 1;
      } else {
        const key = endedReason || "unknown";
        byErrorReason[key] = (byErrorReason[key] || 0) + 1;
      }

      retrySum += retryCount;
      byStatus[status] = (byStatus[status] || 0) + 1;
    }
  } else {
    // Optional: log or count malformed summaries
    console.warn("Missing or invalid summary in document");
  }
});




  const successRate   = totalCalls ? endedCalls / totalCalls : 0;
  const avgRetries    = totalCalls ? retrySum   / totalCalls : 0;

  return res.json({
    totalBatches,
    totalCalls,
    successRate,
    avgRetries,
    byStatus,
    byErrorReason            // 👈 expose in payload
  });
}