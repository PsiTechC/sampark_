// import { useEffect, useState } from "react";

// export default function PhoneNumbers() {
//   const [phoneNumbers, setPhoneNumbers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedRawData, setSelectedRawData] = useState(null);

//   const fetchPhoneNumbers = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       console.log("🔍 Fetching phone numbers...");
//       const response = await fetch("https://api.bolna.dev/phone-numbers/all", {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer ***REMOVED***",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch phone numbers");
//       }

//       const data = await response.json();
//       setPhoneNumbers(data);
//     } catch (error) {
//       console.error("❌ Error fetching phone numbers:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPhoneNumbers();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 w-full h-screen flex flex-col">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">📞 Phone Numbers</h2>

//       <div className="flex-1 overflow-auto border border-gray-300 bg-white shadow-md rounded-lg">
//         {loading ? (
//           <p className="text-gray-600 p-4">Loading phone numbers...</p>
//         ) : error ? (
//           <p className="text-red-500 p-4">Error: {error}</p>
//         ) : phoneNumbers.length === 0 ? (
//           <p className="text-gray-600 p-4">No phone numbers available.</p>
//         ) : (
//           <table className="min-w-full">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="border px-6 py-3 text-left text-lg">ID</th>
//                 <th className="border px-6 py-3 text-left text-lg">Phone Number</th>
//                 <th className="border px-6 py-3 text-left text-lg">Raw Data</th>
//               </tr>
//             </thead>
//             <tbody>
//               {phoneNumbers.map((phone, index) => (
//                 <tr key={index} className="border hover:bg-gray-50 transition">
//                   <td className="border px-6 py-4">{phone.id || "N/A"}</td>
//                   <td className="border px-6 py-4">
//                     {phone.phone_number || phone.number || "N/A"}
//                   </td>
//                   <td className="border px-6 py-4">
//                     <button
//                       onClick={() => setSelectedRawData(phone)}
//                       className="text-gray-700 underline text-sm"
//                     >
//                       Show Raw Data
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Raw Data Modal */}
//       {selectedRawData && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//           <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
//             <h2 className="text-lg font-semibold mb-4">Raw Phone Number Data</h2>
//             <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
//               {JSON.stringify(selectedRawData, null, 2)}
//             </pre>
//             <button
//               onClick={() => setSelectedRawData(null)}
//               className="mt-4 text-gray-800 underline"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// import { useEffect, useState } from "react";

// // Helper function for formatting dates (optional)
// function formatDate(dateString) {
//   if (!dateString) return "N/A";
//   // Example: Convert "2025-02-10T12:46:28.202Z" to "10 Feb, 2025"
//   const dateObj = new Date(dateString);
//   const options = { day: "numeric", month: "short", year: "numeric" };
//   return dateObj.toLocaleDateString(undefined, options);
// }

// export default function PhoneNumbers() {
//   const [phoneNumbers, setPhoneNumbers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // For showing raw data in a modal
//   const [selectedRawData, setSelectedRawData] = useState(null);

//   // Fetch phone numbers from your API
//   const fetchPhoneNumbers = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       console.log("🔍 Fetching phone numbers...");
//       const response = await fetch("https://api.bolna.dev/phone-numbers/all", {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer ***REMOVED***",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch phone numbers");
//       }

//       const data = await response.json();
//       setPhoneNumbers(data);
//     } catch (error) {
//       console.error("❌ Error fetching phone numbers:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPhoneNumbers();
//   }, []);

//   // Placeholder for unlinking an agent from a phone
//   const unlinkAgentFromPhone = async (phoneId) => {
//     console.log("Unlinking agent from phone with ID:", phoneId);
//     // Add your API call or logic here...
//   };

//   // Placeholder for deleting a phone
//   const deletePhone = async (phoneId) => {
//     console.log("Deleting phone with ID:", phoneId);
//     // Add your API call or logic here...
//   };

//   return (
//     <div className="p-6 bg-gray-50 w-full h-screen flex flex-col">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">📞 Phone Numbers</h2>

