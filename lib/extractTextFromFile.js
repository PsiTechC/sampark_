// import fs from "fs";
// import fsp from "fs/promises";
// import path from "path";
// import pdfParse from "pdf-parse";
// import mammoth from "mammoth";

// export async function extractTextFromFile(filePath) {
//   const ext = path.extname(filePath).toLowerCase();

//   try {
//     if (ext === ".pdf") {
//       const data = fs.readFileSync(filePath); // using sync read for pdf-parse
//       const pdfData = await pdfParse(data, {
//         max: 0,
//         normalizeWhitespace: true,
//       });
//       return pdfData.text;
//     }

//     if (ext === ".txt") {
//       return await fsp.readFile(filePath, "utf-8");
//     }

//     if (ext === ".docx") {
//       const result = await mammoth.extractRawText({ path: filePath });
//       return result.value;
//     }

//     return "[Unsupported file format]";
//   } catch (err) {
//     console.error(`❌ Error extracting text from ${filePath}:`, err);
//     return "[Failed to extract text]";
//   }
// }


import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { v4 as uuidv4 } from "uuid";

export async function processUploadedFilesAndSaveText(files) {
  const sessionId = uuidv4(); // 🆕 Unique folder per upload
  const uploadDir = path.join(process.cwd(), "uploads", sessionId);
  const extractDir = path.join(process.cwd(), "extracted");

  await fsp.mkdir(uploadDir, { recursive: true });
  await fsp.mkdir(extractDir, { recursive: true });

  let combinedText = "";

  for (const file of files) {
    const originalPath = file.filepath;
    const ext = path.extname(originalPath);
    const destPath = path.join(uploadDir, `${Date.now()}${ext}`);

    // Move uploaded file into uuid folder
    await fsp.rename(originalPath, destPath);

    const extracted = await extractText(destPath);
    combinedText +=  extracted;
  }

  const finalExtractPath = path.join(extractDir, `${sessionId}.txt`);
  await fsp.writeFile(finalExtractPath, combinedText, "utf-8");

  return {
    sessionId,
    uploadDir,
    extractedFile: finalExtractPath,
    preview: combinedText.slice(0, 500) + "...", // for preview if needed
  };
}

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf") {
      const data = fs.readFileSync(filePath);
      const pdfData = await pdfParse(data, {
        max: 0,
        normalizeWhitespace: true,
      });
      return pdfData.text;
    }

    if (ext === ".txt") {
      return await fsp.readFile(filePath, "utf-8");
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    return "[Unsupported file format]";
  } catch (err) {
    console.error(`❌ Error extracting text from ${filePath}:`, err);
    return "[Failed to extract text]";
  }
}
