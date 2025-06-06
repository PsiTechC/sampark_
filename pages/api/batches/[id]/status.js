// // pages/api/batches/[id]/status.js
// import { connectToDatabase } from "../../../../lib/db";
// import axios from "axios";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { id } = req.query;
//   const { db } = await connectToDatabase();

//   // 1) load your batch
//   const batch = await db.collection("batches").findOne({ batch_id: id });
//   if (!batch) return res.status(404).json({ message: "Batch not found" });

//   // 2) poll VAPI for each callId
//   const updated = await Promise.all(batch.summary.map(async entry => {
//     // skip if already in a terminal state
//     if (["completed","failed","no-answer"].includes(entry.status)) return entry;

//     const resp = await axios.get(`https://api.vapi.ai/call/${entry.callId}`, {
//       headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}` }
//     });
//     return { ...entry, status: resp.data.status };
//   }));

//   // 3) derive new batch status
//   const allDone = updated.every(e => ["completed","failed","no-answer"].includes(e.status));
//   const newStatus = allDone ? "completed" : "running";

//   // 4) write back to Mongo
//   await db.collection("batches").updateOne(
//     { batch_id: id },
//     { $set: { status: newStatus, summary: updated, last_polled: new Date() } }
//   );

//   // 5) return fresh data
//   return res.status(200).json({ batch_id: id, status: newStatus, summary: updated });
// }



// // pages/api/batches/[id]/status.js
// import { connectToDatabase } from "../../../../lib/db";
// import axios from "axios";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { id } = req.query;
//   const { db } = await connectToDatabase();

//   // 1) load your batch
//   const batch = await db.collection("batches").findOne({ batch_id: id });
//   if (!batch) return res.status(404).json({ message: "Batch not found" });

//   // Define all terminal call statuses
//   const TERMINAL = [
//     "completed",
//     "failed",
//     "no-answer",
//     "busy",
//     "customer_busy",
//     "customer_did_not_answer"
//   ];

//   // 2) poll VAPI for each callId, skipping those without callId or already terminal
//   const updated = await Promise.all(
//     batch.summary.map(async (entry) => {
//       // Skip entries with no callId, or already in a terminal state
//       if (!entry.callId || TERMINAL.includes(entry.status)) {
//         return entry;
//       }

//       try {
//         const resp = await axios.get(
//           `https://api.vapi.ai/call/${entry.callId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`
//             }
//           }
//         );
//         return { ...entry, status: resp.data.status };
//       } catch (err) {
//         console.error(`Error polling callId ${entry.callId}:`, err.message);
//         // On error, leave the entry unchanged
//         return entry;
//       }
//     })
//   );

//   // 3) derive new batch status
//   const allDone = updated.every((e) => TERMINAL.includes(e.status));
//   const newStatus = allDone ? "completed" : "running";

//   // 4) write back to Mongo
//   await db.collection("batches").updateOne(
//     { batch_id: id },
//     { $set: { status: newStatus, summary: updated, last_polled: new Date() } }
//   );

//   // 5) return fresh data
//   return res.status(200).json({ batch_id: id, status: newStatus, summary: updated });
// }






// // pages/api/batches/[id]/status.js
// import { connectToDatabase } from "../../../../lib/db";
// import axios from "axios";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { id } = req.query;
//   const { db } = await connectToDatabase();

//   const batch = await db.collection("batches").findOne({ batch_id: id });
//   if (!batch) return res.status(404).json({ message: "Batch not found" });

//   const TERMINAL = [
//   "ended",             // ← add this
//     "completed",
//     "failed",
//     "no-answer",
//     "busy",
//     "customer_busy",
//     "customer_did_not_answer"
//   ];
//   // 1) Poll Vapi for each live call
//   const updated = await Promise.all(
//     batch.summary.map(async entry => {
//       if (!entry.callId || TERMINAL.includes(entry.status)) return entry;
//       try {
//         const resp = await axios.get(
//           `https://api.vapi.ai/call/${entry.callId}`,
//           { headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`
//             }
//           }
//         );
//         return { ...entry, status: resp.data.status };
//       } catch {
//         return entry;
//       }
//     })
//   );

