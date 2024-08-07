// pages/login.js

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.status === 200) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        // Redirect to the super admin dashboard upon successful login
        router.push('/superadmin-dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f7f7f7;
        }
        .login-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          background-color: #0070f3;
          color: white;
          font-size: 1rem;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
        .error {
          color: red;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Login;
