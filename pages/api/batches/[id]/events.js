// pages/api/batches/[id]/events.js
import { connectToDatabase } from "../../../../lib/db";
const TERMINAL = ["completed","failed","no-answer","busy","customer_busy","customer_did_not_answer"];

export default async (req,res)=>{
  if (req.method!=="POST") return res.status(405).end();
  const { id } = req.query;
  const { callId, status } = req.body;

  const { db } = await connectToDatabase();
  await db.collection("batches").updateOne(
    { batch_id: id },
    [
      { $set: {            // 1️⃣ append the latest result
          summary: { $concatArrays:["$summary",[ { callId,status } ]] }
      }},
      { $set: {            // 2️⃣ bump the counter if this result is terminal
          completed_count: {
            $add:[
              "$completed_count",
              { $cond:[ { $in:[status,TERMINAL] }, 1, 0 ] }
            ]
          }
      }},
      { $set: {            // 3️⃣ flip status when all rows are done
          status: {
            $cond:[
              { $eq:["$completed_count","$total_contacts"] },
              "completed",
              "$status"
            ]
          }
      }}
    ]
  );
  res.json({ ok:true });
};
