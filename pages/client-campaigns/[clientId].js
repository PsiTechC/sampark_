import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';

const ClientCampaigns = () => {
  const router = useRouter();
  const { clientId } = router.query; // Get clientId from URL query params
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`/api/campaigns?clientId=${clientId}`);
        if (!res.ok) {
          throw new Error('Error fetching campaigns');
        }
        const data = await res.json();
        setCampaigns(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load campaigns');
        setLoading(false);
      }
    };

    if (clientId) {
      fetchCampaigns();
    }
  }, [clientId]);

  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar styling to match the layout from the image */}
      <div className="w-64 bg-gradient-to-b from-green-700 to-gray-900 text-white h-full fixed">
        <Sidebar />
      </div>

      {/* Main content area with adjusted margin to prevent overlap */}
      <div className="ml-64 p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6">My Campaigns</h1>
        {campaigns.length === 0 ? (
          <p>No campaigns found for this client.</p>
        ) : (
          <ul className="space-y-4">
            {campaigns.map((campaign) => (
              <li key={campaign._id} className="p-4 bg-white rounded shadow-md">
                <h2 className="text-xl font-bold">{campaign.name}</h2>
                <p>Status: {campaign.status}</p>
                <p>Start Date: {campaign.startDate}</p>
                <p>Total Interactions: {campaign.totalInteractions}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClientCampaigns;
