import schedule from "node-schedule";
import axios from "axios";
import { connectToDatabase } from "./db";

const jobs = {};
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
/**
 * Schedule a single batch to run at its scheduled_at time.
 */
export async function scheduleBatch(batch) {
  const runDate = batch.scheduled_at;
  const id      = batch.batch_id;

  // cancel any previously scheduled job for this batch
  if (jobs[id]) {
    jobs[id].cancel();
  }

  // schedule new job
  jobs[id] = schedule.scheduleJob(runDate, async () => {
    console.log(`⏳ [Scheduler] firing batch ${id} at ${new Date().toISOString()}`);
    try {
      await axios.post(
        `${process.env.BASE_URL || `${BASE_URL}`}/api/batches/${id}/run`
      );
      console.log(`✅ [Scheduler] batch ${id} triggered`);
    } catch (e) {
      console.error(`❌ [Scheduler] failed to trigger batch ${id}:`, e.response?.data || e.message);
    }
  });
}

/**
 * When the server starts, load all future scheduled batches
 */
export async function loadAllScheduled() {
  const { db } = await connectToDatabase();
  const now = new Date();
  const due = await db
    .collection("batches")
    .find({ status: "scheduled", scheduled_at: { $gte: now } })
    .toArray();

  for (const batch of due) {
    scheduleBatch(batch);
  }
}

/**
 * If a scheduled batch is stopped or run early, cancel its job
 */
export function cancelScheduledBatch(batchId) {
  if (jobs[batchId]) {
    jobs[batchId].cancel();
    delete jobs[batchId];
    console.log(`🗑 [Scheduler] cancelled batch ${batchId}`);
  }
}