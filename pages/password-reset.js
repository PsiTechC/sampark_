import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const PasswordResetModal = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { clientId } = router.query;  // Extract clientId from the query string

  useEffect(() => {
    console.log('PasswordResetModal received clientId:', clientId);
  }, [clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientId) {
      setError('Client ID is missing.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');  // Clear any previous errors

    try {
      // Post the new password to the backend API
      const response = await axios.post(`/api/clients/${clientId}`, { password });
      console.log("Password reset successful, redirecting to login", response.data);
      router.push('/login'); // Redirect to login after successful password reset
    } catch (err) {
      console.error("Failed to reset password", err);
      if (err.response) {
        setError(`Failed to reset password: ${err.response.data.message}`);
      } else {
        setError('Failed to reset password: Unknown error occurred.');
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Change Password</h2>
        {error && <p className="error text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600 transition duration-300 mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetModal;
