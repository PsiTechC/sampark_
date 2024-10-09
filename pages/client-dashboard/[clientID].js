


// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';

// const ClientDashboard = () => {
//   const router = useRouter();
//   const { clientID } = router.query;  // Extract the clientID from the query params
//   const [clientData, setClientData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (clientID) {
//       console.log('Fetching data for clientID:', clientID);  // Debugging check
//       const fetchClientData = async () => {
//         try {
//           const response = await fetch(`/api/clients/${clientID}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch client data');
//           }
//           const data = await response.json();
//           console.log('Fetched client data:', data);  // Debugging check
//           setClientData(data);
//           setLoading(false);
//         } catch (err) {
//           console.error(err);
//           setError('Failed to load client data');
//           setLoading(false);
//         }
//       };
//       fetchClientData();
//     }
//   }, [clientID]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Client Dashboard</h1>
//       <p>Email: {clientData?.email}</p>
//       <p>Role: {clientData?.role}</p>
//       <p>First Login: {clientData?.firstLogin ? 'Yes' : 'No'}</p>
//       <p>Verified: {clientData?.verified ? 'Yes' : 'No'}</p>
//     </div>
//   );
// };

// export default ClientDashboard;



// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Sidebar from '@/components/sidebar';

// const ClientDashboard = () => {
//   const router = useRouter();
//   const { clientID } = router.query;  // Extract the clientID from the query params
//   const [clientData, setClientData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (clientID) {
//       console.log('Fetching data for clientID:', clientID);  // Debugging check
//       const fetchClientData = async () => {
//         try {
//           const response = await fetch(`/api/clients/${clientID}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch client data');
//           }
//           const data = await response.json();
//           console.log('Fetched client data:', data);  // Debugging check
//           setClientData(data);
//           setLoading(false);
//         } catch (err) {
//           console.error(err);
//           setError('Failed to load client data');
//           setLoading(false);
//         }
//       };
//       fetchClientData();
//     }
//   }, [clientID]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar/>
      

//       {/* Main Content */}
//       <div className="flex-grow p-6">
//         <h1 className="text-3xl font-bold mb-6">Welcome back, {clientData?.email}</h1>

//         <div className="grid grid-cols-3 gap-6">
//           {/* Card 1 */}
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Email</h2>
//             <p>{clientData?.email}</p>
//           </div>

//           {/* Card 2 */}
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Role</h2>
//             <p>{clientData?.role}</p>
//           </div>

//           {/* Card 3 */}
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">First Login</h2>
//             <p>{clientData?.firstLogin ? 'Yes' : 'No'}</p>
//           </div>

//           {/* Card 4 */}
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Verified</h2>
//             <p>{clientData?.verified ? 'Yes' : 'No'}</p>
//           </div>

//           {/* Additional Cards for displaying more information as needed */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;


import Sidebar from '@/components/sidebar';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Dashboard = () => {
  // Dummy data for Recharts
  const pieData = [
    { name: 'Reached', value: 9000 },
    { name: 'Not Reached', value: 6000 },
    { name: 'Completion (mins)', value: 4500 },
  ];

  const barData = [
    { name: 'Campaign 1', total: 5650 },
    { name: 'Campaign 2', total: 7650 },
  ];

  // Data for today's campaign performance (from 9 AM to 5 PM)
  const campaignPerformanceData = [
    { time: '09:00', calls: 5 },
    { time: '09:30', calls: 10 },
    { time: '10:00', calls: 15 },
    { time: '10:30', calls: 18 },
    { time: '11:00', calls: 27 },
    { time: '11:30', calls: 35 },
    { time: '12:00', calls: 10 },
    { time: '12:30', calls: 85 },
    { time: '01:00', calls: 50 },
    { time: '01:30', calls: 55 },
    { time: '02:00', calls: 60 },
    { time: '02:30', calls: 65 },
    { time: '03:00', calls: 70 },
    { time: '03:30', calls: 80 },
    { time: '04:00', calls: 55},
    { time: '04:30', calls: 90 },
    { time: '05:00', calls: 10 },
  ];

  const lineData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 600 },
    { name: 'Mar', value: 700 },
    { name: 'Apr', value: 500 },
    { name: 'May', value: 900 },
    { name: 'Jun', value: 1200 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-6">
        {/* Top Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Account Balance </h2>
            <p className="text-3xl">Rs.1500</p>
            
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Today's Users</h2>
            <p className="text-3xl">86</p>
            <p className="text-green-500">+3% than last week</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">New Clients</h2>
            <p className="text-3xl">36</p>
            <p className="text-red-500">-2% than yesterday</p>
          </div>

          
        </div>

        {/* Graphs and Charts */}
        <div className="grid grid-cols-3 gap-6">
          {/* Line Chart - Today's Campaign Performance */}
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
            <h2 className="text-xl font-bold mb-2">Today's Campaign Performance (9 AM - 5 PM)</h2>
            <LineChart width={600} height={300} data={campaignPerformanceData}>
              <XAxis dataKey="time" label={{ value: 'Time (Hours)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Number of Calls', angle: -90, position: 'insideLeft' }} />
              <CartesianGrid stroke="#f5f5f5" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calls" stroke="#8884d8" />
            </LineChart>
          </div>

          {/* Pie Chart */}
          

          {/* Bar Chart */}
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