//       <div className="flex-1 overflow-auto border border-gray-300 bg-white shadow-md rounded-lg">
//         {loading ? (
//           <p className="text-gray-600 p-4">Loading phone numbers...</p>
//         ) : error ? (
//           <p className="text-red-500 p-4">Error: {error}</p>
//         ) : phoneNumbers.length === 0 ? (
//           <p className="text-gray-600 p-4">No phone numbers available.</p>
//         ) : (
//           <table className="min-w-full table-auto">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="border px-4 py-2">Phone Number</th>
//                 <th className="border px-4 py-2">Agent Answering</th>
//                 <th className="border px-4 py-2">Telephony</th>
//                 <th className="border px-4 py-2">Bought on</th>
//                 <th className="border px-4 py-2">Renews on</th>
//                 <th className="border px-4 py-2">Monthly Rent</th>
//                 <th className="border px-4 py-2">Unlink Agent</th>
//                 <th className="border px-4 py-2">Delete Phone</th>
//                 <th className="border px-4 py-2">Raw Data</th>
//               </tr>
//             </thead>
//             <tbody>
//               {phoneNumbers.map((phone) => (
//                 <tr key={phone.id} className="hover:bg-gray-50 transition">
//                   <td className="border px-4 py-2">
//                     {phone.phone_number || phone.number || "N/A"}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {phone.agent_name || phone.agent_id || "N/A"}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {phone.telephony || "N/A"}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {formatDate(phone.created_at)}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {formatDate(phone.renews_on)}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {phone.monthly_rent ? `$${phone.monthly_rent}` : "N/A"}
//                   </td>
//                   <td className="border px-4 py-2">
//                     <button
//                       onClick={() => unlinkAgentFromPhone(phone.id)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Unlink Agent
//                     </button>
//                   </td>
//                   <td className="border px-4 py-2">
//                     <button
//                       onClick={() => deletePhone(phone.id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                   <td className="border px-4 py-2">
//                     <button
//                       onClick={() => setSelectedRawData(phone)}
//                       className="text-gray-700 underline text-sm"
//                     >
//                       Show Raw
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

     
//     </div>
//   );
// }
 



// import { useEffect, useState } from "react";

// export default function PhoneNumbers() {
//   const [phoneNumbers, setPhoneNumbers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedRawData, setSelectedRawData] = useState(null);

//   const fetchPhoneNumbers = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Fetch phone numbers from your API
//       const response = await fetch("https://api.bolna.dev/phone-numbers/all", {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer ***REMOVED***",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch phone numbers");
//       }

//       const data = await response.json();
//       setPhoneNumbers(data);
//     } catch (err) {
//       console.error("❌ Error fetching phone numbers:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPhoneNumbers();
//   }, []);

//   // Placeholder for unlinking an agent from a phone
//   const unlinkAgentFromPhone = (phoneId) => {
//     console.log("Unlinking agent from phone with ID:", phoneId);
//     // Add your real API call here
//   };

//   // Placeholder for deleting a phone
//   const deletePhone = (phoneId) => {
//     console.log("Deleting phone with ID:", phoneId);
//     // Add your real API call here
//   };

//   return (
//     <main style={{ backgroundColor: "#fff", color: "#000", minHeight: "100vh", padding: "1rem" }}>
//       <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
//         📞 Phone Numbers
//       </h2>

//       {/* Loading, Error, or No Data States */}
//       {loading && <p>Loading phone numbers...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       {!loading && !error && phoneNumbers.length === 0 && <p>No phone numbers available.</p>}

//       {/* List of phone numbers */}
//       {!loading && !error && phoneNumbers.length > 0 && (
//         phoneNumbers.map((phone) => (
//           <div key={phone.id} style={{ marginBottom: "2rem" }}>
//             <p><strong>Phone Number:</strong> {phone.phone_number || "N/A"}</p>
//             <p><strong>Agent ID:</strong> {phone.agent_id || "N/A"}</p>
//             <p><strong>Telephony:</strong> {phone.telephony_provider || "N/A"}</p>
//             <p><strong>Bought on:</strong> {phone.created_at || "N/A"}</p>
//             <p><strong>Renews on:</strong> {phone.renewal_at || "N/A"}</p>
//             <p><strong>Monthly Rent:</strong> {phone.price || "N/A"}</p>

//             <div style={{ marginTop: "0.5rem" }}>
//               <button
//                 onClick={() => unlinkAgentFromPhone(phone.id)}
//                 style={{
//                   marginRight: "1rem",
//                   backgroundColor: "transparent",
//                   color: "blue",
//                   cursor: "pointer",
//                   border: "none",
//                   textDecoration: "underline"
//                 }}
//               >
//                 Unlink Agent
//               </button>

