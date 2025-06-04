// import OpenAI from "openai";
// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });



// function cleanEmail(email) {
//   return email
//     .replace(/\s+/g, '') // remove spaces
//     .replace(/\s?dot\s?/gi, '.')
//     .replace(/\s?at\s?/gi, '@');
// }

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   await CorsMiddleware(req, res);
//   const today = new Date().toISOString();
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

//         // Fetch existing document once per assistant
//         const existingDoc = await collection.findOne({ assistantId });

//         for (const call of calls) {
//           const callId = call.id;

//           const userPhoneNumber = call.customer?.number || "-";

//           if (call.status !== "ended") {
//             // console.log(`⏭️ Skipping call ${callId} with status: ${call.status}`);
//             continue;
//           }
//           // Skip if this callId already exists
//           if (existingDoc?.data?.[callId]) {
//             // console.log(`⏭️ Skipping already processed call: ${callId}`);
//             continue;
//           }

//           const callPayload = {
//             id: callId || "-",
//             assistantId: assistantId || "-",
//             transcript: call.transcript || "",
//             summary: call.summary || "-",
//             systemPrompt: call.artifact?.messages?.find((msg) => msg.role === "system")?.message || "-",
//           };

//           const userPrompt = `
//           You are an information extraction AI. From the following call object, extract these fields:

//           - assistantId: the assistant ID
//           - id: the call ID
//           - name: the user's full name (just the name of the customer NOT THE AI ASSISTANT NAME)
//           - email: a valid email address. If the user spells it (e.g., "a dot b at g m a i l dot com"), convert it into a proper format like "ab@gmail.com". Users may also say their email in parts, such as: "My email address is s a n k e t double k, a p, double o, r 0 7 at Gmail dot com." Make sure to correctly interpret "double" as repeating the following letter (e.g., "double k" → "kk"). Do NOT return email addresses with dots between each character (e.g., "a.b.c.d").
//           - phone: convert spoken formats like "nine one triple eight" or "nine one three one double eight" into digits, like "9188" or "913188". Remove spaces, and return only digits. Do NOT return masked values like "9131XXX".
//           - appointmentDate: if the user mentions a date and time for a meeting or appointment, return it in full ISO 8601 format, e.g., "2025-07-05T15:00:00+05:30".
//                If the user says things like:
//                - "Call me in 30 minutes"
//                - "Book an appointment after 1 hour"
//                - "Connect me tomorrow at 3 PM"

//               Then calculate the exact datetime from the current moment: **${today}** (ISO format). Assume:
//                - "30 minutes from now" → current time + 30 minutes
//                - "after 1 hour" → current time + 1 hour
//                - "tomorrow at 3 PM" → next day at 15:00 local time
//                - If only a vague future intent is mentioned like "later" or "after lunch", return "-"

//                - If the user explicitly mentions a **date and time in the past** (compared to today's datetime of **${today}**), do **not** return that past value. Instead, set:
//                "appointmentDate": "user asked for past date"

//           - timezone: the IANA time zone string if the user mentions a timezone like Pacific, Mountain, Central, Indian, or any other common reference. Also infer the timezone if a country or city is mentioned. Examples:
//             - PST or Pacific → "America/Los_Angeles"
//             - IST or Indian → "Asia/Kolkata"
//             - EST or Eastern → "America/New_York"
//             - CET or Central European → "Europe/Berlin"
//             - If instead the user mentions a country (e.g., India, USA, Germany) or a city (e.g., New York, Berlin, Mumbai), determine the corresponding timezone and return the appropriate IANA name as above.
//             If no timezone is mentioned, return "Asia/Kolkata".

//           Today's date is: ${today}
//           - If no year is mentioned, assume the upcoming date in the current year (${today.split("-")[0]}).
//           - If a past year is mentioned (e.g., 2023), correct it to the current year.
//           - If the year is in the future (e.g., 2026), preserve it as is.

//           - purpose: the purpose of the meeting or call, if mentioned (e.g. "site visit", "demo discussion")
//           - sentiment: classify sentiment based on the conversation and the assistant's system prompt. Use:
//             - positive
//             - negative           
//             - neutral 
//             - no_response (if the transcription is empty or lacks meaningful content)

//           If any field is missing, use "-" for that field.

//           - Additionally, list any direct questions asked by the user that remained unanswered in the transcript.
//   Respond with a second JSON object like:

//   {
//     "unansweredQuestions": [
//       "Q1. What is the price of the flat?",
//       "Q2. Can you send me a brochure?"
//     ]
//   }

//   If there are no such questions, respond with:
//   {
//     "unansweredQuestions": []
//   }

// Return both JSON objects (the extracted call info and unansweredQuestions) one after the other, separated by a newline.


