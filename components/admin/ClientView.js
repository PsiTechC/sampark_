// import { useEffect, useState } from 'react';

// export default function ClientView() {
//   const [clients, setClients] = useState([]);

//   useEffect(() => {
//     fetch('/api/admin/get-clients')
//       .then((res) => res.json())
//       .then((data) => setClients(data.clients));
//   }, []);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">All Clients</h2>
//       {clients.map((client) => (
//         <div key={client._id} className="bg-white p-4 mb-3 shadow rounded border">
//           <p className="text-lg font-semibold">{client.companyName || 'Unnamed Company'}</p>
//           <p className="text-sm text-gray-500">{client.email}</p>
//         </div>
//       ))}
//     </div>
//   );
// }



import { useEffect, useState } from 'react';

export default function ClientView() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch('/api/admin/get-clients')
      .then((res) => res.json())
      .then((data) => setClients(data.clients));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Clients</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div key={client._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all border">
            <p className="text-lg font-semibold text-gray-800">{client.companyName || 'Unnamed Company'}</p>
            <p className="text-sm text-gray-500 mt-1">{client.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
