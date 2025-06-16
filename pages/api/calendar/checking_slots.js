// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";
// import { sendWhatsAppNotification } from '../../../lib/appointment_noti/sendWhatsAppNotification'
// import { createGoogleCalendarEvent } from "../../../lib/appointment_noti/createGoogleCalendarEvent";
// import { sendingWhatsapp } from '../../../lib/appointment_noti/sendingWhatsapp'



// export default async function handler(req, res) {
//   await CorsMiddleware(req, res);

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { db } = await connectToDatabase();
//     const userSlotsCollection = db.collection("user_slots");
//     const whatsappResponsesCollection = db.collection("whatsappresponses");

//     const userSlots = await userSlotsCollection.find({}).toArray();

//     for (const slotEntry of userSlots) {
//       const phone = slotEntry.phoneNumber.replace("+", "").replace(",", "").trim();

//       const allResponses = await whatsappResponsesCollection
//         .find({ from: phone })
//         .sort({ createdAt: -1 })
//         .toArray();

//       let selected = null;
//       let selectedResponse = null;

//       for (const response of allResponses) {
//         let parsed;
//         try {
//           parsed = JSON.parse(response.raw_response_json);
//         } catch (err) {
//           console.warn(`⚠️ Invalid JSON in response for ${phone}, skipping`);
//           continue;
//         }

//         console.log(`🔍 Checking parsed response for ${phone}:`, parsed);

//         const hasEmail = Object.values(parsed).some(
//           (val) => typeof val === "string" && val.includes("@")
//         );

//         if (hasEmail) {
//           console.log(`✉️ Skipping response with email for ${phone}`);
//           continue;
//         }

//         const slotValue = Object.values(parsed).find(
//           (val) =>
//             typeof val === "string" &&
//             /^([0-4])_Slot_([1-5])$/.test(val)
//         );

//         console.log(`🔎 Matched slot value for ${phone}:`, slotValue);

//         if (slotValue) {
//           const match = slotValue.match(/^([0-4])_Slot_([1-5])$/);
//           if (match && parseInt(match[1]) === parseInt(match[2]) - 1) {
//             selected = parseInt(match[2], 10) - 1; // 0-based
//             selectedResponse = response;
//             console.log(`✅ Selected slot index ${selected} for ${phone}`);
//             break;
//           } else {
//             console.warn(`⚠️ Slot index mismatch in value ${slotValue} for ${phone}`);
//           }
//         } else {
//           console.warn(`⚠️ No slot pattern matched in response for ${phone}`);
//         }
//       }


//       if (selected === null) {
//         console.warn(`⚠️ No valid slot selection found for ${phone}`);
//         continue;
//       }


//       console.log(`📦 Parsed response for ${phone}:`, selectedResponse.raw_response_json);
//       console.log(`🎯 Selected slot:`, selected);

//       const selectedSlot = slotEntry.suggestedSlots[selected];
//       if (!selectedSlot) {
//         console.warn(`⚠️ Slot index ${index} not found for ${phone}`);
//         continue;
//       }


//       const {
//         accessToken,
//         refreshToken,
//         time: appointmentDate,
//       } = selectedSlot;

//       const {
//         meetingLink,
//         timezone = "Asia/Kolkata",
//         companyName,
//         companyPhone,
//         name,
//         purpose,
//         summary,
//         email,
//       } = slotEntry;

//       const eventDetails = {
//         name,
//         email,
//         customerNumber: phone,
//         appointmentDate,
//         purpose,
//         meetLink: meetingLink,
//         summary,
//         timezone,
//       };

//       // First send WhatsApp confirmation
//       const whatsappSent = await sendWhatsAppNotification(
//         phone,
//         appointmentDate,
//         meetingLink,
//         timezone,
//         companyName,
//         companyPhone
//       );

//       if (!whatsappSent) {
//         console.error(`❌ WhatsApp notification failed for ${phone}, skipping event creation.`);
//         continue;
//       }

//       const assistantId = slotEntry.assistantId;

//       if (!assistantId) {
//         console.warn(`⚠️ No assistantId in user_slots for ${phone}, skipping brochure send`);
//       } else {
//         const pdfDocs = await db.collection("s3pdfstore").find({ agentId: assistantId }).toArray();
      
//         if (!pdfDocs.length) {
//           console.warn(`📄 No brochures found for assistantId ${assistantId}`);
//         } else {
//           for (const pdf of pdfDocs) {
//             const result = await sendingWhatsapp(phone, pdf.url, companyName, companyPhone);
//             if (result?.status === "error") {
//               console.warn(`❌ Failed to send brochure to ${phone}:`, result.error);
//             } else {
//               console.log(`📩 Brochure sent to ${phone}:`, pdf.url);
//             }
//           }
//         }
//       }
      
      
//       const success = await createGoogleCalendarEvent(
//         selectedSlot.accessToken,
//         eventDetails,
//         selectedSlot.refreshToken,
//         null,
//         db
//       );


//       if (success) {
//         // ✅ Delete the user_slots document
//         await userSlotsCollection.deleteOne({ _id: slotEntry._id });

//         // ✅ Delete the WhatsApp response document that was used
//         await whatsappResponsesCollection.deleteOne({ _id: selectedResponse._id });

