const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' }); // Ensure this points to your .env.local file

async function main() {
  const uri = process.env.MONGODB_URI;

  console.log('Environment Variables:', process.env); // Debugging line to print all environment variables

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  console.log('Connecting to MongoDB with URI:', uri); // Debugging line

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('***REMOVED***');
    const users = database.collection('users');

    // Set the new password for the superadmin
    const newSuperadminPassword = 'new_superadmin_password'; // Set your new superadmin password here
    const hashedPassword = await bcrypt.hash(newSuperadminPassword, 10);

    // Update the superadmin password in the database
    await users.updateOne({ email: 'superadmin@example.com' }, { $set: { password: hashedPassword } });

    console.log('Superadmin password has been updated and hashed successfully.');
  } finally {
    await client.close();
  }
}

main().catch(console.error);
