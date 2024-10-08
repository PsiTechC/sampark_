const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
// console.log('MONGODB_URI:', process.env.MONGODB_URI);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
// console.log('LOGIN_PAGE_URL:', process.env.LOGIN_PAGE_URL);
console.log('LOGIN_PAGE_URL:', process.env.OPENAI_API_KEY);
