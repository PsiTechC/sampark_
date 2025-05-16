// cron-worker.js
import cron from 'node-cron';
import fetch from 'node-fetch';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("🚀 Starting background cron worker...");

cron.schedule("*/10 * * * *", async () => {
  console.log("⏰ Running scheduled task at", new Date().toISOString());

  try {
    const forWSRes = await fetch(`${BASE_URL}/api/clients/forWSvapi`);
    if (!forWSRes.ok) throw new Error("forWSvapi failed");

    const sendWSRes = await fetch(`${BASE_URL}/api/clients/sendWS`);
    const [sentimentRes, userDataRes] = await Promise.all([
      fetch(`${BASE_URL}/api/clients/sentiment`),
      fetch(`${BASE_URL}/api/clients/fetchUserData`)
    ]);

    console.log("✅ Cron tasks completed");
  } catch (err) {
    console.error("❌ Error in cron task:", err.message);
  }
});
