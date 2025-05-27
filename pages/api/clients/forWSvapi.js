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
    const whatsappCollection = db.collection("forwhatsapp");

    const assistantsRes = await fetch("https://api.vapi.ai/assistant", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
      },
    });

    if (!assistantsRes.ok) {
      console.error("❌ Failed to fetch assistants:", assistantsRes.statusText);
      return res.status(500).json({ message: "Failed to fetch assistants" });
    }

    const assistants = await assistantsRes.json();

    for (const assistant of assistants) {
      const assistantId = assistant.id;

      const existingDoc = await whatsappCollection.findOne({ assistantId });

      try {
        const callsRes = await fetch(
          `https://api.vapi.ai/call?assistantId=${assistantId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
            },
          }
        );

        if (!callsRes.ok) {
          console.warn(`⚠️ Failed to fetch calls for assistant ${assistantId}`);
          continue;
        }

        const calls = await callsRes.json();

        for (const call of calls) {
          const callId = call.id;

          if (call.status !== "ended") continue;
          if (existingDoc?.data?.[callId]) {
            console.log(`⏭️ Skipping already processed call: ${callId}`);
            continue;
          }
          if (!call.transcript || call.transcript.trim() === "") {
            console.log(`⏭️ Skipping call with empty transcript: ${callId}`);
            continue;
          }

          const callPayload = {
            id: callId || "-",
            assistantId: assistantId || "-",
            transcript: call.transcript || "",
            systemPrompt:
              call.artifact?.messages?.find((msg) => msg.role === "system")
                ?.message || "-",
          };

          const userPrompt = `
You are an information extraction AI. From the following call object, extract these fields:

- isUserAskedForBrochure: true if the user requested a brochure, PDF, or more information via WhatsApp or email (e.g., "Can you send me a brochure?", "Send me the project PDF"), otherwise false.

- time: extract the time mentioned by the user for a follow-up or callback **only if** it is associated with a request to talk to a human (e.g., "Can someone call me tomorrow at 10 AM?", "Connect me to sales in 15 minutes"). If no such time is mentioned, return null.

- isHumanAgent: true if the user explicitly or implicitly asked to speak with a human, and also mentioned a time to be contacted (e.g., "call me tomorrow", "connect me to sales after 5 PM").

Respond ONLY in this strict JSON format:
{
  "isUserAskedForBrochure": true | false,
  "isHumanAgent": true | false,
  "time": "<string or null>"
}

Call Object:
${JSON.stringify(callPayload, null, 2)}
          `.trim();

          try {
            const aiResponse = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content:
                    "You extract boolean flags and time from call objects. Only mark isHumanAgent true if a time for follow-up is explicitly mentioned by the user. Return only a valid JSON object.",
                },
                {
                  role: "user",
                  content: userPrompt,
                },
              ],
              temperature: 0,
            });

            let rawContent = aiResponse.choices[0].message.content?.trim() || "";

            // Clean up code block fencing
            rawContent = rawContent
              .replace(/^```(?:json)?\s*/i, "")
              .replace(/```$/, "")
              .trim();

            let result = null;
            try {
              if (!rawContent.startsWith("{") || !rawContent.endsWith("}")) {
                throw new Error("Malformed JSON response");
              }

              result = JSON.parse(rawContent);
              result.isUserAskedForBrochure =
                result.hasOwnProperty("isUserAskedForBrochure") ? result.isUserAskedForBrochure : false;
              result.isHumanAgent =
                result.hasOwnProperty("isHumanAgent") ? result.isHumanAgent : false;
              result.time =
                result.hasOwnProperty("time") ? result.time : null;

              console.log("📌 Brochure:", result.isUserAskedForBrochure);
              console.log("📌 Human Agent:", result.isHumanAgent);
              console.log("📌 Time:", result.time);

              await whatsappCollection.updateOne(
                { assistantId },
                {
                  $set: {
                    [`data.${callId}`]: {
                      isUserAskedForBrochure: result.isUserAskedForBrochure,
                      isHumanAgent: result.isHumanAgent,
                      time: result.time,
                    },
                    updatedAt: new Date(),
                  },
                },
                { upsert: true }
              );
            } catch (jsonErr) {
              console.error(`❌ JSON parse error for call ${callId}. Raw content: "${rawContent}"`);
              if (!rawContent || rawContent.length < 5) {
                console.warn(`⚠️ Empty or invalid response from OpenAI for call ${callId}:`, rawContent);
                continue;
              }
              
            }
          } catch (err) {
            console.error(`❌ OpenAI error for call ${callId}:`, err.message);
          }
        }
      } catch (err) {
        console.error(`❌ Error fetching calls for assistant ${assistantId}:`, err);
      }
    }

    return res.status(200).json({ message: "Boolean flags extracted and stored (new only)." });
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
