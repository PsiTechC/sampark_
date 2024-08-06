// Connect to your MongoDB instance
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

const updateVoiceField = async () => {
  try {
    await client.connect();
    const db = client.db(); // Use the default database specified in the URI
    const collection = db.collection('assistants');

    // Update the voice field for all documents
    const result = await collection.updateMany(
      { voice: "en-US" }, // Query to match documents with voice field "en-US"
      { $set: { voice: "nova" } } // Update operation to set the voice field to a valid value
    );

    console.log(`${result.modifiedCount} document(s) were updated.`);
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    await client.close();
  }
};

updateVoiceField();
