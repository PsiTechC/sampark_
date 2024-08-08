// // lib/db.js
// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// const options = {
//   useUnifiedTopology: true,
// };

// let client;
// let clientPromise;

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export async function connectToDatabase() {
//   const client = await clientPromise;
//   const db = client.db(process.env.DB_NAME);
//   return { client, db };
// }

<<<<<<< HEAD

// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// const options = {};

// let client;
// let clientPromise;

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export async function connectToDatabase() {
//   const client = await clientPromise;
//   const db = client.db(process.env.MONGODB_DB); // Use the database name from your environment variables
//   return { client, db };
// }


// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// const options = {};

// let client;
// let clientPromise;

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export async function connectToDatabase() {
//   const client = await clientPromise;
//   const db = client.db(process.env.MONGODB_DB);
//   return { client, db };
// }


// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// const options = {};

// let client;
// let clientPromise;

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export async function connectToDatabase() {
//   const client = await clientPromise;
//   const db = client.db(process.env.MONGODB_DB);
//   return { client, db };
// }



import { MongoClient } from 'mongodb';
=======
// lib/db.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const { MongoClient } = require('mongodb');
>>>>>>> be018253bc16f8ae8b3a724baadb3ed97d9d8bf1

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

<<<<<<< HEAD
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return { client, db };
}
=======
module.exports = {
  connectToDatabase: async () => ({ db: (await clientPromise).db() }),
};
>>>>>>> be018253bc16f8ae8b3a724baadb3ed97d9d8bf1
