// import { connectToDatabase } from "../../../lib/db";
// import CorsMiddleware from "../../../lib/cors-middleware";

// import { sendEmailNotification } from '../../../lib/appointment_noti/sendEmailNotification'
// import { sendWhatsAppNotification } from '../../../lib/appointment_noti/sendWhatsAppNotification'
// import { sendWhatsAppConfirmation } from '../../../lib/appointment_noti/sendWhatsAppConfirmation'
// import { sendWhatsappSlotConfirmation } from "../../../lib/appointment_noti/sendWhatsappSlotConfirmation"
// import { findUserByCallId } from '../../../helpers/findUserByCallId'
// import { bookInAvailableCalendar } from '../../../lib/appointment_noti/bookInAvailableCalendar'
// import { sendingWhatsapp } from '../../../lib/appointment_noti/sendingWhatsapp'

// export default async function handler(req, res) {
//   await CorsMiddleware(req, res);

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { db } = await connectToDatabase();
//     const callCollection = db.collection("userdatafromcallwithsentiment");
//     const meetLinksCollection = db.collection("meetlinks");
//     const whatsappResponsesCollection = db.collection("whatsappresponses");

//     const allData = await callCollection.find({}).toArray();

//     for (const doc of allData) {
//       const assistantId = doc.assistantId;
//       const callData = doc.data || {};
//       const callIds = Object.keys(callData);

//       for (const callId of callIds) {
//         const call = callData[callId];
//         const { appointmentDate, name, customerNumber, email, purpose, summary } = call;
//         let finalName = name;
//         const timezone = call.timezone || "Asia/Kolkata";

//         const validDate =
//           appointmentDate &&
//           typeof appointmentDate === "string" &&
//           appointmentDate !== "-" &&
//           appointmentDate.includes("T") &&
//           !isNaN(Date.parse(appointmentDate));

//         if (!validDate) continue;


//         if (call.isMailSend === true && call.isUserCorrectedMailSend === true) {
//           continue;
//         }

//         let user, tokens;
//         try {
//           const result = await findUserByCallId(callId, db);
//           user = result.user;
//           tokens = result.tokens;
//         } catch (err) {
//           console.warn(`⚠️ Skipping callId ${callId}: ${err.message}`);
//           continue;
//         }

//         if (!user || tokens.length === 0) continue;

//         const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
//         const meetingLink = meetLinkDoc?.meetLink && meetLinkDoc.meetLink !== "-" ? meetLinkDoc.meetLink : "https://meet.google.com/default-link";

//         const userAgentMapping = await db.collection("useragentmapping").findOne({ assistants: assistantId });

//         let companyName = "SamparkAI";
//         let companyPhone = "+91XXXXXXXXXX";

//         if (userAgentMapping?.userId) {
//           const userDoc = await db.collection("users").findOne({ _id: userAgentMapping.userId });
//           if (userDoc) {
//             companyName = userDoc.companyName || companyName;
//             companyPhone = userDoc.phoneNumber || companyPhone;
//           }
//         }

//         if (call.isMailSend !== true && customerNumber && customerNumber !== "-") {
//           const bookingResult = await bookInAvailableCalendar(
//             user,
//             tokens,
//             {
//               name: finalName,
//               email,
//               customerNumber,
//               appointmentDate,
//               purpose,
//               meetLink: meetingLink,
//               summary,
//               timezone,
//             },
//             timezone,
//             db
//           );

//           if (!bookingResult.success) {
//             await sendWhatsappSlotConfirmation(customerNumber, bookingResult.suggestedSlots, companyName, timezone);
//             const userSlotsCollection = db.collection("user_slots");
//             await userSlotsCollection.insertOne({
//               assistantId,
//               phoneNumber: customerNumber,
//               suggestedSlots: bookingResult.suggestedSlots,
//               meetingLink,
//               timezone,
//               companyName,
//               companyPhone,
//               name: finalName,
//               purpose,
//               summary,
//               email,
//               createdAt: new Date(),
//             });
//             await callCollection.updateOne(
//               { assistantId },
//               { $set: { [`data.${callId}.isMailSend`]: true } }
//             );
//             continue;
//           }

//           const whatsappSent = await sendWhatsAppNotification(
//             customerNumber,
//             appointmentDate,
//             meetingLink,
//             timezone,
//             companyName,
//             companyPhone,
//             10
//           );

