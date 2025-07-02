import OpenAI from "openai";
import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import { DateTime } from "luxon";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



function cleanEmail(email) {
  return email
    .replace(/\s+/g, '') // remove spaces
    .replace(/\s?dot\s?/gi, '.')
    .replace(/\s?at\s?/gi, '@');
}

async function getUserTimezoneFromTranscript(transcript, customerNumber) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const timezonePrompt = `
From the following call transcript, extract the **user's CURRENT timezone** in IANA format (e.g., "Asia/Kolkata", "America/New_York", "Pacific/Honolulu").

The user might:
- Directly state the timezone (e.g., "I'm in IST", "Eastern Time", "PST").
- Mention a **city** they live in (e.g., "I'm in Berlin", "based in Bangalore").
- Say something ambiguous like "I was in Germany last week, but I live in India now." — in such cases, use the **location they currently live in or are speaking from**.
- Be vague — if no timezone, country or city is clearly mentioned, default to "Asia/Kolkata".
- If the transcript provides **no timezone, city, or country**, then infer timezone from the following phone number's country code:- Customer phone number: **${customerNumber}**


DO NOT guess based on company or AI assistant location. Only use **what the user says**.

Return only the result in this JSON format:
{
  "timezone": "IANA string"
}

Transcript:
${transcript}
`.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a timezone detection assistant."
        },
        {
          role: "user",
          content: timezonePrompt
        }
      ],
      temperature: 0,
    });

    const content = response.choices[0].message.content.trim();
    console.log("🧾 OpenAI timezone response raw content:", content);


    try {
      // Try direct JSON parsing first
      const directJson = JSON.parse(content);
      if (directJson.timezone) return directJson.timezone;
    } catch { }

    try {
      // If wrapped in code block or extra text, extract JSON substring
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const fallbackJson = JSON.parse(jsonMatch[0]);
        return fallbackJson.timezone || "Asia/Kolkata";
      }
    } catch { }

    console.warn("⚠️ OpenAI response did not contain valid timezone JSON, defaulting.");
    return "Asia/Kolkata";


  } catch (err) {
    console.warn("⚠️ Failed to get timezone from transcript, defaulting to Asia/Kolkata");
    return "Asia/Kolkata";
  }

}


