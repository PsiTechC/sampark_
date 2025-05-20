// pages/api/batches/[id]/report.js
import { connectToDatabase } from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const { db } = await connectToDatabase();
  const batch = await db
    .collection("batches")
    .findOne({ batch_id: id }, { projection: { summary: 1, file_name: 1, created_at: 1, status: 1 } });

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  return res.status(200).json(batch);
}
