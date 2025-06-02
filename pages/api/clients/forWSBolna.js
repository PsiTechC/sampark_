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
//     const collection = db.collection("forwhatsappbolna");

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
//       const agentId = agent.id;
//       console.log(`🚀 Processing agent: ${agentId}`);

//       const existingDoc = await collection.findOne({ assistantId: agentId });

//       try {
//         const execResponse = await fetch(
//           `https://api.bolna.dev/agent/${agentId}/executions`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             },
//           }
//         );

//         if (!execResponse.ok) {
//           console.warn(`⚠️ Failed to fetch executions for agent ${agentId}`);
//           continue;
//         }

//         const executions = await execResponse.json();
//         if (!Array.isArray(executions) || executions.length === 0) {
//           console.log(`📭 No executions found for agent ${agentId}`);
//           continue;
//         }

//         for (const call of executions) {
//           const callId = call.id;

//           if (call.status !== "completed") {
//             console.log(`⏭️ Skipping call ${callId} with status ${call.status}`);
//             continue;
//           }

//           if (existingDoc?.data?.[callId]) {
//             console.log(`🔁 Already processed call ${callId} for agent ${agentId}, skipping.`);
//             continue;
//           }

//           const callPayload = {
//             id: callId,
//             assistantId: agentId,
//             transcript: call.transcript || "",
//             systemPrompt: agent.agent_prompts?.task_1?.system_prompt || "-",
//           };

//           const userPrompt = `
// You are an information extraction AI. From the following call object, extract these fields:

// - isUserAskedForBrochure: true if the user requested a brochure, PDF, or more information via WhatsApp or email, otherwise false.

// - time: extract the time mentioned by the user for a follow-up or callback **only if** it is associated with a request to talk to a human. If no such time, return null.

// - isHumanAgent: true if the user explicitly or implicitly asked to speak with a human, and also mentioned a time to be contacted.

// Respond ONLY in this strict JSON format:
// {
//   "isUserAskedForBrochure": true | false,
//   "isHumanAgent": true | false,
//   "time": "<string or null>"
// }

// Call Object:
// ${JSON.stringify(callPayload, null, 2)}
//           `.trim();

//           try {
//             const aiResponse = await openai.chat.completions.create({
//               model: "gpt-4o",
//               messages: [
//                 { role: "system", content: "You extract boolean flags and time from call objects. You must respond with a complete valid JSON object." },
//                 { role: "user", content: userPrompt },
//               ],
//               temperature: 0,
//             });

//             let rawContent = aiResponse.choices[0].message.content.trim();
//             if (rawContent.startsWith("```")) {
//               rawContent = rawContent.replace(/```(?:json)?\\s*/g, "").replace(/```$/, "").trim();
//             }

//             try {
//               if (!rawContent.startsWith("{") || !rawContent.endsWith("}")) {
//                 throw new Error("Malformed JSON response");
//               }

//               const result = JSON.parse(rawContent);

//               result.isUserAskedForBrochure = result.hasOwnProperty("isUserAskedForBrochure") ? result.isUserAskedForBrochure : false;
//               result.isHumanAgent = result.hasOwnProperty("isHumanAgent") ? result.isHumanAgent : false;
//               result.time = result.hasOwnProperty("time") ? result.time : null;

//               await collection.updateOne(
//                 { assistantId: agentId },
//                 {
//                   $set: {
//                     [`data.${callId}`]: {
//                       isUserAskedForBrochure: result.isUserAskedForBrochure,
//                       isHumanAgent: result.isHumanAgent,
//                       time: result.time,
//                     },
//                     updatedAt: new Date()
//                   }
//                 },
//                 { upsert: true }
//               );

//               console.log(`✅ Saved execution ${callId} for agent ${agentId}`);

//             } catch (jsonErr) {
//               console.error(`❌ JSON parse error for call ${callId}:`, rawContent);
//             }
//           } catch (err) {
//             console.error(`❌ OpenAI error for call ${callId}:`, err.message);
//           }
//         }
//       } catch (err) {
//         console.error(`❌ Error processing agent ${agentId}:`, err);
//       }
//     }

//     return res.status(200).json({ message: "Boolean flags extracted and stored (new only) for Bolna." });
//   } catch (error) {
//     console.error("❌ Server error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


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
//     const collection = db.collection("forwhatsappbolna");

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
//       const agentId = agent.id;
//       console.log(`🚀 Processing agent: ${agentId}`);

