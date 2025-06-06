// C:/botGIT/botGIT-main/components/sidebar.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserCircle, FaUserPlus, FaHashtag, FaCalendar, FaAd, FaSignOutAlt } from "react-icons/fa";
import { FaSquarePhone, FaChartSimple,  } from "react-icons/fa6";
import { useRouter } from "next/router";
const Sidebar = ({ clientId }) => {
  const [storedClientId, setStoredClientId] = useState(clientId || null);


  useEffect(() => {
    if (!storedClientId) {
      const clientIdFromStorage = localStorage.getItem("clientId");
      setStoredClientId(clientIdFromStorage);
    }
  }, [storedClientId]);

  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/logout"); // Invalidate cookie server-side
    router.push("/");
  };
  

  return (
    <nav className="w-56 bg-white text-gray-900 shadow-lg p-5 flex flex-col justify-between min-h-screen border-r border-gray-300">
      <div>
        <div className="flex flex-col items-center mb-10">
          <FaUserCircle className="text-6xl mb-3 text-gray-700" />
          <span className="text-lg font-bold">Welcome!</span>
        </div>
        <ul className="space-y-4">
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link
              href="/agents/ClientDashboard"
              className="flex items-center space-x-3"
            >
              <FaChartSimple className="text-blue-500" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link
              href="/client-dashboard/[clientId].js"
              className="flex items-center space-x-3"
            >
              <FaUserPlus className="text-blue-500" />
              <span>Add/Edit Agents</span>
            </Link>
          </li>
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link
              href="/agents/call_logs"
              className="flex items-center space-x-3"
            >
              <FaSquarePhone className="text-blue-500" />
              <span>Call Logs</span>
            </Link>
          </li>
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link
              href="/agents/numbers"
              className="flex items-center space-x-3"
            >
              <FaHashtag className="text-blue-500" />
              <span>Numbers</span>
            </Link>
          </li>
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link
              href="/agents/Marketing"
              className="flex items-center space-x-3"
            >
              <FaAd className="text-blue-500" />
              <span>Marketing Campaigns</span>
            </Link>
          </li>
          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link
              href="/agents/analytics"
              className="flex items-center space-x-3"
            >
              <FaAd className="text-blue-500" />
              <span>Marketing Analytics</span>
            </Link>
          </li>

          <li className="cursor-pointer flex items-center space-x-3 text-lg hover:bg-gray-200 p-3 rounded-lg">
            <Link
              href="/agents/ConnectCalender"
              className="flex items-center space-x-3"
            >
              <FaCalendar className="text-blue-500" />
              <span>Connect Calendar</span>
            </Link>
          </li>

        </ul>
      </div>
      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-600 hover:bg-red-50 p-3 rounded-lg w-full"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
