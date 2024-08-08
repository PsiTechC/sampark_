// import nextConnect from 'next-connect';

// console.log('nextConnect:', nextConnect); // Debugging line

// const handler = nextConnect();

// handler.get((req, res) => {
//   res.json({ message: 'Next-connect is working!' });
// });

// export default handler;
// pages/api/test.js

// pages/api/test.js
export default function handler(req, res) {
  console.log('Test endpoint hit');
  res.status(200).json({ message: 'Test endpoint working' });
}
