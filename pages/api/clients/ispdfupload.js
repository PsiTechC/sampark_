// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   // Run CORS middleware inline as in the second example
//   await CorsMiddleware(req, res);

//   const agentId = req.query.agentId;

//   if (!agentId) {
//     return res.status(400).json({ message: "agentId is required in query." });
//   }

//   try {
//     const { db } = await connectToDatabase();
//     const collection = db.collection("s3pdfstore");

//     const record = await collection.findOne(
//       { agentId },
//       { projection: { url: 1, _id: 0 } }
//     );

//     if (record) {
//       return res.status(200).json({
//         message: "✅ File found.",
//         agentId,
//         url: record.url,
//       });
//     } else {
//       return res.status(404).json({
//         message: "❌ No file uploaded for this agent.",
//         agentId,
//       });
//     }
//   } catch (error) {
//     console.error("❌ GET error:", error);
//     return res.status(500).json({ message: `Something went wrong: ${error.message}` });
//   }
// }


import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";

export default async function handler(req, res) {
  await CorsMiddleware(req, res); // Run CORS middleware first

  const agentId = req.query.agentId;

  if (!agentId) {
    return res.status(400).json({ message: "agentId is required in query." });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("s3pdfstore");

    if (req.method === "GET") {
      const record = await collection.findOne(
        { agentId },
        { projection: { url: 1, _id: 0 } }
      );

      if (record) {
        return res.status(200).json({
          message: "✅ File found.",
          agentId,
          url: record.url,
        });
      } else {
        return res.status(404).json({
          message: "❌ No file uploaded for this agent.",
          agentId,
        });
      }
    }

    if (req.method === "DELETE") {
      const result = await collection.deleteOne({ agentId });

      if (result.deletedCount === 1) {
        return res.status(200).json({
          message: "✅ File entry deleted successfully.",
          agentId,
        });
      } else {
        return res.status(404).json({
          message: "❌ No file found for deletion.",
          agentId,
        });
      }
    }

    // Method not allowed
    return res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error(`❌ ${req.method} error:`, error);
    return res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
}
