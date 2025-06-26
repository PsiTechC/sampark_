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
            // console.log(`⏭️ Skipping already processed call: ${callId}`);
            continue;
          }
          if (!call.transcript || call.transcript.trim() === "") {
            // console.log(`⏭️ Skipping call with empty transcript: ${callId}`);
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

- isUserAskedForBrochure: true if the user requested a brochure, PDF, or more information via WhatsApp or email (e.g., "Can you send me a brochure?", "Send me the project PDF", "Is there any document you can send me related to this project?", "send me document of this project"), otherwise false.

Respond ONLY in this strict JSON format:
{
  "isUserAskedForBrochure": true | false,
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
                    "You extract boolean flags from call objects. Only mark isUserAskedForBrochure true if if the user requested a brochure. Return only a valid JSON object.",
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

              console.log("📌 Brochure:", result.isUserAskedForBrochure);

              await whatsappCollection.updateOne(
                { assistantId },
                {
                  $set: {
                    [`data.${callId}`]: {
                      isUserAskedForBrochure: result.isUserAskedForBrochure,
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
