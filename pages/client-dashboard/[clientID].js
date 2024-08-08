// pages/client-dashboard/[clientId].js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ClientDashboard = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch client-specific data
    const fetchClientData = async () => {
      const response = await fetch(`/api/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setClientData(data);
    };

    fetchClientData();
  }, [clientId, router]);

  if (!clientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="client-dashboard">
      <h1>Client Dashboard</h1>
      <p>Welcome, {clientData.name}!</p>
      {/* Render client-specific data here */}
    </div>
  );
};

export default ClientDashboard;
