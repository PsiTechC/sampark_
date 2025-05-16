
// import axios from "axios";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" }); 

//   }

//   const { agent_id } = req.query;

//   if (!agent_id) {
//     return res.status(400).json({ message: "Missing agent_id in query" });
//   }

//   try {
//     const executionResponse = await axios.get(
//       `https://api.bolna.dev/agent/${agent_id}/executions`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       }
//     );

//     const executions = executionResponse.data;
//     const now = new Date();

//     let totalCents = 0;
//     let last7Days = 0;
//     let last30Days = 0;
//     let last90Days = 0;
//     let currentYear = 0;

//     executions.forEach((exec) => {
//       const costCents = typeof exec.total_cost === "number" ? exec.total_cost : 0;
//       totalCents += costCents;

//       const createdAt = new Date(exec.created_at);
//       const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);

//       if (diffDays <= 7) last7Days += costCents;
//       if (diffDays <= 30) last30Days += costCents;
//       if (diffDays <= 90) last90Days += costCents;
//       if (createdAt.getFullYear() === now.getFullYear()) currentYear += costCents;
//     });

//     return res.status(200).json({
//       agent_id,
//       total_cost_usd: Number((totalCents / 100).toFixed(2)),
//       cost_breakdown: {
//         last_7_days: Number((last7Days / 100).toFixed(2)),
//         last_30_days: Number((last30Days / 100).toFixed(2)),
//         last_90_days: Number((last90Days / 100).toFixed(2)),
//         current_year: Number((currentYear / 100).toFixed(2)),
//       },
//     });
//   } catch (err) {
//     console.error(`❌ Failed fetching executions for agent ${agent_id}:`, err.message);
//     return res.status(500).json({
//       message: `Failed to fetch executions for agent ${agent_id}`,
//     });
//   }
// }


import axios from "axios";
import cors from "../../../lib/cors-middleware";

export default async function handler(req, res) {
  // Apply CORS
  await cors(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" }); 
  }

  const { agent_id } = req.query;

  if (!agent_id) {
    return res.status(400).json({ message: "Missing agent_id in query" });
  }

  try {
    const executionResponse = await axios.get(
      `https://api.bolna.dev/agent/${agent_id}/executions`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      }
    );

    const executions = executionResponse.data;
    const now = new Date();

    let totalCents = 0;
    let last7Days = 0;
    let last30Days = 0;
    let last90Days = 0;
    let currentYear = 0;

    executions.forEach((exec) => {
      const costCents = typeof exec.total_cost === "number" ? exec.total_cost : 0;
      totalCents += costCents;

      const createdAt = new Date(exec.created_at);
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);

      if (diffDays <= 7) last7Days += costCents;
      if (diffDays <= 30) last30Days += costCents;
      if (diffDays <= 90) last90Days += costCents;
      if (createdAt.getFullYear() === now.getFullYear()) currentYear += costCents;
    });

    return res.status(200).json({
      agent_id,
      total_cost_usd: Number((totalCents / 100).toFixed(2)),
      cost_breakdown: {
        last_7_days: Number((last7Days / 100).toFixed(2)),
        last_30_days: Number((last30Days / 100).toFixed(2)),
        last_90_days: Number((last90Days / 100).toFixed(2)),
        current_year: Number((currentYear / 100).toFixed(2)),
      },
    });
  } catch (err) {
    console.error(`❌ Failed fetching executions for agent ${agent_id}:`, err.message);
    return res.status(500).json({
      message: `Failed to fetch executions for agent ${agent_id}`,
    });
  }
}
