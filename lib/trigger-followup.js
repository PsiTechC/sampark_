// lib/trigger-followup.js (Dummy file for triggering external process)
export async function handleFollowUp({ callId, data }) {
    // Simulate processing follow-up
    console.log("🔁 Triggering follow-up for call:", callId);
    console.log("📦 With data:", data);
  
    // Simulate success
    return { status: "success" };
  }