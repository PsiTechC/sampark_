export async function sendWhatsAppConfirmation(phoneNumber, email, name, maxRetries = 50) {
  const apiUrl = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";

  const payload = {
    to_number: phoneNumber,
    template_name: "email_name_confirm_v5",
    whatsapp_request_type: "TEMPLATE",
    parameters: [email, name],
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.WHATSAPP_API_KEY,
          "Authorization": `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(`❌ Attempt ${attempt} failed:`, result.message || result);

        if (
          attempt < maxRetries &&
          typeof result.message === "string" &&
          result.message.includes("Application failed to respond")
        ) {
          const waitTime = 1000 * 2 ** (attempt - 1);
          console.warn(`⏳ Retrying in ${waitTime / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        return false;
      }

      console.log("✅ WhatsApp confirmation sent:", result);
      return true;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed due to error:`, error.message);

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
