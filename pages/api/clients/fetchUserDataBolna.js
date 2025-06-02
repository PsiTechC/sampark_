

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

//         // ✅ Get existing document
//         const existingDoc = await db.collection("bolnauserdatafromcall").findOne(
//           { assistantId: agent.id },
//           { projection: { _id: 0 } }
//         );

//         const existingIds = new Set(
//           existingDoc ? Object.keys(existingDoc.data || {}) : []
//         );

//         const newData = {};

//         const systemPrompt =
//           agent.agent_prompts?.task_1?.system_prompt ||
//           "You are a sentiment analysis tool.";

//         for (const call of executions) {
//           if (existingIds.has(call.id)) {
//             // console.log(`🔁 Skipping already processed execution: ${call.id}`);
//             continue;
//           }

//           if (call.status !== "completed") {
//             // console.log(`⏭️ Skipping execution ${call.id} because status is not 'completed' (status: ${call.status})`);
//             continue;
//           }
          
//           const transcript = call.transcript || "";

//           const userPrompt = `
//           You are an information extraction AI. From the following call object, extract these fields:

//           - name: the user's full name (just the name of the customer NOT THE AI ASSISTANT NAME)
//           - email: a valid email address. If the user spells it (e.g. "a dot b at gmail dot com"), convert it into a proper format like "ab@gmail.com". Do NOT return email with dots between each character (e.g. "a.b.c.d").
//           - phone: convert spoken formats like "nine one triple eight" or "nine one three one double eight" into digits, like "9188" or "913188". Remove spaces, and return only digits. Do NOT return masked values like "9131XXX".
//           - appointmentDate: if the user mentions a date and time for a meeting or appointment, return them both in a single string (e.g., "13 April at 5 PM" or "2025-04-13 17:00"). If multiple dates/times are mentioned, return only the **last one** mentioned.
//           - purpose: the purpose of the meeting or call, if mentioned (e.g., "site visit", "demo discussion")
          
//           - budget: extract the user's budget if mentioned. This can be:
//           - a total budget (e.g., "up to 1.5 crore", "budget is 70 lakhs", "around 2 crores")
//           - a per-unit price (e.g., "15000 per square feet", "12000 per square yard")
//           - If the user mentions a **currency**, include it (e.g., "USD", "INR", "rupees", "dollars")
//           - Return the exact phrase spoken by the user, cleaned of extra words. If both total and per-unit values are mentioned, include both (e.g., "Budget is ₹1.5 crore or ₹15,000 per sq ft")

//           - timeline: if the user shares a timeline to buy (e.g., "within 2 months", "after 6 months", "next year"), extract that 
//           - sentiment: classify sentiment based on the conversation and the assistant's system prompt. Use:
//             - positive
//             - negative
//             - neutral
//             - no_response (if the transcription is empty or lacks meaningful content)

//           If any field is missing, use "-" for that field.

//           Respond ONLY in this strict JSON format:
//           {
//             "name": "<name_or_->",
//             "email": "<email_or_->",
//             "phone": "<phone_or_->",
//             "appointmentDate": "<date_and_time_or_->",
//             "purpose": "<purpose_or_->",
//             "budget": "<budget_or_->",
//             "timeline": "<timeline_or_->",
//             "sentiment": "positive" | "negative" | "neutral" | "no_response"
//           }

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

//             newData[call.id] = {
//               name: result.name,
//               email: result.email,
//               phone: result.phone,
//               appointmentDate: result.appointmentDate,
//               purpose: result.purpose,
//               budget: result.budget,             
//               timeline: result.timeline,  
//               sentiment: result.sentiment,
//             };

//             console.log(`🧠 Agent ${agent.id} | Execution ${call.id} → Extracted`, result);

//           } catch (err) {
//             console.error(`❌ OpenAI error for execution ${call.id}:`, err.message);
//           }
//         }

//         if (Object.keys(newData).length > 0) {
//           console.log(`💾 Saving ${Object.keys(newData).length} new entries for agent ${agent.id}`);

//           await db.collection("bolnauserdatafromcall").updateOne(
//             { assistantId: agent.id },
//             {
//               $setOnInsert: { created_at: new Date(), assistantId: agent.id },
//               $set: Object.entries(newData).reduce((acc, [callId, callData]) => {
//                 acc[`data.${callId}`] = callData;
//                 return acc;
//               }, {}),
//               $currentDate: { updated_at: true },
//             },
//             { upsert: true }
//           );
//         } else {
//           console.log(`📭 No new executions to save for agent ${agent.id}`);
//         }
//       } catch (err) {
//         console.error(`❌ Error processing agent ${agent.id}:`, err);
//       }
//     }

//     return res.status(200).json({ message: "New data saved successfully in 'bolnauserdatafromcall' collection" });
//   } catch (error) {
//     console.error("❌ Server error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
