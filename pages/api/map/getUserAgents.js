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
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = decoded.email;
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { db } = await connectToDatabase();
    const mappingCollection = db.collection("useragentmapping");

    const mapping = await mappingCollection.findOne({ email });

    if (!mapping) {
      return res.status(200).json({ assistants: [] }); // return empty if none found
    }

    return res.status(200).json({
      assistants: mapping.assistants || [],
    });
  } catch (error) {
    console.error("❌ Failed to fetch user agents:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