export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await CorsMiddleware(req, res);

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


          const callSystemPrompt = call.artifact?.messages?.find((msg) => msg.role === "system")?.message || "-";

          const userTimeZone = await getUserTimezoneFromTranscript(call.transcript || "");
          const today = DateTime.now().setZone(userTimeZone).toISO();

          console.log(`🌍 Timezone detected for call ${callId}: ${userTimeZone}`);
          const readableToday = DateTime.fromISO(today).setZone(userTimeZone).toFormat("cccc, d LLLL yyyy, hh:mm a");
          console.log(`🕒 Local 'today' for call ${callId}: ${readableToday} (${userTimeZone})`);

          // console.log(`🧾 Call ${call.id} sample keys:`, Object.keys(call));
          // console.log(`💲 Cost for call ${call.id}:`, call.cost);


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

          - appointmentDate: if the user **explicitly mentions a meeting or appointment**, extract the date and time in ISO 8601 format (e.g., "2025-07-05T15:00:00+05:30").

           Examples that qualify:
           - "Book an appointment after 1 hour"
           - "Schedule a demo at 3 PM tomorrow"
           - "Can we meet on July 5th at 2 PM?"
        
           Do not extract appointmentDate for call-back phrases like "call me", "ping me", "give me a ring" etc.
        
          If the user mentions a date/time in the past compared to: **${today}**, then return:
          "appointmentDate": "user asked for past date"
        
          If no such future meeting/appointment is clearly mentioned, return "-"
        
        - callTime: if the user says **call me**, **ping me**, or anything suggesting a callback rather than a formal appointment, return the inferred datetime in ISO 8601.
        
           Examples that qualify:
           - "Call me in 30 minutes"
           - "Call me in 10 minutes"
           - "Ping me after 1 hour"
           - "Give me a call tomorrow at 3 PM"
        
           Use current reference time: **${today}**
           IMPORTANT:-
           - If the user says "later", "after lunch", or similar vague phrases, return "-".
           - If the user mentions a time or date that is in the **past compared to today (${today})**, then also return: 
             "callTime": "-"
               
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
            If the conversation involves property, real estate, apartments, houses, or similar interests — and the user mentions a budget, include that in the purpose.
            Examples: "property interest with budget 1cr", "real estate inquiry, budget $500K", "interested in flat, budget range 80L–1cr"

            ✔ Include budgets if:
             The user directly states a budget (e.g., "my budget is 1.5cr", "I'm looking under $700,000")
             The AI suggests a budget range and the user confirms (e.g., AI: "Is your budget 1–2cr?" → User: "Yes, that’s right")
             The user says something like "my maximum is 90L", or "can't go beyond 70 lakhs"
             ⚠️ Only include user-confirmed budgets. Do not include ranges suggested by the AI unless the user clearly agrees.

            If the user says the currency (e.g., INR, USD, rupees, lakhs, crores, dollars), include it. If not, just include the number (e.g., "budget 1cr").

            ❌ Do not include budget if:
             It was only suggested by the AI and never agreed to by the user
             The user says they’re unsure or gives vague replies like “I’ll decide later” or “not sure”

          - sentiment: classify sentiment based on the conversation and the assistant's system prompt. Use:
            - positive
            - negative           
            - neutral 
            - no_response (if the transcription is empty or lacks meaningful content)
          
          If any field is missing, use "-" for that field.

          - Additionally, identify any questions the **human user** asked that were **not fully or clearly answered** by the assistant. You are detecting *unanswered or unresolved questions*.

             A question is considered **unanswered** if:
               - The assistant explicitly ignores the question.
               - The assistant replies with a vague or evasive response (e.g., "I'll get back to you", "Let me check", "I'm not sure").
               - The assistant misunderstands the question or provides an unrelated answer.
               - The assistant deflects (e.g., “please visit our website” without actually answering).
               - The assistant provides a response that does not actually resolve the user’s query (e.g., giving a partial or indirect answer to a specific question).
               - The assistant repeats back the question without progressing toward an answer.
               - The assistant misunderstands and answers a different question.
               - The assistant goes off-topic or delivers marketing fluff instead of answering the actual question.

             A question is **not** considered unanswered if:
              - The assistant provides a reasonably complete and direct response to the question.
              - The question is rhetorical, sarcastic, or not meant to be answered.
              - The assistant gives clear steps or explanations that address the question's intent.
              - The user rephrases or answers their own question.
  
            ❗Be strict: do not include questions that were even *partially* addressed, unless it is clear the user did not get the information they were looking for.

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
            "callTime": "<date_and_time_or_->",
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
                  content: "You are analyzing a call handled by an AI assistant. You will extract structured information and identify unanswered questions.",
                },
                {
                  role: "system",
                  content: `This was the instruction given to the AI assistant during the call (its internal system prompt):\n\n${callSystemPrompt}`,
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
              if (result.callTime && result.callTime !== "-") {
                const userNow = DateTime.fromISO(today).setZone(result.timezone || "Asia/Kolkata");
                const extractedCallTime = DateTime.fromISO(result.callTime).setZone(result.timezone || "Asia/Kolkata");

                if (!extractedCallTime.isValid || extractedCallTime < userNow) {
                  console.warn(`⚠️ Overriding callTime to "-" as it's in the past: ${result.callTime} < ${userNow.toISO()}`);
                  result.callTime = "-";
                }
              }
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
                    callTime: result.callTime || "-",
                    timezone: result.timezone || "-",
                    purpose: result.purpose,
                    sentiment: result.sentiment,
                    summary: call.summary || "-",
                    customerNumber: userPhoneNumber,
                    duration: parseFloat(durationInSeconds.toFixed(2)),
                    cost: call.cost ?? 0
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
