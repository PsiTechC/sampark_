import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import PasswordResetModal from '../components/PasswordResetModal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting login form");

    try {
      const response = await axios.post('/api/login', { email, password });
      console.log("Received response:", response.data);

      if (response.status === 200) {
        if (response.data.firstLogin) {
          console.log("First login detected, showing password reset modal");
          setClientId(response.data.clientId);
          setIsResetModalOpen(true); // Show password reset modal
        } else {
          console.log("Normal login, setting token and redirecting");
          localStorage.setItem('token', response.data.token);
          if (response.data.role === 'superadmin') {
            router.push('/superadmin-dashboard');
          } else if (response.data.role === 'client') {
            router.push(`/client-dashboard/${response.data.clientId}`);
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || 'Invalid email or password');
    }
  };

  const handlePasswordReset = async (newPassword) => {
    console.log("Attempting password reset");
    try {
      await axios.post(`/api/clients/${clientId}`, { password: newPassword });
      console.log("Password reset successful, redirecting to login");
      setIsResetModalOpen(false);
      router.push('/login'); // Redirect to login after resetting password
    } catch (error) {
      console.error("Failed to reset password", error);
      setError('Failed to reset password');
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
      <PasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onSave={handlePasswordReset}
      />
    </div>
  );
};

export default Login;
