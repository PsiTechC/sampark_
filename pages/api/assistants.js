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


// import nextConnect from 'next-connect';
// import multer from 'multer';
// import pool from '../../lib/db';
// import fs from 'fs';
// import path from 'path';

// const upload = multer({ dest: 'uploads/' });

// const handler = nextConnect();

// handler.use(upload.single('image'));

// handler.post(async (req, res) => {
//   const { name, instructions, model, tools, settings, assistantInfo } = JSON.parse(req.body.assistant);

//   try {
//     const imagePath = req.file ? req.file.path : null;

//     const result = await pool.query(
//       'INSERT INTO assistants (name, instructions, model, file_search, code_interpreter, temperature, top_p, max_tokens, stop_sequences, frequency_penalty, presence_penalty, assistant_info, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
//       [name, instructions, model, tools.fileSearch, tools.codeInterpreter, settings.temperature, settings.topP, settings.maxTokens, settings.stopSequences, settings.frequencyPenalty, settings.presencePenalty, assistantInfo, imagePath]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error('Error creating assistant:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });

// export default handler;


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


// pages/api/assistants.js
// import pool from '../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { name, instructions, model, tools, settings, voice } = req.body;

//     try {
//       const result = await pool.query(
//         `INSERT INTO assistants (name, instructions, model, file_search, code_interpreter, temperature, top_p, max_tokens, stop_sequences, frequency_penalty, presence_penalty, voice) 
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
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
//           settings.stopSequences.join(', '),
//           settings.frequencyPenalty,
//           settings.presencePenalty,
//           voice // New voice field
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

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { name, instructions, model, tools, settings, voice, phoneNumber, country, assistantShowMsg } = req.body;

//     try {
//       const result = await pool.query(
//         `INSERT INTO assistants (name, instructions, model, file_search, code_interpreter, temperature, top_p, max_tokens, stop_sequences, frequency_penalty, presence_penalty, voice, phone_number, country, assistant_show_msg) 
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
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
//           settings.presencePenalty,
//           voice, // Include voice in the query
//           phoneNumber, // Include phone number in the query
//           country, // Include country in the query
//           assistantShowMsg // Include assistant_show_msg in the query
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

//working
// import multer from 'multer';
// import pool from '../../lib/db';
// import fs from 'fs';
// import path from 'path';
// import { promisify } from 'util';
// import { parse } from 'url';

// // Define the upload directory
// const uploadDir = path.join('E:', 'my_***REMOVED***', '***REMOVED***', 'uploads');

// // Create the directory if it doesn't exist
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Set up Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// const runMiddleware = promisify(upload.array('images'));

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };

// export default async function handler(req, res) {
//   const { method } = req;
//   const parsedUrl = parse(req.url, true);
//   const { pathname } = parsedUrl;

//   if (method === 'POST' && pathname === '/api/assistants') {
//     try {
//       await runMiddleware(req, res);

//       const {
//         name,
//         instructions,
//         model,
//         tools,
//         settings,
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//       } = JSON.parse(req.body.assistantData);

//       const imagePaths = req.files.map(file => file.path);

//       const result = await pool.query(
//         `INSERT INTO assistants (
//           name,
//           instructions,
//           model,
//           file_search,
//           code_interpreter,
//           temperature,
//           top_p,
//           max_tokens,
//           stop_sequences,
//           frequency_penalty,
//           presence_penalty,
//           voice,
//           phone_number,
//           country,
//           assistant_show_msg,
//           image_paths
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature,
//           settings.topP,
//           settings.maxTokens,
//           settings.stopSequences.join(', '),
//           settings.frequencyPenalty,
//           settings.presencePenalty,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           imagePaths.join(', '), // Convert array to comma-separated string for storage
//         ]
//       );

//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'GET' && pathname === '/api/assistants') {
//     try {
//       const result = await pool.query('SELECT * FROM assistants');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }


// import multer from 'multer';
// import pool from '../../lib/db';
// import fs from 'fs';
// import path from 'path';
// import { promisify } from 'util';
// import { parse } from 'url';

