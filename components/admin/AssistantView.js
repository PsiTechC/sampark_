import { useEffect, useState } from 'react';
import AssistantCard from './AssistantCard';

export default function AssistantView() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [assistants, setAssistants] = useState([]);

  useEffect(() => {
    fetch('/api/admin/get-clients')
      .then((res) => res.json())
      .then((data) => setClients(data.clients));
  }, []);

  const loadAssistants = async (clientId) => {
    const res = await fetch(`/api/admin/get-bots?clientId=${clientId}`);
    const data = await res.json();
    setAssistants(data.bots);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Client</h2>
      <select
        className="p-2 border mb-4"
        onChange={(e) => {
          setSelected(e.target.value);
          loadAssistants(e.target.value);
        }}
      >
        <option value="">-- Choose Client --</option>
        {clients.map((c) => (
          <option key={c._id} value={c._id}>
            {c.companyName || c.email}
          </option>
        ))}
      </select>

      {selected && (
        <div className="space-y-4">
          {assistants.map((a) => (
            <AssistantCard key={a} assistantId={a} />
          ))}
        </div>
      )}
    </div>
  );
}
