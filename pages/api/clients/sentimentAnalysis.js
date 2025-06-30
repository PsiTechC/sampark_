import { connectToDatabase } from "../../../lib/db";
import cors from "../../../lib/cors-middleware";

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    const assistantIdParam = req.query.assistantId;
    let matchFilter = {};

    // Support multiple assistant IDs via query param: ?assistantId=id1,id2,id3
    if (assistantIdParam) {
      const ids = Array.isArray(assistantIdParam)
        ? assistantIdParam
        : assistantIdParam.split(",").map((id) => id.trim());

      matchFilter = {
        assistantId: { $in: ids }
      };
    }

    const docs = await db
      .collection("userdatafromcallwithsentiment")
      .find(matchFilter)
      .toArray();

    const results = [];

    for (const doc of docs) {
      const summary = {
        assistantId: doc.assistantId,
        positive: 0,
        negative: 0,
        neutral: 0,
        no_response: 0,
        total_calls: 0,
        answered: 0,
        unanswered: 0,
      };

      const calls = doc.data || {};

      Object.values(calls).forEach((entry) => {
        const sentiment = (entry.sentiment || "no_response").toLowerCase();
        const duration = parseFloat(entry.duration || 0);

        // Sentiment tracking
        if (summary.hasOwnProperty(sentiment)) {
          summary[sentiment]++;
        } else {
          summary.no_response++;
        }

        // Call status tracking
        if (duration > 0) {
          summary.answered++;
        } else {
          summary.unanswered++;
        }
      });

      // Total calls is the sum of all sentiment categories
      summary.total_calls =
        summary.positive +
        summary.negative +
        summary.neutral +
        summary.no_response;

      results.push(summary);
    }

    return res.status(200).json({ sentiment_summary: results });
  } catch (error) {
    console.error("❌ Error generating sentiment summary:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
