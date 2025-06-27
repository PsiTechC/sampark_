// lib/dialer.js
import xlsx from "xlsx";
import axios from "axios";
import pLimit from "p-limit";
import { DateTime } from "luxon";

const VAPI_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN_VAPI;
const API_URL = "https://api.vapi.ai/call";
const DEFAULT_CC = "+91";
const CONCURRENCY = 1;
const CALL_WINDOW = { start: "11:00", end: "20:30" };

// POST helper with retry on server errors or timeouts
async function postWithRetry(url, payload, opts, retries = 2) {
  try {
    return await axios.post(url, payload, opts);
  } catch (err) {
    const code = err.response?.status;
    const isServerError = code >= 500 && code < 600;
    const isTimeout = err.code === "ECONNABORTED";
    if (retries > 0 && (isServerError || isTimeout)) {
      console.log(`⏳ Retrying (${retries}) for ${payload.customer.name}`);
      return postWithRetry(url, payload, opts, retries - 1);
    }
    throw err;
  }
}

// Phone normalizer
function toE164(raw) {
  if (!raw) return "";
  let s = String(raw).trim();
  if (s.startsWith("+")) return s.replace(/\D/g, "").replace(/^/, "+");
  let digits = s.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.startsWith("191") && digits.length === 13) digits = digits.slice(1);
  if (digits.startsWith("9191") && digits.length === 14) digits = digits.slice(2);
  if (digits.startsWith("91") && digits.length === 12) return "+" + digits;
  if (digits.length === 10) return "+91" + digits;
  return DEFAULT_CC + digits;
}

export async function runCampaign(buffer, { phoneNumberId, assistantId, batchId }) {
  const wb = xlsx.read(buffer, { type: "buffer", raw: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, {
    header: ["firstName", "lastName", "contact_number", "timezone"],
    range: 1,
    defval: ""
  }).filter(r => r.firstName && r.contact_number);

  const results = [];
  const limit = pLimit(CONCURRENCY);

  await Promise.allSettled(
    rows.map((row, i) =>
      limit(() => dial(row, i, rows.length, results, phoneNumberId, assistantId, batchId))
    )
  );
  return results;
}

async function dial(contact, idx, total, results, phoneNumberId, assistantId, batchId) {
  const firstName = contact.firstName.trim();
  const lastName = contact.lastName?.trim() || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const e164 = toE164(contact.contact_number);
  const zone = DateTime.utc().setZone(contact.timezone || "Asia/Kolkata").zoneName;

  console.log(`\n[${idx+1}/${total}] Starting call logic for ${fullName} (${e164}) in ${zone}`);

  if (!/^\+\d{10,15}$/.test(e164)) {
    console.error(`[${idx+1}/${total}] ⚠️  Skip bad number for ${fullName}: ${contact.contact_number}`);
    results.push({ row: idx+1, status: "skipped", reason: "invalid number", name: fullName });
    return;
  }

  const nowLocal = DateTime.utc().setZone(zone);
  if (!nowLocal.isValid) {
    console.error(`[${idx+1}/${total}] ⚠️  Skip bad timezone for ${fullName}: ${zone}`);
    results.push({ row: idx+1, status: "skipped", reason: "invalid timezone", name: fullName });
    return;
  }

  const [sH, sM] = CALL_WINDOW.start.split(":").map(Number);
  const [eH, eM] = CALL_WINDOW.end.split(":").map(Number);
  const startTOD = nowLocal.set({ hour: sH, minute: sM, second: 0, millisecond: 0 });
  const endTOD = nowLocal.set({ hour: eH, minute: eM, second: 0, millisecond: 0 });

  let schedulePlan;
  if (!(nowLocal >= startTOD && nowLocal <= endTOD)) {
    const nextStart = nowLocal < startTOD ? startTOD : startTOD.plus({ days: 1 });
    schedulePlan = { earliestAt: nextStart.toUTC().toISO() };
    console.log(
      `[${idx+1}/${total}] 💤  Scheduling ${fullName} for ${nextStart.toFormat("dd LLL yyyy, h:mm a")} (${zone})`
    );
  }

  const payload = {
    assistantId,
    phoneNumberId,
    customer: { number: e164, name: fullName },
    assistantOverrides: { variableValues: { firstName, lastName, timezone: zone } },
    metadata: { batchId },
    ...(schedulePlan && { schedulePlan })
  };

  console.log(`[${idx+1}/${total}] 📤  Payload:`, JSON.stringify(payload, null, 2));

  try {
    const { data } = await postWithRetry(
      API_URL,
      payload,
      {
        headers: { Authorization: `Bearer ${VAPI_TOKEN}` },
        timeout: 10000
      },
      2
    );

    // Use data.id as the call identifier
    if (!data.id) {
      console.error(`[${idx+1}/${total}] ❌  No callId for ${fullName}`, data);
      results.push({ row: idx+1, status: "error", reason: "no-callId", name: fullName });
      return;
    }

    const tag = schedulePlan ? "queued" : data.id;
    console.log(`[${idx+1}/${total}] ✅  ${fullName} → ${tag}`);
   results.push({
  row:       idx+1,
  name:      fullName,
  callId:    data.id,
  status:    tag,
  customerNumber: e164,
  timezone: zone,
  retryCount: 0
});

  } catch (err) {
    const resp = err.response || {};
    console.error(
      `[${idx+1}/${total}] ❌  ${fullName} →`,
      resp.status || "no status",
      resp.data || err.message
    );
    results.push({ row: idx+1, status: "error", error: err.message, name: fullName });
  }
}