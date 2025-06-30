import { connectToDatabase } from "../../../lib/db";
import cors from "../../../lib/cors-middleware";
import { DateTime } from "luxon";

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({ message: "Missing 'ids' query parameter" });
  }

  try {
    const assistantIds = Array.isArray(ids)
      ? ids
      : typeof ids === "string"
        ? ids.split(",").map((id) => id.trim())
        : [];

    if (assistantIds.length === 0) {
      return res.status(400).json({ message: "No valid assistant IDs provided" });
    }


    const { db } = await connectToDatabase();
    const collection = db.collection("userdatafromcallwithsentiment");

    const now = DateTime.now();
    const start7d = now.minus({ days: 7 });
    const start30d = now.minus({ days: 30 });
    const start90d = now.minus({ days: 90 });
    const startYear = DateTime.local(now.year, 1, 1);

    const results = [];
    let overallTotalCost = 0;

    for (const assistantId of assistantIds) {
      const doc = await collection.findOne({ assistantId });

      if (!doc || !doc.data) {
        results.push({
          assistantId,
          call_count: 0,
          total_cost_usd: 0,
          cost_breakdown: {
            total: 0,
            last_7_days: 0,
            last_30_days: 0,
            last_90_days: 0,
            current_year: 0,
          },
        });
        continue;
      }

      let totalCost = 0;
      let callCount = 0;

      let costBreakdown = {
        total: 0,
        last_7_days: 0,
        last_30_days: 0,
        last_90_days: 0,
        current_year: 0,
      };

      for (const callId in doc.data) {
        const callData = doc.data[callId];
        const timestamp = callData?.timestamp || doc.updatedAt; // fallback

        if (typeof callData.cost === "number") {
          totalCost += callData.cost;
          costBreakdown.total += callData.cost;

          const callTime = DateTime.fromJSDate(new Date(timestamp));
          if (callTime >= start7d) costBreakdown.last_7_days += callData.cost;
          if (callTime >= start30d) costBreakdown.last_30_days += callData.cost;
          if (callTime >= start90d) costBreakdown.last_90_days += callData.cost;
          if (callTime >= startYear) costBreakdown.current_year += callData.cost;
        }

        callCount++;
      }

      // Round all cost values to 4 decimals
      const roundedBreakdown = {};
      for (const key in costBreakdown) {
        roundedBreakdown[key] = parseFloat(costBreakdown[key].toFixed(4));
      }

      const roundedTotal = parseFloat(totalCost.toFixed(4));
      overallTotalCost += roundedTotal;

      results.push({
        assistantId,
        call_count: callCount,
        total_cost_usd: roundedTotal,
        cost_breakdown: roundedBreakdown,
      });
      
    }

    overallTotalCost = parseFloat(overallTotalCost.toFixed(4));

    return res.status(200).json({
      results,
      overall_total_cost_usd: overallTotalCost,
    });
  } catch (err) {
    console.error("❌ Error calculating assistant call costs:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
