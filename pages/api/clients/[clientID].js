

// // C:\Users\***REMOVED*** kale\botGIT\pages\api\clients\[clientID].js
// import { connectToDatabase } from '../../../lib/db';
// import { ObjectId } from 'mongodb';
// import bcrypt from 'bcryptjs';

// export default async function handler(req, res) {
//   console.log(`[PASSWORD RESET] Received request with query: ${JSON.stringify(req.query)}`);

//   const { clientID } = req.query; // Use 'clientID' to match the route parameter case

//   console.log(`[PASSWORD RESET] Extracted clientID: ${clientID}`);

//   if (!clientID) {
//     console.error(`[PASSWORD RESET] clientID is undefined or missing`);
//     return res.status(400).json({ message: 'clientID is required' });
//   }

//   if (req.method === 'POST') {
//     const { password } = req.body;

//     if (!password) {
//       console.error(`[PASSWORD RESET] Password is undefined or missing in the request body`);
//       return res.status(400).json({ message: 'Password is required' });
//     }

//     try {
//       const { db } = await connectToDatabase();

//       let objectId;
//       try {
//         objectId = new ObjectId(clientID);
//         console.log(`[PASSWORD RESET] Converted clientID to ObjectId: ${objectId}`);
//       } catch (error) {
//         console.error(`[PASSWORD RESET] Invalid clientID format: ${clientID}`);
//         return res.status(400).json({ message: 'Invalid clientID format' });
//       }

//       const client = await db.collection('clients').findOne({ _id: objectId });
//       if (!client) {
//         console.error(`[PASSWORD RESET] Client not found for ID: ${clientID}`);
//         return res.status(404).json({ message: 'Client not found' });
//       }
//       console.log(`[PASSWORD RESET] Retrieved client: ${JSON.stringify(client)}`);

//       const hashedPassword = await bcrypt.hash(password, 10);
//       console.log(`[PASSWORD RESET] New hashed password generated: ${hashedPassword}`);

//       const updateResult = await db.collection('clients').updateOne(
//         { _id: objectId },
//         {
//           $set: {
//             password: hashedPassword,
//             firstLogin: false,
//           },
//         }
//       );

//       if (updateResult.modifiedCount > 0) {
//         console.log(`[PASSWORD RESET] Password updated successfully for client: ${clientID}`);
//         return res.status(200).json({ message: 'Password reset successfully' });
//       } else {
//         console.error(`[PASSWORD RESET] No documents were modified. This may indicate that the password was already up-to-date.`);
//         return res.status(500).json({ message: 'Failed to update password. No documents were modified.' });
//       }
//     } catch (error) {
//       console.error(`[PASSWORD RESET] Internal server error while updating password for client: ${clientID}`, error);
//       return res.status(500).json({ message: 'Internal server error occurred during password reset.' });
//     }
//   } else {
//     console.error(`[PASSWORD RESET] Invalid method: ${req.method}`);
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }



import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  console.log(`[REQUEST HANDLER] Received request with query: ${JSON.stringify(req.query)}`);

  const { clientID } = req.query;

  console.log(`[REQUEST HANDLER] Extracted clientID: ${clientID}`);

  if (!clientID) {
    console.error(`[REQUEST HANDLER] clientID is undefined or missing`);
    return res.status(400).json({ message: 'clientID is required' });
  }

  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const objectId = new ObjectId(clientID);

      const client = await db.collection('clients').findOne({ _id: objectId });
      if (!client) {
        console.error(`[GET CLIENT] Client not found for ID: ${clientID}`);
        return res.status(404).json({ message: 'Client not found' });
      }

      console.log(`[GET CLIENT] Retrieved client: ${JSON.stringify(client)}`);
      return res.status(200).json(client);
    } catch (error) {
      console.error(`[GET CLIENT] Internal server error while fetching data for client: ${clientID}`, error);
      return res.status(500).json({ message: 'Internal server error occurred while fetching client data.' });
    }
  } else if (req.method === 'POST') {
    const { password } = req.body;

    if (!password) {
      console.error(`[PASSWORD RESET] Password is undefined or missing in the request body`);
      return res.status(400).json({ message: 'Password is required' });
    }

    try {
      const { db } = await connectToDatabase();

      let objectId;
      try {
        objectId = new ObjectId(clientID);
        console.log(`[PASSWORD RESET] Converted clientID to ObjectId: ${objectId}`);
      } catch (error) {
        console.error(`[PASSWORD RESET] Invalid clientID format: ${clientID}`);
        return res.status(400).json({ message: 'Invalid clientID format' });
      }

      const client = await db.collection('clients').findOne({ _id: objectId });
      if (!client) {
        console.error(`[PASSWORD RESET] Client not found for ID: ${clientID}`);
        return res.status(404).json({ message: 'Client not found' });
      }
      console.log(`[PASSWORD RESET] Retrieved client: ${JSON.stringify(client)}`);

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(`[PASSWORD RESET] New hashed password generated: ${hashedPassword}`);

      const updateResult = await db.collection('clients').updateOne(
        { _id: objectId },
        {
          $set: {
            password: hashedPassword,
            firstLogin: false,
          },
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(`[PASSWORD RESET] Password updated successfully for client: ${clientID}`);
        return res.status(200).json({ message: 'Password reset successfully' });
      } else {
        console.error(`[PASSWORD RESET] No documents were modified. This may indicate that the password was already up-to-date.`);
        return res.status(500).json({ message: 'Failed to update password. No documents were modified.' });
      }
    } catch (error) {
      console.error(`[PASSWORD RESET] Internal server error while updating password for client: ${clientID}`, error);
      return res.status(500).json({ message: 'Internal server error occurred during password reset.' });
    }
  } else {
    console.error(`[REQUEST HANDLER] Invalid method: ${req.method}`);
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
