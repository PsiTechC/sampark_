// // pages/api/batches/index.js
// import formidable from "formidable";
// import fs from "fs";
// import path from "path";
// import { v4 as uuid } from "uuid";
// import { connectToDatabase } from "../../../lib/db";

// // disable Next.js body parser so formidable can handle multipart
// export const config = { api: { bodyParser: false } };

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     // parse the multipart form
//     const form = formidable();
//     const { fields, files } = await new Promise((ok, fail) =>
//       form.parse(req, (err, f, fl) => (err ? fail(err) : ok({ fields: f, files: fl })))
//     );

//     const assistantId = fields.assistant_id;
//     const phoneId     = fields.from_phone_number;
    
//     // Normalize fileInfo whether single or array
//     const rawFile = files.file;
//     const fileInfo = Array.isArray(rawFile) ? rawFile[0] : rawFile;

//     if (!assistantId || !phoneId || !fileInfo) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Ensure uploads directory exists
//     const UPLOAD_DIR = path.join(process.cwd(), "uploads");
//     if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

//     // Generate a unique filename and determine paths
//     const filename = `${uuid()}-${fileInfo.originalFilename}`;
//     const destPath = path.join(UPLOAD_DIR, filename);

//     // Use correct temp path property depending on Formidable version
//     const tempPath = fileInfo.filepath || fileInfo.path;
//     if (!tempPath || !fs.existsSync(tempPath)) {
//       return res.status(500).json({ message: "Uploaded file not available on server" });
//     }

//     // Move file from temp to uploads directory
//     try {
//       fs.renameSync(tempPath, destPath);
//     } catch (moveErr) {
//       console.error("Error moving uploaded file:", moveErr);
//       return res.status(500).json({ message: "Failed to store uploaded file" });
//     }

//     // Persist batch metadata to MongoDB
//     const { db } = await connectToDatabase();
//     const batchId = uuid();
//     await db.collection("batches").insertOne({
//       batch_id: batchId,
//       assistant_id: assistantId,
//       phoneNumberId: phoneId,
//       file_name: filename,
//       created_at: new Date(),
//       status: "uploaded",
//       valid_contacts: 0,
//       total_contacts: 0
//     });

//     // Respond with new batch details
//     return res.status(201).json({
//       batch_id: batchId,
//       valid_contacts: 0,
//       total_contacts: 0
//     });
//   }

//   // GET all batches
//   const { db } = await connectToDatabase();
//   const list = await db
//     .collection("batches")
//     .find()
//     .sort({ created_at: -1 })
//     .toArray();
//   return res.status(200).json(list);
// }



// pages/api/batches/index.js
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { connectToDatabase } from "../../../lib/db";

// disable Next.js body parser so formidable can handle multipart
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method === "POST") {
    // parse the multipart form
    const form = formidable();
    const { fields, files } = await new Promise((ok, fail) =>
      form.parse(req, (err, f, fl) => (err ? fail(err) : ok({ fields: f, files: fl })))
    );

    // Normalize assistantId in case formidable returns an array
// Normalize assistantId in case formidable returns an array
const rawAssistant = fields.assistant_id;
const assistantId = Array.isArray(rawAssistant) ? rawAssistant[0] : rawAssistant;
// Normalize phoneNumberId similarly
const rawPhone = fields.from_phone_number;
const phoneId = Array.isArray(rawPhone) ? rawPhone[0] : rawPhone;
    
    // Normalize fileInfo whether single or array
    const rawFile = files.file;
    const fileInfo = Array.isArray(rawFile) ? rawFile[0] : rawFile;

    if (!assistantId || !phoneId || !fileInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure uploads directory exists
    const UPLOAD_DIR = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    // Generate a unique filename and determine paths
    const filename = `${uuid()}-${fileInfo.originalFilename}`;
    const destPath = path.join(UPLOAD_DIR, filename);

    // Use correct temp path property depending on Formidable version
    const tempPath = fileInfo.filepath || fileInfo.path;
    if (!tempPath || !fs.existsSync(tempPath)) {
      return res.status(500).json({ message: "Uploaded file not available on server" });
    }

        // Move file from temp to uploads directory
    try {
      // cross-device safe copy instead of rename
      fs.copyFileSync(tempPath, destPath);
      fs.unlinkSync(tempPath);
    } catch (moveErr) {
      console.error("Error moving uploaded file:", moveErr);
      return res.status(500).json({ message: "Failed to store uploaded file" });
    }


    // Persist batch metadata to MongoDB
    const { db } = await connectToDatabase();
    const batchId = uuid();
    await db.collection("batches").insertOne({
      batch_id: batchId,
      assistant_id: assistantId,
      phoneNumberId: phoneId,
      file_name: filename,
      created_at: new Date(),
      status: "uploaded",
      valid_contacts: 0,
      total_contacts: 0
    });

    // Respond with new batch details
    return res.status(201).json({
      batch_id: batchId,
      valid_contacts: 0,
      total_contacts: 0
    });
  }

  // GET all batches
  const { db } = await connectToDatabase();
  const list = await db
    .collection("batches")
    .find()
    .sort({ created_at: -1 })
    .toArray();
  return res.status(200).json(list);
}
