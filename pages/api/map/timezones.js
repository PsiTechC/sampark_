import CorsMiddleware from "../../../lib/cors-middleware";
import { getTimezonesFromCSV } from "../../../utils/parseTimezoneCSV";

export default async function handler(req, res) {
  await CorsMiddleware(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const timezones = getTimezonesFromCSV();
    return res.status(200).json({ timezones });
  } catch (err) {
    console.error("❌ Failed to read timezones:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
