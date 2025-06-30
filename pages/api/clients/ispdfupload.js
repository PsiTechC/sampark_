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
      const records = await collection
        .find({ agentId, url: { $regex: /\.pdf$/i } }) // optional filter: only PDFs
        .project({ url: 1, name: 1, uploadedAt: 1, _id: 0 })
        .toArray();
    
      if (records.length > 0) {
        return res.status(200).json({
          message: "✅ Files found.",
          agentId,
          files: records,
        });
      } else {
        return res.status(404).json({
          message: "❌ No files uploaded for this agent.",
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
