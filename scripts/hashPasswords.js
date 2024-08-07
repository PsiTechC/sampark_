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

  console.log('Super admin user created');
}

createSuperAdmin().catch(console.error);
