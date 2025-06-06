import { DateTime } from "luxon";

export async function sendWhatsAppNotification(phoneNumber, appointmentDate, meetingLink, timezone = "Asia/Kolkata", companyName, companyPhone, maxRetries = 10) {
    const dt = DateTime.fromISO(appointmentDate, { zone: 'utc' }).setZone(timezone);
    const readableDate = dt.toFormat("d LLLL yyyy 'at' h:mm a");
  
    const apiUrl = "https://whatsapp-api-backend-production.up.railway.app/api/send-message";
    const apiKey = process.env.WHATSAPP_API_KEY;
  
    const payload = {
      to_number: phoneNumber,
      template_name: "appointment_v3",
      whatsapp_request_type: "TEMPLATE",
      parameters: [
        companyName,
        `${readableDate} (${timezone} timezone)`,
        meetingLink,
        companyPhone,
      ],
    };
  
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            'Authorization': `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
          },
          body: JSON.stringify(payload),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          console.error(`❌ Attempt ${attempt} failed:`, data.message || data);
          console.error("🔍 Full API response:", data);
  
  
          // Retry only for specific error message
          if (
            attempt < maxRetries &&
            typeof data.message === "string" &&
            data.message.includes("Application failed to respond")
          ) {
            const waitTime = 1000 * 2 ** (attempt - 1); // exponential backoff
            console.warn(`⏳ Retrying in ${waitTime / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
  
          return false;
        }
  
        console.log("📲 WhatsApp message sent successfully:", data);
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