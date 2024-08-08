// testEnv.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
