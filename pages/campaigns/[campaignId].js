
//C:\botGIT\botGIT-main\pages\campaigns\[campaignId].js
 import { useRouter } from 'next/router';
 import { useEffect, useState } from 'react';
 
 const CampaignDetails = () => {
   const router = useRouter();
   const { campaignId } = router.query; // Get campaignId from the URL
   const [campaign, setCampaign] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
 
   useEffect(() => {
     if (campaignId) {
       const fetchCampaignDetails = async () => {
         try {
           const res = await fetch(`/api/campaigns/${campaignId}`);
           const data = await res.json();
           setCampaign(data);
           setLoading(false);
         } catch (err) {
           setError('Failed to load campaign');
           setLoading(false);
         }
       };
       fetchCampaignDetails();
     }
   }, [campaignId]);
 
   if (loading) return <div>Loading...</div>;
   if (error) return <div>{error}</div>;
 
   return (
     <div className="p-6">
       <h1 className="text-3xl font-bold mb-6">{campaign?.name}</h1>
       <p>Status: {campaign?.status}</p>
       <p>Start Date: {campaign?.startDate}</p>
       <p>Total Interactions: {campaign?.totalInteractions}</p>
       {/* Additional campaign data */}
     </div>
   );
 };
 
 export default CampaignDetails;
 