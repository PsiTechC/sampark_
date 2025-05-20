import { connectToDatabase } from "../../../../lib/db";
import { scheduleBatch }       from "../../../../lib/scheduler";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id }           = req.query;
  const { scheduled_at } = req.body;
  if (!scheduled_at) {
    return res.status(400).json({ message: "Missing scheduled_at" });
  }

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("batches").updateOne(
      { batch_id: id },
      {
        $set: {
          scheduled_at: new Date(scheduled_at),
          status:       "scheduled"
        }
      }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // fetch the freshly updated batch and register it in memory
    const batch = await db.collection("batches").findOne({ batch_id: id });
    scheduleBatch(batch);

    return res.status(200).json({ message: "Scheduled", batch });
  } catch (err) {
    console.error("Schedule error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
