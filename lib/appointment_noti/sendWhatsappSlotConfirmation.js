import { DateTime } from "luxon";

export async function sendWhatsappSlotConfirmation(phoneNumber, slotDateTimes, companyName, timezone = "Asia/Kolkata", maxRetries = 50) {
  const apiUrl = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";
  const apiKey = process.env.WHATSAPP_API_KEY;
  const bearerToken = process.env.WHATSAPP_BEARER_TOKEN;

  if (!slotDateTimes || slotDateTimes.length < 5) {
    console.warn("⚠️ Insufficient slots provided to send slot confirmation.");
    return false;
  }

  const formattedSlots = slotDateTimes.slice(0, 5).map(slot => {
    return DateTime.fromISO(slot.time, { zone: 'utc' })
      .setZone(timezone)
      .toFormat("ccc, dd LLL, yyyy, hh:mm a");
  });

  const payload = {
    to_number: phoneNumber,
    template_name: "slot_confirm_v1",
    whatsapp_request_type: "TEMPLATE",
    parameters: [...formattedSlots, companyName],
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "Authorization": `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(`❌ Attempt ${attempt} failed:`, data.message || data);

        if (
          attempt < maxRetries &&
          typeof data.message === "string" &&
          data.message.includes("Application failed to respond")
        ) {
          const waitTime = 1000 * 2 ** (attempt - 1);
          console.warn(`⏳ Retrying in ${waitTime / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        return false;
      }

      console.log("📲 Slot confirmation WhatsApp message sent successfully:", data);
      return true;
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed due to error:`, err.message);

      if (attempt < maxRetries) {
        const waitTime = 1000 * 2 ** (attempt - 1);
        console.warn(`⏳ Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        return false;
      }
    }
  }

  return false;
}
