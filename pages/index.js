// pages/index.js
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to the Chatbot Assistant</h1>
    
      </div>
    </div>
  );
};

export default Home;
