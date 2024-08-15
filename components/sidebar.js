// import Link from 'next/link';

// const Sidebar = () => {
//   return (
//     <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
//       <h2 className="text-2xl font-bold mb-4">Navigation</h2>
//       <ul>
        
//         <li className="mb-2">
//           <Link href="/superadmin/clients">
//             <a className="text-white hover:text-gray-400">Clients</a>
//           </Link>
//         </li>
//         {/* Add more links as needed */}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;



// components/Sidebar.js
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  const navigateToClients = () => {
    router.push('/client-management');
  };

  const navigateToDashboard = () => {
    router.push('/super-admin-dashboard');
  };

  const navigateToAssignAgents = () => {
    router.push('/assign-agents');
  };

  const navigateToClientDetails = () => {
    router.push('/client-details');
  };

  const navigateToLeads = () => {
    router.push('/leads');
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <ul>
        <li className="section-title">CLIENT</li>
        <li onClick={navigateToClients}>Clients</li>
        <li onClick={navigateToAssignAgents}>Agents</li>
        <li>Call List</li>
        <li>Campaign</li>
        <li className="section-title">ADMINISTRATOR</li>
        <li onClick={navigateToAssignAgents}>Assign Agents</li>
        <li onClick={navigateToClientDetails}>Client Details</li>
        <li onClick={navigateToLeads}>Leads</li>
      </ul>
      <style jsx>{`
        .sidebar {
          width: 220px;
          background-color: #f4f4f4;
          padding: 20px;
          height: 100vh;
          position: fixed;
          display: flex;
          flex-direction: column;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .sidebar ul {
          list-style-type: none;
          padding: 0;
        }
        .sidebar ul li {
          padding: 10px;
          cursor: pointer;
          color: #333;
          margin-bottom: 10px;
        }
        .sidebar ul li:hover {
          background-color: #0070f3;
          color: white;
        }
        .sidebar ul li.section-title {
          font-weight: bold;
          color: #555;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