//       const existingDoc = await collection.findOne({ assistantId: agentId });

//       try {
//         const execResponse = await fetch(
//           `https://api.bolna.dev/agent/${agentId}/executions`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             },
//           }
//         );

//         if (!execResponse.ok) {
//           console.warn(`⚠️ Failed to fetch executions for agent ${agentId}`);
//           continue;
//         }

//         const executions = await execResponse.json();
//         if (!Array.isArray(executions) || executions.length === 0) {
//           console.log(`📭 No executions found for agent ${agentId}`);
//           continue;
//         }

//         for (const call of executions) {
//           const callId = call.id;

//           if (call.status !== "completed") {
//             // console.log(`⏭️ Skipping call ${callId} with status ${call.status}`);
//             continue;
//           }

//           if (existingDoc?.data?.[callId]) {
//             // console.log(`🔁 Already processed call ${callId} for agent ${agentId}, skipping.`);
//             continue;
//           }

//           const callPayload = {
//             id: callId,
//             assistantId: agentId,
//             transcript: call.transcript || "",
//             systemPrompt: agent.agent_prompts?.task_1?.system_prompt || "-",
//           };

//           const userPrompt = `
// You are an information extraction AI. From the following call object, extract these fields:

// - isUserAskedForBrochure: true if the user requested a brochure, PDF, or more information via WhatsApp or email, otherwise false.

// - time: extract the time mentioned by the user for a follow-up or callback **only if** it is associated with a request to talk to a human. If no such time, return null.

// - isHumanAgent: true if the user explicitly or implicitly asked to speak with a human, and also mentioned a time to be contacted.

// Respond ONLY in this strict JSON format:
// {
//   "isUserAskedForBrochure": true | false,
//   "isHumanAgent": true | false,
//   "time": "<string or null>"
// }

// Call Object:
// ${JSON.stringify(callPayload, null, 2)}
//           `.trim();

//           try {
//             const aiResponse = await openai.chat.completions.create({
//               model: "gpt-4o",
//               messages: [
//                 {
//                   role: "system",
//                   content:
//                     "You extract boolean flags and time from call objects. You must respond with a complete valid JSON object.",
//                 },
//                 { role: "user", content: userPrompt },
//               ],
//               temperature: 0,
//             });

//             let rawContent = aiResponse.choices[0].message.content.trim();

//             // ✅ Fixed regex for stripping code blocks
//             rawContent = rawContent
//               .replace(/^```(?:json)?\s*/i, "")
//               .replace(/```$/, "")
//               .trim();

//             try {
//               if (!rawContent.startsWith("{") || !rawContent.endsWith("}")) {
//                 throw new Error("Malformed JSON response");
//               }

//               const result = JSON.parse(rawContent);

//               result.isUserAskedForBrochure =
//                 result.hasOwnProperty("isUserAskedForBrochure")
//                   ? result.isUserAskedForBrochure
//                   : false;
//               result.isHumanAgent = result.hasOwnProperty("isHumanAgent")
//                 ? result.isHumanAgent
//                 : false;
//               result.time = result.hasOwnProperty("time") ? result.time : null;

//               await collection.updateOne(
//                 { assistantId: agentId },
//                 {
//                   $set: {
//                     [`data.${callId}`]: {
//                       isUserAskedForBrochure: result.isUserAskedForBrochure,
//                       isHumanAgent: result.isHumanAgent,
//                       time: result.time,
//                     },
//                     updatedAt: new Date(),
//                   },
//                 },
//                 { upsert: true }
//               );

//               console.log(`✅ Saved execution ${callId} for agent ${agentId}`);
//             } catch (jsonErr) {
//               console.error(`❌ JSON parse error for call ${callId}:`, rawContent);
//             }
//           } catch (err) {
//             console.error(`❌ OpenAI error for call ${callId}:`, err.message);
//           }
//         }
//       } catch (err) {
//         console.error(`❌ Error processing agent ${agentId}:`, err);
//       }
//     }

//     return res.status(200).json({
//       message: "Boolean flags extracted and stored (new only) for Bolna.",
//     });
//   } catch (error) {
//     console.error("❌ Server error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
