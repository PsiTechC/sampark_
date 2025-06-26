import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";
import CorsMiddleware from "../../../lib/cors-middleware";
import { connectToDatabase } from "../../../lib/db";
import { csvProcessAndSendWhatsApp } from '../../../lib/ws_bc_function/csvProcessAndSendWhatsApp';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "uploads", "ws_csv_uploads");

const ensureDirExists = async (dir) => {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
};

const parseForm = async (req) =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
      uploadDir,
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await CorsMiddleware(req, res);

  try {
    await ensureDirExists(uploadDir);
    const { fields, files } = await parseForm(req);

    const assistantId = Array.isArray(fields.assistantId)
      ? fields.assistantId[0].trim()
      : (fields.assistantId || "").trim();

    if (!assistantId) {
      return res.status(400).json({ message: "Missing assistantId." });
    }

    let uploadedFile = files.file || Object.values(files)[0];
    if (Array.isArray(uploadedFile)) uploadedFile = uploadedFile[0];

    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ message: "No file uploaded or file path missing." });
    }

    const targetPath = path.join(uploadDir, `${assistantId}.csv`);
    await fs.promises.rename(uploadedFile.filepath, targetPath);
    uploadedFile.filepath = targetPath;
    uploadedFile.newFilename = `${assistantId}.csv`;

    const { db } = await connectToDatabase();
    const mappingDoc = await db.collection("useragentmapping").findOne({
      assistants: { $in: [assistantId] },
    });

    if (!mappingDoc || !mappingDoc.userId) {
      return res.status(404).json({ message: `No user mapping found for assistant ID: ${assistantId}` });
    }

    const userId = mappingDoc.userId;
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: { ws_broadcast_assistant_id: assistantId } }
    );

    console.log(`✅ ws_broadcast_assistant_id set for user ${userId} (${result.modifiedCount} update)`);

    const wsmapCollection = db.collection("client_user_assistant_and_wsmap");
    await wsmapCollection.updateOne(
      { userId },
      { $set: { assistantId } },
      { upsert: true }
    );
    console.log(`📌 Mapped userId ${userId} and assistantId ${assistantId} in client_user_assistant_and_wsmap`);

    // 🚀 Send response immediately before background processing
    res.status(200).json({
      message: "CSV uploaded and assistant mapping updated successfully.",
      filePath: uploadedFile.filepath,
      fileName: uploadedFile.originalFilename || uploadedFile.newFilename,
      userId,
      assistantId,
    });

    // 🔄 Start background WhatsApp broadcast processing
    const user = await usersCollection.findOne({ _id: userId });

    if (user && user.companyName) {
      console.log(`🚀 Background processing CSV for ${user.companyName}`);
      csvProcessAndSendWhatsApp(uploadedFile.filepath, user.companyName, assistantId)
        .then(() => console.log("✅ Background WhatsApp broadcast completed."))
        .catch((err) => console.error("❌ Background processing error:", err));
    } else {
      console.warn(`⚠️ Company name missing for user ${userId}, skipping broadcast.`);
    }
  } catch (err) {
    console.error("❌ Error processing upload:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to upload CSV or update user.", error: err.message });
    }
  }
}
