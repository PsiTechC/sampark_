import fs from "fs";
import path from "path";
const formidable = require("formidable");
import { processUploadedFilesAndSaveText } from "@/lib/extractTextFromFile";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    return handleFileUpload(req, res);
  } else if (req.method === "GET") {
    return handleFetchExtractedText(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

// 📤 Upload handler
async function handleFileUpload(req, res) {
  const uploadDir = path.join(process.cwd(), "pages/api/Knowledgebase/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, async (err, fields, filesObj) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      const files = Object.values(filesObj).flat();
      const filteredFiles = files.filter((f) => f?.filepath);

      if (filteredFiles.length === 0) {
        return res.status(400).json({ error: "No valid files uploaded." });
      }

      const results = await processUploadedFilesAndSaveText(filteredFiles);

      res.status(200).json({
        message: "✅ Files processed successfully.",
        sessionId: results.sessionId,
        extractedFilePath: results.extractedFile,
        preview: results.preview,
      });
    } catch (error) {
      console.error("❌ Error processing uploaded files:", error);
      res.status(500).json({ error: "Failed to extract and save file text." });
    }
  });
}

// 📥 Text retrieval handler
async function handleFetchExtractedText(req, res) {
  const sessionId = req.query.sessionId;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  const extractPath = path.join(process.cwd(), "extracted", `${sessionId}.txt`);

  if (!fs.existsSync(extractPath)) {
    return res.status(404).json({ error: "Extracted file not found" });
  }

  try {
    const text = fs.readFileSync(extractPath, "utf-8");
    res.status(200).json({ sessionId, text });
  } catch (err) {
    console.error("❌ Failed to read extracted file:", err);
    res.status(500).json({ error: "Could not read extracted file" });
  }
}