//   // 2) Determine overall batch status
//   const allDone = updated.every(e => TERMINAL.includes(e.status));
//   const newStatus = allDone ? "completed" : "running";

//   // 3) Derive per-status counts
//   const counts = updated.reduce((acc, e) => {
//     acc[e.status] = (acc[e.status] || 0) + 1;
//     return acc;
//   }, {});

//   // 4) Write back
//   await db.collection("batches").updateOne(
//     { batch_id: id },
//     { $set: { status: newStatus, summary: updated, last_polled: new Date() } }
//   );

//   // 5) Return detailed response
//   return res.status(200).json({
//     batch_id: id,
//     status: newStatus,
//     summary: updated,
//     counts   // ← e.g. { queued:2, ended:3, failed:1 }
//   });
// }






// // pages/api/batches/[id]/status.js
// import schedule from "node-schedule";
// import axios from "axios";
// import { connectToDatabase } from "../../../../lib/db";

// const MAX_RETRIES = 3;
// const REDIAL_DELAY_MINUTES = 10;

// // terminal statuses (including “ended” and any no-answer variants)
// const TERMINAL = [
//   "completed",
//   "failed",
//   "no-answer",
//   "busy",
//   "customer_busy",
//   "customer_did_not_answer",
//   "ended"
// ];

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { id: batchId } = req.query;
//   const { db } = await connectToDatabase();

//   // 1) load the batch document
//   const batch = await db.collection("batches").findOne({ batch_id: batchId });
//   if (!batch) {
//     return res.status(404).json({ message: "Batch not found" });
//   }

//   // 2) poll Vapi for each in-flight call, collect updated entries
//   const updated = await Promise.all(
//     batch.summary.map(async (entry) => {
//       // skip if no callId or already in a terminal state
//       if (!entry.callId || TERMINAL.includes(entry.status)) {
//         return entry;
//       }

//       let resp;
//       try {
//         resp = await axios.get(`https://api.vapi.ai/call/${entry.callId}`, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//           },
//         });
//       } catch (err) {
//         console.error(`Error polling callId ${entry.callId}:`, err.message);
//         return entry;
//       }

//       const { status, endedReason } = resp.data;
//       const next = {
//         ...entry,
//         status,
//         endedReason,
//         retryCount: entry.retryCount || 0,
//       };

//       // 3) if customer didn’t answer, schedule a re-dial up to MAX_RETRIES
//       if (
//         endedReason === "customer-did-not-answer" &&
//         next.retryCount < MAX_RETRIES
//       ) {
//         const runAt = new Date(Date.now() + REDIAL_DELAY_MINUTES * 60_000);

//         schedule.scheduleJob(runAt, async () => {
//           try {
//             await axios.post(
//               "https://api.vapi.ai/call",
//               {
//                 assistantId: batch.assistant_id,
//                 phoneNumberId: batch.phoneNumberId,
//                 customer: {
//                   number: entry.customerNumber,
//                   name: entry.name,
//                 },
//                 assistantOverrides: {
//                   variableValues: {
//                     firstName: entry.name,
//                     timezone: entry.timezone,
//                   },
//                 },
//                 metadata: {
//                   batchId,
//                   row: entry.row,
//                   retry: next.retryCount + 1,
//                 },
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//                 },
//               }
//             );
//             console.log(
//               `🔄 Scheduled redial #${next.retryCount + 1} for row ${entry.row} at ${runAt}`
//             );
//           } catch (err) {
//             console.error(
//               `Failed to redial row ${entry.row}:`,
//               err.response?.data || err.message
//             );
//           }
//         });

//         // increment retry count so we don’t exceed MAX_RETRIES
//         next.retryCount++;
//       }

//       return next;
//     })
//   );

//   // 4) derive the overall batch status
//   const allDone = updated.every((e) => TERMINAL.includes(e.status));
//   const newStatus = allDone ? "completed" : "running";

