import { connectToDatabase }   from "../../../../lib/db";
import { cancelScheduledBatch } from "../../../../lib/scheduler";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("batches").updateOne(
      { batch_id: id },
      { $set: { status: "stopped", stopped_at: new Date() } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // cancel any in-memory scheduled job
    cancelScheduledBatch(id);

    // return the updated batch
    const batch = await db.collection("batches").findOne({ batch_id: id });
    return res.status(200).json({ message: "Batch stopped", batch });
  } catch (err) {
    console.error("Stop error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
