import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const VerifyEmailComponent = ({ email: propEmail }) => {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/register/verify-email', {
        email: propEmail,
        otp,
      });
      setStatus('Email verified successfully!');
      setTimeout(() => {
        router.push('/register?login=true'); // redirect to login
      }, 2000);
    } catch (error) {
      setStatus('Email verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-semibold mb-6 text-center">Verify Your Email</h1>

      {status && (
        <p className={status.includes('successfully') ? 'text-green-500' : 'text-red-500'}>
          {status}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            value={propEmail}
            disabled
            className="w-full p-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

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

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded mb-4"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailComponent;
