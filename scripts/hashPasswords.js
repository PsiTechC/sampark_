const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' });

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db('***REMOVED***');
    const users = database.collection('users');

    // Define the users to be added
    const usersToAdd = [
      {
        email: 'superadmin@example.com',
        password: 'new2',
        role: 'superadmin'
      },
      
    ];

    for (const user of usersToAdd) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await users.insertOne({ email: user.email, password: hashedPassword, role: user.role });
    }

    console.log('Users have been added successfully.');
  } finally {
    await client.close();
  }
}

main().catch(console.error);
