import { useState, useEffect } from 'react';
import axios from 'axios';
import AddAssistantModal from '../components/AddAssistantModal';
import ChatInterface from '../components/ChatInterface';
import Navbar from '../components/Navbar';
import EditAssistantModal from '../components/EditAssistantModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

const Admin = () => {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteAssistantId, setDeleteAssistantId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && showDeleteModal) {
        handleDelete(deleteAssistantId);
      }
    };

    if (showDeleteModal) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDeleteModal, deleteAssistantId]);

  const handleSave = (newAssistant) => {
    setAssistants((prev) => [...prev, newAssistant]);
  };

  const handleUpdate = (updatedAssistant) => {
    setAssistants((prev) =>
      prev.map((assistant) => (assistant._id === updatedAssistant._id ? updatedAssistant : assistant))
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/assistants?id=${id}`);
      setAssistants((prev) => prev.filter((assistant) => assistant._id !== id));
      setShowDeleteModal(false);
      window.location.reload(); // Refresh the browser after deletion
    } catch (error) {
      console.error('Error deleting assistant:', error);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteAssistantId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteAssistantId(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 bg-white text-black p-4 flex flex-col shadow-md">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Add New Assistant
          </button>
          <div className="flex-1 overflow-y-auto">
            {assistants.map((assistant) => (
              <div
                key={assistant._id} // Ensure each child has a unique key
                className={`p-2 cursor-pointer ${selectedAssistant?._id === assistant._id ? 'bg-gray-200' : 'bg-white'} rounded-md mb-2 border border-gray-300 flex items-center`}
                onClick={() => setSelectedAssistant(assistant)}
              >
                {assistant.images && assistant.images[0] && (
                  <img
                    src={assistant.images[0].filepath} // Ensure the path is correct
                    alt={assistant.name}
                    className="h-8 w-8 object-cover rounded-full mr-2"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{assistant.name}</h2>
                  <p>{assistant.assistantShowMsg}</p>
                  <p>{assistant.phoneNumber}</p> 
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(assistant);
                  }}
                  className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-1.5 px-1.5 rounded-xl mr-2 fa-sm mb-12"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(assistant._id);
                  }}
                  className="bg-red-400 hover:bg-red-600 text-white font-bold py-1.5 px-1.5 rounded-xl fa-sm mb-12"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col bg-gray-100">
          {selectedAssistant ? (
            <ChatInterface assistant={selectedAssistant} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Select an assistant to start chatting</div>
          )}
        </div>
        {showAddModal && (
          <AddAssistantModal onClose={() => setShowAddModal(false)} onSave={handleSave} />
        )}
        {showEditModal && (
          <EditAssistantModal
            assistant={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleUpdate}
          />
        )}
      </div>
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete"
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
          <p className="mb-4">Are you sure you want to delete this assistant?</p>
          <div className="flex justify-end">
            <button
              onClick={closeDeleteModal}
              className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteAssistantId)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;
