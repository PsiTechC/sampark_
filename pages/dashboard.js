// pages/dashboard.js
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-black">Dashboard Page</h1>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
