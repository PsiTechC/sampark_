const { connectToDatabase } = require('../lib/db'); // Adjust the import path if necessary
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Explicitly load .env.local file
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function createSuperAdmin() {
  const { db } = await connectToDatabase(); // Destructure to get the `db` object
  const email = 'kale***REMOVED***980@gmail.com';
  const password = '***REMOVED***';
  const hashedPassword = bcrypt.hashSync(password, 10);

  await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    role: 'superadmin', // Make sure the role matches what your login check expects
  });

<<<<<<< HEAD
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
=======
  console.log('Super admin user created');
>>>>>>> origin/main
}

createSuperAdmin().catch(console.error);
