// import { useRouter } from 'next/router';
// import { FaChartLine, FaFileAlt, FaCogs, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; // Add some icons for better appearance

// const Sidebar = ({ userId, userEmail }) => {
//   const router = useRouter();

//   return (
//     <nav className="w-54 bg-gradient-to-b from-green-700 to-gray-900 text-white p-5 flex flex-col justify-between min-h-screen">
//       {/* Top Section with User Profile */}
//       <div>
//         <div className="flex flex-col items-center mb-10">
//           {/* Profile Icon */}
//           <FaUserCircle className="text-6xl mb-3" />
          
//           {/* User Name or Email */}
//           <span className="text-lg font-bold">{userEmail || 'User Name'}</span>
//         </div>

//         {/* Menu Items */}
//         <ul className="space-y-6 mt-15">
//           <li
//             onClick={() => router.push(`/campaigns?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaChartLine className="mr-2" /> Campaigns
//           </li>

//           <li
//             onClick={() => router.push(`/reports?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaFileAlt className="mr-2" /> Reports
//           </li>

//           <li
//             onClick={() => router.push(`/settings?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaCogs className="mr-2" /> Settings
//           </li>
//         </ul>
//       </div>

//       {/* Bottom Section */}
//       <div className="mt-8">
//         <ul className="space-y-6">
//           <li
//             onClick={() => router.push('/login')}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaSignOutAlt className="mr-2" /> Logout
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;


// components/Sidebar.js

// import { useRouter } from 'next/router';
// import { FaChartLine, FaFileAlt, FaCogs, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; // Add some icons for better appearance

// const Sidebar = ({ userId, userEmail }) => {
//   const router = useRouter();

//   return (
//     <nav className="w-54 bg-gradient-to-b from-green-700 to-gray-900 text-white p-5 flex flex-col justify-between min-h-screen">
//       {/* Top Section with User Profile */}
//       <div>
//         <div className="flex flex-col items-center mb-10">
//           {/* Profile Icon */}
//           <FaUserCircle className="text-6xl mb-3" />
          
//           {/* User Name or Email */}
//           <span className="text-lg font-bold">{userEmail || 'User Name'}</span>
//         </div>

//         {/* Menu Items */}
//         <ul className="space-y-6 mt-15">
         
// <li
//   onClick={() => router.push(`/campaigns/[campaignId]`, `/campaigns/${campaignId}`)}

//   className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
// >
//   <FaChartLine className="mr-2" /> Campaigns
// </li>




//           <li
//             onClick={() => router.push(`/reports?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaFileAlt className="mr-2" /> Reports
//           </li>

//           <li
//             onClick={() => router.push(`/settings?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaCogs className="mr-2" /> Settings
//           </li>
//         </ul>
//       </div>

//       {/* Bottom Section */}
//       <div className="mt-8">
//         <ul className="space-y-6">
//           <li
//             onClick={() => router.push('/login')}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaSignOutAlt className="mr-2" /> Logout
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;











// import { useRouter } from 'next/router';
// import { FaChartLine, FaFileAlt, FaCogs, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; // Icons for better appearance
// import Image from 'next/image'; // Import for using the image

// const Sidebar = ({ userId, userEmail }) => {
//   const router = useRouter();

//   return (
//     <nav className="w-54 bg-gradient-to-b from-green-700 to-gray-900 text-white p-5 flex flex-col justify-between min-h-screen">
//       {/* Top Section with User Profile */}
//       <div className="flex flex-col items-center">
//         {/* Profile Icon or Image */}
//         <FaUserCircle size={80} className="mb-3" /> {/* Adjust the size of the icon */}
        
//         {/* User Name or Email */}
//         <span className="text-base font-bold mb-10">{userEmail || 'User Name'}</span>

//         {/* Menu Items */}
//         <ul className="space-y-6">
//           {/* Campaigns Menu Item */}
//           <li
//             onClick={() => router.push('/campaigns')}
//             className="cursor-pointer flex items-center justify-center text-sm hover:bg-gray-800 p-3 rounded"
//           >
//             <FaChartLine className="mr-2" /> Campaigns
//           </li>

//           {/* Reports Menu Item */}
//           <li
//             onClick={() => router.push(`/reports?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-sm hover:bg-gray-800 p-3 rounded"
//           >
//             <FaFileAlt className="mr-2" /> Reports
//           </li>