//               <button
//                 onClick={() => deletePhone(phone.id)}
//                 style={{
//                   marginRight: "1rem",
//                   backgroundColor: "transparent",
//                   color: "red",
//                   cursor: "pointer",
//                   border: "none",
//                   textDecoration: "underline"
//                 }}
//               >
//                 Delete
//               </button>

//               <button
//                 onClick={() => setSelectedRawData(phone)}
//                 style={{
//                   backgroundColor: "transparent",
//                   color: "#333",
//                   cursor: "pointer",
//                   border: "none",
//                   textDecoration: "underline"
//                 }}
//               >
//                 Show Raw
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       {/* Raw Data Modal (optional) */}
//       {selectedRawData && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "rgba(0,0,0,0.5)"
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#fff",
//               padding: "1rem",
//               borderRadius: "0.25rem",
//               width: "80%",
//               maxWidth: "600px",
//               maxHeight: "80vh",
//               overflowY: "auto"
//             }}
//           >
//             <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Raw Phone Number Data</h2>
//             <pre style={{ background: "#f8f8f8", padding: "1rem" }}>
//               {JSON.stringify(selectedRawData, null, 2)}
//             </pre>
//             <button
//               onClick={() => setSelectedRawData(null)}
//               style={{
//                 marginTop: "1rem",
//                 backgroundColor: "transparent",
//                 color: "blue",
//                 cursor: "pointer",
//                 border: "none",
//                 textDecoration: "underline"
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }



// // C:\botGIT\botGIT-main\pages\agents\numbers.js
// import { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar";

// export default function NumbersPage() {
//   const [phoneNumbers, setPhoneNumbers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedRawData, setSelectedRawData] = useState(null);

//   // Fetch phone numbers from your API
//   const fetchPhoneNumbers = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("https://api.bolna.dev/phone-numbers/all", {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer ***REMOVED***",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch phone numbers");
//       }

//       const data = await response.json();
//       setPhoneNumbers(data);
//     } catch (err) {
//       console.error("❌ Error fetching phone numbers:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPhoneNumbers();
//   }, []);

//   // Placeholder for unlinking an agent from a phone
//   const unlinkAgentFromPhone = (phoneId) => {
//     console.log("Unlinking agent from phone with ID:", phoneId);
//     // Add your real API call here
//   };

//   // Placeholder for deleting a phone
//   const deletePhone = (phoneId) => {
//     console.log("Deleting phone with ID:", phoneId);
//     // Add your real API call here
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar on the left */}
//       <Sidebar />

//       {/* Main content on the right */}
//       <main className="flex-grow p-6" style={{ backgroundColor: "#fff", color: "#000" }}>
//         <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
//           📞 Phone Numbers
//         </h2>

//         {/* Loading, Error, or No Data States */}
//         {loading && <p>Loading phone numbers...</p>}
//         {error && <p style={{ color: "red" }}>Error: {error}</p>}
//         {!loading && !error && phoneNumbers.length === 0 && <p>No phone numbers available.</p>}

//         {/* List of phone numbers */}
//         {!loading && !error && phoneNumbers.length > 0 && (
//           phoneNumbers.map((phone) => (
//             <div key={phone.id} style={{ marginBottom: "2rem" }}>
//               <p><strong>Phone Number:</strong> {phone.phone_number || "N/A"}</p>
//               <p><strong>Agent ID:</strong> {phone.agent_id || "N/A"}</p>
//               <p><strong>Telephony:</strong> {phone.telephony_provider || "N/A"}</p>
//               <p><strong>Bought on:</strong> {phone.created_at || "N/A"}</p>
//               <p><strong>Renews on:</strong> {phone.renewal_at || "N/A"}</p>
//               <p><strong>Monthly Rent:</strong> {phone.price || "N/A"}</p>

//               <div style={{ marginTop: "0.5rem" }}>
//                 <button
//                   onClick={() => unlinkAgentFromPhone(phone.id)}
//                   style={{
//                     marginRight: "1rem",
//                     backgroundColor: "transparent",
//                     color: "blue",
//                     cursor: "pointer",
//                     border: "none",
//                     textDecoration: "underline"
//                   }}
//                 >
//                   Unlink Agent
//                 </button>

