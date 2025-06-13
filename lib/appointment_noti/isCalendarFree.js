import { refreshAccessToken } from "./createGoogleCalendarEvent"; // adjust path as needed

export async function isCalendarFree(accessToken, refreshToken, start, end, timezone, userId, db, tokenKey) {
    let tokenToUse = accessToken;
  
    let res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenToUse}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin: start,
        timeMax: end,
        timeZone: timezone,
        items: [{ id: "primary" }],
      }),
    });
  
    // If token expired, refresh and retry
    if (res.status === 401 && refreshToken) {
      console.warn("🔁 FreeBusy token expired. Attempting refresh...");
  
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (!newAccessToken) return { isFree: false, newAccessToken: null };
  
      tokenToUse = newAccessToken;
  
      if (tokenKey !== undefined && tokenKey !== null) {
        const tokenField = (tokenKey === "" || tokenKey === undefined || tokenKey === null)
  ? "googleAccessToken"
  : (tokenKey === 0 ? "googleAccessToken" : `googleAccessToken${tokenKey}`);

        await db.collection("users").updateOne(
          { _id: userId },
          { $set: { [tokenField]: newAccessToken } }
        );
      }
      
  
      // Retry freeBusy with new token
      res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeMin: start,
          timeMax: end,
          timeZone: timezone,
          items: [{ id: "primary" }],
        }),
      });
    }
  
    const data = await res.json();
    const isBusy = data?.calendars?.primary?.busy?.length > 0;
  
    return { isFree: !isBusy, newAccessToken: tokenToUse };
  }
  