// //  C:\botGIT\botGIT-main\components\sidebar.js
// import { useEffect, useState } from 'react';
// import { FaUserCircle, FaEnvelope } from 'react-icons/fa';

// const Sidebar = ({ clientId, setActivePage }) => {
//   const [storedClientId, setStoredClientId] = useState(clientId || null);

//   useEffect(() => {
//     if (!storedClientId) {
//       const clientIdFromStorage = localStorage.getItem('clientId');
//       setStoredClientId(clientIdFromStorage);
//     }
//   }, [storedClientId]);

//   if (!storedClientId) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <nav className="w-64 bg-white text-gray-900 shadow-lg p-5 flex flex-col justify-between min-h-screen border-r border-gray-300">
//       <div>
//         <div className="flex flex-col items-center mb-10">
//           <FaUserCircle className="text-6xl mb-3 text-gray-700" />
//           <span className="text-lg font-bold">Welcome!</span>
//         </div>

//         <ul className="space-y-4">
//           <li
//             onClick={() => setActivePage("agents")}
//             className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg"
//            >
//             <FaEnvelope className="text-blue-500" /> <span>Agents</span>
//           </li>
//           <li
//             onClick={() => setActivePage("call_logs")}
//             className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg"
//            >
//             <FaEnvelope className="text-blue-500" /> <span>call logs</span>
//           </li>
//           <li
//             onClick={() => setActivePage("agents")}
//             className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg"
//            >
//             <FaEnvelope className="text-blue-500" /> <span> Numbers</span>
//           </li>
//           <li
//             onClick={() => setActivePage("agents")}
//             className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg"
//            >
//             <FaEnvelope className="text-blue-500" /> <span>Agents</span>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;




// // C:\botGIT\botGIT-main\components\sidebar.js
// import { useEffect, useState } from 'react';
// import { FaUserCircle, FaEnvelope } from 'react-icons/fa';

// const Sidebar = ({ clientId, setActivePage }) => {
//   const [storedClientId, setStoredClientId] = useState(clientId || null);

//   useEffect(() => {
//     if (!storedClientId) {
//       const clientIdFromStorage = localStorage.getItem('clientId');
//       setStoredClientId(clientIdFromStorage);
//     }
//   }, [storedClientId]);

//   if (!storedClientId) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <nav className="w-64 bg-white text-gray-900 shadow-lg p-5 flex flex-col justify-between min-h-screen border-r border-gray-300">
//       <div>
//         <div className="flex flex-col items-center mb-10">
//           <FaUserCircle className="text-6xl mb-3 text-gray-700" />
//           <span className="text-lg font-bold">Welcome!</span>
//         </div>

//         <ul className="space-y-4">
//           <li
//             onClick={() => setActivePage("agents")}
//             className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg"
//            >
//             <FaEnvelope className="text-blue-500" /> <span>Agents</span>
//           </li>
//           <li
//             onClick={() => setActivePage("call_logs")}
//             className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg"
//            >
//             <FaEnvelope className="text-blue-500" /> <span>Call Logs</span>
//           </li>
//           <li
//             onClick={() => setActivePage("numbers")}
//             className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg"
//            >
//             <FaEnvelope className="text-blue-500" /> <span>Numbers</span>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;




// C:\botGIT\botGIT-main\components\sidebar.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaEnvelope } from 'react-icons/fa';

const Sidebar = ({ clientId }) => {
  const [storedClientId, setStoredClientId] = useState(clientId || null);

  useEffect(() => {
    if (!storedClientId) {
      const clientIdFromStorage = localStorage.getItem('clientId');
      setStoredClientId(clientIdFromStorage);
    }
  }, [storedClientId]);

  if (!storedClientId) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="w-64 bg-white text-gray-900 shadow-lg p-5 flex flex-col justify-between min-h-screen border-r border-gray-300">
      <div>
        <div className="flex flex-col items-center mb-10">
          <FaUserCircle className="text-6xl mb-3 text-gray-700" />
          <span className="text-lg font-bold">Welcome!</span>
        </div>
        <ul className="space-y-4">
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link href="/agents" className="flex items-center space-x-3">
              <FaEnvelope className="text-blue-500" />
              <span>Agents</span>
            </Link>
          </li>
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link href="/agents/call_logs" className="flex items-center space-x-3">
              <FaEnvelope className="text-blue-500" />
              <span>Call Logs</span>
            </Link>
          </li>
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link href="/agents/numbers" className="flex items-center space-x-3">
              <FaEnvelope className="text-blue-500" />
              <span>Numbers</span>
            </Link>
          </li>

          

        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
