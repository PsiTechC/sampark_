import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SuperAdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const navigateToClients = () => {
    router.push('/client-management');
  };

  const navigateToDashboard = () => {
    router.push('/super-admin-dashboard');
  };

  // Add more navigation functions as needed
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
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/path-to-your-logo.png" alt="Logo" />
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
      </div>
      <div className="content">
        <h1>Super Admin Dashboard</h1>
        <p>Welcome, Super Admin!</p>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
        }
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
        .content {
          margin-left: 240px; /* Adjust this value based on sidebar width */
          padding: 20px;
          width: calc(100% - 240px);
        }
      `}</style>
    </div>
  );
};

export default SuperAdminDashboard;
