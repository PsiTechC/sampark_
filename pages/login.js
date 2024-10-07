


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
