import CorsMiddleware from "../../../lib/cors-middleware";
import { connectToDatabase } from "../../../lib/db";

const API_KEY_VAPI = process.env.NEXT_PUBLIC_API_TOKEN_VAPI;
const PHONE_NUMBER_ID = "4519aa32-fcb2-4bf6-9200-53a6959258e1";

async function initiateVapiCall(assistantId, customerNumber) {
    try {
        const response = await fetch("https://api.vapi.ai/call", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY_VAPI}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phoneNumberId: PHONE_NUMBER_ID,
                assistantId,
                customer: {
                    number: customerNumber,
                    extension: "",
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ Call failed for ${customerNumber}:`, data);
            return null;
        }

        const executionId = data.id || data.execution_id;
        console.log(`✅ Call initiated for ${customerNumber}: Execution ID: ${executionId}`);
        return executionId;
    } catch (err) {
        console.error("❌ Error initiating call:", err.message);
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    await CorsMiddleware(req, res);

    try {
        const { db } = await connectToDatabase();
        const responsesCollection = db.collection("whatsappresponses");
        const trackingCollection = db.collection("ws_broadcast_assistant_ids");
        const wsMapCollection = db.collection("client_user_assistant_and_wsmap");

        const allDocs = await responsesCollection.find({}).toArray();

        for (const doc of allDocs) {
            const rawJsonStr = doc.raw_response_json;
            const customerNumber = doc.customer_number;

            if (!rawJsonStr) continue;

            let parsedJson;
            try {
                parsedJson = JSON.parse(rawJsonStr);
            } catch (error) {
                console.warn(`⚠️ Failed to parse JSON for document ${doc._id}`);
                continue;
            }

            if (parsedJson["screen_0_Call_Me__0"] === true) {
                const contextMessageId = doc.context_message_id;
                const formattedNumber = customerNumber.startsWith("+") ? customerNumber : `+${customerNumber}`;
                console.log(`📞 Call confirmed by: ${formattedNumber}`);

                if (!contextMessageId) {
                    console.warn(`⚠️ No context_message_id found for ${formattedNumber}`);
                    continue;
                }

                // 🧠 Find the assistantId from ws map using context message ID
                const wsMapDoc = await wsMapCollection.findOne({ id: contextMessageId });

                if (!wsMapDoc || !wsMapDoc.assistantId) {
                    console.warn(`❌ No assistantId found for context_message_id: ${contextMessageId}`);
                    continue;
                }

                const assistantId = wsMapDoc.assistantId;
                const executionId = await initiateVapiCall(assistantId, formattedNumber);

                if (executionId) {
                    await trackingCollection.updateOne(
                        { assistantId },
                        {
                            $push: {
                                executions: {
                                    executionId,
                                    customerNumber: formattedNumber,
                                    triggeredAt: new Date(),
                                },
                            },
                            $setOnInsert: {
                                assistantId,
                            },
                        },
                        { upsert: true }
                    );

                    console.log(`📝 Saved execution ID to assistantId ${assistantId}`);


                    // ✅ 2. Delete the processed WhatsApp response
                    await responsesCollection.deleteOne({ _id: doc._id });
                    console.log(`🗑️ Deleted whatsappresponses doc for ${formattedNumber}`);

                    // ✅ 3. Remove only the used ID from the array
                    await wsMapCollection.updateOne(
                        { assistantId },
                        { $pull: { id: contextMessageId } }
                    );
                    console.log(`🧹 Removed msg ID ${contextMessageId} from assistantId ${assistantId}`);
                }
            }
        }

        return res.status(200).json({ message: "Call check, trigger, and cleanup complete." });
    } catch (err) {
        console.error("❌ Error in handler:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
