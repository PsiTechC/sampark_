export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
  
    const body = req.body;
  
    const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages || messages.length === 0) return res.status(200).end();
  
    const msg = messages[0];
    const from = msg.from; // WhatsApp ID (phone number like '919131296862')
    const type = msg.type;
  
    // Send custom message only if it is a text, interactive, or button reply
    if (["text", "button", "interactive"].includes(type)) {
      console.log(`📩 Received message from ${from}. Sending custom reply...`);
      await sendCustomText(from);
    }
  
    res.status(200).end();
  }
  
  async function sendCustomText(number) {
    const url = "https://graph.facebook.com/v22.0/625575060639250/messages";
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  
    const payload = {
      messaging_product: "whatsapp",
      to: 919131296862,
      type: "text",
      text: {
        body: "working..."
      }
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error("❌ Failed to send custom message:", data);
      } else {
        console.log(`✅ Custom message sent to ${number}`);
      }
    } catch (error) {
      console.error("❌ Error sending custom message:", error);
    }
  }
  