// // Define the upload directory
// const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// // Create the directory if it doesn't exist
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Set up Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// const runMiddleware = promisify(upload.array('images'));

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };

// export default async function handler(req, res) {
//   const { method } = req;
//   const parsedUrl = parse(req.url, true);
//   const { pathname } = parsedUrl;

//   if (method === 'POST' && pathname === '/api/assistants') {
//     try {
//       await runMiddleware(req, res);

//       const {
//         name,
//         instructions,
//         model,
//         tools,
//         settings,
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//       } = JSON.parse(req.body.assistantData);

//       const imagePaths = req.files.map(file => `uploads/${file.filename}`);

//       const result = await pool.query(
//         `INSERT INTO assistants (
//           name,
//           instructions,
//           model,
//           file_search,
//           code_interpreter,
//           temperature,
//           top_p,
//           max_tokens,
//           stop_sequences,
//           frequency_penalty,
//           presence_penalty,
//           voice,
//           phone_number,
//           country,
//           assistant_show_msg,
//           image_paths
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature,
//           settings.topP,
//           settings.maxTokens,
//           settings.stopSequences.join(', '),
//           settings.frequencyPenalty,
//           settings.presencePenalty,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           imagePaths.join(', '), // Convert array to comma-separated string for storage
//         ]
//       );

//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'GET' && pathname === '/api/assistants') {
//     try {
//       const result = await pool.query('SELECT * FROM assistants');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }


// import pool from '../../lib/db';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import { promisify } from 'util';
// import { parse } from 'url';

// const uploadDir = path.join(process.cwd(), 'public', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });
// const runMiddleware = promisify(upload.array('images'));

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };

// export default async function handler(req, res) {
//   const { method } = req;
//   const parsedUrl = parse(req.url, true);
//   const { pathname } = parsedUrl;

//   if (method === 'POST' && pathname === '/api/assistants') {
//     try {
//       await runMiddleware(req, res);

//       const {
//         name,
//         instructions,
//         model,
//         tools,
//         settings,
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//       } = JSON.parse(req.body.assistantData);

//       const imagePaths = req.files.map(file => `uploads/${file.filename}`);

//       const result = await pool.query(
//         `INSERT INTO assistants (
//           name,
//           instructions,
//           model,
//           file_search,
//           code_interpreter,
//           temperature,
//           top_p,
//           max_tokens,
//           stop_sequences,
//           frequency_penalty,
//           presence_penalty,
//           voice,
//           phone_number,
//           country,
//           assistant_show_msg,
//           image_paths
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature || null,
//           settings.topP || null,
//           settings.maxTokens || null,
//           settings.stopSequences ? settings.stopSequences.join(', ') : null,
//           settings.frequencyPenalty || null,
//           settings.presencePenalty || null,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           imagePaths.join(', '),
//         ]
//       );

//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'GET' && pathname === '/api/assistants') {
//     try {
//       const result = await pool.query('SELECT * FROM assistants');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'PUT' && pathname === '/api/assistants') {
//     try {
//       console.log('Request body:', req.body); // Detailed logging

//       const {
//         id,
//         name,
//         instructions,
//         model,
//         tools = {},
//         settings = {},
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//       } = req.body;

//       if (!id) {
//         res.status(400).json({ error: 'ID is required' });
//         return;
//       }

//       const result = await pool.query(
//         `UPDATE assistants
//          SET name = $1, instructions = $2, model = $3, file_search = $4, code_interpreter = $5, temperature = $6,
//              top_p = $7, max_tokens = $8, stop_sequences = $9, frequency_penalty = $10, presence_penalty = $11, voice = $12,
//              phone_number = $13, country = $14, assistant_show_msg = $15
//          WHERE id = $16
//          RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature || null,
//           settings.topP || null,
//           settings.maxTokens || null,
//           settings.stopSequences ? settings.stopSequences.join(', ') : null,
//           settings.frequencyPenalty || null,
//           settings.presencePenalty || null,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           id,
//         ]
//       );