//           {/* Settings Menu Item */}
//           <li
//             onClick={() => router.push(`/settings?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-sm hover:bg-gray-800 p-3 rounded"
//           >
//             <FaCogs className="mr-2" /> Settings
//           </li>
//         </ul>
//       </div>

//       {/* Bottom Section */}
//       <div className="mt-8">
//         <ul className="space-y-6">
//           {/* Logout Menu Item */}
//           <li
//             onClick={() => router.push('/register')} // Updated routing to /register
//             className="cursor-pointer flex items-center justify-center text-sm hover:bg-gray-800 p-3 rounded"
//           >
//             <FaSignOutAlt className="mr-2" /> Logout
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;


// // Sidebar.js

// import { useRouter } from 'next/router';
// import { FaChartLine, FaFileAlt, FaCogs, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; 

// const Sidebar = ({ userId, userEmail, campaignId }) => {  // Ensure campaignId is passed as a prop
//   const router = useRouter();

//   return (
//     <nav className="w-54 bg-gradient-to-b from-green-700 to-gray-900 text-white p-5 flex flex-col justify-between min-h-screen">
//       {/* Top Section with User Profile */}
//       <div>
//         <div className="flex flex-col items-center mb-10">
//           {/* Profile Icon */}
//           <FaUserCircle className="text-6xl mb-3" />
          
//           {/* User Name or Email */}
//           <span className="text-lg font-bold">{userEmail || 'User Name'}</span>
//         </div>

//         {/* Menu Items */}
//         <ul className="space-y-6 mt-15">
//           {/* Campaigns Button with campaignId */}
//           <li
//   onClick={() => {
//     const campaignId = '670393a7016eccbc55982f81';  // Replace with actual ID from data
//     router.push(`/campaigns/[campaignId]`, `/campaigns/${campaignId}`);
//   }}
//   className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
// >
//   <FaChartLine className="mr-2" /> Campaigns
// </li>


//           {/* Other Menu Items */}
//           <li
//             onClick={() => router.push(`/reports?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaFileAlt className="mr-2" /> Reports
//           </li>

//           <li
//             onClick={() => router.push(`/settings?userId=${userId}`)}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaCogs className="mr-2" /> Settings
//           </li>
//         </ul>
//       </div>

//       {/* Bottom Section */}
//       <div className="mt-8">
//         <ul className="space-y-6">
//           <li
//             onClick={() => router.push('/login')}
//             className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
//           >
//             <FaSignOutAlt className="mr-2" /> Logout
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;



import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaChartLine, FaFileAlt, FaCogs, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Sidebar = ({ clientId }) => {
  const router = useRouter();
  const [storedClientId, setStoredClientId] = useState(clientId || null);

  useEffect(() => {
    if (!storedClientId) {
      const clientIdFromStorage = localStorage.getItem('clientId');
      setStoredClientId(clientIdFromStorage);
    }
  }, [storedClientId]);

  if (!storedClientId) {
    return <div>Loading...</div>;  // Show a loading message if clientId isn't ready
  }

  return (
    <nav className="w-54 bg-gradient-to-b from-green-700 to-gray-900 text-white p-5 flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex flex-col items-center mb-10">
          <FaUserCircle className="text-6xl mb-3" />
          <span className="text-lg font-bold">Welcome!</span>
        </div>

        <ul className="space-y-6 mt-15">
          {/* Redirect to client-specific campaign list */}
          <li
            onClick={() => router.push(`/client-campaigns/${storedClientId}`)}
            className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
          >
            <FaChartLine className="mr-2" /> My Campaigns
          </li>

          {/* Redirect to client-specific reports */}
          <li
            onClick={() => router.push(`/reports?clientId=${storedClientId}`)}
            className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
          >
            <FaFileAlt className="mr-2" /> Reports
          </li>

          {/* Redirect to client-specific settings */}
          <li
            onClick={() => router.push(`/settings?clientId=${storedClientId}`)}
            className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
          >
            <FaCogs className="mr-2" /> Settings
          </li>

          {/* Logout */}
          <li
            onClick={() => {
              localStorage.removeItem('clientId');  // Clear the clientId from storage on logout
              router.push('/login');
            }}
            className="cursor-pointer flex items-center justify-center text-lg hover:bg-gray-800 p-3 rounded"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
