import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
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
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="p-4 flex-grow">
          <h1 className="text-2xl font-bold text-gray-800">Client Management</h1>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Add Client
            </button>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold">Existing Clients</h2>
            <ul>
              {clients.map((client) => (
                <li key={client.id} className="border p-2 mt-2">
                  {client.name} - {client.phone} - {client.licenseValidFrom} - {client.assistant}
                </li>
              ))}
            </ul>
          </div>
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
