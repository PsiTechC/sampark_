import fetch from "node-fetch";

const WHATSAPP_API_URL = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";

export async function sendWhatsAppMessageWhenUserBusy(number, companyName, maxRetries = 20) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(WHATSAPP_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.WHATSAPP_API_KEY,
          Authorization: `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          to_number: number,
          template_name: "user_call_confirm_v1",
          whatsapp_request_type: "TEMPLATE",
          parameters: [companyName],
        }),
      });

      const result = await response.json();
      const msgId = result?.metaResponse?.messages?.[0]?.id;
      console.log(`🆔 Message ID for ${number} (attempt ${attempt}):`, msgId);

      if (!response.ok) {
        console.error(`❌ Attempt ${attempt} failed for ${number}:`, result.message || result);

        if (
          attempt < maxRetries &&
          typeof result.message === "string" &&
          result.message.includes("Application failed to respond")
        ) {
          const waitTime = 1000 * 2 ** (attempt - 1);
          console.warn(`⏳ Retrying ${number} in ${waitTime / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        return false;
      }

      console.log(`✅ WhatsApp message sent to ${number}`);
      return true;
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed for ${number}:`, err.message);

      if (attempt < maxRetries) {
        const waitTime = 1000 * 2 ** (attempt - 1);
        console.warn(`⏳ Retrying ${number} in ${waitTime / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        return false;
      }
    }
  }

  return false;
}
