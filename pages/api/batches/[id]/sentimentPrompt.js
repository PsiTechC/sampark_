// POST /api/batches/[id]/sentimentPrompt
import { connectToDatabase } from "../../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

if (req.method === "GET") {
  const { db } = await connectToDatabase();
  const batch = await db.collection("batches").findOne({ batch_id: id });

  if (!batch) return res.status(404).json({ message: "Batch not found" });

  return res.status(200).json({ prompt: batch.sentimentPrompt || "" });
}


  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Invalid prompt" });
  }

  const { db } = await connectToDatabase();

  await db.collection("batches").updateOne(
    { batch_id: id },
    { $set: { sentimentPrompt: prompt } }
  );

  res.status(200).json({ message: "Sentiment prompt saved" });
}