//           if (whatsappSent) {
//             await callCollection.updateOne(
//               { assistantId },
//               { $set: { [`data.${callId}.isMailSend`]: true } }
//             );
//             await callCollection.updateOne(
//               { assistantId },
//               { $set: { [`data.${callId}.isUserCorrectedMailSend`]: false } }
//             );

//             const cleanNumber = customerNumber?.startsWith("+") ? customerNumber.slice(1) : customerNumber;
//             const responseDoc = await whatsappResponsesCollection.findOne({ customer_number: cleanNumber });

//             if (responseDoc?.raw_response_json) {
//               try {
//                 const parsed = JSON.parse(responseDoc.raw_response_json);

//                 const nameFromWhatsApp = Object.entries(parsed).find(
//                   ([key, val]) => key.toLowerCase().includes("name") && typeof val === "string"
//                 )?.[1];

//                 if (nameFromWhatsApp) {
//                   finalName = nameFromWhatsApp.trim();  // Overriding the name with the WhatsApp response
//                   console.log(`📛 Name overridden from WhatsApp response: ${finalName}`);
//                 } else {
//                   console.log("📛 No name found in WhatsApp response, using default.");
//                 }

//                 const detailsConfirmed = Object.values(parsed)
//                   .flatMap((val) => Array.isArray(val) ? val : [val])
//                   .includes("0_My_details_are_correct");

//                 const fallbackMeetLink = "https://meet.google.com/default-link";

//                 if (detailsConfirmed && email && email.includes("@")) {
//                   const emailSent = await sendEmailNotification(email, appointmentDate, fallbackMeetLink, timezone);
//                   if (emailSent) {
//                     await whatsappResponsesCollection.updateOne(
//                       { _id: responseDoc._id },
//                       { $set: { isMailExtracted: true, isMailSentFromConfirmedDetails: true } }
//                     );
//                     await callCollection.updateOne(
//                       { assistantId },
//                       { $set: { [`data.${callId}.isUserCorrectedMailSend`]: true } }
//                     );
//                   }
//                 } else {
//                   const emailCandidate = Object.values(parsed).find(
//                     (val) => typeof val === "string" && val.includes("@")
//                   );

//                   if (emailCandidate) {
//                     const extractedEmail = emailCandidate.trim();
//                     const emailSent = await sendEmailNotification(extractedEmail, appointmentDate, fallbackMeetLink, timezone);

//                     if (emailSent) {
//                       await whatsappResponsesCollection.updateOne(
//                         { _id: responseDoc._id },
//                         { $set: { isMailExtracted: true } }
//                       );
//                       await callCollection.updateOne(
//                         { assistantId },
//                         { $set: { [`data.${callId}.isUserCorrectedMailSend`]: true } }
//                       );
//                     }
//                   }
//                 }
//               } catch (err) {
//                 console.error(`❌ Failed to parse WhatsApp response for ${customerNumber}:`, err.message);
//               }
//             }
//             const pdfDocs = await db.collection("s3pdfstore").find({ agentId: assistantId }).toArray();

//             if (!pdfDocs.length) {
//               console.warn(`📄 No brochures found for assistantId ${assistantId}`);
//             } else {
//               for (const pdf of pdfDocs) {
//                 const result = await sendingWhatsapp(customerNumber, pdf.url, companyName, companyPhone);
//                 if (result?.status === "error") {
//                   console.warn(`❌ Failed to send brochure to ${customerNumber}:`, result.error);
//                 } else {
//                   console.log(`📩 Brochure sent to ${customerNumber}:`, pdf.url);
//                 }
//               }
//             }
//           }
//           const cleanNumber = customerNumber.startsWith("+") ? customerNumber.slice(1) : customerNumber;
//           const responseDoc = await whatsappResponsesCollection.findOne({ customer_number: cleanNumber });

//           if (!responseDoc && appointmentDate !== "-") {
//             await sendWhatsAppConfirmation(customerNumber, email, name);
//             console.warn(`📩 Sent fallback WhatsApp confirmation for ${customerNumber} — no WhatsApp response found.`);
//           }

//         }
//       }
//     }

//     return res.status(200).json({ message: "Notifications and calendar events processed successfully" });
//   } catch (error) {
//     console.error("❌ Failed to process calls:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }





import { connectToDatabase } from "../../../lib/db";
import CorsMiddleware from "../../../lib/cors-middleware";

