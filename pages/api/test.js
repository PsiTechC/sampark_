import nextConnect from 'next-connect';

console.log('nextConnect:', nextConnect); // Debugging line

const handler = nextConnect();

handler.get((req, res) => {
  res.json({ message: 'Next-connect is working!' });
});

export default handler;
