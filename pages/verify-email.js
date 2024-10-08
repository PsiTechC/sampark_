import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VerifyEmail = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyUser = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/api/verify-email?userId=${userId}`);
          setStatus('Email verified successfully!');
          router.push('/login'); // Redirect to login after verification
        } catch (error) {
          setStatus('Email verification failed.');
        }
      }
    };

    verifyUser();
  }, [userId, router]);

  return <div>{status}</div>;
};

export default VerifyEmail;
