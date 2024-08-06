import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState('');

  useEffect(() => {
    // Fetch existing clients from the database
    const fetchClients = async () => {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    };

    fetchClients();
  }, []);

  const addClient = async () => {
    if (!newClient) return;
    
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newClient }),
    });

    const data = await response.json();
    setClients([...clients, data]);
    setNewClient('');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold">Navigation</h2>
          <ul className="mt-4">
            <li>
              <button
                className="w-full text-left py-2 px-4 hover:bg-gray-700"
                onClick={() => router.push('/superadmin-dashboard')}
              >
                Back to Dashboard
              </button>
            </li>
          </ul>
        </div>
        <div className="p-4 flex-grow">
          <h1 className="text-2xl font-bold text-gray-800">Client Management</h1>
          <div className="mt-4">
            <input
              type="text"
              className="border p-2"
              placeholder="New Client Name"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white p-2 ml-2"
              onClick={addClient}
            >
              Add Client
            </button>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold">Existing Clients</h2>
            <ul>
              {clients.map((client) => (
                <li key={client.id} className="border p-2 mt-2">
                  {client.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
