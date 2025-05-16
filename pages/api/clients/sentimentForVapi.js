import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";

export default async function handler(req, res) {
  await CorsMiddleware(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("bolnauserdatafromcall");

    const allData = await collection.find({}).toArray();

    const sentimentSummaryPerAgent = {};

    allData.forEach(doc => {
      const assistantId = doc.assistantId;
      const callData = doc.data || {};

      if (!sentimentSummaryPerAgent[assistantId]) {
        sentimentSummaryPerAgent[assistantId] = {
          positive: 0,
          negative: 0,
          neutral: 0,
          no_response: 0,
          total_calls: 0, 
        };
      }

      const callIds = Object.keys(callData);

      sentimentSummaryPerAgent[assistantId].total_calls += callIds.length; 

      for (const callId of callIds) {
        const call = callData[callId];
        const sentiment = (call.sentiment || "").toLowerCase();

        if (sentimentSummaryPerAgent[assistantId].hasOwnProperty(sentiment)) {
          sentimentSummaryPerAgent[assistantId][sentiment]++;
        } else {
          console.warn(`Unknown sentiment "${sentiment}" for assistantId ${assistantId}`);
        }
      }
    });

    return res.status(200).json({
      sentimentSummary: sentimentSummaryPerAgent
    });

  } catch (error) {
    console.error("Failed to fetch or process data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
