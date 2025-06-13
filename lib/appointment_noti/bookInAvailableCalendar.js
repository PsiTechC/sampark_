import { createGoogleCalendarEvent } from './createGoogleCalendarEvent'
import { isCalendarFree } from "./isCalendarFree"

import { DateTime } from "luxon";

export async function bookInAvailableCalendar(user, tokens, eventDetails, timezone, db) {
  const { appointmentDate } = eventDetails;

  const dt = new Date(appointmentDate);
  const startRFC3339 = dt.toISOString();
  const endRFC3339 = new Date(dt.getTime() + 30 * 60000).toISOString();
  const googleTokens = tokens;


  // 1. Try originally requested slot
  for (const token of googleTokens) {
    const { isFree, newAccessToken } = await isCalendarFree(
      token.accessToken,
      token.refreshToken,
      startRFC3339,
      endRFC3339,
      timezone,
      user._id,
      db,
      token.tokenKey
    );

    if (isFree) {
      console.log(`🟢 Token ${token.tokenKey || "0"} is free at requested time.`);
      const calendarEventCreated = await createGoogleCalendarEvent(
        newAccessToken,
        eventDetails,
        token.refreshToken,
        user._id,
        db,
        token.tokenKey
      );

      if (calendarEventCreated) {
        console.log(`✅ Event created using token ${token.tokenKey || "0"}`);
        return { success: true, calendarIndex: token.tokenKey };
      } else {
        console.error(`❌ Failed to create event with token ${token.tokenKey || "0"}`);
      }
    } else {
      console.log(`⛔ Token ${token.tokenKey || "0"} is busy at requested time.`);
    }
  }

  // 2. Suggest 5 alternative slots
  const availableSlots = [];
  let currentDateTime = DateTime.fromISO(appointmentDate, { zone: timezone });

  if (currentDateTime.hour >= 18) {
    // Next day 9 AM in the same timezone
    currentDateTime = currentDateTime.plus({ days: 1 }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  } else {
    // Same day, move to next half-hour slot
    if (currentDateTime.minute < 30) {
      currentDateTime = currentDateTime.set({ minute: 30, second: 0, millisecond: 0 });
    } else {
      currentDateTime = currentDateTime.plus({ hours: 1 }).set({ minute: 0, second: 0, millisecond: 0 });
    }
  
    // But no earlier than 9 AM
    if (currentDateTime.hour < 9) currentDateTime = currentDateTime.set({ hour: 9, minute: 0 });
  }
  
  while (availableSlots.length < 5) {
    for (let hour = currentDateTime.hour; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        if (hour === currentDateTime.hour && minute < currentDateTime.minute) continue;
  
        const slotStart = currentDateTime.set({ hour, minute, second: 0, millisecond: 0 });
        const slotEnd = slotStart.plus({ minutes: 30 });
  
        const slotStartISO = slotStart.toUTC().toISO();
        const slotEndISO = slotEnd.toUTC().toISO();
  
        for (const token of googleTokens) {
          const { isFree, newAccessToken } = await isCalendarFree(
            token.accessToken,
            token.refreshToken,
            slotStartISO,
            slotEndISO,
            timezone,
            user._id,
            db,
            token.tokenKey
          );
  
          if (isFree) {
            availableSlots.push({
              time: slotStart.toISO(), // keep it in local time for storing
              accessToken: newAccessToken,
              refreshToken: token.refreshToken,
            });
            break;
          }
        }
  
        if (availableSlots.length === 5) break;
      }
      if (availableSlots.length === 5) break;
    }
  
    // Next day 9:00 AM
    currentDateTime = currentDateTime.plus({ days: 1 }).set({ hour: 9, minute: 0 });
  }
  
  

  console.log("🕒 Suggested Available Slots:");
  availableSlots.forEach((slot, idx) => {
    const dt = DateTime.fromISO(slot.time, { zone: 'utc' }).setZone(timezone);
    console.log(`🟢 Slot ${idx + 1}: ${dt.toFormat("d LLL yyyy, h:mm a")} (${timezone})`);
  });

  return { success: false, suggestedSlots: availableSlots };
}