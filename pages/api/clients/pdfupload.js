import multer from "multer";
import { Storage } from "@google-cloud/storage";
import { connectToDatabase } from "../../../lib/db";
import { Readable } from "stream";

// Disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// GCS setup
const storage = new Storage();
const bucketName = "sampark_psitech_v1";
const bucket = storage.bucket(bucketName);

// Multer config for memory buffer + file validation
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/svg+xml",
      "image/heic",
      "image/heif"
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only PDF, DOC, DOCX, and image files are allowed."));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 10MB
});

// Middleware runner
const runUploadMiddleware = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.array("files")(req, res, (err) => {
      if (err) {
        console.error("❌ Multer error:", err);
        reject(new Error("Failed to parse uploaded files: " + err.message));
      } else {
        resolve();
      }
    });
  });
};

// Upload one file to GCS
const uploadToGCS = async (agentId, file) => {
  const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
  const finalName = `${agentId}_${Date.now()}_${sanitizedFileName}`;
  const blob = bucket.file(finalName);

  return new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("error", (err) => {
      console.error("❌ GCS Stream Error:", err);
      reject(err);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve({ url: publicUrl, name: sanitizedFileName });
    });

    const readableStream = Readable.from(file.buffer);
    readableStream.pipe(blobStream);
  });
};

// Main handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const agentId = req.query.agentId;
  if (!agentId) {
    return res.status(400).json({ message: "Agent ID is required." });
  }

  try {
    await runUploadMiddleware(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("s3pdfstore");

    const uploadedDocs = [];

    for (const file of req.files) {
      const { url, name } = await uploadToGCS(agentId, file);

      const doc = {
        agentId,
        name,
        url,
        uploadedAt: new Date(),
      };

      uploadedDocs.push(doc);
    }

    await collection.insertMany(uploadedDocs);

    return res.status(200).json({
      message: "✅ Files uploaded successfully!",
      files: uploadedDocs,
    });

  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
}