//       res.status(200).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error updating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'DELETE' && pathname === '/api/assistants') {
//     try {
//       console.log('Request body:', req.body); // Detailed logging

//       const { id } = req.body;

//       if (!id) {
//         res.status(400).json({ error: 'ID is required' });
//         return;
//       }

//       // Move related messages to deleted_messages table
//       const messages = await pool.query(
//         'SELECT * FROM messages WHERE assistant_id = $1',
//         [id]
//       );

//       for (const message of messages.rows) {
//         await pool.query(
//           `INSERT INTO deleted_messages (original_message_id, assistant_id, message_content, created_at)
//            VALUES ($1, $2, $3, $4)`,
//           [message.id, message.assistant_id, message.message_content, message.created_at]
//         );
//       }

//       // Delete related messages
//       await pool.query('DELETE FROM messages WHERE assistant_id = $1', [id]);

//       // Then delete the assistant
//       const result = await pool.query(
//         'DELETE FROM assistants WHERE id = $1 RETURNING *',
//         [id]
//       );

//       res.status(200).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error deleting assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//     res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }


// assistant backend but with error in delete and edit functionality
// import pool from '../../lib/db';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import { promisify } from 'util';
// import { parse } from 'url';

// // Define the upload directory
// const uploadDir = path.join(process.cwd(), 'public', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Set up Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });
// const runMiddleware = promisify(upload.array('images'));

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };

// export default async function handler(req, res) {
//   const { method } = req;
//   const parsedUrl = parse(req.url, true);
//   const { pathname } = parsedUrl;

//   if (method === 'POST' && pathname === '/api/assistants') {
//     try {
//       await runMiddleware(req, res);

//       const {
//         name,
//         instructions,
//         model,
//         tools,
//         settings,
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//       } = JSON.parse(req.body.assistantData);

//       const imagePaths = req.files.map(file => `uploads/${file.filename}`);

//       const result = await pool.query(
//         `INSERT INTO assistants (
//           name,
//           instructions,
//           model,
//           file_search,
//           code_interpreter,
//           temperature,
//           top_p,
//           max_tokens,
//           stop_sequences,
//           frequency_penalty,
//           presence_penalty,
//           voice,
//           phone_number,
//           country,
//           assistant_show_msg,
//           image_paths
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature || null,
//           settings.topP || null,
//           settings.maxTokens || null,
//           settings.stopSequences ? settings.stopSequences.join(', ') : null,
//           settings.frequencyPenalty || null,
//           settings.presencePenalty || null,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           imagePaths.join(', '), // Convert array to comma-separated string for storage
//         ]
//       );

//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'GET' && pathname === '/api/assistants') {
//     try {
//       const result = await pool.query('SELECT * FROM assistants');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'PUT' && pathname === '/api/assistants') {
//     try {
//       console.log('Request body:', req.body); // Detailed logging

//       const {
//         id,
//         name,
//         instructions,
//         model,
//         tools = {},
//         settings = {},
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//       } = req.body;

//       if (!id) {
//         res.status(400).json({ error: 'ID is required' });
//         return;
//       }

//       const result = await pool.query(
//         `UPDATE assistants
//          SET name = $1, instructions = $2, model = $3, file_search = $4, code_interpreter = $5, temperature = $6,
//              top_p = $7, max_tokens = $8, stop_sequences = $9, frequency_penalty = $10, presence_penalty = $11, voice = $12,
//              phone_number = $13, country = $14, assistant_show_msg = $15
//          WHERE id = $16
//          RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature || null,
//           settings.topP || null,
//           settings.maxTokens || null,
//           settings.stopSequences ? settings.stopSequences.join(', ') : null,
//           settings.frequencyPenalty || null,
//           settings.presencePenalty || null,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           id,
//         ]
//       );

//       res.status(200).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error updating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'DELETE' && pathname === '/api/assistants') {
//     try {
//       console.log('Request body:', req.body); // Detailed logging

//       const { id } = req.body;

//       if (!id) {
//         res.status(400).json({ error: 'ID is required' });
//         return;
//       }

