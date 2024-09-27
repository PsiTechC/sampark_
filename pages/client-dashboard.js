// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';

// const ClientDashboard = () => {
//   const router = useRouter();
//   const { clientId } = router.query; // Get the client ID from the URL
//   const [clientData, setClientData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Function to fetch client-specific data
//     const fetchClientData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           router.push('/login');
//           return;
//         }

//         const response = await fetch(`/api/clients/${clientId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setClientData(data);
//         } else {
//           throw new Error('Failed to fetch client data');
//         }
//       } catch (error) {
//         console.error('Error fetching client data:', error);
//         setError('Failed to load client data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (clientId) {
//       fetchClientData();
//     }
//   }, [clientId, router]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!clientData) {
//     return <div>No client data found.</div>;
//   }

//   return (
//     <div className="client-dashboard">
      
//       {/* Add more client-specific data or actions here */}

//       {/* Example of a logout button */}
//       <button
//         onClick={() => {
//           localStorage.removeItem('token');
//           router.push('/login');
//         }}
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default ClientDashboard;




import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Doughnut } from 'react-chartjs-2';

const ClientDashboard = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaignData, setCampaignData] = useState({
    labels: ['Completed Calls', 'Ongoing Calls', 'Scheduled Calls'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#4CAF50', '#FFCA28', '#F44336'],
      hoverBackgroundColor: ['#66BB6A', '#FFEB3B', '#EF5350'],
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  });

  useEffect(() => {
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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">No client data found.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 bg-blue-900 text-white">
        <div className="p-4 text-2xl font-bold text-center">Dashboard</div>
        <ul className="space-y-2">
          <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/campaigns')}>
            Campaigns
          </li>
          <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/reports')}>
            Reports
          </li>
          <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/settings')}>
            Settings
          </li>
          <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/login')}>
            Logout
          </li>
        </ul>
      </nav>
      <div className="flex flex-col items-center justify-center flex-grow p-8 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4">Campaign Overview</h1>
        <Doughnut data={campaignData} />
      </div>
    </div>
  );
};

export default ClientDashboard;
