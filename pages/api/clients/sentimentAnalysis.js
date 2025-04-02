// import { connectToDatabase } from "../../../lib/db";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { db } = await connectToDatabase();

//     // Fetch all sentiment documents
//     const sentimentDocs = await db.collection("sentiment").find({}).toArray();

//     const results = sentimentDocs.map((doc) => {
//       const summary = {
//         agent_id: doc.agent_id,
//         positive: 0,
//         negative: 0,
//         neutral: 0,
//         no_response: 0,
//       };

//       // Loop over each key in the document (e.g., call1, call2, ...)
//       Object.keys(doc).forEach((key) => {
//         if (key.startsWith("call") && doc[key]?.sentiment) {
//           const sentiment = doc[key].sentiment.toLowerCase();
//           if (summary.hasOwnProperty(sentiment)) {
//             summary[sentiment]++;
//           }
//         }
//       });

//       return summary;
//     });

//     return res.status(200).json({ sentiment_summary: results });
//   } catch (error) {
//     console.error("❌ Error calculating sentiment analysis:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import { connectToDatabase } from "../../../lib/db";
import cors from "../../../lib/cors-middleware";

export default async function handler(req, res) {
  // Run CORS first
  await cors(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    const sentimentDocs = await db.collection("sentiment").find({}).toArray();

    const results = sentimentDocs.map((doc) => {
      const summary = {
        agent_id: doc.agent_id,
        positive: 0,
        negative: 0,
        neutral: 0,
        no_response: 0,
      };

      Object.keys(doc).forEach((key) => {
        if (key.startsWith("call") && doc[key]?.sentiment) {
          const sentiment = doc[key].sentiment.toLowerCase();
          if (summary.hasOwnProperty(sentiment)) {
            summary[sentiment]++;
          }
        }
      });

      return summary;
    });

    return res.status(200).json({ sentiment_summary: results });
  } catch (error) {
    console.error("❌ Error calculating sentiment analysis:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