//   // 5) compute counts by status
//   const counts = updated.reduce((acc, e) => {
//     acc[e.status] = (acc[e.status] || 0) + 1;
//     return acc;
//   }, {});

//   // 6) write back to Mongo
//   await db.collection("batches").updateOne(
//     { batch_id: batchId },
//     {
//       $set: {
//         status: newStatus,
//         summary: updated,
//         counts,
//         last_polled: new Date(),
//       },
//     }
//   );

//   // 7) return the enriched batch
//   return res.status(200).json({
//     batch_id: batchId,
//     status: newStatus,
//     summary: updated,
//     counts,
//   });
// }







// // pages/api/batches/[id]/status.js
// import schedule from "node-schedule";
// import axios from "axios";
// import { connectToDatabase } from "../../../../lib/db";
// import { scheduleRetry } from "../../../../lib/workingWindowScheduler";  

// const MAX_RETRIES = 3;
// const REDIAL_DELAY_MINUTES = 5;

// // terminal statuses (including “ended” and any no-answer variants)
// const TERMINAL = [
//   "completed",
//   "failed",
//   "no-answer",
//   "busy",
//   "customer_busy",
//   "customer_did_not_answer",
//   "ended"
// ];

// export default async function handler(req, res) {
//   console.log(`[STATUS] Handler invoked for batch ${req.query.id} at ${new Date().toISOString()}`);
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     console.log(`[STATUS] Method ${req.method} not allowed`);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { id: batchId } = req.query;
//   const { db } = await connectToDatabase();

//   // 1) load the batch document
//   const batch = await db.collection("batches").findOne({ batch_id: batchId });
//   if (!batch) {
//     console.log(`[STATUS] Batch ${batchId} not found`);
//     return res.status(404).json({ message: "Batch not found" });
//   }

//   console.log(`[STATUS] Loaded batch ${batchId} with ${batch.summary.length} entries`);

//   // 2) poll Vapi for each in-flight call, collect updated entries
//   const updated = await Promise.all(
//     batch.summary.map(async (entry) => {
//       console.log(`[STATUS] Checking entry row ${entry.row}, callId=${entry.callId}, status=${entry.status}`);
//       // skip if no callId or already terminal
//       if (!entry.callId || TERMINAL.includes(entry.status)) {
//         console.log(`[STATUS] Skipping row ${entry.row}`);
//         return entry;
//       }

//       let resp;
//       try {
//         resp = await axios.get(`https://api.vapi.ai/call/${entry.callId}`, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//           },
//         });
//         console.log(`[STATUS] Polled callId ${entry.callId}: ${resp.data.status}`);
//       } catch (err) {
//         console.error(`[STATUS] Error polling callId ${entry.callId}:`, err.message);
//         return entry;
//       }

//       const { status, endedReason } = resp.data;
//       const next = {
//         ...entry,
//         status,
//         endedReason,
//         retryCount: entry.retryCount || 0,
//       };

//       // 3) if customer didn’t answer, schedule a re-dial up to MAX_RETRIES
//     if (
//   endedReason === "customer-did-not-answer" &&
//   next.retryCount < MAX_RETRIES
// )  {
//         const runAt = new Date(Date.now() + REDIAL_DELAY_MINUTES * 60_000);
//         console.log(
//           `[STATUS] Scheduling retry #${next.retryCount + 1} for row ${entry.row} at ${runAt.toISOString()}`
//         );
//   scheduleRetry(
//       {
//         now: new Date(),
//         timezone: entry.timezone,
//         delayMinutes: REDIAL_DELAY_MINUTES,
//       },
//       async () => {
//         console.log(
//           `[RETRY] Executing retry #${next.retryCount + 1} for row ${entry.row} at ${new Date().toISOString()}`
//         );
//         const { data } = await axios.post(
//           "https://api.vapi.ai/call",
//           {
//             assistantId: batch.assistant_id,
//             phoneNumberId: batch.phoneNumberId,
//             customer: {
//               number: entry.customerNumber,
//               name: entry.name,
//             },
//             assistantOverrides: {
//               variableValues: {
//                 firstName: entry.name,
//                 timezone: entry.timezone,
//               },
//             },
//             metadata: {
//               batchId,
//               row: entry.row,
//               retry: next.retryCount + 1,
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//             },
//           }
//         );
//         console.log(
//           `[RETRY] Scheduled redial success for row ${entry.row}, new callId=${data.id}`
//         );
//       }
  
      
//       );

