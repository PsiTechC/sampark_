const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://psitech:Psitech123@pms.ijqbdmu.mongodb.net/chatbot?retryWrites=true&w=majority";
const dbName = "EmployeeM";

async function updateCheckInTime(docId, newTimeISO) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const attendanceCollection = db.collection("Attendance");

    const result = await attendanceCollection.updateOne(
      { _id: new ObjectId(docId) },
      {
        $set: {
          checkInTime: new Date(newTimeISO)
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ No document found with _id: ${docId}`);
    } else if (result.modifiedCount === 1) {
      console.log(`✅ Successfully updated checkInTime to ${newTimeISO}`);
    } else {
      console.log(`⚠️ Document found but not modified.`);
    }

  } catch (err) {
    console.error("❌ Error updating document:", err);
  } finally {
    await client.close();
  }
}

// Run the function with example values
const documentId = "684fe8439e9029e269ecacd5"; 
const newCheckInTime = "2025-06-16T04:30:00.000Z"; 

updateCheckInTime(documentId, newCheckInTime);
