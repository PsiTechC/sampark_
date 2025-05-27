import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  await CorsMiddleware(req, res);

  if (req.method !== "DELETE") {
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

    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: "Missing agentId in request body" });
    }

    const { db } = await connectToDatabase();
    const mappingCollection = db.collection("useragentmapping");

    const updateResult = await mappingCollection.updateOne(
      { email },
      { $pull: { assistants: agentId } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "Agent ID not found or already removed." });
    }

    console.log(`🗑️ Removed agent ${agentId} from user ${email}`);
    return res.status(200).json({ message: "Agent removed successfully." });

  } catch (error) {
    console.error("❌ Failed to delete agent:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
