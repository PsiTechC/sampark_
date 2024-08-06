
// // lib/db.js
// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// const pool = new Pool({
//   connectionString,
// });

// // Test the connection
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//   } else {
//     console.log('Database connected:', res.rows[0]);
//   }
//  // pool.end();
// });

// export default pool;


//working db
// import { MongoClient } from 'mongodb';
// import dotenv from 'dotenv';

// dotenv.config();

// const client = new MongoClient(process.env.MONGODB_URI);

// let db;

// export const connectToDatabase = async () => {
//   if (!db) {
//     try {
//       await client.connect();
//       db = client.db(); // Use the default database specified in the URI
//       console.log('Connected to MongoDB');
//     } catch (error) {
//       console.error('Error connecting to MongoDB:', error);
//     }
//   }
//   return db;
// };


import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

let db;

export const connectToDatabase = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db(process.env.MONGODB_DB);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  return db;
};


