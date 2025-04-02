// import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export default async function handler(req, res) {
//     if (req.method !== 'GET') {
//         return res.status(405).json({ message: 'Method Not Allowed' });
//     }

//     try {
//         const agentsResponse = await fetch('https://api.bolna.dev/v2/agent/all', {
//             headers: {
//                 Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             },
//         });

//         if (!agentsResponse.ok) {
//             console.error("❌ Failed to fetch agents:", agentsResponse.statusText);
//             return res.status(500).json({ message: 'Failed to fetch agents' });
//         }

//         const agents = await agentsResponse.json();

//         for (const agent of agents) {
//             try {
//                 const execResponse = await fetch(`https://api.bolna.dev/agent/${agent.id}/executions`, {
//                     method: 'GET',
//                     headers: {
//                         Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//                     },
//                 });

//                 if (!execResponse.ok) {
//                     console.warn(`⚠️ Failed to fetch executions for agent ${agent.id}:`, execResponse.statusText);
//                     continue;
//                 }

//                 const executions = await execResponse.json();
//                 if (!Array.isArray(executions) || executions.length === 0) continue;

//                 for (let i = 0; i < executions.length; i++) {
//                     const call = executions[i];
//                     const transcript = call.transcript || '';

//                     const prompt = `
// You are a sentiment analysis model. Given a call transcription, classify it into one of the following categories:
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

//                     try {
//                         const aiResponse = await openai.chat.completions.create({
//                             model: "gpt-3.5-turbo",
//                             messages: [
//                                 { role: "system", content: "You are a sentiment analysis tool." },
//                                 { role: "user", content: prompt },
//                             ],
//                             temperature: 0,
//                         });

//                         let rawContent = aiResponse.choices[0].message.content.trim();

//                         if (rawContent.startsWith("```")) {
//                             rawContent = rawContent.replace(/```(?:json)?\s*/g, "").replace(/```$/, "").trim();
//                           }
                        
//                           const result = JSON.parse(rawContent);

//                         console.log(`🧠 Agent ${agent.id} | Call ${i + 1} → Sentiment:`, result.sentiment);
//                     } catch (openAiErr) {
//                         console.error(`❌ OpenAI error for agent ${agent.id}, call ${i + 1}:`, openAiErr);
//                     }
//                 }

//             } catch (err) {
//                 console.error(`❌ Error processing agent ${agent.id}:`, err);
//             }
//         }

//         return res.status(200).json({ message: 'Per-call sentiment logged to console' });
//     } catch (error) {
//         console.error("❌ Server error:", error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// }


// import OpenAI from "openai";
// import { connectToDatabase } from "../../../lib/db"; // Adjust path if needed

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

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

//         for (let i = 0; i < executions.length; i++) {
//           const call = executions[i];
//           const transcript = call.transcript || "";

//           const prompt = `
// You are a sentiment analysis model. Given a call transcription, classify it into one of the following categories:
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
//                 { role: "system", content: "You are a sentiment analysis tool." },
//                 { role: "user", content: prompt },
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

//             console.log(
//               `🧠 Agent ${agent.id} | Call ${i + 1} → Sentiment:`,
//               result.sentiment
//             );

//             await db.collection("sentiment").insertOne({
//                 agent_id: agent.id,
//                 sentiment: result.sentiment,
//                 created_at: new Date(),
//               });
              
              

//           } catch (openAiErr) {
//             console.error(
//               `❌ OpenAI error for agent ${agent.id}, call ${i + 1}:`,
//               openAiErr
//             );
//           }
//         }
//       } catch (err) {
//         console.error(`❌ Error processing agent ${agent.id}:`, err);
//       }
//     }

//     return res
//       .status(200)
//       .json({ message: "Sentiments logged and saved to MongoDB" });
//   } catch (error) {
//     console.error("❌ Server error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


import OpenAI from "openai";
import { connectToDatabase } from "../../../lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

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

        // 👇 Create a new document for this agent
        const sentimentDoc = {
          agent_id: agent.id,
          created_at: new Date(),
        };

        for (let i = 0; i < executions.length; i++) {
          const call = executions[i];
          const transcript = call.transcript || "";

          const prompt = `
You are a sentiment analysis model. Given a call transcription, classify it into one of the following categories:
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
                { role: "system", content: "You are a sentiment analysis tool." },
                { role: "user", content: prompt },
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

            console.log(
              `🧠 Agent ${agent.id} | Call ${i + 1} → Sentiment:`,
              result.sentiment
            );

            // 👇 Add call-level sentiment to the document
            sentimentDoc[`call${i + 1}`] = { sentiment: result.sentiment };

          } catch (openAiErr) {
            console.error(
              `❌ OpenAI error for agent ${agent.id}, call ${i + 1}:`,
              openAiErr
            );
          }
        }

        // ✅ Save full agent sentiment summary
        await db.collection("sentiment").insertOne(sentimentDoc);

      } catch (err) {
        console.error(`❌ Error processing agent ${agent.id}:`, err);
      }
    }

    return res
      .status(200)
      .json({ message: "Sentiment summaries saved to MongoDB" });

  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
