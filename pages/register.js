



// // C:\Users\***REMOVED*** kale\botGIT\pages\register.js
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import { GoogleLogin } from '@react-oauth/google'; // Import Google Login

// const Register = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isUserExisting, setIsUserExisting] = useState(false);
//   const [isLoginMode, setIsLoginMode] = useState(false); // State to manage login/register mode
//   const router = useRouter();

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(String(email).toLowerCase());
//   };

//   const validatePassword = (password) => {
//     return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
//   };

//   const checkIfUserExists = async (email) => {
//     try {
//       const res = await axios.post('/api/register/check-user', { email });
//       setIsUserExisting(res.data.exists);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateEmail(email)) {
//       setError('Invalid email format');
//       return;
//     }

//     if (!validatePassword(password)) {
//       setError('Password must be at least 8 characters long and contain one uppercase letter and one number');
//       return;
//     }

//     if (password !== confirmPassword && !isLoginMode) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       const response = isLoginMode
//         ? await axios.post('/api/login', { email, password })
//         : await axios.post('/api/register/registeration', { email, password });
        
//       console.log('Action successful:', response.data);

//       if (isLoginMode) {
//         const { redirectUrl } = response.data; // Extract the redirectUrl from response
//         router.push(redirectUrl); // Redirect to the client dashboard
//       } else {
//         setIsLoginMode(true); // Switch to login mode after successful registration
//         setEmail(''); // Clear email input
//         setPassword(''); // Clear password input
//         setConfirmPassword(''); // Clear confirm password input
//         setError(''); // Clear any previous errors
//       }
//     } catch (error) {
//       console.error('Error during registration/login:', error);
//       setError(error.response?.data?.message || 'Something went wrong');
//     }
//   };

//   const handleEmailChange = (e) => {
//     const value = e.target.value;
//     setEmail(value);
//     checkIfUserExists(value);
//   };

//   const toggleMode = () => {
//     setIsLoginMode(!isLoginMode); // Toggle between login and registration
//     setError(''); // Reset error message on toggle
//     setEmail(''); // Clear email input on toggle
//     setPassword(''); // Clear password input on toggle
//     setConfirmPassword(''); // Clear confirm password input on toggle
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//           <h1 className="text-2xl font-semibold mb-6 text-center">{isLoginMode ? 'Login' : 'Register'}</h1>
//           {isUserExisting && !isLoginMode && (
//             <p className="text-red-500 mb-4">You are already registered. Please <a href="/login" className="text-blue-700">Login</a> instead.</p>
//           )}
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block mb-1">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={handleEmailChange}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             {!isLoginMode && (
//               <div className="mb-4">
//                 <label className="block mb-1">Confirm Password</label>
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             )}
//             <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded mb-4">
//               {isLoginMode ? 'Login' : 'Register'}
//             </button>
            
//             <p className="text-center my-4">
//               {isLoginMode ? "Don't have an account?" : 'Already have an account?'} 
//               <button onClick={toggleMode} className="text-blue-700">
//                 {isLoginMode ? 'Create an account' : 'Login'}
//               </button>
//             </p>
//           </form>
//         </div>
//       </div>
//       {/* Right side with the video background */}
//       <div className="hidden lg:flex w-1/2 relative">
//         <video autoPlay loop muted className="absolute inset-0 object-cover w-full h-full">
//           <source src="\assets\11922053_2160_3840_24fps.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     </div>
//   );
// };

// export default Register;


import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isUserExisting, setIsUserExisting] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [otp, setOtp] = useState(''); // State for OTP input
  const [isOtpMode, setIsOtpMode] = useState(false); // State to switch to OTP verification mode
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
  };

  const checkIfUserExists = async (email) => {
    try {
      const res = await axios.post('/api/register/check-user', { email });
      setIsUserExisting(res.data.exists);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain one uppercase letter and one number');
      return;
    }

    if (password !== confirmPassword && !isLoginMode) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = isLoginMode
        ? await axios.post('/api/login', { email, password })
        : await axios.post('/api/register/registeration', { email, password }); // This calls the backend to register and send OTP
      
      if (isLoginMode) {
        router.push('/dashboard'); // Redirect to dashboard on successful login
      } else {
        setIsOtpMode(true); // Switch to OTP mode after successful registration
        setSuccessMessage('Registration successful! Check your email for the OTP to verify your account.');
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      console.error('Error during registration/login:', error);
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/register/verify-otp', { email, otp }); // This verifies the OTP
      setSuccessMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login'); // Redirect after OTP verification
      }, 2000);
    } catch (error) {
      setError('Invalid OTP');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    checkIfUserExists(value);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6 text-center">{isOtpMode ? 'Verify OTP' : isLoginMode ? 'Login' : 'Register'}</h1>
          
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {isOtpMode ? (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <label className="block mb-1">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded mb-4">
                Verify OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              {!isLoginMode && (
                <div className="mb-4">
                  <label className="block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded mb-4">
                {isLoginMode ? 'Login' : 'Register'}
              </button>
            </form>
          )}

          <p className="text-center my-4">
            {isLoginMode ? "Don't have an account?" : 'Already have an account?'} 
            <button onClick={toggleMode} className="text-blue-700">
              {isLoginMode ? 'Create an account' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 relative">
        <video autoPlay loop muted className="absolute inset-0 object-cover w-full h-full">
          <source src="/assets/11922053_2160_3840_24fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Register;