//       // Move related messages to deleted_messages table
//       const messages = await pool.query(
//         'SELECT * FROM messages WHERE assistant_id = $1',
//         [id]
//       );

//       for (const message of messages.rows) {
//         await pool.query(
//           `INSERT INTO deleted_messages (original_message_id, assistant_id, message_content, created_at)
//            VALUES ($1, $2, $3, $4)`,
//           [message.id, message.assistant_id, message.message_content, message.created_at]
//         );
//       }

//       // Delete related messages
//       await pool.query('DELETE FROM messages WHERE assistant_id = $1', [id]);

//       // Then delete the assistant
//       const result = await pool.query(
//         'DELETE FROM assistants WHERE id = $1 RETURNING *',
//         [id]
//       );

//       res.status(200).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error deleting assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//     res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }


// import pool from '../../lib/db';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import { promisify } from 'util';
// import { parse } from 'url';

// // Define the upload directory
// const uploadDir = path.join(process.cwd(), 'public', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Set up Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });
// const runMiddleware = promisify(upload.array('images'));

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };

// export default async function handler(req, res) {
//   const { method } = req;
//   const parsedUrl = parse(req.url, true);
//   const { pathname, query } = parsedUrl;

//   if (method === 'POST' && pathname === '/api/assistants') {
//     try {
//       await runMiddleware(req, res);

//       const {
//         name,
//         instructions,
//         model,
//         tools,
//         settings,
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//       } = JSON.parse(req.body.assistantData);

//       const imagePaths = req.files.map(file => `uploads/${file.filename}`);

//       const result = await pool.query(
//         `INSERT INTO assistants (
//           name,
//           instructions,
//           model,
//           file_search,
//           code_interpreter,
//           temperature,
//           top_p,
//           max_tokens,
//           stop_sequences,
//           frequency_penalty,
//           presence_penalty,
//           voice,
//           phone_number,
//           country,
//           assistant_show_msg,
//           image_paths
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature || null,
//           settings.topP || null,
//           settings.maxTokens || null,
//           settings.stopSequences ? settings.stopSequences.join(', ') : null,
//           settings.frequencyPenalty || null,
//           settings.presencePenalty || null,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           imagePaths.join(', '), // Convert array to comma-separated string for storage
//         ]
//       );

//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'GET' && pathname === '/api/assistants') {
//     try {
//       const result = await pool.query('SELECT * FROM assistants');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'PUT' && pathname === '/api/assistants') {
//     try {
//       console.log('Request body:', req.body); // Detailed logging

//       const {
//         id,
//         name,
//         instructions,
//         model,
//         tools = {},
//         settings = {},
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//       } = req.body;

//       if (!id) {
//         res.status(400).json({ error: 'ID is required' });
//         return;
//       }

//       const result = await pool.query(
//         `UPDATE assistants
//          SET name = $1, instructions = $2, model = $3, file_search = $4, code_interpreter = $5, temperature = $6,
//              top_p = $7, max_tokens = $8, stop_sequences = $9, frequency_penalty = $10, presence_penalty = $11, voice = $12,
//              phone_number = $13, country = $14, assistant_show_msg = $15
//          WHERE id = $16
//          RETURNING *`,
//         [
//           name,
//           instructions,
//           model,
//           tools.fileSearch,
//           tools.codeInterpreter,
//           settings.temperature || null,
//           settings.topP || null,
//           settings.maxTokens || null,
//           settings.stopSequences ? settings.stopSequences.join(', ') : null,
//           settings.frequencyPenalty || null,
//           settings.presencePenalty || null,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           id,
//         ]
//       );

//       res.status(200).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error updating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (method === 'DELETE' && pathname === '/api/assistants') {
//     try {
//       const { id } = query;

//       if (!id) {
//         res.status(400).json({ error: 'ID is required' });
//         return;
//       }

//       // Move related messages to deleted_messages table
//       const messages = await pool.query(
//         'SELECT * FROM messages WHERE assistant_id = $1',
//         [id]
//       );

