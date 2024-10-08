

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Sidebar from "../../components/dashboard/sidebar"

const ClientDashboard = () => {
  const router = useRouter();
  const { clientId } = router.query; // Extract clientId from the URL
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const campaignData = [
    { name: 'Campaign 1', value: 400, fill: '#8884d8' },
    { name: 'Campaign 2', value: 300, fill: '#83a6ed' },
    { name: 'Campaign 3', value: 300, fill: '#8dd1e1' },
    { name: 'Campaign 4', value: 200, fill: '#82ca9d' },
  ];

  const barData = [
    { name: 'Campaign 1', calls: 300 },
    { name: 'Campaign 2', calls: 500 },
    { name: 'Campaign 3', calls: 200 },
    { name: 'Campaign 4', calls: 400 },
  ];

  useEffect(() => {
    const fetchClientData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`/api/clients/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClientData(data);
        } else {
          throw new Error('Failed to fetch client data');
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        setError('Failed to load client data.');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId, router]);

  //if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      {/* <nav className="w-64 bg-blue-500 text-black p-5">
        <div className="text-xl font-bold mb-4">Dashboard</div>
        <ul className="space-y-3">
          <li onClick={() => router.push('/campaigns')}>Campaigns</li>
          <li onClick={() => router.push('/reports')}>Reports</li>
          <li onClick={() => router.push('/settings')}>Settings</li>
          <li onClick={() => router.push('/login')}>Logout</li>
        </ul>
      </nav> */}

      <Sidebar/>

      {/* Main Content */}
      <div className="flex-grow p-5">
        <h1 className="text-2xl font-bold mb-4">Client Dashboard for {clientId}</h1>
        <p className="mb-6">Email: {clientData?.email ?? 'N/A'}</p>
        
        {/* Pie Chart */}
        <PieChart width={730} height={250}>
          <Pie data={campaignData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {campaignData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        {/* Bar Chart */}
        <BarChart width={730} height={250} data={barData} className="mt-10">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="calls" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default ClientDashboard;





