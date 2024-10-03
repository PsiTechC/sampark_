// C:\Users\***REMOVED*** kale\botGIT\pages\api\register\check-user.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ email });

      res.status(200).json({ exists: !!user });
    } catch (error) {
      console.error('Error checking user existence:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