//       for (const message of messages.rows) {
//         await pool.query(
//           `INSERT INTO deleted_messages (original_message_id, assistant_id, message_content, created_at)
//            VALUES ($1, $2, $3, $4)`,
//           [message.id, message.assistant_id, message.message_content, message.created_at]
//         );
//       }

//       // Delete related messages
//       await pool.query('DELETE FROM messages WHERE assistant_id = $1', [id]);

//       // Then delete the assistant
//       const result = await pool.query(
//         'DELETE FROM assistants WHERE id = $1 RETURNING *',
//         [id]
//       );

//       res.status(200).json(result.rows[0]);
//     } catch (error) {
//       console.error('Error deleting assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//     res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }


// pages/api/assistants.js
// import { connectToDatabase } from '../../lib/db';

// export default async function handler(req, res) {
//   const db = await connectToDatabase();
//   const collection = db.collection('assistants');

//   if (req.method === 'POST') {
//     const { name, instructions, model, tools, settings, voice, phoneNumber, country, assistantShowMsg } = req.body;
//     try {
//       const result = await collection.insertOne({
//         name,
//         instructions,
//         model,
//         tools,
//         settings,
//         voice,
//         phoneNumber,
//         country,
//         assistantShowMsg,
//         createdAt: new Date(),
//       });
//       res.status(201).json(result.ops[0]);
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'GET') {
//     try {
//       const assistants = await collection.find({}).toArray();
//       res.status(200).json(assistants);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// pages/api/assistants.js
// pages/api/assistants.js
// import { connectToDatabase } from '../../lib/db';

// export default async function handler(req, res) {
//   try {
//     const db = await connectToDatabase();
//     const collection = db.collection('assistants');

//     if (req.method === 'POST') {
//       const { name, instructions, model, tools, settings, voice, phoneNumber, country, assistantShowMsg } = req.body;
//       try {
//         const result = await collection.insertOne({
//           name,
//           instructions,
//           model,
//           tools,
//           settings,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           createdAt: new Date(),
//         });
//         res.status(201).json({ insertedId: result.insertedId });
//       } catch (error) {
//         console.error('Error creating assistant:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     } else if (req.method === 'GET') {
//       try {
//         const assistants = await collection.find({}).toArray();
//         res.status(200).json(assistants);
//       } catch (error) {
//         console.error('Error fetching assistants:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     } else {
//       res.setHeader('Allow', ['GET', 'POST']);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
//   } catch (err) {
//     console.error('Database connection error:', err);
//     res.status(500).json({ error: 'Internal Server Error', details: 'Database connection failed' });
//   }
// }



//E:\my_***REMOVED***\***REMOVED***\pages\api\assistants.js WORKING
// import { connectToDatabase } from '../../lib/db';

// export default async function handler(req, res) {
//   try {
//     console.log('Connecting to database...');
//     const db = await connectToDatabase();
//     console.log('Connected to database.');
//     const collection = db.collection('assistants');

//     if (req.method === 'POST') {
//       const { name, instructions, model, tools, settings, voice, phoneNumber, country, assistantShowMsg } = req.body;
//       try {
//         console.log('Inserting new assistant...');
//         const result = await collection.insertOne({
//           name,
//           instructions,
//           model,
//           tools,
//           settings,
//           voice,
//           phoneNumber,
//           country,
//           assistantShowMsg,
//           createdAt: new Date(),
//         });
//         console.log('Assistant inserted with ID:', result.insertedId);
//         res.status(201).json({ insertedId: result.insertedId });
//       } catch (error) {
//         console.error('Error creating assistant:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     } else if (req.method === 'GET') {
//       try {
//         console.log('Fetching assistants...');
//         const assistants = await collection.find({}).toArray();
//         console.log('Assistants fetched.');
//         res.status(200).json(assistants);
//       } catch (error) {
//         console.error('Error fetching assistants:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     } else {
//       res.setHeader('Allow', ['GET', 'POST']);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
//   } catch (err) {
//     console.error('Database connection error:', err);
//     res.status(500).json({ error: 'Internal Server Error', details: 'Database connection failed' });
//   }
// }

//everything working 06/08/24
// import { connectToDatabase } from '../../lib/db';
// import multer from 'multer';
// import { ObjectId } from 'mongodb';

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const handler = async (req, res) => {
//   if (req.method === 'POST') {
//     upload.array('images')(req, res, async (err) => {
//       if (err) {
//         console.error('Error uploading images:', err);
//         return res.status(500).json({ error: 'Error uploading images' });
//       }

//       try {
//         const db = await connectToDatabase();
//         const assistantData = JSON.parse(req.body.assistantData);

//         const images = req.files.map(file => ({
//           filename: file.originalname,
//           data: file.buffer,
//           contentType: file.mimetype,
//         }));

//         const assistant = {
//           ...assistantData,
//           images,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };

//         const result = await db.collection('assistants').insertOne(assistant);

//         res.status(201).json({ _id: result.insertedId, ...assistant });
//       } catch (error) {
//         console.error('Error creating assistant:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     });
//   } else if (req.method === 'GET') {
//     try {
//       const db = await connectToDatabase();
//       const assistants = await db.collection('assistants').find({}).toArray();
//       res.status(200).json(assistants);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };

// export default handler;



//working with edit and delete functionality 6/8/24
// import { connectToDatabase } from '../../lib/db';
// import multer from 'multer';
// import { ObjectId } from 'mongodb';

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const handler = async (req, res) => {
//   const db = await connectToDatabase();

//   if (req.method === 'POST') {
//     upload.array('images')(req, res, async (err) => {
//       if (err) {
//         console.error('Error uploading images:', err);
//         return res.status(500).json({ error: 'Error uploading images' });
//       }

//       try {
//         const assistantData = JSON.parse(req.body.assistantData);

//         const images = req.files.map(file => ({
//           filename: file.originalname,
//           data: file.buffer,
//           contentType: file.mimetype,
//         }));

//         const assistant = {
//           ...assistantData,
//           images,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };

//         const result = await db.collection('assistants').insertOne(assistant);

//         res.status(201).json({ _id: result.insertedId, ...assistant });
//       } catch (error) {
//         console.error('Error creating assistant:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     });
//   } else if (req.method === 'GET') {
//     try {
//       const assistants = await db.collection('assistants').find({}).toArray();
//       res.status(200).json(assistants);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'DELETE') {
//     try {
//       const { id } = req.query;
//       await db.collection('assistants').deleteOne({ _id: new ObjectId(id) });
//       res.status(200).json({ message: 'Assistant deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'PUT') {
//     upload.array('images')(req, res, async (err) => {
//       if (err) {
//         console.error('Error uploading images:', err);
//         return res.status(500).json({ error: 'Error uploading images' });
//       }

//       try {
//         const assistantData = JSON.parse(req.body.assistantData);
//         const { id } = assistantData;
        
//         delete assistantData.id; // Remove id from the update data

//         const images = req.files.map(file => ({
//           filename: file.originalname,
//           data: file.buffer,
//           contentType: file.mimetype,
//         }));

//         const result = await db.collection('assistants').updateOne(
//           { _id: new ObjectId(id) },
//           {
//             $set: {
//               ...assistantData,
//               images,
//               updatedAt: new Date(),
//             }
//           }
//         );

//         res.status(200).json({ message: 'Assistant updated successfully' });
//       } catch (error) {
//         console.error('Error updating assistant:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     });
//   } else {
//     res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };

// export default handler;



//working but without images
// import { connectToDatabase } from '../../lib/db';
// import multer from 'multer';
// import { ObjectId } from 'mongodb';

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const handler = async (req, res) => {
//   const db = await connectToDatabase();

//   if (req.method === 'POST') {
//     upload.array('images')(req, res, async (err) => {
//       if (err) {
//         console.error('Error uploading images:', err);
//         return res.status(500).json({ error: 'Error uploading images' });
//       }

//       try {
//         const assistantData = JSON.parse(req.body.assistantData);

//         const images = req.files.map(file => ({
//           filename: file.originalname,
//           data: file.buffer,
//           contentType: file.mimetype,
//         }));

//         const assistant = {
//           ...assistantData,
//           images,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };

//         const result = await db.collection('assistants').insertOne(assistant);

//         res.status(201).json({ _id: result.insertedId, ...assistant });
//       } catch (error) {
//         console.error('Error creating assistant:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     });
//   } else if (req.method === 'GET') {
//     try {
//       const assistants = await db.collection('assistants').find({}).toArray();
//       res.status(200).json(assistants);
//     } catch (error) {
//       console.error('Error fetching assistants:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'DELETE') {
//     try {
//       const { id } = req.query;
//       await db.collection('assistants').deleteOne({ _id: new ObjectId(id) });
//       res.status(200).json({ message: 'Assistant deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting assistant:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   } else if (req.method === 'PUT') {
//     upload.array('images')(req, res, async (err) => {
//       if (err) {
//         console.error('Error uploading images:', err);
//         return res.status(500).json({ error: 'Error uploading images' });
//       }

//       try {
//         const assistantData = JSON.parse(req.body.assistantData);
//         const { id } = assistantData;
        
//         delete assistantData.id; // Remove id from the update data

//         const existingAssistant = await db.collection('assistants').findOne({ _id: new ObjectId(id) });
//         let images = existingAssistant.images;

//         if (req.files.length > 0) {
//           images = req.files.map(file => ({
//             filename: file.originalname,
//             data: file.buffer,
//             contentType: file.mimetype,
//           }));
//         }

//         const result = await db.collection('assistants').updateOne(
//           { _id: new ObjectId(id) },
//           {
//             $set: {
//               ...assistantData,
//               images,
//               updatedAt: new Date(),
//             }
//           }
//         );

//         res.status(200).json({ message: 'Assistant updated successfully' });
//       } catch (error) {
//         console.error('Error updating assistant:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//       }
//     });
//   } else {
//     res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };

// export default handler;



import { connectToDatabase } from '../../lib/db';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const db = await connectToDatabase();

  if (req.method === 'POST') {
    upload.array('images')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading images:', err);
        return res.status(500).json({ error: 'Error uploading images' });
      }

      try {
        const assistantData = JSON.parse(req.body.assistantData);

        const images = req.files.map(file => ({
          filename: file.filename,
          filepath: `/uploads/${file.filename}`,
          contentType: file.mimetype,
        }));

        const assistant = {
          ...assistantData,
          images,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await db.collection('assistants').insertOne(assistant);

        res.status(201).json({ _id: result.insertedId, ...assistant });
      } catch (error) {
        console.error('Error creating assistant:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const assistants = await db.collection('assistants').find({}).toArray();
      res.status(200).json(assistants);
    } catch (error) {
      console.error('Error fetching assistants:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(id) });
      if (assistant.images) {
        assistant.images.forEach(image => {
          const imagePath = path.join(process.cwd(), 'public', image.filepath);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
      await db.collection('assistants').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Assistant deleted successfully' });
    } catch (error) {
      console.error('Error deleting assistant:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else if (req.method === 'PUT') {
    upload.array('images')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading images:', err);
        return res.status(500).json({ error: 'Error uploading images' });
      }

      try {
        const assistantData = JSON.parse(req.body.assistantData);
        const { id } = assistantData;

        delete assistantData.id; // Remove id from the update data

        const existingAssistant = await db.collection('assistants').findOne({ _id: new ObjectId(id) });
        let images = existingAssistant.images;

        if (req.files.length > 0) {
          images = req.files.map(file => ({
            filename: file.filename,
            filepath: `/uploads/${file.filename}`,
            contentType: file.mimetype,
          }));
        }

        const result = await db.collection('assistants').updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              ...assistantData,
              images,
              updatedAt: new Date(),
            }
          }
        );

        res.status(200).json({ message: 'Assistant updated successfully' });
      } catch (error) {
        console.error('Error updating assistant:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
