import OpenAI from "openai";
import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import axios from "axios";

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
    const token = process.env.NEXT_PUBLIC_API_TOKEN;

    const agentsResponse = await axios.get("https://api.bolna.dev/v2/agent/all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const agents = agentsResponse.data;
    console.log(`📦 Fetched ${agents.length} agents`);

    for (const agent of agents) {
      const agentId = agent.id;
      const systemPrompt = agent.agent_prompts?.task_1?.system_prompt || "You are a sentiment analysis tool.";
      console.log(`\n👤 Processing Agent: ${agentId}`);

      const existingAgentDoc = await db.collection("batch_sentiment").findOne({ agent_id: agentId });

      const batchesResponse = await axios.get(`https://api.bolna.dev/batches/${agentId}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const batches = batchesResponse.data;
      console.log(`📦 Found ${batches.length} batches for agent ${agentId}`);
      const updatedBatches = [];

      for (const batch of batches) {
        const batchId = batch.batch_id;
        console.log(`🧩 Checking Batch: ${batchId}`);

        const execResponse = await axios.get(`https://api.bolna.dev/batches/${batchId}/executions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const executions = execResponse.data;
        console.log(`🧾 Found ${executions.length} executions in batch ${batchId}`);

        const existingExecutions =
          existingAgentDoc?.batches?.find((b) => b.batch_id === batchId)?.executions || [];

        const existingExecIds = new Set(existingExecutions.map((e) => e.execution_id));
        const batchExecutions = [];

        for (const exec of executions) {
          if (existingExecIds.has(exec.id)) {
            console.log(`🔁 Skipping already processed execution: ${exec.id}`);
            continue;
          }

          const transcript = exec.transcript || "";
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
            console.log(`💬 Sending to OpenAI | Execution: ${exec.id}`);
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
              rawContent = rawContent.replace(/```(?:json)?\s*/g, "").replace(/```$/, "").trim();
            }

            const result = JSON.parse(rawContent);
            console.log(`✅ Sentiment for ${exec.id}: ${result.sentiment}`);
            batchExecutions.push({ execution_id: exec.id, sentiment: result.sentiment });
          } catch (aiErr) {
            console.error(`❌ OpenAI error for execution ${exec.id}:`, aiErr.message);
          }
        }

        if (batchExecutions.length > 0) {
          console.log(`📥 Appending ${batchExecutions.length} new executions to batch ${batchId}`);
          updatedBatches.push({ batch_id: batchId, executions: batchExecutions });
        }
      }

      if (updatedBatches.length > 0) {
        for (const batch of updatedBatches) {
          const batchExists = existingAgentDoc?.batches?.some((b) => b.batch_id === batch.batch_id);

          if (batchExists) {
            console.log(`📌 Updating batch ${batch.batch_id} for agent ${agentId}`);
            await db.collection("batch_sentiment").updateOne(
              { agent_id: agentId, "batches.batch_id": batch.batch_id },
              { $push: { "batches.$.executions": { $each: batch.executions } } }
            );
          } else {
            console.log(`🆕 Adding new batch ${batch.batch_id} for agent ${agentId}`);
            await db.collection("batch_sentiment").updateOne(
              { agent_id: agentId },
              { $push: { batches: batch } },
              { upsert: true }
            );
          }
        }
      } else {
        console.log(`📭 No new executions to update for agent ${agentId}`);
      }
    }

    console.log("✅ Finished processing all agents.");
    return res.status(200).json({ message: "Updated with new batch sentiments." });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
