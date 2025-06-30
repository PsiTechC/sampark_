
// import OpenAI from "openai";
// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";
// import { getCachedCallIds, cacheCallId } from "../../../lib/node-cache";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// function cleanEmail(email) {
//   return email
//     .replace(/\s+/g, '')
//     .replace(/\s?dot\s?/gi, '.')
//     .replace(/\s?at\s?/gi, '@');
// }

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   await CorsMiddleware(req, res);

//   try {
//     const { db } = await connectToDatabase();
//     const collection = db.collection("userdatafromcallwithsentiment");

//     const assistantsRes = await fetch("https://api.vapi.ai/assistant", {
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//       },
//     });

//     if (!assistantsRes.ok) {
//       console.error("❌ Failed to fetch assistants:", assistantsRes.statusText);
//       return res.status(500).json({ message: "Failed to fetch assistants" });
//     }

//     const assistants = await assistantsRes.json();

//     for (const assistant of assistants) {
//       const assistantId = assistant.id;
//       const cachedCallIds = await getCachedCallIds(assistantId);

//       try {
//         const callsRes = await fetch(
//           `https://api.vapi.ai/call?assistantId=${assistantId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//             },
//           }
//         );

//         if (!callsRes.ok) {
//           console.warn(`⚠️ Failed to fetch calls for assistant ${assistantId}`);
//           continue;
//         }

//         const calls = await callsRes.json();
//         const existingDoc = await collection.findOne({ assistantId });

//         for (const call of calls) {
//           const callId = call.id;

//           if (call.status !== "ended") {
//             // console.log(`⏭️ Skipping call ${callId} with status: ${call.status}`);
//             continue;
//           }

//           if (cachedCallIds.has(callId)) {
//             // console.log(`⏭️ Skipping already cached call: ${callId}`);
//             continue;
//           }

//           if (existingDoc?.data?.[callId]) {
//             // console.log(`⏭️ Skipping already processed call: ${callId}`);
//             await cacheCallId(assistantId, callId);
//             continue;
//           }

//           const callPayload = {
//             id: callId || "-",
//             assistantId: assistantId || "-",
//             transcript: call.transcript || "",
//             systemPrompt:
//               call.artifact?.messages?.find((msg) => msg.role === "system")?.message || "-",
//           };

//           const userPrompt = `
//           You are an information extraction AI. From the following call object, extract these fields:

//           - assistantId: the assistant ID
//           - id: the call ID
//           - name: the user's full name (just the name of the customer NOT THE AI ASSISTANT NAME)
//           - email: a valid email address. If the user spells it (e.g. "a dot b at g m a i l dot com"), convert it into a proper format like "ab@gmail.com". Do NOT return email with dots between each character (e.g. "a.b.c.d").
//           - phone: convert spoken formats like "nine one triple eight" or "nine one three one double eight" into digits, like "9188" or "913188". Remove spaces, and return only digits. Do NOT return masked values like "9131XXX".
//           - appointmentDate: if the user mentions a date and time for a meeting or appointment, return them both in a single string (e.g., "13 April at 5 PM" or "2025-04-13 17:00"). If multiple dates/times are mentioned, return only the **last one** mentioned.
//           - purpose: the purpose of the meeting or call, if mentioned (e.g. "site visit", "demo discussion")
//           - budget: extract the user's budget if mentioned.
//             - a total budget (e.g., "up to 1.5 crore", "budget is 70 lakhs", "around 2 crores")
//             - a per-unit price (e.g., "15000 per square feet", "12000 per square yard")
//             - If the user mentions a **currency**, include it (e.g., "USD", "INR", "rupees", "dollars")
//             - Return the exact phrase spoken by the user, cleaned of extra words. If both total and per-unit values are mentioned, include both (e.g., "Budget is ₹1.5 crore or ₹15,000 per sq ft")
//           - timeline: if the user shares a timeline to buy (e.g., "within 2 months", "after 6 months", "next year"), extract that
//           - sentiment: classify sentiment based on the conversation and the assistant's system prompt. Use:
//             - positive
//             - negative
//             - neutral
//             - no_response (if the transcription is empty or lacks meaningful content)
//           If any field is missing, use "-" for that field.

//           Respond ONLY in this strict JSON format:
//           {
//             "assistantId": "<assistant_id_or_->_",
//             "id": "<call_id_or_->_",
//             "name": "<name_or_->_",
//             "email": "<email_or_->_",
//             "phone": "<phone_or_->_",
//             "appointmentDate": "<date_and_time_or_->_",
//             "purpose": "<purpose_or_->_",
//             "budget": "<budget_or_->_",
//             "timeline": "<timeline_or_->_",
//             "sentiment": "positive" | "negative" | "neutral" | "no_response"
//           }

//           Call Object:
// ${JSON.stringify(callPayload, null, 2)}
//           `.trim();

//           try {
//             const aiResponse = await openai.chat.completions.create({
//               model: "gpt-3.5-turbo",
//               messages: [
//                 {
//                   role: "system",
//                   content: "You extract structured data from call objects.",
//                 },
//                 {
//                   role: "user",
//                   content: userPrompt,
//                 },
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
//             result.email = result.email !== "-" ? cleanEmail(result.email) : "-";

//             console.log("📤 Cleaned Extracted Info:", result);

//             await collection.updateOne(
//               { assistantId: result.assistantId },
//               {
//                 $set: {
//                   [`data.${result.id}`]: {
//                     name: result.name,
//                     email: result.email,
//                     phone: result.phone,
//                     appointmentDate: result.appointmentDate,
//                     purpose: result.purpose,
//                     budget: result.budget,
//                     timeline: result.timeline,
//                     sentiment: result.sentiment,
//                   },
//                   updatedAt: new Date(),
//                 },
//               },
//               { upsert: true }
//             );

//             await cacheCallId(result.assistantId, result.id);
//           } catch (err) {
//             console.error(`❌ OpenAI error for call ${callId}:`, err.message);
//           }
//         }
//       } catch (err) {
//         console.error(`❌ Error fetching calls for assistant ${assistantId}:`, err);
//       }
//     }

//     return res.status(200).json({ message: "User info extracted, new entries processed only." });
//   } catch (error) {
//     console.error("❌ Server error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
