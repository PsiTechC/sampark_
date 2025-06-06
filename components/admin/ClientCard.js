import { useState } from 'react';
import AssistantCard from './AssistantCard';

export default function ClientCard({ client }) {
  const [bots, setBots] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loadingBots, setLoadingBots] = useState(false);

  const toggleExpand = async () => {
    if (!expanded) {
      setLoadingBots(true);
      const res = await fetch(`/api/admin/get-bots?clientId=${client._id}`);
      const data = await res.json();
      setBots(data.bots);
      setLoadingBots(false);
    }
    setExpanded(!expanded);
  };

  return (
    <div className="border rounded p-4 mb-4 shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">{client.companyName || 'Unnamed Company'}</p>
          <p className="text-sm text-gray-500">{client.email}</p>
        </div>
        <button className="text-blue-600 underline" onClick={toggleExpand}>
          {expanded ? 'Hide Bots' : 'View Bots'}
        </button>
      </div>

      {expanded && (
        <div className="ml-4 mt-4">
          {loadingBots ? (
            <p>Loading bots...</p>
          ) : bots.length === 0 ? (
            <p>No bots found.</p>
          ) : (
            bots.map((botId) => (
              <AssistantCard key={botId} assistantId={botId} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
