import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, redirectUrl } = response.data;
      localStorage.setItem('token', token);
      router.push(redirectUrl); // Redirect to dashboard
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded mb-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;
