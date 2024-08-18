// // C:\Users\***REMOVED*** kale\botGIT\pages\client-dashboard\[clientId].js


// // pages/client-dashboard/[clientId].js

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';

// const ClientDashboard = () => {
//   const router = useRouter();
//   const { clientId } = router.query; // Extract the clientId from the URL
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
//       <h1>Client Dashboard</h1>
//       <p>Welcome, {clientData.name}!</p>
//       <p>Email: {clientData.email}</p>
//       <p>Phone: {clientData.phone}</p>
//       <p>Organization: {clientData.organization}</p>
//       <p>License Valid From: {clientData.licenseValidFrom}</p>
//       <p>License Valid To: {clientData.licenseValidTo}</p>
//       <p>Purpose: {clientData.purpose}</p>

//       {/* Additional client-specific details and actions can go here */}
//     </div>
//   );
// };

// export default ClientDashboard;



// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';

// const ClientDashboard = () => {
//   const router = useRouter();
//   const { clientId } = router.query; // Extract the clientId from the URL
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
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-lg font-semibold">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-red-500 text-lg font-semibold">{error}</div>
//       </div>
//     );
//   }

//   if (!clientData) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-lg font-semibold">No client data found.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
//       <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
//         <h1 className="text-3xl font-bold mb-6 text-center">Client Dashboard</h1>
//         <div className="space-y-4">
//           <div className="text-xl font-semibold">
//             Welcome, <span className="text-blue-500">{clientData.name}</span>!
//           </div>
//           <div className="text-lg">
//             <span className="font-semibold">Email:</span> {clientData.email}
//           </div>
//           <div className="text-lg">
//             <span className="font-semibold">Phone:</span> {clientData.phone}
//           </div>
//           <div className="text-lg">
//             <span className="font-semibold">Organization:</span> {clientData.organization}
//           </div>
//           <div className="text-lg">
//             <span className="font-semibold">License Valid From:</span> {clientData.licenseValidFrom}
//           </div>
//           <div className="text-lg">
//             <span className="font-semibold">License Valid To:</span> {clientData.licenseValidTo}
//           </div>
//           <div className="text-lg">
//             <span className="font-semibold">Purpose:</span> {clientData.purpose}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;



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
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar Navigation */}
      <nav className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold text-center">Dashboard</div>
        <ul className="space-y-2">
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => router.push('/campaigns')}
          >
            Campaigns
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => router.push('/reports')}
          >
            Reports
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => router.push('/settings')}
          >
            Settings
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => router.push('/login')}
          >
            Logout
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Client Dashboard</h1>
          <div className="space-y-4">
            <div className="text-xl font-semibold">
              Welcome, <span className="text-blue-500">{clientData.name}</span>!
            </div>
            <div className="text-lg">
              <span className="font-semibold">Email:</span> {clientData.email}
            </div>
            <div className="text-lg">
              <span className="font-semibold">Phone:</span> {clientData.phone}
            </div>
            <div className="text-lg">
              <span className="font-semibold">Organization:</span> {clientData.organization}
            </div>
            <div className="text-lg">
              <span className="font-semibold">License Valid From:</span> {clientData.licenseValidFrom}
            </div>
            <div className="text-lg">
              <span className="font-semibold">License Valid To:</span> {clientData.licenseValidTo}
            </div>
            <div className="text-lg">
              <span className="font-semibold">Purpose:</span> {clientData.purpose}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
