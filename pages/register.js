import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LoginComponent from '../components/verification_components/LoginComponent'; 
import VerifyEmail from '../components/verification_components/VerifyEmail'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false); // Control login mode
  const [isOtpMode, setIsOtpMode] = useState(false); // Control OTP mode
  const [userId, setUserId] = useState(''); // To store userId for email verification
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');


  // Check if the login mode is triggered by the query parameter
  useEffect(() => {
    if (router.query.login === 'true') {
      setIsLoginMode(true);
    }
  }, [router.query]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/register/registeration', { email, password, companyName, phoneNumber });
      setUserId(response.data.userId); // Set the userId for email verification
      setIsOtpMode(true); // Switch to OTP mode after successful registration
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
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
          {isLoginMode ? (
            <LoginComponent /> // Show the login component if in login mode
          ) : isOtpMode ? (
            <VerifyEmail email={email} /> // Show the VerifyEmailComponent for OTP verification
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
              {error && <p className="text-red-500 mb-4">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>


                <div className="mb-4">
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <div className="mb-4">
                  <label className="block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded mb-4">
                  Register
                </button>
              </form>
            </>
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
