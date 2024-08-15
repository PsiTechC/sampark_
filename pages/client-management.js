import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/sidebar';
import AddClientModal from '../components/AddClientModal';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    };

    fetchClients();
  }, []);

  const handleSaveClient = async (client) => {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });

    if (response.ok) {
      const newClient = await response.json();
      setClients([...clients, newClient]);
      setIsModalOpen(false);
    } else {
      // Handle error
      console.error('Failed to save client');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow p-8 ml-56"> {/* Adjusted the margin-left */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Client Management</h1>
        <div className="mb-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Add Client
          </button>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Existing Clients</h2>
          <ul>
            {clients.map((client) => (
              <li key={client.id} className="border-b py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold">{client.name}</p>
                    <p className="text-gray-600">Email: {client.email}</p>
                    <p className="text-gray-600">Phone: {client.phone}</p>
                    <p className="text-gray-600">Assistant: {client.assistant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">License Valid From: {client.licenseValidFrom}</p>
                    <p className="text-gray-600">Purpose: {client.purpose}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default ClientManagement;