//                 <button
//                   onClick={() => deletePhone(phone.id)}
//                   style={{
//                     marginRight: "1rem",
//                     backgroundColor: "transparent",
//                     color: "red",
//                     cursor: "pointer",
//                     border: "none",
//                     textDecoration: "underline"
//                   }}
//                 >
//                   Delete
//                 </button>

//                 <button
//                   onClick={() => setSelectedRawData(phone)}
//                   style={{
//                     backgroundColor: "transparent",
//                     color: "#333",
//                     cursor: "pointer",
//                     border: "none",
//                     textDecoration: "underline"
//                   }}
//                 >
//                   Show Raw
//                 </button>
//               </div>
//             </div>
//           ))
//         )}

//         {/* Raw Data Modal (optional) */}
//         {selectedRawData && (
//           <div
//             style={{
//               position: "fixed",
//               inset: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "rgba(0,0,0,0.5)"
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 padding: "1rem",
//                 borderRadius: "0.25rem",
//                 width: "80%",
//                 maxWidth: "600px",
//                 maxHeight: "80vh",
//                 overflowY: "auto"
//               }}
//             >
//               <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Raw Phone Number Data</h2>
//               <pre style={{ background: "#f8f8f8", padding: "1rem" }}>
//                 {JSON.stringify(selectedRawData, null, 2)}
//               </pre>
//               <button
//                 onClick={() => setSelectedRawData(null)}
//                 style={{
//                   marginTop: "1rem",
//                   backgroundColor: "transparent",
//                   color: "blue",
//                   cursor: "pointer",
//                   border: "none",
//                   textDecoration: "underline"
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


// C:\botGIT\botGIT-main\pages\agents\numbers.js
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

// Helper to display dates like "11th Mar, 2025"
function formatDateOrdinal(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

function getOrdinalSuffix(day) {
  // Handle teens 11th, 12th, 13th
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export default function NumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch phone numbers from your API
  const fetchPhoneNumbers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.bolna.dev/phone-numbers/all", {
        method: "GET",
        headers: {
          Authorization: "Bearer ***REMOVED***",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch phone numbers");
      }

      const data = await response.json();
      setPhoneNumbers(data);
    } catch (err) {
      console.error("❌ Error fetching phone numbers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  // Placeholder for unlinking an agent from a phone
  const unlinkAgentFromPhone = (phoneId) => {
    console.log("Unlinking agent from phone with ID:", phoneId);
    // Add your real API call here
  };

  // Placeholder for deleting a phone
  const deletePhone = (phoneId) => {
    console.log("Deleting phone with ID:", phoneId);
    // Add your real API call here
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right with top and horizontal margins */}
      <main className="flex-grow p-6 bg-white text-black mt-8 mx-4">
        {/* Header row: Title + "Buy phone number" button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">📞 Phone Numbers</h2>
          <button
            onClick={() => console.log("Buying a phone number...")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Buy phone number
          </button>
        </div>

        {/* Loading, Error, or No Data States */}
        {loading && <p>Loading phone numbers...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && phoneNumbers.length === 0 && (
          <p>No phone numbers available.</p>
        )}

        {/* Table of phone numbers */}
        {!loading && !error && phoneNumbers.length > 0 && (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border text-left">Phone number</th>
                  <th className="px-4 py-2 border text-left">
                    Agent answering this phone number
                  </th>
                  <th className="px-4 py-2 border text-left">Telephony</th>
                  <th className="px-4 py-2 border text-left">Bought on</th>
                  <th className="px-4 py-2 border text-left">Renews on</th>
                  <th className="px-4 py-2 border text-left">Monthly rent</th>
                  <th className="px-4 py-2 border text-left">
                    Unlink agent from phone
                  </th>
                  <th className="px-4 py-2 border text-left">Delete phone</th>
                </tr>
              </thead>
              <tbody>
                {phoneNumbers.map((phone) => (
                  <tr key={phone.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">
                      {phone.phone_number || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {phone.agent_name || phone.agent_id || "—"}
                    </td>
                    <td className="px-4 py-2 border">
                      {phone.telephony_provider || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatDateOrdinal(phone.created_at)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatDateOrdinal(phone.renewal_at)}
                    </td>
                    <td className="px-4 py-2 border">
                      {phone.price || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => unlinkAgentFromPhone(phone.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Unlink agent
                      </button>
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => deletePhone(phone.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
-