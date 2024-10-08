import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login'); // Redirect to login if no token
      } else {
        try {
          const response = await axios.post('/api/verify-token', { token });
          setIsAuthenticated(true);
          setIsVerified(response.data.isVerified);
          setLoading(false);

          if (!response.data.isVerified) {
            router.push('/verify-email');
          }
        } catch (error) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isVerified) {
    return null; // Or show a message like "You need to verify your email"
  }

  return children;
};

export default ProtectedRoute;
