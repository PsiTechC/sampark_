import { connectToDatabase } from "@/lib/db";
//  C:\sanket\psitech\sampark_\pages\api\batches\[id]\batches.js
export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { db } = await connectToDatabase();

  try {
    const batches = await db
      .collection("batches")
      .find({ assistant_id: id })
      .sort({ created_at: -1 })
      .toArray();

    res.status(200).json(batches);
  } catch (err) {
    console.error("❌ Error fetching batches:", err);
    res.status(500).json({ message: "Failed to fetch batches" });
  }
}
