// C:\Users\***REMOVED*** kale\botGIT\pages\api\clients\[clientID].js

// pages/api/clients/[clientId].js


import { connectToDatabase } from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { clientId } = req.query;

  if (req.method === 'POST') {
    const { password } = req.body;

    try {
      const { db } = await connectToDatabase();
      console.log("Hashing new password");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("New hashed password:", hashedPassword);

      const result = await db.collection('clients').updateOne(
        { _id: clientId },
        { $set: { password: hashedPassword, firstLogin: false } }
      );

      if (result.modifiedCount > 0) {
        console.log("Password updated successfully for client:", clientId);
        res.status(200).json({ message: 'Password reset successfully' });
      } else {
        console.log("Client not found for ID:", clientId);
        res.status(404).json({ message: 'Client not found' });
      }
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    console.log("Invalid method:", req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
