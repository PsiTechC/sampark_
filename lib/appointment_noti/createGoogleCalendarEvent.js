
export async function refreshAccessToken(refreshToken) {
    try {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error_description || "Failed to refresh token");
      }
  
      return data.access_token;
    } catch (err) {
      console.error("❌ Failed to refresh access token:", err.message);
      return null;
    }
  }
  
  export async function createGoogleCalendarEvent(accessToken, eventDetails, refreshToken, userId, db) {
    const { name, email, customerNumber, appointmentDate, meetLink, purpose, summary, timezone } = eventDetails;
  
    const eventTimeZone = timezone && typeof timezone === "string" ? timezone : "Asia/Kolkata";
    const startTime = appointmentDate;
    if (!startTime || !startTime.includes("T")) {
      console.error("❌ Invalid ISO format appointmentDate:", appointmentDate);
      return false;
    }
  
    const endTime = new Date(new Date(startTime).getTime() + 30 * 60000).toISOString();
  
    const event = {
      summary: `Meeting with ${name}`,
      description: `Purpose: ${purpose || "N/A"}\nCustomer Number: ${customerNumber}\n\nSummary: ${summary || "N/A"}`,
      start: { dateTime: startTime, timeZone: eventTimeZone },
      end: { dateTime: endTime, timeZone: eventTimeZone },
      location: meetLink,
    };
  
    if (email && email !== "-" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      event.attendees = [{ email }];
    }
  
  
    let res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
  
    if (res.status === 401 && refreshToken) {
      console.warn("🔁 Access token expired. Attempting refresh...");
  
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (!newAccessToken) return false;
  
      await db.collection("users").updateOne(
        { _id: userId },
        { $set: { googleAccessToken: newAccessToken } }
      );
  
      res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    }
  
    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { error: 'Invalid JSON response', statusText: res.statusText };
    }
  
    if (!res.ok) {
      console.error("❌ Calendar API error:", data.error || data);
      return false;
    }
  
    console.log("📅 Google Calendar event created:", data.id);
    return true;
  }