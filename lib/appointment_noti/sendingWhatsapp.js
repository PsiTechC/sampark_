export async function sendingWhatsapp(number, pdfUrl, mediaName, companyName, companyPhone) {
    console.log(`📤 Sending WA message with document to ${number}... URL: ${pdfUrl}`);
  
    const apiUrl = 'https://whatsapp-api-backend-production.up.railway.app/api/send-message';
  
    const requestBody = {
      to_number: number,
      media_url: pdfUrl,
      media_name: mediaName,
      parameters: [companyName, companyPhone],
      messages: null,
      template_name: "pdf_req_v1",
      whatsapp_request_type: "TEMPLATE_WITH_DOCUMENT",
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.WHATSAPP_API_KEY,
          'Authorization': `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const result = await response.json();
      console.log(`✅ Document message sent successfully to ${number}:`, result);
      return { status: "success", result };
    } catch (error) {
      console.error('❌ Error sending document message:', error);
      return { status: "error", error };
    }
  }