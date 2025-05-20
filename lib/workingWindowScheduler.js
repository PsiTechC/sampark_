// lib/workingWindowScheduler.js
import { DateTime } from "luxon";
import schedule from "node-schedule";

/**
 * Your daily working window, in local time (e.g. "10:00" to "17:00").
 * If you need per-contact timezones, pass the timezone into nextWorkingRetry.
 */
export const WORK_WINDOW = { start: "10:00", end: "17:00" };

/**
 * Calculate the next retry Date object (in UTC) that falls within your working window.
 * @param {string|Date} nowInput   - current time (ISO string or Date)
 * @param {string} timezone        - IANA timezone for window calculations (default UTC)
 * @param {number} delayMinutes    - minutes to delay before retry
 * @returns {Date}                 - JS Date in UTC for node-schedule
 */
export function nextWorkingRetry(nowInput, timezone = "UTC", delayMinutes = 10) {
  let dt = typeof nowInput === "string"
    ? DateTime.fromISO(nowInput, { zone: timezone })
    : DateTime.fromJSDate(nowInput, { zone: timezone });

  const [sH, sM] = WORK_WINDOW.start.split(":").map(Number);
  const [eH, eM] = WORK_WINDOW.end.split(":").map(Number);

  // define today's start/end in the same timezone
  const todayStart = dt.set({ hour: sH, minute: sM, second: 0, millisecond: 0 });
  const todayEnd   = dt.set({ hour: eH, minute: eM, second: 0, millisecond: 0 });

  // candidate time = now + delay
  let candidate = dt.plus({ minutes: delayMinutes });

  // if candidate before window start → schedule at window start
  if (candidate < todayStart) {
    candidate = todayStart;
  }
  // if candidate after window end → schedule next day at window start
  else if (candidate > todayEnd) {
    candidate = todayStart.plus({ days: 1 });
  }

  // convert back to UTC JS Date
  return candidate.toUTC().toJSDate();
}

/**
 * Schedule a callback to retry a call within working hours.
 * @param {Object} options
 * @param {number} options.delayMinutes
 * @param {string|Date} options.now
 * @param {string} options.timezone
 * @param {Function} callback     - async function to invoke when retry runs
 */
export function scheduleRetry({ now = new Date(), timezone = "UTC", delayMinutes = 10 }, callback) {
  const runAt = nextWorkingRetry(now, timezone, delayMinutes);
  console.log(`[RETRY-SCHED] scheduling at ${runAt.toISOString()}`);
  schedule.scheduleJob(runAt, async () => {
    console.log(`[RETRY-SCHED] running retry at ${new Date().toISOString()}`);
    try {
      await callback();
      console.log(`[RETRY-SCHED] retry callback succeeded`);
    } catch (err) {
      console.error(`[RETRY-SCHED] retry callback failed:`, err.message || err);
    }
  });
}