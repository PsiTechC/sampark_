// //C:\Users\***REMOVED*** kale\botGIT\pages\api\login.js

// import { connectToDatabase } from '../../lib/db';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     try {
//       const { db } = await connectToDatabase();

//       console.log(`[LOGIN] Attempting login for email: ${email}`);

//       // Search for user in both 'users' and 'clients' collections
//       let user = await db.collection('users').findOne({ email });
//       if (!user) {
//         console.log(`[LOGIN] Email not found in 'users' collection, checking 'clients' collection.`);
//         user = await db.collection('clients').findOne({ email });
//       }

//       if (!user) {
//         console.error(`[LOGIN] Invalid email: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       console.log(`[LOGIN] User found: ${user.email} (ID: ${user._id})`);

//       // Compare the provided password with the hashed password stored in the database
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       console.log(`[LOGIN] Password comparison result for user ${user.email}: ${isPasswordValid}`);

//       if (!isPasswordValid) {
//         console.error(`[LOGIN] Invalid password for email: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       // If it's the first login, redirect to the password reset page
//       if (user.firstLogin) {
//         console.log(`[LOGIN] First login detected for user: ${user.email}`);
//         return res.status(200).json({ firstLogin: true, clientId: user._id });
//       }

//       // Create a JWT token
//       const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       console.log(`[LOGIN] JWT token generated for user: ${user.email}`);

//       res.status(200).json({ token, role: user.role, clientId: user._id });
//     } catch (error) {
//       console.error(`[LOGIN] Login error for email: ${email}`, error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     console.error(`[LOGIN] Invalid request method: ${req.method}`);
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }



// import { connectToDatabase } from '../../lib/db';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     try {
//       const { db } = await connectToDatabase();

//       console.log(`[LOGIN] Attempting login for email: ${email}`);

//       // Search for user in both 'users' and 'clients' collections
//       let user = await db.collection('users').findOne({ email });
//       if (!user) {
//         console.log(`[LOGIN] Email not found in 'users' collection, checking 'clients' collection.`);
//         user = await db.collection('clients').findOne({ email });
//       }

//       if (!user) {
//         console.error(`[LOGIN] Invalid email: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       console.log(`[LOGIN] User found: ${user.email} (ID: ${user._id})`);

//       // Compare the provided password with the hashed password stored in the database
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       console.log(`[LOGIN] Password comparison result for user ${user.email}: ${isPasswordValid}`);

//       if (!isPasswordValid) {
//         console.error(`[LOGIN] Invalid password for email: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       // If it's the first login, redirect to the password reset page
//       if (user.firstLogin) {
//         console.log(`[LOGIN] First login detected for user: ${user.email}`);
//         return res.status(200).json({ firstLogin: true, clientId: user._id });
//       }

//       // Create a JWT token
//       const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       console.log(`[LOGIN] JWT token generated for user: ${user.email}`);

//       // Redirect to client dashboard after successful login
//       res.status(200).json({ token, role: user.role, clientId: user._id, redirectUrl: `/client-dashboard/${user._id}` });
//     } catch (error) {
//       console.error(`[LOGIN] Login error for email: ${email}`, error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     console.error(`[LOGIN] Invalid request method: ${req.method}`);
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }






// 1st oct 2024

// C:\Users\***REMOVED*** kale\botGIT\pages\api\login.js
   

// import { connectToDatabase } from '../../lib/db';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     try {
//       const { db } = await connectToDatabase();

//       // Search for user in the 'users' collection
//       const user = await db.collection('users').findOne({ email });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       // Compare the provided password with the stored hashed password
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       // If it's the first login, redirect to the password reset page
//       if (user.firstLogin) {
//         return res.status(200).json({ firstLogin: true, clientId: user._id });
//       }

//       // Generate JWT token
//       const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       res.status(200).json({ token, role: user.role, clientId: user._id });
//     } catch (error) {
//       console.error('Login error:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }



// C:\Users\***REMOVED*** kale\botGIT\pages\api\login.js
// import { connectToDatabase } from '../../lib/db';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     try {
//       const { db } = await connectToDatabase();

//       // Fetch user details based on email
//       const user = await db.collection('clients').findOne({ email });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       // Validate password
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       // Generate a JWT token
//       const token = jwt.sign({ email: user.email, clientId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//       // Return the token and client ID for redirection
//       res.status(200).json({ token, redirectUrl: `/client-dashboard/${user._id}` });
//     } catch (error) {
//       console.error('Login error:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }


// C:\Users\***REMOVED*** kale\botGIT\pages\api\login.js
// import { connectToDatabase } from '../../lib/db';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     try {
//       const { db } = await connectToDatabase();
//       const user = await db.collection('clients').findOne({ email });

//       if (!user) {
//         console.error(`[LOGIN] User not found: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         console.error(`[LOGIN] Invalid password for user: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const token = jwt.sign({ email: user.email, clientId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       return res.status(200).json({ token, redirectUrl: `/client-dashboard/${user._id}` });
//     } catch (error) {
//       console.error('Login error:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }




// // C:\Users\***REMOVED*** kale\botGIT\pages\api\login.js
// import { connectToDatabase } from '../../lib/db';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     try {
//       const { db } = await connectToDatabase();
//       const user = await db.collection('users').findOne({ email });

//       if (!user) {
//         console.error(`[LOGIN] User not found: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       console.log(`Stored hashed password: ${user.password}`);

//       // Compare with trimmed password
//       const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
//       console.log(`Is password valid: ${isPasswordValid}`); // Will log true or false

//       if (!isPasswordValid) {
//         console.error(`[LOGIN] Invalid password for user: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const token = jwt.sign({ email: user.email, clientId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       return res.status(200).json({ token, redirectUrl: `/client-dashboard/${user._id}` });
//     } catch (error) {
//       console.error('Login error:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }


// /// C:\Users\***REMOVED*** kale\botGIT\pages\api\login.js
// import { connectToDatabase } from '../../lib/db';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     try {
//       const { db } = await connectToDatabase();
//       const user = await db.collection('users').findOne({ email });

//       if (!user) {
//         console.error(`[LOGIN] User not found: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
//       if (!isPasswordValid) {
//         console.error(`[LOGIN] Invalid password for user: ${email}`);
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const token = jwt.sign({ email: user.email, clientId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       return res.status(200).json({ token, redirectUrl: `/client-dashboard/${user._id}`, clientId: user._id });
//     } catch (error) {
//       console.error('Login error:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }



// C:\Users\***REMOVED*** kale\botGIT\pages\api\login.js
import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        console.error(`[LOGIN] User not found: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
      if (!isPasswordValid) {
        console.error(`[LOGIN] Invalid password for user: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: user.email, clientId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, redirectUrl: `/client-dashboard/${user._id}`, clientId: user._id });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
