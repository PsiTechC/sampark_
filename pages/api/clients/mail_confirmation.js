import { MongoClient } from "mongodb";

async function updateAllMailFlags() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(); // default db from URI
    const collection = db.collection("userdatafromcallwithsentiment");

    const allDocs = await collection.find({}).toArray();

    for (const doc of allDocs) {
      const assistantId = doc.assistantId;
      const data = doc.data;

      if (!data || typeof data !== "object") continue;

      const $set = {};
      const $unset = {};

      for (const callId of Object.keys(data)) {
        const callData = data[callId];

        // Set required flags
        $set[`data.${callId}.isMailSend`] = true;
        $set[`data.${callId}.isUserCorrectedMailSend`] = true;

        // Remove any other boolean keys
        for (const [key, value] of Object.entries(callData)) {
          const path = `data.${callId}.${key}`;
          if (
            typeof value === "boolean" &&
            key !== "isMailSend" &&
            key !== "isUserCorrectedMailSend"
          ) {
            $unset[path] = "";
          }
        }
      }

      const updatePayload = {};
      if (Object.keys($set).length > 0) updatePayload["$set"] = $set;
      if (Object.keys($unset).length > 0) updatePayload["$unset"] = $unset;

      if (Object.keys(updatePayload).length > 0) {
        await collection.updateOne({ assistantId }, updatePayload);
        console.log(`✅ Updated assistantId: ${assistantId}`);
      }
    }

    console.log("🎉 All entries updated successfully.");
  } catch (err) {
    console.error("❌ Error updating documents:", err);
  } finally {
    await client.close();
  }
}

updateAllMailFlags();
