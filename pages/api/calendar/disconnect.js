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
//     // Get JWT from cookies
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const token = cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: "Missing auth token" });
//     }

//     let email;
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       email = decoded.email;
//     } catch (err) {
//       console.error("❌ Invalid token:", err.message);
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     // Remove calendar tokens
//     const { db } = await connectToDatabase();
//     const result = await db.collection("users").updateOne(
//       { email },
//       {
//         $unset: {
//           googleAccessToken: "",
//           googleRefreshToken: "",
//         },
//       }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json({ success: true, message: "Google Calendar disconnected." });
//   } catch (error) {
//     console.error("❌ Error disconnecting calendar:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }

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
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const token = cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: "Missing auth token" });
//     }

//     let email;
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       email = decoded.email;
//     } catch (err) {
//       console.error("❌ Invalid token:", err.message);
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     // ✅ New expected fields from frontend
//     const { accessField, refreshField } = req.body;

//     if (!accessField || !refreshField) {
//       return res.status(400).json({ message: "Missing token field identifiers" });
//     }

//     const { db } = await connectToDatabase();
//     const result = await db.collection("users").updateOne(
//       { email },
//       {
//         $unset: {
//           [accessField]: "",
//           [refreshField]: "",
//         },
//       }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json({ success: true, message: `Calendar disconnected.` });
//   } catch (error) {
//     console.error("❌ Error disconnecting calendar:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


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
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = decoded.email;
    } catch (err) {
      console.error("❌ Invalid token:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    const { accessField, refreshField } = req.body;

    if (!accessField || !refreshField) {
      return res.status(400).json({ message: "Missing token field identifiers" });
    }

    // 🧠 Determine corresponding calendarMeta key
    let index = "";
    if (accessField !== "googleAccessToken") {
      index = accessField.replace("googleAccessToken", ""); // e.g. "1"
    }
    const calendarMetaKey = index === "" ? "calendarMeta" : `calendarMeta${index}`;

    const { db } = await connectToDatabase();
    const result = await db.collection("users").updateOne(
      { email },
      {
        $unset: {
          [accessField]: "",
          [refreshField]: "",
          [calendarMetaKey]: "", // ❌ also remove associated name
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true, message: `Calendar disconnected.` });
  } catch (error) {
    console.error("❌ Error disconnecting calendar:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
