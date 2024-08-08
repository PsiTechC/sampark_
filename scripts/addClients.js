// scripts/addClients.js

const { connectToDatabase } = require('../lib/db');
const bcrypt = require('bcryptjs');

async function addClients() {
  const { db } = await connectToDatabase();

  const clients = [
    { name: 'Client 1', email: 'client1@example.com', password: 'password1', role: 'client' },
    { name: 'Client 2', email: 'client2@example.com', password: 'password2', role: 'client' },
    // Add more clients as needed
  ];

  for (const client of clients) {
    const hashedPassword = await bcrypt.hash(client.password, 10);
    await db.collection('users').insertOne({
      name: client.name,
      email: client.email,
      password: hashedPassword,
      role: client.role,
    });
  }

  console.log('Clients added successfully');
}

addClients().catch(console.error);
