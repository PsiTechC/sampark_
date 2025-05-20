// pages/api/batches/[id]/run.js
import { connectToDatabase } from "../../../../lib/db";
import fs from "fs";
import path from "path";
import { runCampaign } from "../../../../lib/dialer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const { db } = await connectToDatabase();

  // 1) fetch the batch metadata
  const batch = await db.collection("batches").findOne({ batch_id: id });
  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  // 2) read the CSV from uploads/
  const filePath = path.join(process.cwd(), "uploads", batch.file_name);
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ message: "Batch file missing on server" });
  }
  const buffer = fs.readFileSync(filePath);

  // 3) normalize stored IDs (they may have come back as single-item arrays)
  const rawPhone      = batch.phoneNumberId;
  const phoneNumberId = Array.isArray(rawPhone) ? rawPhone[0] : rawPhone;

  const rawAssist     = batch.assistant_id;
  const assistantId   = Array.isArray(rawAssist) ? rawAssist[0] : rawAssist;

  // 4) run the campaign using the stored assistant_id
  try {
const summary = await runCampaign(buffer, { phoneNumberId, assistantId, batchId: id });


    // 5) update status & store summary
    await db.collection("batches").updateOne(
      { batch_id: id },
      {
        $set: {
          status: "running",
          last_run_at: new Date(),
          valid_contacts: summary.filter(r => r.status !== "error").length,
          total_contacts: summary.length,
          summary
        }
      }
    );

    return res.status(200).json({ message: "Batch started", summary });
  } catch (err) {
    console.error("Run error:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
}
