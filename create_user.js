const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createUser() {
  const uri = "***REMOVED***";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db("***REMOVED***");
    const collection = db.collection("users");

    const email = "kale***REMOVED***980@gmail.com";
    const plainTextPassword = "***REMOVED***";

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    const user = {
      email,
      password: hashedPassword,
      role: 'superadmin' // Adding the role field here
    };

    const result = await collection.insertOne(user);
    console.log("User created:", result.insertedId);

    const insertedUser = await collection.findOne({ _id: result.insertedId });
    console.log("Inserted user details:", insertedUser);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await client.close();
  }
}

createUser();
