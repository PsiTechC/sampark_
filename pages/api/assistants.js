// import { connectToDatabase } from '../../lib/db';
// import multer from 'multer';
// import { ObjectId } from 'mongodb';
// import fs from 'fs';
// import path from 'path';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = path.join(process.cwd(), 'public', 'uploads');
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
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
//           filename: file.filename,
//           filepath: `/uploads/${file.filename}`,
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
//       const assistant = await db.collection('assistants').findOne({ _id: new ObjectId(id) });

//       if (!assistant) {
//         return res.status(404).json({ error: 'Assistant not found' });
//       }

//       if (assistant.images) {
//         assistant.images.forEach(image => {
//           const imagePath = path.join(process.cwd(), 'public', image.filepath);
//           if (fs.existsSync(imagePath)) {
//             fs.unlinkSync(imagePath);
//           }
//         });
//       }

//       await db.collection('assistants').deleteOne({ _id: new ObjectId(id) });

//       // Delete associated messages
//       await db.collection('messages').deleteMany({ assistantId: new ObjectId(id) });

//       res.status(200).json({ message: 'Assistant and associated messages deleted successfully' });
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
//             filename: file.filename,
//             filepath: `/uploads/${file.filename}`,
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
//         res.status500.json({ error: 'Internal Server Error', details: error.message });
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
  const { db } = await connectToDatabase();

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

      if (!assistant) {
        return res.status(404).json({ error: 'Assistant not found' });
      }

      if (assistant.images) {
        assistant.images.forEach(image => {
          const imagePath = path.join(process.cwd(), 'public', image.filepath);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }

      await db.collection('assistants').deleteOne({ _id: new ObjectId(id) });

      // Delete associated messages
      await db.collection('messages').deleteMany({ assistantId: new ObjectId(id) });

      res.status(200).json({ message: 'Assistant and associated messages deleted successfully' });
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

        await db.collection('assistants').updateOne(
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
