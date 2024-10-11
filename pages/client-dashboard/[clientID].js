

// // C:\botGIT\botGIT-main\pages\client-dashboard\[clientID].js
// import Sidebar from '@/components/sidebar';
// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// const Dashboard = () => {
//   // Dummy data for Recharts
//   const pieData = [
//     { name: 'Reached', value: 9000 },
//     { name: 'Not Reached', value: 6000 },
//     { name: 'Completion (mins)', value: 4500 },
//   ];

//   const barData = [
//     { name: 'Campaign 1', total: 5650 },
//     { name: 'Campaign 2', total: 7650 },
//   ];

//   // Data for today's campaign performance (from 9 AM to 5 PM)
//   const campaignPerformanceData = [
//     { time: '09:00', calls: 5 },
//     { time: '09:30', calls: 10 },
//     { time: '10:00', calls: 15 },
//     { time: '10:30', calls: 18 },
//     { time: '11:00', calls: 27 },
//     { time: '11:30', calls: 35 },
//     { time: '12:00', calls: 10 },
//     { time: '12:30', calls: 85 },
//     { time: '01:00', calls: 50 },
//     { time: '01:30', calls: 55 },
//     { time: '02:00', calls: 60 },
//     { time: '02:30', calls: 65 },
//     { time: '03:00', calls: 70 },
//     { time: '03:30', calls: 80 },
//     { time: '04:00', calls: 55},
//     { time: '04:30', calls: 90 },
//     { time: '05:00', calls: 10 },
//   ];

//   const lineData = [
//     { name: 'Jan', value: 400 },
//     { name: 'Feb', value: 600 },
//     { name: 'Mar', value: 700 },
//     { name: 'Apr', value: 500 },
//     { name: 'May', value: 900 },
//     { name: 'Jun', value: 1200 },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-grow p-6">
//         {/* Top Cards */}
//         <div className="grid grid-cols-4 gap-6 mb-6">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Account Balance </h2>
//             <p className="text-3xl">Rs.1500</p>
            
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Today's Users</h2>
//             <p className="text-3xl">86</p>
//             <p className="text-green-500">+3% than last week</p>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">New Clients</h2>
//             <p className="text-3xl">36</p>
//             <p className="text-red-500">-2% than yesterday</p>
//           </div>


          
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Campaign Performance</h2>
//             <p className="text-3xl">200</p>
//             <p className="text-red-500">+10% than yesterday</p>
//           </div>

          
//         </div>

//         {/* Graphs and Charts */}
//         <div className="grid grid-cols-3 gap-6">
//           {/* Line Chart - Today's Campaign Performance */}
//           <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
//             <h2 className="text-xl font-bold mb-2">Today's Campaign Performance (9 AM - 5 PM)</h2>
//             <LineChart width={600} height={300} data={campaignPerformanceData}>
//               <XAxis dataKey="time" label={{ value: 'Time (Hours)', position: 'insideBottomRight', offset: -5 }} />
//               <YAxis label={{ value: 'Number of Calls', angle: -90, position: 'insideLeft' }} />
//               <CartesianGrid stroke="#f5f5f5" />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="calls" stroke="#8884d8" />
//             </LineChart>
//           </div>

//           {/* Pie Chart */}
          

//           {/* Bar Chart */}
          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// // C:\botGIT\botGIT-main\pages\client-dashboard\[clientID].js

// import Sidebar from '@/components/sidebar';
// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// const Dashboard = ({ clientId }) => {
//   // Fetch clientId from router or from props (if passed from previous page)
//   useEffect(() => {
//     // Store clientId in local storage if not already set
//     if (clientId) {
//       localStorage.setItem('clientId', clientId);
//     }
//   }, [clientId]);

//   // Dummy data for Recharts
//   const pieData = [
//     { name: 'Reached', value: 9000 },
//     { name: 'Not Reached', value: 6000 },
//     { name: 'Completion (mins)', value: 4500 },
//   ];

//   const barData = [
//     { name: 'Campaign 1', total: 5650 },
//     { name: 'Campaign 2', total: 7650 },
//   ];

