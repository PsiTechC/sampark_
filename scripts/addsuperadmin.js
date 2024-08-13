const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Load .env.local at the very top before any other code
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const { connectToDatabase } = require('../lib/db');

async function createSuperAdmin() {
  try {
    const { db } = await connectToDatabase(); // Destructure to get the `db` object
    const email = 'sanketkkapoor07@gmail.com';
    const password = 'sanket'; // Plaintext password

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the super admin user into the users collection
    await db.collection('users').insertOne({
      email,
      password: hashedPassword, // Store the hashed password
      role: 'superadmin', // Make sure the role matches what your login check expects
    });

    console.log('Super admin user created successfully');
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
}

createSuperAdmin().catch(console.error);