//         // increment retry count so we don’t exceed MAX_RETRIES
//         next.retryCount++;
//       }

//       return next;
//     })
//   );

//   // 4) derive the overall batch status
//   const allDone = updated.every((e) => TERMINAL.includes(e.status));
//   const newStatus = allDone ? "completed" : "running";
//   console.log(`[STATUS] Derived batch status=${newStatus}`);

//   // 5) compute counts by status
//   const counts = updated.reduce((acc, e) => {
//     acc[e.status] = (acc[e.status] || 0) + 1;
//     return acc;
//   }, {});
//   console.log(`[STATUS] Counts:`, counts);

//   // 6) write back to Mongo
//   await db.collection("batches").updateOne(
//     { batch_id: batchId },
//     {
//       $set: {
//         status: newStatus,
//         summary: updated,
//         counts,
//         last_polled: new Date(),
//       },
//     }
//   );
//   console.log(`[STATUS] Updated batch document in Mongo`);

//   // 7) return the enriched batch
//   return res.status(200).json({
//     batch_id: batchId,
//     status: newStatus,
//     summary: updated,
//     counts,
//   });
// }





// // pages/api/batches/[id]/status.js
// import schedule from "node-schedule";
// import axios from "axios";
// import { connectToDatabase } from "../../../../lib/db";
// import { scheduleRetry } from "../../../../lib/workingWindowScheduler";

// const MAX_RETRIES = 5;
// const REDIAL_DELAY_MINUTES = 5;

// // terminal statuses (including “ended” and any no-answer variants)
// const TERMINAL = [
//   "completed",
//   "failed",
//   "no-answer",
//   "busy",
//   "customer_busy",
//   "customer_did_not_answer",
//   "ended"
// ];

// export default async function handler(req, res) {
//   console.log(
//     `[STATUS] Handler invoked for batch ${req.query.id} at ${new Date().toISOString()}`
//   );
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     console.log(`[STATUS] Method ${req.method} not allowed`);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { id: batchId } = req.query;
//   const { db } = await connectToDatabase();

//   // 1) load the batch document
//   const batch = await db.collection("batches").findOne({ batch_id: batchId });
//   if (!batch) {
//     console.log(`[STATUS] Batch ${batchId} not found`);
//     return res.status(404).json({ message: "Batch not found" });
//   }

//   console.log(
//     `[STATUS] Loaded batch ${batchId} with ${batch.summary.length} entries`
//   );

//   // 2) poll Vapi for each in-flight call, collect updated entries
//   const updated = await Promise.all(
//     batch.summary.map(async (entry) => {
//       console.log(
//         `[STATUS] Checking entry row ${entry.row}, callId=${entry.callId}, status=${entry.status}`
//       );
//       // skip if no callId or already terminal
//       // if (!entry.callId || TERMINAL.includes(entry.status)) {
//       //   console.log(`[STATUS] Skipping row ${entry.row}`);
//       //   return entry;
//       // }


//       if (!entry.callId) return entry;

// const isTerminal = TERMINAL.includes(entry.status);
// const hasReason  = !!entry.endedReason;

// if (isTerminal && hasReason) return entry;


//       let resp;
//       try {
//         resp = await axios.get(`https://api.vapi.ai/call/${entry.callId}`, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//           },
//         });
//         console.log(
//           `[STATUS] Polled callId ${entry.callId}: ${resp.data.status}`
//         );
//       } catch (err) {
//         console.error(
//           `[STATUS] Error polling callId ${entry.callId}:`,
//           err.message
//         );
//         return entry;
//       }

//       const { status } = resp.data;
//       console.log("[STATUS] Vapi response:", JSON.stringify(resp.data, null, 2));