//           Respond ONLY in this strict JSON format:
//           {
//             "assistantId": "<assistant_id_or_->",
//             "id": "<call_id_or_->",
//             "name": "<name_or_->",
//             "email": "<email_or_->",
//             "phone": "<phone_or_->",
//             "appointmentDate": "<date_and_time_or_->",
//             "timezone": "<IANA_zone_or_->",
//             "purpose": "<purpose_or_->",
//             "sentiment": "positive" | "negative" | "neutral" | "no_response"
//           }


//           Call Object:
//           ${JSON.stringify(callPayload, null, 2)}
//           `.trim();


//           try {
//             const aiResponse = await openai.chat.completions.create({
//               model: "gpt-4o",
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

//             const durationInSeconds = call.startedAt && call.endedAt
//               ? (new Date(call.endedAt) - new Date(call.startedAt)) / 1000
//               : 0;
//             await collection.updateOne(
//               { assistantId: result.assistantId },
//               {
//                 $set: {
//                   [`data.${result.id}`]: {
//                     name: result.name,
//                     email: result.email,
//                     phone: result.phone,
//                     appointmentDate: result.appointmentDate,
//                     timezone: result.timezone || "-",
//                     purpose: result.purpose,
//                     sentiment: result.sentiment,
//                     summary: call.summary || "-",
//                     customerNumber: userPhoneNumber,
//                     duration: parseFloat(durationInSeconds.toFixed(2))
//                   },
//                   updatedAt: new Date(),
//                 },
//               },
//               { upsert: true }
//             );
//           } catch (err) {
//             console.error(`❌ OpenAI error for call ${callId}:`, err.message);
//           }
//         }
//       } catch (err) {
//         console.error(`❌ Error fetching calls for assistant ${assistantId}:`, err);
//       }
//     }

//     return res
//       .status(200)
//       .json({ message: "User info extracted, new entries processed only." });
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