import { sendEmailNotification } from '../../../lib/appointment_noti/sendEmailNotification'
import { sendWhatsAppNotification } from '../../../lib/appointment_noti/sendWhatsAppNotification'
import { sendWhatsAppConfirmation } from '../../../lib/appointment_noti/sendWhatsAppConfirmation'
import { sendWhatsappSlotConfirmation } from "../../../lib/appointment_noti/sendWhatsappSlotConfirmation"
import { findUserByCallId } from '../../../helpers/findUserByCallId'
import { bookInAvailableCalendar } from '../../../lib/appointment_noti/bookInAvailableCalendar'
import { sendingWhatsapp } from '../../../lib/appointment_noti/sendingWhatsapp'

export default async function handler(req, res) {
  await CorsMiddleware(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const callCollection = db.collection("userdatafromcallwithsentiment");
    const meetLinksCollection = db.collection("meetlinks");
    const whatsappResponsesCollection = db.collection("whatsappresponses");

    const allData = await callCollection.find({}).toArray();

    for (const doc of allData) {
      const assistantId = doc.assistantId;
      const callData = doc.data || {};
      const callIds = Object.keys(callData);

      for (const callId of callIds) {
        const call = callData[callId];
        const { appointmentDate, name, customerNumber, email, purpose, summary } = call;
        let finalName = name;
        const timezone = call.timezone || "Asia/Kolkata";

        const validDate =
          appointmentDate &&
          typeof appointmentDate === "string" &&
          appointmentDate !== "-" &&
          appointmentDate.includes("T") &&
          !isNaN(Date.parse(appointmentDate));

        if (!validDate) continue;


        if (call.isMailSend === true && call.isUserCorrectedMailSend === true) {
          continue;
        }

        let user, tokens;
        try {
          const result = await findUserByCallId(callId, db);
          user = result.user;
          tokens = result.tokens;
        } catch (err) {
          console.warn(`⚠️ Skipping callId ${callId}: ${err.message}`);
          continue;
        }

        if (!user || tokens.length === 0) continue;

        const meetLinkDoc = await meetLinksCollection.findOne({ assistantId });
        const meetingLink = meetLinkDoc?.meetLink && meetLinkDoc.meetLink !== "-" ? meetLinkDoc.meetLink : "https://meet.google.com/default-link";

        const userAgentMapping = await db.collection("useragentmapping").findOne({ assistants: assistantId });

        let companyName = "SamparkAI";
        let companyPhone = "+91XXXXXXXXXX";

        if (userAgentMapping?.userId) {
          const userDoc = await db.collection("users").findOne({ _id: userAgentMapping.userId });
          if (userDoc) {
            companyName = userDoc.companyName || companyName;
            companyPhone = userDoc.phoneNumber || companyPhone;
          }
        }

        if (call.isMailSend !== true && customerNumber && customerNumber !== "-") {
          // Extract name from WhatsApp response before calling bookInAvailableCalendar
          const cleanNumber = customerNumber?.startsWith("+") ? customerNumber.slice(1) : customerNumber;
          const responseDoc = await whatsappResponsesCollection.findOne({ customer_number: cleanNumber });


          let nameFromWhatsApp = null;
          let emailCandidate = null;

          if (responseDoc?.raw_response_json) {
            try {
              const parsed = JSON.parse(responseDoc.raw_response_json);

               nameFromWhatsApp = Object.entries(parsed).find(
                ([key, val]) => key.toLowerCase().includes("name") && typeof val === "string"
              )?.[1];
              emailCandidate = Object.values(parsed).find(
                (val) => typeof val === "string" && val.includes("@")
              );
              
              if (nameFromWhatsApp) {
                finalName = nameFromWhatsApp.trim();  
                console.log(`📛 Name overridden from WhatsApp response: ${finalName}`);
              } else {
                console.log("📛 No name found in WhatsApp response, using default.");
              }
              const updateFields = {};
              if (nameFromWhatsApp) updateFields[`data.${callId}.name`] = nameFromWhatsApp.trim();
              if (emailCandidate) updateFields[`data.${callId}.email`] = emailCandidate.trim();

              if (Object.keys(updateFields).length > 0) {
                await callCollection.updateOne(
                  { assistantId },
                  { $set: updateFields }
                );
                console.log(`📦 Updated userdatafromcallwithsentiment:`, updateFields);
              }
            } catch (err) {
              console.error(`❌ Failed to parse WhatsApp response for ${customerNumber}:`, err.message);
            }
          }

          const bookingResult = await bookInAvailableCalendar(
            user,
            tokens,
            {
              name: finalName,
              email,
              customerNumber,
              appointmentDate,
              purpose,
              meetLink: meetingLink,
              summary,
              timezone,
            },
            timezone,
            db
          );

          if (!bookingResult.success) {
            await sendWhatsappSlotConfirmation(customerNumber, bookingResult.suggestedSlots, companyName, timezone);
            const userSlotsCollection = db.collection("user_slots");
            await userSlotsCollection.insertOne({
              assistantId,
              phoneNumber: customerNumber,
              suggestedSlots: bookingResult.suggestedSlots,
              meetingLink,
              timezone,
              companyName,
              companyPhone,
              name: finalName,
              purpose,
              summary,
              email,
              createdAt: new Date(),
            });
            await callCollection.updateOne(
              { assistantId },
              { $set: { [`data.${callId}.isMailSend`]: true } }
            );
            continue;
          }

          const whatsappSent = await sendWhatsAppNotification(
            customerNumber,
            appointmentDate,
            meetingLink,
            timezone,
            companyName,
            companyPhone,
            10
          );

          if (whatsappSent) {
            await callCollection.updateOne(
              { assistantId },
              { $set: { [`data.${callId}.isMailSend`]: true } }
            );
            await callCollection.updateOne(
              { assistantId },
              { $set: { [`data.${callId}.isUserCorrectedMailSend`]: false } }
            );

            if (responseDoc?.raw_response_json) {
              try {
                const parsed = JSON.parse(responseDoc.raw_response_json);

                const detailsConfirmed = Object.values(parsed)
                  .flatMap((val) => Array.isArray(val) ? val : [val])
                  .includes("0_My_details_are_correct");

                const fallbackMeetLink = "https://meet.google.com/default-link";

                if (detailsConfirmed && email && email.includes("@")) {
                  const emailSent = await sendEmailNotification(email, appointmentDate, fallbackMeetLink, timezone);
                  if (emailSent) {
                    await whatsappResponsesCollection.updateOne(
                      { _id: responseDoc._id },
                      { $set: { isMailExtracted: true, isMailSentFromConfirmedDetails: true } }
                    );
                    await callCollection.updateOne(
                      { assistantId },
                      { $set: { [`data.${callId}.isUserCorrectedMailSend`]: true } }
                    );
                  }
                } else {
                  const emailCandidate = Object.values(parsed).find(
                    (val) => typeof val === "string" && val.includes("@")
                  );

                  if (emailCandidate) {
                    const extractedEmail = emailCandidate.trim();
                    const emailSent = await sendEmailNotification(extractedEmail, appointmentDate, fallbackMeetLink, timezone);

                    if (emailSent) {
                      await whatsappResponsesCollection.updateOne(
                        { _id: responseDoc._id },
                        { $set: { isMailExtracted: true } }
                      );
                      await callCollection.updateOne(
                        { assistantId },
                        { $set: { [`data.${callId}.isUserCorrectedMailSend`]: true } }
                      );
                    }
                  }
                }
              } catch (err) {
                console.error(`❌ Failed to parse WhatsApp response for ${customerNumber}:`, err.message);
              }
            }
            const pdfDocs = await db.collection("s3pdfstore").find({ agentId: assistantId }).toArray();

            if (!pdfDocs.length) {
              console.warn(`📄 No brochures found for assistantId ${assistantId}`);
            } else {
              for (const pdf of pdfDocs) {
                const result = await sendingWhatsapp(customerNumber, pdf.url, companyName, companyPhone);
                if (result?.status === "error") {
                  console.warn(`❌ Failed to send brochure to ${customerNumber}:`, result.error);
                } else {
                  console.log(`📩 Brochure sent to ${customerNumber}:`, pdf.url);
                }
              }
            }
          }

          if (!responseDoc && appointmentDate !== "-") {
            await sendWhatsAppConfirmation(customerNumber, email, name);
            console.warn(`📩 Sent fallback WhatsApp confirmation for ${customerNumber} — no WhatsApp response found.`);
          }
        }


      }
    }

    return res.status(200).json({ message: "Notifications and calendar events processed successfully" });
  } catch (error) {
    console.error("❌ Failed to process calls:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}






