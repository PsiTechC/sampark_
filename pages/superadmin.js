import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const SuperadminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkRole = () => {
      const role = localStorage.getItem('role');
      console.log('Retrieved role from local storage:', role); // Debugging line
      if (role === 'superadmin') {
        setAuthorized(true);
      } else {
        router.push('/login');
      }
      setLoading(false);
    };

    checkRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authorized) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Superadmin Dashboard</h1>
        <p>Welcome, Superadmin!</p>
       
      </div>
    </div>
  );
};

export default SuperadminDashboard;
