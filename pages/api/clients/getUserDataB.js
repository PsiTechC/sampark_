// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";

// export default async function handler(req, res) {
//   await CorsMiddleware(req, res);

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { db } = await connectToDatabase();
//     const collection = db.collection("bolnauserdatafromcall");

//     const allData = await collection.find({}).toArray();

//     return res.status(200).json({ data: allData });
//   } catch (error) {
//     console.error("❌ Failed to fetch data:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
