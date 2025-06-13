// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";
// import jwt from "jsonwebtoken";
// import cookie from "cookie";

// export default async function handler(req, res) {
//   await CorsMiddleware(req, res);

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     // Parse the token from cookies
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const token = cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: "Missing auth token" });
//     }

//     // Verify the token and extract user email
//     let email;
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       email = decoded.email;
//     } catch (err) {
//       console.error("❌ Invalid token:", err.message);
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     // Connect to DB and find user by email
//     const { db } = await connectToDatabase();
//     const user = await db.collection("users").findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const hasTokens = Boolean(user.googleAccessToken && user.googleRefreshToken);

//     return res.status(200).json({
//       isCalendarConnected: hasTokens,
//     });
//   } catch (error) {
//     console.error("❌ Error checking calendar tokens:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  await CorsMiddleware(req, res);

  if (req.method !== "GET") {
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

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectedCalendars = Object.keys(user)
    .filter((key) => key.startsWith("googleAccessToken") && typeof user[key] === "string" && user[key])
    .map((accessKey) => {
      const index = accessKey === "googleAccessToken" ? "" : accessKey.replace("googleAccessToken", "");
      const refreshKey = `googleRefreshToken${index}`;
      const nameKey = index === "" ? "calendarMeta" : `calendarMeta${index}`;
  
      return {
        accessField: accessKey,
        refreshField: refreshKey,
        calendarName: user[nameKey] || `Calendar ${index || 1}`,
      };
    });
  


  return res.status(200).json({
    isCalendarConnected: connectedCalendars.length > 0,
    connectedCalendars, 
  });
  
  } catch (error) {
    console.error("❌ Error checking calendar tokens:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
