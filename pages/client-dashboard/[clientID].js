


// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';

// const ClientDashboard = () => {
//   const router = useRouter();
//   const { clientID } = router.query;  // Extract the clientID from the query params
//   const [clientData, setClientData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (clientID) {
//       console.log('Fetching data for clientID:', clientID);  // Debugging check
//       const fetchClientData = async () => {
//         try {
//           const response = await fetch(`/api/clients/${clientID}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch client data');
//           }
//           const data = await response.json();
//           console.log('Fetched client data:', data);  // Debugging check
//           setClientData(data);
//           setLoading(false);
//         } catch (err) {
//           console.error(err);
//           setError('Failed to load client data');
//           setLoading(false);
//         }
//       };
//       fetchClientData();
//     }
//   }, [clientID]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Client Dashboard</h1>
//       <p>Email: {clientData?.email}</p>
//       <p>Role: {clientData?.role}</p>
//       <p>First Login: {clientData?.firstLogin ? 'Yes' : 'No'}</p>
//       <p>Verified: {clientData?.verified ? 'Yes' : 'No'}</p>
//     </div>
//   );
// };

// export default ClientDashboard;



import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/sidebar';

const ClientDashboard = () => {
  const router = useRouter();
  const { clientID } = router.query;  // Extract the clientID from the query params
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (clientID) {
      console.log('Fetching data for clientID:', clientID);  // Debugging check
      const fetchClientData = async () => {
        try {
          const response = await fetch(`/api/clients/${clientID}`);
          if (!response.ok) {
            throw new Error('Failed to fetch client data');
          }
          const data = await response.json();
          console.log('Fetched client data:', data);  // Debugging check
          setClientData(data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to load client data');
          setLoading(false);
        }
      };
      fetchClientData();
    }
  }, [clientID]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar/>
      

      {/* Main Content */}
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome back, {clientData?.email}</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Email</h2>
            <p>{clientData?.email}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Role</h2>
            <p>{clientData?.role}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">First Login</h2>
            <p>{clientData?.firstLogin ? 'Yes' : 'No'}</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Verified</h2>
            <p>{clientData?.verified ? 'Yes' : 'No'}</p>
          </div>

          {/* Additional Cards for displaying more information as needed */}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
