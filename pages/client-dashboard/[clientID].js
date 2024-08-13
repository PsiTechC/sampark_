// C:\Users\***REMOVED*** kale\botGIT\pages\client-dashboard\[clientId].js


// pages/client-dashboard/[clientId].js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ClientDashboard = () => {
  const router = useRouter();
  const { clientId } = router.query; // Extract the clientId from the URL
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch client-specific data
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!clientData) {
    return <div>No client data found.</div>;
  }

  return (
    <div className="client-dashboard">
      <h1>Client Dashboard</h1>
      <p>Welcome, {clientData.name}!</p>
      <p>Email: {clientData.email}</p>
      <p>Phone: {clientData.phone}</p>
      <p>Organization: {clientData.organization}</p>
      <p>License Valid From: {clientData.licenseValidFrom}</p>
      <p>License Valid To: {clientData.licenseValidTo}</p>
      <p>Purpose: {clientData.purpose}</p>

      {/* Additional client-specific details and actions can go here */}
    </div>
  );
};

export default ClientDashboard;
