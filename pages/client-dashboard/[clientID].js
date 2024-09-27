

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
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Left Sidebar Navigation */}
//       <nav className="w-64 bg-gray-800 text-white">
//         <div className="p-4 text-2xl font-bold text-center">Dashboard</div>
//         <ul className="space-y-2">
//           <li
//             className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
//             onClick={() => router.push('/campaigns')}
//           >
//             Campaigns
//           </li>
//           <li
//             className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
//             onClick={() => router.push('/reports')}
//           >
//             Reports
//           </li>
//           <li
//             className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
//             onClick={() => router.push('/settings')}
//           >
//             Settings
//           </li>
//           <li
//             className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
//             onClick={() => router.push('/login')}
//           >
//             Logout
//           </li>
//         </ul>
//       </nav>

//       {/* Main Content */}
//       <div className="flex flex-col items-center justify-center flex-grow p-8">
        
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;





// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// const ClientDashboard = () => {
//   const router = useRouter();
//   const { clientId } = router.query;
//   const [clientData, setClientData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Dummy campaign data for Recharts
//   const campaignData = [
//     { name: 'Completed Calls', value: 300, fill: '#4CAF50' },
//     { name: 'Ongoing Calls', value: 50, fill: '#FFCA28' },
//     { name: 'Scheduled Calls', value: 100, fill: '#F44336' }
//   ];

//   useEffect(() => {
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
//     <div className="flex min-h-screen">
//       <nav className="w-64 bg-gray-300 text-black">
//         <div className="p-4 text-2xl font-bold text-center">Dashboard</div>
//         <ul className="space-y-2">
//           <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/campaigns')}>
//             Campaigns
//           </li>
//           <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/reports')}>
//             Reports
//           </li>
//           <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/settings')}>
//             Settings
//           </li>
//           <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/login')}>
//             Logout
//           </li>
//         </ul>
//       </nav>
//       <div className="flex flex-col items-center justify-center flex-grow p-8 bg-gray-100">
//         <h1 className="text-2xl font-semibold mb-4">Campaign Overview</h1>
//         <PieChart width={400} height={250}>
//           <Pie data={campaignData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
//             {campaignData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.fill} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;





import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const ClientDashboard = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for Recharts
  const campaignData = [
    { name: 'Completed Calls', value: 300, fill: '#8884d8' },
    { name: 'Ongoing Calls', value: 50, fill: '#82ca9d' },
    { name: 'Scheduled Calls', value: 100, fill: '#ffc658' }
  ];

  const barData = [
    { name: 'Completed Calls', calls: 200 },
    { name: 'Quick Scheduling', calls: 150 },
    { name: 'Follow-ups', calls: 80 }
  ];

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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Failed to load client data.</div>;
  }

  if (!clientData) {
    return <div className="flex items-center justify-center h-screen">No client data found.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-64 bg-blue-500 text-black p-5">
        <div className="text-xl font-bold mb-4">Dashboard</div>
        <ul className="space-y-3">
          <li onClick={() => router.push('/campaigns')}>Campaigns</li>
          <li onClick={() => router.push('/reports')}>Reports</li>
          <li onClick={() => router.push('/settings')}>Settings</li>
          <li onClick={() => router.push('/login')}>Logout</li>
        </ul>
      </nav>
      <div className="flex-grow p-5">
        <PieChart width={730} height={250}>
          <Pie data={campaignData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {campaignData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        <BarChart width={730} height={250} data={barData}>
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
