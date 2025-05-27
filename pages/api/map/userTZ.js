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

//     let email, userId;
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       email = decoded.email;

//       const { db } = await connectToDatabase();
//       const user = await db.collection("users").findOne({ email });

//       if (!user) {
//         return res.status(404).json({ message: "User not found in users collection" });
//       }

//       userId = user._id;
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     const { timezone } = req.body;

//     if (!timezone) {
//       return res.status(400).json({ message: "Missing timezone in request body." });
//     }

//     const { db } = await connectToDatabase();
//     const mappingCollection = db.collection("useragentmapping");

//     // Update or insert the timezone for the given user
//     await mappingCollection.updateOne(
//       { email },
//       {
//         $set: {
//           timezone,
//           email,
//           userId
//         }
//       },
//       { upsert: true }
//     );

//     console.log("✅ Timezone updated:", timezone);
//     console.log("📧 Associated Email:", email);
//     console.log("🆔 Mongo User ID:", userId);

//     return res.status(200).json({ message: "Timezone saved successfully." });
//   } catch (error) {
//     console.error("❌ Failed to process request:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  await CorsMiddleware(req, res);

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

  const { db } = await connectToDatabase();
  const mappingCollection = db.collection("useragentmapping");

  // ====================
  // POST: Save Timezone
  // ====================
  if (req.method === "POST") {
    const { timezone } = req.body;

    if (!timezone) {
      return res.status(400).json({ message: "Missing timezone in request body." });
    }

    await mappingCollection.updateOne(
      { email },
      {
        $set: {
          timezone,
          email,
          userId
        }
      },
      { upsert: true }
    );

    console.log("✅ Timezone updated:", timezone);
    return res.status(200).json({ message: "Timezone saved successfully." });
  }

  // ====================
  // GET: Fetch Timezone
  // ====================
  if (req.method === "GET") {
    const userMapping = await mappingCollection.findOne({ email });

    if (!userMapping || !userMapping.timezone) {
      return res.status(404).json({ message: "Timezone not set for this user." });
    }

    return res.status(200).json({ timezone: userMapping.timezone });
  }

  // Fallback for unsupported methods
  return res.status(405).json({ message: "Method Not Allowed" });
}
