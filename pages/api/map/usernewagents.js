// // pages/api/usernewagents.js
// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";
// import jwt from "jsonwebtoken";
// import cookie from "cookie";

// export default async function handler(req, res) {
//   await CorsMiddleware(req, res);

//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const cookies = cookie.parse(req.headers.cookie || "");
//     const token = cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: "Missing auth token" });
//     }

//     let email;
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       email = decoded.email;
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     const { agentId } = req.body;

//     if (!agentId) {
//       return res.status(400).json({ message: "Missing agent or assistant ID" });
//     }

//     console.log("✅ Agent/Assistant ID:", agentId);
//     console.log("📧 Associated Email from Token:", email);

//     return res.status(200).json({ message: "Agent/Assistant ID received and logged." });
//   } catch (error) {
//     console.error("❌ Failed to process request:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// pages/api/usernewagents.js
import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  await CorsMiddleware(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    let email, userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = decoded.email;

      const { db } = await connectToDatabase();
      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found in users collection" });
      }

      userId = user._id;

    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: "Missing agent or assistant ID" });
    }

    const { db } = await connectToDatabase();
    const mappingCollection = db.collection("useragentmapping");

    // Upsert logic: add agentId to assistants array if not already present
    await mappingCollection.updateOne(
      { email },
      {
        $setOnInsert: { email, userId },
        $addToSet: { assistants: agentId },
      },
      { upsert: true }
    );

    console.log("✅ Agent/Assistant ID:", agentId);
    console.log("📧 Associated Email:", email);
    console.log("🆔 Mongo User ID:", userId);

    return res.status(200).json({ message: "Agent ID mapped successfully." });
  } catch (error) {
    console.error("❌ Failed to process request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
