// import OpenAI from "openai";
// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }
//   await CorsMiddleware(req, res);

//   try {
//     const { db } = await connectToDatabase();

//     const agentsResponse = await fetch("https://api.bolna.dev/v2/agent/all", {
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//       },
//     });

//     if (!agentsResponse.ok) {
//       console.error("❌ Failed to fetch agents:", agentsResponse.statusText);
//       return res.status(500).json({ message: "Failed to fetch agents" });
//     }

//     const agents = await agentsResponse.json();

//     for (const agent of agents) {
//       try {
//         const execResponse = await fetch(
//           `https://api.bolna.dev/agent/${agent.id}/executions`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             },
//           }
//         );

//         if (!execResponse.ok) {
//           console.warn(`⚠️ Failed to fetch executions for agent ${agent.id}`);
//           continue;
//         }

//         const executions = await execResponse.json();
//         if (!Array.isArray(executions) || executions.length === 0) continue;

//         // ✅ Check existing sentiments
//         const existingDoc = await db.collection("sentiment").findOne(
//           { agent_id: agent.id },
//           { projection: { _id: 0 } }
//         );

//         const storedCallsCount = existingDoc
//           ? Object.keys(existingDoc).filter((key) => key.startsWith("call")).length
//           : 0;

//         console.log(`ℹ️ Agent ${agent.id} has ${executions.length} total calls, ${storedCallsCount} stored.`);

//         if (storedCallsCount >= executions.length) continue;

//         const sentimentUpdates = {};
//         const systemPrompt =
//           agent.agent_prompts?.task_1?.system_prompt ||
//           "You are a sentiment analysis tool.";
//         for (let i = storedCallsCount; i < executions.length; i++) {
//           const call = executions[i];
//           const transcript = call.transcript || "";

//           const userPrompt = `
// You are a sentiment analysis model. Based on the following call transcription and system context, classify the sentiment into one of:
// - positive
// - negative
// - neutral
// - no_response (if transcription is empty or missing)

// Respond with JSON only:
// {
//   "sentiment": "positive" | "negative" | "neutral" | "no_response"
// }

// Transcription:
// """${transcript}"""
//           `.trim();

//           try {
//             const aiResponse = await openai.chat.completions.create({
//               model: "gpt-3.5-turbo",
//               messages: [
//                 { role: "system", content: systemPrompt },
//                 { role: "user", content: userPrompt },
//               ],
//               temperature: 0,
//             });

//             let rawContent = aiResponse.choices[0].message.content.trim();

//             if (rawContent.startsWith("```")) {
//               rawContent = rawContent
//                 .replace(/```(?:json)?\s*/g, "")
//                 .replace(/```$/, "")
//                 .trim();
//             }

//             const result = JSON.parse(rawContent);

//             console.log(`🧠 Agent ${agent.id} | Call ${i + 1} → Sentiment:`, result.sentiment);
//             sentimentUpdates[`call${i + 1}`] = { sentiment: result.sentiment };
//           } catch (openAiErr) {
//             console.error(`❌ OpenAI error for agent ${agent.id}, call ${i + 1}:`, openAiErr);
//           }
//         }

//         if (Object.keys(sentimentUpdates).length > 0) {
//           await db.collection("sentiment").updateOne(
//             { agent_id: agent.id },
//             {
//               $setOnInsert: { created_at: new Date() },
//               $set: sentimentUpdates,
//             },
//             { upsert: true }
//           );
//         }

//       } catch (err) {
//         console.error(`❌ Error processing agent ${agent.id}:`, err);
//       }
//     }

//     return res.status(200).json({ message: "New sentiments analyzed and saved to MongoDB" });

//   } catch (error) {
//     console.error("❌ Server error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import OpenAI from "openai";
import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await CorsMiddleware(req, res);

  try {
    const { db } = await connectToDatabase();

    const agentsResponse = await fetch("https://api.bolna.dev/v2/agent/all", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    });

    if (!agentsResponse.ok) {
      console.error("❌ Failed to fetch agents:", agentsResponse.statusText);
      return res.status(500).json({ message: "Failed to fetch agents" });
    }

    const agents = await agentsResponse.json();

    for (const agent of agents) {
      try {
        const execResponse = await fetch(
          `https://api.bolna.dev/agent/${agent.id}/executions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          }
        );

        if (!execResponse.ok) {
          console.warn(`⚠️ Failed to fetch executions for agent ${agent.id}`);
          continue;
        }

        const executions = await execResponse.json();
        if (!Array.isArray(executions) || executions.length === 0) continue;

        // ✅ Get existing sentiment doc with execution_ids
        const existingDoc = await db.collection("sentiments").findOne(
          { agent_id: agent.id },
          { projection: { _id: 0 } }
        );

        const existingIds = new Set(
          existingDoc?.executions?.map((entry) => entry.execution_id) || []
        );

        const newEntries = [];
        const systemPrompt =
          agent.agent_prompts?.task_1?.system_prompt ||
          "You are a sentiment analysis tool.";

        for (const call of executions) {
          if (existingIds.has(call.id)) {
            console.log(`🔁 Skipping already processed execution: ${call.id}`);
            continue;
          }

          const transcript = call.transcript || "";
          const userPrompt = `
You are a sentiment analysis model. Based on the following call transcription and system context, classify the sentiment into one of:
- positive
- negative
- neutral
- no_response (if transcription is empty or missing)

Respond with JSON only:
{
  "sentiment": "positive" | "negative" | "neutral" | "no_response"
}

Transcription:
"""${transcript}"""
          `.trim();

          try {
            const aiResponse = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0,
            });

            let rawContent = aiResponse.choices[0].message.content.trim();
            if (rawContent.startsWith("```")) {
              rawContent = rawContent
                .replace(/```(?:json)?\s*/g, "")
                .replace(/```$/, "")
                .trim();
            }

            const result = JSON.parse(rawContent);
            newEntries.push({ execution_id: call.id, sentiment: result.sentiment });

            console.log(`🧠 Agent ${agent.id} | Execution ${call.id} → Sentiment:`, result.sentiment);
          } catch (err) {
            console.error(`❌ OpenAI error for execution ${call.id}:`, err.message);
          }
        }

        if (newEntries.length > 0) {
          console.log(`💾 Saving ${newEntries.length} new entries for agent ${agent.id}`);
          await db.collection("sentiments").updateOne(
            { agent_id: agent.id },
            {
              $setOnInsert: { created_at: new Date() },
              $push: { executions: { $each: newEntries } },
            },
            { upsert: true }
          );
        } else {
          console.log(`📭 No new executions to save for agent ${agent.id}`);
        }
      } catch (err) {
        console.error(`❌ Error processing agent ${agent.id}:`, err);
      }
    }

    return res.status(200).json({ message: "New sentiments saved to 'sentiments' collection" });
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
