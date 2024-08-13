



import { useState, useEffect } from 'react';

const PasswordResetModal = ({ isOpen, onClose, onSave, clientId }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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
      await onSave(password);
    } catch (err) {
      setError('Failed to reset password');
    }
  };

  if (!isOpen) {
    return null;
  }

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
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600 transition duration-300 mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
      <style jsx>{`
        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          width: 100%;
          max-width: 400px;
        }
        .error {
          color: red;
        }
      `}</style>
    </div>
  );
};

export default PasswordResetModal;
