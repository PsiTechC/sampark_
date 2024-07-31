// // pages/admin.js
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import AddAssistantModal from '../components/AddAssistantModal';
// import ChatInterface from '../components/ChatInterface';
// import Navbar from '../components/Navbar';

// const Admin = () => {
//   const [assistants, setAssistants] = useState([]);
//   const [selectedAssistant, setSelectedAssistant] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchAssistants = async () => {
//       const response = await axios.get('/api/assistants');
//       setAssistants(response.data);
//     };
//     fetchAssistants();
//   }, []);

//   const handleSave = (newAssistant) => {
//     setAssistants((prev) => [...prev, newAssistant]);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="flex h-screen bg-gray-900">
//         <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col shadow-md">
       
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
//           >
//             Add New Assistant
//           </button>
//           <div className="flex-1 overflow-y-auto mt-4">
//             {assistants.map((assistant) => (
//               <div
//                 key={assistant.id}
//                 className={`p-2 cursor-pointer ${selectedAssistant?.id === assistant.id ? 'bg-gray-600' : 'bg-gray-700'} rounded-md mb-2`}
//                 onClick={() => setSelectedAssistant(assistant)}
//               >
//                 <h2 className="text-lg font-bold">{assistant.name}</h2>
//                 <p>{assistant.instructions}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="flex-1 p-4  text-white">
//           {selectedAssistant ? (
//             <ChatInterface assistant={selectedAssistant} />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500">Select an assistant to start chatting</div>
//           )}
//         </div>
//         {showModal && (
//           <AddAssistantModal onClose={() => setShowModal(false)} onSave={handleSave} />
//         )}
//       </div>
//     </div>
//   );
// };



// export default Admin;


// pages/admin.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddAssistantModal from '../components/AddAssistantModal';
import ChatInterface from '../components/ChatInterface';
import Navbar from '../components/Navbar';

const Admin = () => {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await axios.get('/api/assistants');
        setAssistants(response.data);
      } catch (error) {
        console.error('Error fetching assistants:', error);
      }
    };
    fetchAssistants();
  }, []);

  const handleSave = (newAssistant) => {
    setAssistants((prev) => [...prev, newAssistant]);
  };

  return (
    <div>
      <Navbar />
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/4 bg-white text-black p-4 flex flex-col shadow-md">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Add New Assistant
          </button>
          <div className="flex-1 overflow-y-auto">
            {assistants.map((assistant) => (
              <div
                key={assistant.id}
                className={`p-2 cursor-pointer ${selectedAssistant?.id === assistant.id ? 'bg-gray-200' : 'bg-white'} rounded-md mb-2 border border-gray-300`}
                onClick={() => setSelectedAssistant(assistant)}
              >
                <h2 className="text-lg font-bold">{assistant.name}</h2>
                <p>{assistant.instructions}</p>
                {assistant.image_path && (
                  <img
                    src={`/${assistant.image_path}`}
                    alt={assistant.name}
                    className="mt-2 h-16 w-16 object-cover rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 text-black">
          {selectedAssistant ? (
            <ChatInterface assistant={selectedAssistant} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Select an assistant to start chatting</div>
          )}
        </div>
        {showModal && (
          <AddAssistantModal onClose={() => setShowModal(false)} onSave={handleSave} />
        )}
      </div>
    </div>
  );
};

export default Admin;
