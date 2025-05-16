// import { connectToDatabase } from "../../../lib/db";
// import cors from "../../../lib/cors-middleware";

// export default async function handler(req, res) {
//   await cors(req, res);

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { db } = await connectToDatabase();

//     const batchDocs = await db.collection("batch_sentiment").find({}).toArray();

//     const results = batchDocs.map((doc) => {
//       const summary = {
//         agent_id: doc.agent_id,
//         positive: 0,
//         negative: 0,
//         neutral: 0,
//         no_response: 0,
//       };

//       for (const batch of doc.batches || []) {
//         for (const exec of batch.executions || []) {
//           const sentiment = exec.sentiment?.toLowerCase();
//           if (summary.hasOwnProperty(sentiment)) {
//             summary[sentiment]++;
//           }
//         }
//       }

//       return summary;
//     });

//     return res.status(200).json({ sentiment_summary: results });
//   } catch (error) {
//     console.error("❌ Error generating batch sentiment summary:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


// import { connectToDatabase } from "../../../lib/db";
// import cors from "../../../lib/cors-middleware";

// export default async function handler(req, res) {
//   await cors(req, res);

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { db } = await connectToDatabase();

//     const batchDocs = await db.collection("batch_sentiment").find({}).toArray();

//     const results = [];

//     for (const doc of batchDocs) {
//       const agentId = doc.agent_id;

//       for (const batch of doc.batches || []) {
//         const summary = {
//           agent_id: agentId,
//           batch_id: batch.batch_id,
//           positive: 0,
//           negative: 0,
//           neutral: 0,
//           no_response: 0,
//         };

//         for (const exec of batch.executions || []) {
//           const sentiment = exec.sentiment?.toLowerCase();
//           if (summary.hasOwnProperty(sentiment)) {
//             summary[sentiment]++;
//           }
//         }

//         results.push(summary);
//       }
//     }

//     return res.status(200).json({ sentiment_summary: results });
//   } catch (error) {
//     console.error("❌ Error generating batch sentiment summary:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import { connectToDatabase } from "../../../lib/db";
import cors from "../../../lib/cors-middleware";

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const batchDocs = await db.collection("batch_sentiment").find({}).toArray();

    const groupedResults = [];

    for (const doc of batchDocs) {
      const agentId = doc.agent_id;
      const batches = doc.batches || [];

      const batchSummaries = batches.map((batch) => {
        const summary = {
          batch_id: batch.batch_id,
          positive: 0,
          negative: 0,
          neutral: 0,
          no_response: 0,
        };

        for (const exec of batch.executions || []) {
          const sentiment = exec.sentiment?.toLowerCase();
          if (summary.hasOwnProperty(sentiment)) {
            summary[sentiment]++;
          }
        }

        return summary;
      });

      groupedResults.push({
        agent_id: agentId,
        total_batches: batches.length,
        batch_summaries: batchSummaries,
      });
    }

    return res.status(200).json({ sentiment_summary: groupedResults });
  } catch (error) {
    console.error("❌ Error generating grouped batch sentiment summary:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
