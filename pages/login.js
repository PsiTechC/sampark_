// // import { useState } from 'react';
// // import axios from 'axios';
// // import { useRouter } from 'next/router';

// // const Login = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [error, setError] = useState('');
// //   const router = useRouter();

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     console.log("Submitting login form");

// //     try {
// //       const response = await axios.post('/api/login', { email, password });
// //       console.log("Received response:", response.data);

// //       if (response.status === 200) {
// //         if (response.data.firstLogin) {
// //           console.log("First login detected, redirecting to password reset page with clientId:", response.data.clientId);
// //           router.push(`/password-reset?clientId=${response.data.clientId}`);
// //         } else {
// //           console.log("Normal login, setting token and redirecting");
// //           localStorage.setItem('token', response.data.token);
// //           if (response.data.role === 'superadmin') {
// //             router.push('/superadmin-dashboard');
// //           } else if (response.data.role === 'client') {
// //             router.push(`/client-dashboard/${response.data.clientId}`);
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Login error:", error);
// //       setError(error.response?.data?.message || 'Invalid email or password');
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
// //         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
// //         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           <div className="form-group">
// //             <label className="block text-gray-700">Email</label>
// //             <input
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>
// //           <div className="form-group relative">
// //             <label className="block text-gray-700">Password</label>
// //             <input
// //               type={showPassword ? 'text' : 'password'}
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               required
// //               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //             <button
// //               type="button"
// //               className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
// //               onClick={() => setShowPassword(!showPassword)}
// //             >
// //               {showPassword ? 'Hide' : 'Show'}
// //             </button>
// //           </div>
// //           <button
// //             type="submit"
// //             className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
// //           >
// //             Login
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;





// // import axios from 'axios';
// // import { useRouter } from 'next/router';
// // import { useState } from 'react';

// // const Login = () => {
// //   const router = useRouter();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');

// //   const handleLogin = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const response = await axios.post('/api/login', { email, password });
// //       const { token, clientId, firstLogin } = response.data;

// //       // Store the token in localStorage or cookies
// //       localStorage.setItem('token', token);

// //       if (firstLogin) {
// //         // Redirect to password reset page if it's the first login
// //         router.push(`/password-reset?clientId=${clientId}`);
// //       } else {
// //         // Redirect to the client's dashboard
// //         router.push(`/client-dashboard/${clientId}`);
// //       }
// //     } catch (error) {
// //       console.error("Login error:", error);
// //       setError('Invalid email or password');
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleLogin}>
// //       <input
// //         type="email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //         placeholder="Email"
// //         required
// //       />
// //       <input
// //         type="password"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //         placeholder="Password"
// //         required
// //       />
// //       <button type="submit">Login</button>
// //       {error && <p>{error}</p>}
// //     </form>
// //   );
// // };

// // export default Login;


// import axios from 'axios';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// const Login = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('/api/login', { email, password });
//       const { token, clientId, firstLogin } = response.data;

//       // Store the token in localStorage or cookies
//       localStorage.setItem('token', token);

//       if (firstLogin) {
//         // Redirect to password reset page if it's the first login
//         router.push(`/password-reset?clientId=${clientId}`);
//       } else {
//         // Redirect to the client's dashboard
//         router.push(`/client-dashboard/${clientId}`);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError('Invalid email or password');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//         <form onSubmit={handleLogin} className="space-y-6">
//           <div className="form-group">
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="form-group">
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import axios from 'axios';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// const Login = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('/api/login', { email, password });
//       const { token, clientId, firstLogin } = response.data;

//       // Store the token in localStorage or cookies
//       localStorage.setItem('token', token);

//       if (firstLogin) {
//         // Redirect to password reset page if it's the first login
//         router.push(`/password-reset?clientId=${clientId}`);
//       } else {
//         // Redirect to the client's dashboard
//         router.push(`/client-dashboard/${clientId}`);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError('Invalid email or password');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//         <form onSubmit={handleLogin} className="space-y-6">
//           <div className="form-group">
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="form-group relative">
//             <label className="block text-gray-700">Password</label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 focus:outline-none"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? 'Hide' : 'Show'}
//             </button>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
//           >
//             Login
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <p className="text-gray-600">
//             Don’t have an account yet?{' '}
//             <a href="#" className="text-blue-500 hover:underline">
//               Create an account
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




// 1st oct, 2024

// // C:\Users\***REMOVED*** kale\botGIT\pages\login.js
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log(`[LOGIN] Form submitted with email: ${email}`);

//     try {
//       const response = await axios.post('/api/login', { email, password });
//       const { token, redirectUrl } = response.data;

//       // Store the token in local storage
//       localStorage.setItem('token', token);
//       console.log(`[LOGIN] Successful login for email: ${email}. Token stored.`);

//       // Redirect based on role
//       router.push(redirectUrl);
//       console.log(`[LOGIN] Redirecting to: ${redirectUrl}`);
//     } catch (error) {
//       console.error('Error during login:', error);
//       setError(error.response?.data?.message || 'Something went wrong');
//       console.log(`[LOGIN] Login failed for email: ${email}. Error: ${error.message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl mb-6">Login</h1>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div className="mb-4">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;




// // C:\Users\***REMOVED*** kale\botGIT\pages\login.js
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false); // Loading state
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log(`[LOGIN] Form submitted with email: ${email}`);
//     setLoading(true); // Set loading to true

//     try {
//       const response = await axios.post('/api/login', { email, password });
//       const { token, redirectUrl } = response.data;

//       // Store the token in local storage
//       localStorage.setItem('token', token);
//       console.log(`[LOGIN] Successful login for email: ${email}. Token stored.`);
//       console.log(`[LOGIN] Client ID: ${clientId}`);

//       // Redirect based on role
//       router.push(redirectUrl);
//       console.log(`[LOGIN] Redirecting to: ${redirectUrl}`);
//     } catch (error) {
//       console.error('Error during login:', error);
//       setError(error.response?.data?.message || 'Something went wrong');
//       console.log(`[LOGIN] Login failed for email: ${email}. Error: ${error.message}`);
//     } finally {
//       setLoading(false); // Set loading to false
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl mb-6">Login</h1>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div className="mb-4">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;




// // C:\Users\***REMOVED*** kale\botGIT\pages\login.js
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post('/api/login', { email, password });
//       const { token, clientId } = response.data; // Extract clientId from response

//       // Store the token in local storage
//       localStorage.setItem('token', token);
//       console.log(`[LOGIN] Successful login for email: ${email}. Token stored.`);
//       console.log(`[LOGIN] Client ID: ${clientId}`); // Log the client ID

//       // Redirect to the specific client dashboard using clientId
//       router.push(`/client-dashboard/${clientId}`);
//       console.log(`[LOGIN] Redirecting to: /client-dashboard/${clientId}`);
//     } catch (error) {
//       console.error('Error during login:', error);
//       setError(error.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl mb-6">Login</h1>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div className="mb-4">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;





// C:\Users\***REMOVED*** kale\botGIT\pages\login.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, clientId } = response.data; // Extract clientId from response

      // Store the token in local storage
      localStorage.setItem('token', token);
      console.log(`[LOGIN] Successful login for email: ${email}. Token stored.`);
      console.log(`[LOGIN] Client ID: ${clientId}`); // Log the client ID

      // Redirect to the specific client dashboard using clientId
      router.push(`/client-dashboard/${clientId}`);
      console.log(`[LOGIN] Redirecting to: /client-dashboard/${clientId}`);
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
