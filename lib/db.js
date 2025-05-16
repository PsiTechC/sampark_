require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let client;
let clientPromise;

const options = {
  useNewUrlParser: true, // Ensures compatibility with connection string formats
};

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log('Connected to MongoDB (Development Mode)');
        return client;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit to prevent the server from running with a failed DB connection
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then((client) => {
      console.log('Connected to MongoDB (Production Mode)');
      return client;
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
}

module.exports = {
  connectToDatabase: async () => {
    const dbClient = await clientPromise;
    return { db: dbClient.db() };
  },
};
