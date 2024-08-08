const dotenv = require('dotenv');
const path = require('path');

// Explicitly load .env.local file
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