function cleanEmail(email) {
  return email
    .replace(/\s+/g, '') // remove spaces
    .replace(/\s?dot\s?/gi, '.')
    .replace(/\s?at\s?/gi, '@');
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await CorsMiddleware(req, res);
  const today = new Date().toISOString();
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("userdatafromcallwithsentiment");

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

        // Fetch existing document once per assistant
        const existingDoc = await collection.findOne({ assistantId });

        for (const call of calls) {
          const callId = call.id;

          const userPhoneNumber = call.customer?.number || "-";

          if (call.status !== "ended") {
            // console.log(`⏭️ Skipping call ${callId} with status: ${call.status}`);
            continue;
          }
          // Skip if this callId already exists
          if (existingDoc?.data?.[callId]) {
            // console.log(`⏭️ Skipping already processed call: ${callId}`);
            continue;
          }

          const callPayload = {
            id: callId || "-",
            assistantId: assistantId || "-",
            transcript: call.transcript || "",
            summary: call.summary || "-",
            systemPrompt: call.artifact?.messages?.find((msg) => msg.role === "system")?.message || "-",
          };

          const userPrompt = `
          You are an information extraction AI. From the following call object, extract these fields:
          
          - assistantId: the assistant ID
          - id: the call ID
          - name: the user's full name (just the name of the customer NOT THE AI ASSISTANT NAME)
          - email: a valid email address. If the user spells it (e.g., "a dot b at g m a i l dot com"), convert it into a proper format like "ab@gmail.com". Users may also say their email in parts, such as: "My email address is s a n k e t double k, a p, double o, r 0 7 at Gmail dot com." Make sure to correctly interpret "double" as repeating the following letter (e.g., "double k" → "kk"). Do NOT return email addresses with dots between each character (e.g., "a.b.c.d").
          - phone: convert spoken formats like "nine one triple eight" or "nine one three one double eight" into digits, like "9188" or "913188". Remove spaces, and return only digits. Do NOT return masked values like "9131XXX".
          - appointmentDate: if the user mentions a date and time for a meeting or appointment, return it in full ISO 8601 format, e.g., "2025-07-05T15:00:00+05:30".
               If the user says things like:
               - "Call me in 30 minutes"
               - "Book an appointment after 1 hour"
               - "Connect me tomorrow at 3 PM"
        
              Then calculate the exact datetime from the current moment: **${today}** (ISO format). Assume:
               - "30 minutes from now" → current time + 30 minutes
               - "after 1 hour" → current time + 1 hour
               - "tomorrow at 3 PM" → next day at 15:00 local time
               - If only a vague future intent is mentioned like "later" or "after lunch", return "-"

               - If the user explicitly mentions a **date and time in the past** (compared to today's datetime of **${today}**), do **not** return that past value. Instead, set:
               "appointmentDate": "user asked for past date"
               
          - timezone: the IANA time zone string if the user mentions a timezone like Pacific, Mountain, Central, Indian, or any other common reference. Also infer the timezone if a country or city is mentioned. Examples:
            - PST or Pacific → "America/Los_Angeles"
            - IST or Indian → "Asia/Kolkata"
            - EST or Eastern → "America/New_York"
            - CET or Central European → "Europe/Berlin"
            - If instead the user mentions a country (e.g., India, USA, Germany) or a city (e.g., New York, Berlin, Mumbai), determine the corresponding timezone and return the appropriate IANA name as above.
            If no timezone is mentioned, return "Asia/Kolkata".
          
          Today's date is: ${today}
          - If no year is mentioned, assume the upcoming date in the current year (${today.split("-")[0]}).
          - If a past year is mentioned (e.g., 2023), correct it to the current year.
          - If the year is in the future (e.g., 2026), preserve it as is.
          
          - purpose: the purpose of the meeting or call, if mentioned (e.g. "site visit", "demo discussion")
          - sentiment: classify sentiment based on the conversation and the assistant's system prompt. Use:
            - positive
            - negative           
            - neutral 
            - no_response (if the transcription is empty or lacks meaningful content)
          
          If any field is missing, use "-" for that field.

          - Additionally, identify any questions the user asked that were not clearly answered by the assistant.
             Respond with a second JSON object like:
 
             {
               "unansweredQuestions": [
               "Q1. What is the price of the flat?",
               "Q2. Can you send me a brochure?"
               ]
             }

            If there are no such questions, respond with:
            {
             "unansweredQuestions": []
            }

            Return both JSON objects (the extracted call info and unansweredQuestions) one after the other, separated by a newline.

          
          Respond ONLY in this strict JSON format:
          {
            "assistantId": "<assistant_id_or_->",
            "id": "<call_id_or_->",
            "name": "<name_or_->",
            "email": "<email_or_->",
            "phone": "<phone_or_->",
            "appointmentDate": "<date_and_time_or_->",
            "timezone": "<IANA_zone_or_->",
            "purpose": "<purpose_or_->",
            "sentiment": "positive" | "negative" | "neutral" | "no_response"
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
                  content: "You extract structured data from call objects.",
                },
                {
                  role: "user",
                  content: userPrompt,
                },
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

            const jsonMatches = [...rawContent.matchAll(/\{[\s\S]*?\}/g)];

            if (jsonMatches.length === 0) {
              console.error(`❌ No valid JSON objects found in OpenAI response for call ${callId}`);
              return res.status(500).json({ message: "Failed to parse OpenAI response" });
            }
            
            const resultJson = jsonMatches[0][0];
            const questionsJson = jsonMatches[1] ? jsonMatches[1][0] : null;
            

            let result, unansweredQuestions;

            try {
              result = JSON.parse(resultJson);
              result.email = result.email !== "-" ? cleanEmail(result.email) : "-";
            } catch (err) {
              console.error(`❌ Failed to parse structured result JSON for call ${callId}:`, err.message);
              return;
            }
            
            try {
              unansweredQuestions = JSON.parse(questionsJson)?.unansweredQuestions || [];
            } catch (err) {
              unansweredQuestions = [];
              console.warn(`⚠️ Failed to parse unansweredQuestions JSON for call ${callId}`);
            }
            

            result.email = result.email !== "-" ? cleanEmail(result.email) : "-";

            console.log("📤 Cleaned Extracted Info:", result);

            const durationInSeconds = call.startedAt && call.endedAt
              ? (new Date(call.endedAt) - new Date(call.startedAt)) / 1000
              : 0;
            await collection.updateOne(
              { assistantId: result.assistantId },
              {
                $set: {
                  [`data.${result.id}`]: {
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    appointmentDate: result.appointmentDate,
                    timezone: result.timezone || "-",
                    purpose: result.purpose,
                    sentiment: result.sentiment,
                    summary: call.summary || "-",
                    customerNumber: userPhoneNumber,
                    duration: parseFloat(durationInSeconds.toFixed(2))
                  },
                  updatedAt: new Date(),
                },
              },
              { upsert: true }
            );
            if (unansweredQuestions.length > 0) {
              const userQuestionsCollection = db.collection("user_unanswered_ques");

              await userQuestionsCollection.updateOne(
                { assistantId: result.assistantId },
                {
                  $set: {
                    [`data.${result.id}`]: {
                      questions: unansweredQuestions,
                      updatedAt: new Date()
                    }
                  }
                },
                { upsert: true }
              );

              console.log(`❓ Saved ${unansweredQuestions.length} unanswered questions for call ${result.id}`);
              console.log("📦 Unanswered Questions Data:", {
                assistantId: result.assistantId,
                callId: result.id,
                questions: unansweredQuestions
              });
            }

          } catch (err) {
            console.error(`❌ OpenAI error for call ${callId}:`, err.message);
          }
        }
      } catch (err) {
        console.error(`❌ Error fetching calls for assistant ${assistantId}:`, err);
      }
    }

    return res
      .status(200)
      .json({ message: "User info extracted, new entries processed only." });
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
