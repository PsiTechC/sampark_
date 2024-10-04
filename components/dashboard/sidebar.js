// components/Sidebar.js
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <nav
      className="w-64 p-5 min-h-screen"
      style={{ backgroundColor: '#F5EFFF', color: 'black' }} // Inline styles for background and text color
    >
      <div className="text-2xl font-bold mb-6">Dashboard</div>
      <ul className="space-y-4">
        <li
          onClick={() => handleNavigation('/campaigns')}
          className="cursor-pointer hover:bg-blue-700 p-2 rounded"
          style={{ color: 'black' }} // Set text color to black
        >
          Campaigns
        </li>
        <li
          onClick={() => handleNavigation('/reports')}
          className="cursor-pointer hover:bg-blue-700 p-2 rounded"
          style={{ color: 'black' }} // Set text color to black
        >
          Reports
        </li>
        <li
          onClick={() => handleNavigation('/settings')}
          className="cursor-pointer hover:bg-blue-700 p-2 rounded"
          style={{ color: 'black' }} // Set text color to black
        >
          Settings
        </li>
        <li
          onClick={() => handleNavigation('/login')}
          className="cursor-pointer hover:bg-blue-700 p-2 rounded"
          style={{ color: 'black' }} // Set text color to black
        >
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
