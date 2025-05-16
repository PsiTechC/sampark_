import cron from 'node-cron';
import fetch from 'node-fetch';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function initCronJobs() {
  console.log("🚀 Initializing cron jobs...");

  cron.schedule("*/10 * * * *", async () => {
    console.log("⏰ Running scheduled task at", new Date().toISOString());

    try {
      // 1. Call forWSvapi first
      const forWSRes = await fetch(`${BASE_URL}/api/clients/forWSvapi`);
      if (!forWSRes.ok) throw new Error("forWSvapi failed");

      const forWSData = await forWSRes.json();
      console.log("✅ forWSvapi success:", forWSData);

      // 2. After success, call sendWS
      const sendWSRes = await fetch(`${BASE_URL}/api/clients/sendWS`);
      const sendWSData = await sendWSRes.json();
      console.log("✅ sendWS success:", sendWSData);

      // 3. In parallel, call sentiment and fetchUserData
      const [sentimentRes, userDataRes] = await Promise.all([
        fetch(`${BASE_URL}/api/clients/sentiment`),
        fetch(`${BASE_URL}/api/clients/fetchUserData`)
      ]);

      const sentimentData = await sentimentRes.json();
      const userData = await userDataRes.json();

      console.log("✅ sentiment success:", sentimentData);
      console.log("✅ fetchUserData success:", userData);

    } catch (err) {
      console.error("❌ Error in cron task:", err.message);
    }
  });
}