//         console.log(`✅ Event created and cleaned up for ${phone}`);
//       } else {
//         console.error(`❌ Failed to create calendar event for ${phone}`);
//       }
//     }

//     return res.status(200).json({ message: "Slot processing completed" });
//   } catch (error) {
//     console.error("❌ Unexpected error in checking_slots:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }



import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";
import { sendWhatsAppNotification } from '../../../lib/appointment_noti/sendWhatsAppNotification'
import { createGoogleCalendarEvent } from "../../../lib/appointment_noti/createGoogleCalendarEvent";
import { sendingWhatsapp } from '../../../lib/appointment_noti/sendingWhatsapp'



export default async function handler(req, res) {
  await CorsMiddleware(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const userSlotsCollection = db.collection("user_slots");
    const whatsappResponsesCollection = db.collection("whatsappresponses");

    const userSlots = await userSlotsCollection.find({}).toArray();

    for (const slotEntry of userSlots) {
      const phone = slotEntry.phoneNumber.replace("+", "").replace(",", "").trim();

      const allResponses = await whatsappResponsesCollection
        .find({ from: phone })
        .sort({ createdAt: -1 })
        .toArray();

      let selected = null;
      let selectedResponse = null;

      for (const response of allResponses) {
        let parsed;
        try {
          parsed = JSON.parse(response.raw_response_json);
        } catch (err) {
          console.warn(`⚠️ Invalid JSON in response for ${phone}, skipping`);
          continue;
        }

        console.log(`🔍 Checking parsed response for ${phone}:`, parsed);

        const hasEmail = Object.values(parsed).some(
          (val) => typeof val === "string" && val.includes("@")
        );

        if (hasEmail) {
          console.log(`✉️ Skipping response with email for ${phone}`);
          continue;
        }

        const slotValue = Object.values(parsed).find(
          (val) =>
            typeof val === "string" &&
            /^([0-4])_Slot_([1-5])$/.test(val)
        );

        console.log(`🔎 Matched slot value for ${phone}:`, slotValue);

        if (slotValue) {
          const match = slotValue.match(/^([0-4])_Slot_([1-5])$/);
          if (match && parseInt(match[1]) === parseInt(match[2]) - 1) {
            selected = parseInt(match[2], 10) - 1; // 0-based
            selectedResponse = response;
            console.log(`✅ Selected slot index ${selected} for ${phone}`);
            break;
          } else {
            console.warn(`⚠️ Slot index mismatch in value ${slotValue} for ${phone}`);
          }
        } else {
          console.warn(`⚠️ No slot pattern matched in response for ${phone}`);
        }
      }


      if (selected === null) {
        console.warn(`⚠️ No valid slot selection found for ${phone}`);
        continue;
      }


      console.log(`📦 Parsed response for ${phone}:`, selectedResponse.raw_response_json);
      console.log(`🎯 Selected slot:`, selected);

      const selectedSlot = slotEntry.suggestedSlots[selected];
      if (!selectedSlot) {
        console.warn(`⚠️ Slot index ${index} not found for ${phone}`);
        continue;
      }


      const {
        accessToken,
        refreshToken,
        time: appointmentDate,
      } = selectedSlot;

      const {
        meetingLink,
        timezone = "Asia/Kolkata",
        companyName,
        companyPhone,
        name,
        purpose,
        summary,
        email,
      } = slotEntry;

      const eventDetails = {
        name,
        email,
        customerNumber: phone,
        appointmentDate,
        purpose,
        meetLink: meetingLink,
        summary,
        timezone,
      };

      // First send WhatsApp confirmation
      const whatsappSent = await sendWhatsAppNotification(
        phone,
        appointmentDate,
        meetingLink,
        timezone,
        companyName,
        companyPhone
      );

      if (!whatsappSent) {
        console.error(`❌ WhatsApp notification failed for ${phone}, skipping event creation.`);
        continue;
      }

      const assistantId = slotEntry.assistantId;

      if (!assistantId) {
        console.warn(`⚠️ No assistantId in user_slots for ${phone}, skipping brochure send`);
      } else {
        const pdfDocs = await db.collection("s3pdfstore").find({ agentId: assistantId }).toArray();
      
        if (!pdfDocs.length) {
          console.warn(`📄 No brochures found for assistantId ${assistantId}`);
        } else {
          for (const pdf of pdfDocs) {
            const result = await sendingWhatsapp(phone, pdf.url, companyName, companyPhone);
            if (result?.status === "error") {
              console.warn(`❌ Failed to send brochure to ${phone}:`, result.error);
            } else {
              console.log(`📩 Brochure sent to ${phone}:`, pdf.url);
            }
          }
        }
      }
      
      
      const success = await createGoogleCalendarEvent(
        selectedSlot.accessToken,
        eventDetails,
        selectedSlot.refreshToken,
        null,
        db
      );


      if (success) {
        // ✅ Delete the user_slots document
        await userSlotsCollection.deleteOne({ _id: slotEntry._id });

        // ✅ Delete the WhatsApp response document that was used
        await whatsappResponsesCollection.deleteOne({ _id: selectedResponse._id });

        console.log(`✅ Event created and cleaned up for ${phone}`);
      } else {
        console.error(`❌ Failed to create calendar event for ${phone}`);
      }
    }

    return res.status(200).json({ message: "Slot processing completed" });
  } catch (error) {
    console.error("❌ Unexpected error in checking_slots:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
