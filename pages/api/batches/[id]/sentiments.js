// import { connectToDatabase } from "@/lib/db";
// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export default async function handler(req, res) {
//   const { id } = req.query;
//   const { prompt } = req.body;

//   if (req.method !== "POST") return res.status(405).end();

//   const { db } = await connectToDatabase();
//   const batch = await db.collection("batches").findOne({ batch_id: id });

//   if (!batch || !Array.isArray(batch.summary)) {
//     return res.status(404).json({ message: "Batch or summary not found" });
//   }

//   const responses = await Promise.all(
//     batch.summary.map(async call => {
//       if (!call.transcript) return { callId: call.callId, sentiment: "N/A" };

//       const completion = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//           { role: "system", content: `Evaluate the sentiment of this call transcript using the following criteria:\n${prompt}` },
//           { role: "user", content: call.transcript }
//         ]
//       });

//       const sentiment = completion.choices?.[0]?.message?.content?.trim() || "Unknown";
//       return { callId: call.callId, sentiment };
//     })
//   );

//   return res.status(200).json(responses);
// }







// // pages/api/batches/[id]/sentiments.js
// import { connectToDatabase } from "../../../../lib/db";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).end("Method Not Allowed");
//   }

//   const { id } = req.query;
//   const { prompt } = req.body;

//   const { db } = await connectToDatabase();
//   const batch = await db.collection("batches").findOne({ batch_id: id });

//   if (!batch || !Array.isArray(batch.summary)) {
//     return res.status(404).json({ message: "Batch or summary not found" });
//   }

//   const callIds = batch.summary.map(c => c.callId).filter(Boolean);

//   const results = await Promise.all(
//     callIds.map(async (callId) => {
//       try {
//         const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`
//           }
//         });

//         if (!response.ok) throw new Error(`Vapi returned ${response.status}`);
//         const callData = await response.json();

//      const transcript = callData.transcript?.transcript || callData.transcript;
// if (!transcript || transcript.trim().length < 10) {
//   console.warn(`[NO TRANSCRIPT] ${callId} has no usable transcript.`);
//   return { callId, sentiment: "N/A" };
// }

//         // Analyze via OpenAI
//         const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             model: "gpt-4o",
//             messages: [
//              { role: "system", content: `You are a sentiment classifier. Given a transcript, return only one word — either Positive, Negative, or Neutral — based on the following rules: ${prompt}` },

//               { role: "user", content: transcript }
//             ]
//           })
//         });

//         const gptJson = await gptResponse.json();
//      const output = gptJson.choices?.[0]?.message?.content?.trim() || "N/A";
// const sentiment = output.split('\n')[0].trim();
// return { callId, sentiment };




//       } catch (err) {
//         console.error(`[SENTIMENT ERROR] ${callId}`, err.message);
//         console.log(`[DEBUG] Skipping ${callId} due to missing/short transcript:`, transcript);

//         return { callId, sentiment: "N/A" };
//       }
//     })
//   );

//   res.status(200).json(results);
// }


// C:\sanket\psitech\sampark_\pages\api\batches\[id]\sentiments.js
import { connectToDatabase } from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { id } = req.query;

  const { db } = await connectToDatabase();
  const batch = await db.collection("batches").findOne({ batch_id: id });

  if (!batch || !Array.isArray(batch.summary)) {
    return res.status(404).json({ message: "Batch or summary not found" });
  }

  const prompt = batch.sentimentPrompt;
  if (!prompt) {
    return res.status(400).json({ message: "No sentiment prompt defined for this batch." });
  }
  try {
    const { db } = await connectToDatabase();
    const batch = await db.collection("batches").findOne({ batch_id: id });

    if (!batch || !Array.isArray(batch.summary)) {
      return res.status(404).json({ message: "Batch or summary not found" });
    }

    const callIds = batch.summary.map(c => c.callId).filter(Boolean);

    const results = await Promise.all(
      callIds.map(async (callId) => {
        try {
          const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`
            }
          });

          if (!response.ok) {
            console.warn(`[VAPI] Failed to fetch call ${callId}: ${response.status}`);
            return { callId, sentiment: "N/A" };
          }

          const callData = await response.json();
          console.log(`[DEBUG] VAPI callData for ${callId}:`, callData);

          const transcript = typeof callData.transcript === "string"
            ? callData.transcript
            : callData.transcript?.transcript || "";

          if (!transcript || transcript.trim().length < 10) {
            console.warn(`[NO TRANSCRIPT] ${callId} has no usable transcript.`);
            return { callId, sentiment: "N/A" };
          }

          console.log(`[DEBUG] Transcript for ${callId}:`, transcript.slice(0, 100));

          // Analyze via OpenAI
          const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: `You are a sentiment classifier. Given a transcript, return only one word — either Positive, Negative, or Neutral — based on the following rules: ${prompt}`
                },
                {
                  role: "user",
                  content: transcript
                }
              ]
            })
          });

          const gptJson = await gptResponse.json();
          console.log(`[DEBUG] GPT response for ${callId}:`, gptJson);

          if (gptJson.error) {
            console.error(`[GPT ERROR] ${callId}:`, gptJson.error.message);
            return { callId, sentiment: "N/A" };
          }

          const output = gptJson.choices?.[0]?.message?.content?.trim() || "N/A";
          const sentiment = output.split('\n')[0].trim();

          return { callId, sentiment };
        } catch (err) {
          console.error(`[SENTIMENT ERROR] ${callId}:`, err.message);
          return { callId, sentiment: "N/A" };
        }
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("[HANDLER ERROR]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
