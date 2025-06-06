import { useState } from 'react';

export default function BotCard({ bot }) {
  const [campaigns, setCampaigns] = useState([]);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCampaigns = async () => {
    if (!showCampaigns) {
      setLoading(true);
      const res = await fetch(`/api/admin/get-campaigns?botId=${bot._id}`);
      const data = await res.json();
      setCampaigns(data.campaigns);
      setLoading(false);
    }
    setShowCampaigns(!showCampaigns);
  };

  return (
    <div className="border-l pl-4 mt-2 mb-4">
      <div className="flex justify-between items-center">
        <p className="font-medium">{bot.name || 'Unnamed Bot'}</p>
        <button
          className="text-sm text-blue-500 underline"
          onClick={toggleCampaigns}
        >
          {showCampaigns ? 'Hide Campaigns' : 'View Campaigns'}
        </button>
      </div>

      {showCampaigns && (
        <div className="ml-4 mt-2">
          {loading ? (
            <p>Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <p>No campaigns available.</p>
          ) : (
            <ul className="list-disc ml-6">
              {campaigns.map(c => (
                <li key={c._id} className="text-sm">
                  {c.title || 'Untitled Campaign'}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