//   // Data for today's campaign performance (from 9 AM to 5 PM)
//   const campaignPerformanceData = [
//     { time: '09:00', calls: 5 },
//     { time: '09:30', calls: 10 },
//     { time: '10:00', calls: 15 },
//     { time: '10:30', calls: 18 },
//     { time: '11:00', calls: 27 },
//     { time: '11:30', calls: 35 },
//     { time: '12:00', calls: 10 },
//     { time: '12:30', calls: 85 },
//     { time: '01:00', calls: 50 },
//     { time: '01:30', calls: 55 },
//     { time: '02:00', calls: 60 },
//     { time: '02:30', calls: 65 },
//     { time: '03:00', calls: 70 },
//     { time: '03:30', calls: 80 },
//     { time: '04:00', calls: 55},
//     { time: '04:30', calls: 90 },
//     { time: '05:00', calls: 10 },
//   ];

//   const lineData = [
//     { name: 'Jan', value: 400 },
//     { name: 'Feb', value: 600 },
//     { name: 'Mar', value: 700 },
//     { name: 'Apr', value: 500 },
//     { name: 'May', value: 900 },
//     { name: 'Jun', value: 1200 },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Pass clientId to Sidebar */}
//       <Sidebar clientId={clientId} />

//       {/* Main Content */}
//       <div className="flex-grow p-6">
//         {/* Top Cards */}
//         <div className="grid grid-cols-4 gap-6 mb-6">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Account Balance </h2>
//             <p className="text-3xl">Rs.1500</p>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Today's Users</h2>
//             <p className="text-3xl">86</p>
//             <p className="text-green-500">+3% than last week</p>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">New Clients</h2>
//             <p className="text-3xl">36</p>
//             <p className="text-red-500">-2% than yesterday</p>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Campaign Performance</h2>
//             <p className="text-3xl">200</p>
//             <p className="text-red-500">+10% than yesterday</p>
//           </div>
//         </div>

//         {/* Graphs and Charts */}
//         <div className="grid grid-cols-3 gap-6">
//           {/* Line Chart - Today's Campaign Performance */}
//           <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
//             <h2 className="text-xl font-bold mb-2">Today's Campaign Performance (9 AM - 5 PM)</h2>
//             <LineChart width={600} height={300} data={campaignPerformanceData}>
//               <XAxis dataKey="time" label={{ value: 'Time (Hours)', position: 'insideBottomRight', offset: -5 }} />
//               <YAxis label={{ value: 'Number of Calls', angle: -90, position: 'insideLeft' }} />
//               <CartesianGrid stroke="#f5f5f5" />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="calls" stroke="#8884d8" />
//             </LineChart>
//           </div>

//           {/* Pie Chart */}
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-2">Campaign Reach</h2>
//             <PieChart width={300} height={300}>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" />
//               <Tooltip />
//             </PieChart>
//           </div>
//         </div>

//         {/* Bar Chart */}
//         <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//           <h2 className="text-xl font-bold mb-2">Campaign Comparison</h2>
//           <BarChart width={600} height={300} data={barData}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <CartesianGrid strokeDasharray="3 3" />
//             <Bar dataKey="total" fill="#82ca9d" />
//           </BarChart>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// C:\botGIT\botGIT-main\pages\client-dashboard\[clientID].js
import Sidebar from '@/components/sidebar';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // Import useRouter to capture query params
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Dashboard = ({ clientId: propClientId }) => {
  const router = useRouter();
  const [clientId, setClientId] = useState(propClientId || null);

  // Fetch clientId from router query or from props (if passed from previous page)
  useEffect(() => {
    const queryClientId = router.query.clientId;  // Get clientId from the URL if present

    // Store clientId in state and localStorage if found
    if (queryClientId) {
      setClientId(queryClientId);
      localStorage.setItem('clientId', queryClientId);
    } else if (propClientId) {
      setClientId(propClientId);
      localStorage.setItem('clientId', propClientId);
    } else {
      const storedClientId = localStorage.getItem('clientId');  // Retrieve from localStorage
      if (storedClientId) {
        setClientId(storedClientId);
      }
    }
  }, [router.query.clientId, propClientId]);

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
    { time: '04:00', calls: 55 },
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

  // Ensure clientId is available
  if (!clientId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Pass clientId to Sidebar */}
      <Sidebar clientId={clientId} />

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

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Campaign Performance</h2>
            <p className="text-3xl">200</p>
            <p className="text-red-500">+10% than yesterday</p>
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Campaign Reach</h2>
            <PieChart width={300} height={300}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" />
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl font-bold mb-2">Campaign Comparison</h2>
          <BarChart width={600} height={300} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

