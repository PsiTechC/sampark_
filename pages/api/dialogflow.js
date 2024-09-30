// // C:\Users\***REMOVED*** kale\botGIT\pages\api\dialogflow.js
// import { v4 as uuidv4 } from 'uuid';

// import { detectIntent } from '../../lib/dialogflow';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { query } = req.body;

//     try {
//       const projectId = 'dialougeflowtest-433910';
//       const sessionId = uuidv4(); // Unique identifier for the session
//       const languageCode = 'en-US'; // Set the language code as needed

//       const response = await detectIntent(projectId, sessionId, query, languageCode);

//       res.status(200).json({ response });
//     } catch (error) {
//       res.status(500).json({ error: 'Error communicating with Dialogflow', details: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

// C:\Users\***REMOVED*** kale\botGIT\pages\api\dialogflow.js
import { detectIntent } from '../../lib/dialogflow';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;

    try {
      const projectId = 'dialougeflowtest-433910';
      const location = 'us-central1'; // e.g., 'us-central1'
      const agentId = 'ed9af07b-344f-4153-b0e8-77e63cb9dae9'; // Your Dialogflow CX agent ID
      const sessionId = uuidv4(); // Unique identifier for the session
      const languageCode = 'en'; // Set the language code as needed

      const response = await detectIntent(projectId, location, agentId, sessionId, query, languageCode);

      res.status(200).json({ response });
    } catch (error) {
      res.status(500).json({ error: 'Error communicating with Dialogflow', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