// const endedReason =
//   resp.data.ended_reason ||
//   resp.data.failed_reason ||
//   resp.data.reason ||
//   "";
      
//       console.log(`[STATUS] row ${entry.row} endedReason= ${endedReason}`);
//       const next = {
//         ...entry,
//         status,
//         endedReason,
//         retryCount: entry.retryCount || 0,
//       };

//       // 3) if customer didn’t answer, schedule a re-dial up to MAX_RETRIES
//       if (
//         endedReason === "customer-did-not-answer" &&
//         next.retryCount < MAX_RETRIES
//       ) {
//         console.log(
//           `[STATUS] Will retry #${next.retryCount + 1} for row ${entry.row} in working hours`
//         );

//         scheduleRetry(
//           {
//             now: new Date(),
//             timezone: entry.timezone,
//             delayMinutes: REDIAL_DELAY_MINUTES,
//           },
//           async () => {
//             console.log(
//               `[RETRY] Executing retry #${next.retryCount + 1} for row ${entry.row} at ${new Date().toISOString()}`
//             );
//             try {
//               const { data } = await axios.post(
//                 "https://api.vapi.ai/call",
//                 {
//                   assistantId: batch.assistant_id,
//                   phoneNumberId: batch.phoneNumberId,
//                   customer: {
//                     number: entry.customerNumber,
//                     name: entry.name,
//                   },
//                   assistantOverrides: {
//                     variableValues: {
//                       firstName: entry.name,
//                       timezone: entry.timezone,
//                     },
//                   },
//                   metadata: {
//                     batchId,
//                     row: entry.row,
//                     retry: next.retryCount + 1,
//                   },
//                 },
//                 {
//                   headers: {
//                     Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//                   },
//                 }
//               );
//               console.log(
//                 `[RETRY] Scheduled redial success for row ${entry.row}, new callId=${data.id}`
//               );
//             } catch (err) {
//               console.error(
//                 `[RETRY] Failed to redial row ${entry.row}:`,
//                 err.response?.data || err.message
//               );
//             }
//           }
//         );

//         // increment retry count so we don’t exceed MAX_RETRIES
//         next.retryCount++;
//       }

//       return next;
//     })
//   );

//   // 4) derive the overall batch status
//   const allDone = updated.every((e) => TERMINAL.includes(e.status));
//   const newStatus = allDone ? "completed" : "running";
//   console.log(`[STATUS] Derived batch status=${newStatus}`);

//   // 5) compute counts by status
//   const counts = updated.reduce((acc, e) => {
//     acc[e.status] = (acc[e.status] || 0) + 1;
//     return acc;
//   }, {});
//   console.log(`[STATUS] Counts:`, counts);

//   // 6) write back to Mongo
//   await db.collection("batches").updateOne(
//     { batch_id: batchId },
//     {
//       $set: {
//         status: newStatus,
//         summary: updated,
//         counts,
//         last_polled: new Date(),
//       },
//     }
//   );
//   console.log(`[STATUS] Updated batch document in Mongo`);

//   // 7) return the enriched batch
//   return res.status(200).json({
//     batch_id: batchId,
//     status: newStatus,
//     summary: updated,
//     counts,
//   });
// }







// pages/api/batches/[id]/status.js
import schedule from "node-schedule";
import axios from "axios";
import { connectToDatabase } from "../../../../lib/db";
import { scheduleRetry } from "../../../../lib/workingWindowScheduler";

const MAX_RETRIES = 5;
const REDIAL_DELAY_MINUTES = 5;

// terminal statuses (including “ended” and any no-answer variants)
const TERMINAL = [
  "completed",
  "failed",
  "no-answer",
  "busy",
  "customer_busy",
  "customer_did_not_answer",
  "ended"
];

