import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";

export default async function handler(req, res) {
  await CorsMiddleware(req, res); // Apply CORS middleware

  const { method, query, body } = req;
  const assistantId = query.assistantId || body.assistantId;

  if (!assistantId) {
    return res.status(400).json({ message: "'assistantId' is required." });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("meetlinks");

    if (method === "POST") {
      const { meetLink } = body;

      if (!meetLink) {
        return res.status(400).json({ message: "'meetLink' is required in POST body." });
      }

      const result = await collection.updateOne(
        { assistantId },
        { $set: { meetLink, updatedAt: new Date() } },
        { upsert: true }
      );

      return res.status(200).json({
        message: "✅ Meet link saved successfully.",
        assistantId,
        meetLink,
      });
    }

    if (method === "GET") {
      const doc = await collection.findOne({ assistantId });

      if (!doc) {
        return res.status(404).json({ message: "❌ No meet link found.", assistantId });
      }

      return res.status(200).json({
        message: "✅ Meet link retrieved successfully.",
        assistantId,
        meetLink: doc.meetLink,
      });
    }

    if (method === "DELETE") {
      const result = await collection.deleteOne({ assistantId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "❌ No meet link found to delete.", assistantId });
      }

      return res.status(200).json({
        message: "✅ Meet link deleted successfully.",
        assistantId,
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error(`❌ ${method} error in /uploadmeetlink:`, error);
    return res.status(500).json({
      message: `❌ Failed to process ${method} request.`,
      error: error.message,
    });
  }
}
