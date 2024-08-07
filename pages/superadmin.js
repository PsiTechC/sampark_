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
  }, [router]);

  const navigateToClients = () => {
    router.push('/client-management');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authorized) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex">
      
      <div className="flex">
        <div className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold">Navigation</h2>
          <ul className="mt-4">
            <li>
              <button
                className="w-full text-left py-2 px-4 hover:bg-gray-700"
                onClick={navigateToClients}
              >
                Clients
              </button>
            </li>
          </ul>
        </div>
        <div className="p-4 flex-grow">
          <h1 className="text-2xl font-bold text-gray-800">Superadmin Dashboard</h1>
          <p>Welcome, Superadmin!</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-pink-500 text-white p-4 rounded shadow-md">
              <h2>Total Call Minutes</h2>
              <p className="text-3xl">100</p>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded shadow-md">
              <h2>Call Minutes Used</h2>
              <p className="text-3xl">54</p>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded shadow-md">
              <h2>Call Minutes Remaining</h2>
              <p className="text-3xl">46</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded shadow-md">
              <h2>Campaigns</h2>
              <p className="text-3xl">0</p>
            </div>
            <div className="bg-pink-700 text-white p-4 rounded shadow-md">
              <h2>Agents</h2>
              <p className="text-3xl">2</p>
            </div>
            <div className="bg-yellow-700 text-white p-4 rounded shadow-md">
              <h2>Total Amount</h2>
              <p className="text-3xl">₹ 189</p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold">Today's Logs</h2>
            <div className="mt-2">
              <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                  <tr>
                    <th className="py-2">Direction</th>
                    <th className="py-2">From</th>
                    <th className="py-2">To</th>
                    <th className="py-2">Duration (minutes)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add your logs here */}
                  <tr>
                    <td className="py-2">-</td>
                    <td className="py-2">-</td>
                    <td className="py-2">-</td>
                    <td className="py-2">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