export default async function handler(req, res) {
  console.log(
    `[STATUS] Handler invoked for batch ${req.query.id} at ${new Date().toISOString()}`
  );
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    console.log(`[STATUS] Method ${req.method} not allowed`);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id: batchId } = req.query;
  const { db } = await connectToDatabase(); 

  // 1) load the batch document
  const batch = await db.collection("batches").findOne({ batch_id: batchId });
  if (!batch) {
    console.log(`[STATUS] Batch ${batchId} not found`);
    return res.status(404).json({ message: "Batch not found" });
  }

  console.log(
    `[STATUS] Loaded batch ${batchId} with ${batch.summary.length} entries`
  );

  // 2) poll Vapi for each in-flight call, collect updated entries
  const updated = await Promise.all(
    batch.summary.map(async (entry) => {
      console.log(
        `[STATUS] Checking entry row ${entry.row}, callId=${entry.callId}, status=${entry.status}`
      );
      // skip if no callId or already terminal
      // if (!entry.callId || TERMINAL.includes(entry.status)) {
      //   console.log(`[STATUS] Skipping row ${entry.row}`);
      //   return entry;
      // }


if (!entry.callId) return entry;

 const isTerminal = TERMINAL.includes(entry.status);
 const hasReason  = !!entry.endedReason;

 if (isTerminal && hasReason) {
  console.log(`[STATUS] Skipping row ${entry.row} (reason already known)`);
   return entry;
 }

      let resp;
      try {
        resp = await axios.get(`https://api.vapi.ai/call/${entry.callId}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
          },
        });
        console.log(
          `[STATUS] Polled callId ${entry.callId}: ${resp.data.status}`
        );
      } catch (err) {
        console.error(
          `[STATUS] Error polling callId ${entry.callId}:`,
          err.message
        );
        return entry;
      }

      const { status, endedReason } = resp.data;
      console.log(`[STATUS] row ${entry.row} endedReason= ${endedReason}`);
      const next = {
        ...entry,
        status,
        endedReason,
        retryCount: entry.retryCount || 0,
      };

      // 3) if customer didn’t answer, schedule a re-dial up to MAX_RETRIES
      if (
        endedReason === "customer-did-not-answer" &&
        next.retryCount < MAX_RETRIES
      ) {
        console.log(
          `[STATUS] Will retry #${next.retryCount + 1} for row ${entry.row} in working hours`
        );

        scheduleRetry(
          {
            now: new Date(),
            timezone: entry.timezone,
            delayMinutes: REDIAL_DELAY_MINUTES,
          },
          async () => {
            console.log(
              `[RETRY] Executing retry #${next.retryCount + 1} for row ${entry.row} at ${new Date().toISOString()}`
            );
            try {
              const { data } = await axios.post(
                "https://api.vapi.ai/call",
                {
                  assistantId: batch.assistant_id,
                  phoneNumberId: batch.phoneNumberId,
                  customer: {
                    number: entry.customerNumber,
                    name: entry.name,
                  },
                  assistantOverrides: {
                    variableValues: {
                      firstName: entry.name,
                      timezone: entry.timezone,
                    },
                  },
                  metadata: {
                    batchId,
                    row: entry.row,
                    retry: next.retryCount + 1,
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
                  },
                }
              );
              console.log(
                `[RETRY] Scheduled redial success for row ${entry.row}, new callId=${data.id}`
              );
            } catch (err) {
              console.error(
                `[RETRY] Failed to redial row ${entry.row}:`,
                err.response?.data || err.message
              );
            }
          }
        );

        // increment retry count so we don’t exceed MAX_RETRIES
        next.retryCount++;
      }

      return next;
    })
  );

  // 4) derive the overall batch status
  const allDone = updated.every((e) => TERMINAL.includes(e.status));
  const newStatus = allDone ? "completed" : "running";
  console.log(`[STATUS] Derived batch status=${newStatus}`);

  // 5) compute counts by status
  const counts = updated.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});
  console.log(`[STATUS] Counts:`, counts);

  // 6) write back to Mongo
  await db.collection("batches").updateOne(
    { batch_id: batchId },
    {
      $set: {
        status: newStatus,
        summary: updated,
        counts,
        last_polled: new Date(),
      },
    }
  );
  console.log(`[STATUS] Updated batch document in Mongo`);

  // 7) return the enriched batch
  return res.status(200).json({
    batch_id: batchId,
    status: newStatus,
    summary: updated,
    counts,
  });
}