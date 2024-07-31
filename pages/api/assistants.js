// import OpenAI from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

// console.log('OpenAI API Key:', process.env.OPENAI_API_KEY); // Debugging line

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export default async function handler(req, res) 
// {
//   if (req.method === 'POST') {
//     const { message } = req.body;

//     try {
//       const response = await openai.chat.completions.create({
//         model: 'gpt-4',
//         messages: [{ role: 'user', content: 'you are a coustomer care assistant for a dental clinic'}],
//       });

//       const chatResponse = response.choices[0].message.content.trim();
//       res.status(200).json({ message: chatResponse });
//     } catch (error) {
//       console.error('Error fetching OpenAI API:', error.response ? error.response.data : error.message);
//       res.status(500).json({ error: error.message, details: error.response ? error.response.data : null });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

                  // pages/api/assistants.js
// import pool from '../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { name, instructions, model, tools, settings } = req.body;

//     try {
//       const result = await pool.query(
//         'INSERT INTO assistants (name, instructions, model, file_search, code_interpreter, temperature, top_p) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
//         [name, instructions, model, tools.fileSearch, tools.codeInterpreter, settings.temperature, settings.topP]
//       );
//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'GET') {
//     try {
//       const result = await pool.query('SELECT * FROM assistants');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }


// pages/api/assistants.js
// import pool from '../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { name, instructions, model, tools, settings } = req.body;

//     try {
//       const result = await pool.query(
//         `INSERT INTO assistants (name, instructions, model, file_search, code_interpreter, temperature, top_p, max_tokens, stop_sequences, frequency_penalty, presence_penalty) 
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
//         RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature,
//           settings.topP,
//           settings.maxTokens,
//           settings.stopSequences.join(', '), // Convert array to comma-separated string for storage
//           settings.frequencyPenalty,
//           settings.presencePenalty
//         ]
//       );
//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'GET') {
//     try {
//       const result = await pool.query('SELECT * FROM assistants');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }


// import pool from '../../lib/db';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import { promisify } from 'util';

// const mkdir = promisify(fs.mkdir);

// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadPath = './uploads';
//     if (!fs.existsSync(uploadPath)) {
//       await mkdir(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };

// const runMiddleware = (req, res, fn) => {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     await runMiddleware(req, res, upload.single('image'));

//     const { name, instructions, model, tools, settings } = JSON.parse(req.body.assistant);
//     const imagePath = req.file ? req.file.path : null;

//     try {
//       const result = await pool.query(
//         'INSERT INTO assistants (name, instructions, model, file_search, code_interpreter, temperature, top_p, max_tokens, stop_sequences, frequency_penalty, presence_penalty, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
//         [name, instructions, model, tools.fileSearch, tools.codeInterpreter, settings.temperature, settings.topP, settings.maxTokens, settings.stopSequences, settings.frequencyPenalty, settings.presencePenalty, imagePath]
//       );
//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'GET') {
//     try {
//       const result = await pool.query('SELECT * FROM assistants');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }


import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../lib/db';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

const handler = nextConnect();

handler.use(upload.single('image'));

handler.post(async (req, res) => {
  const { name, instructions, model, tools, settings, assistantInfo } = JSON.parse(req.body.assistant);

  try {
    const imagePath = req.file ? req.file.path : null;

    const result = await pool.query(
      'INSERT INTO assistants (name, instructions, model, file_search, code_interpreter, temperature, top_p, max_tokens, stop_sequences, frequency_penalty, presence_penalty, assistant_info, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [name, instructions, model, tools.fileSearch, tools.codeInterpreter, settings.temperature, settings.topP, settings.maxTokens, settings.stopSequences, settings.frequencyPenalty, settings.presencePenalty, assistantInfo, imagePath]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating assistant:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

export default handler;
