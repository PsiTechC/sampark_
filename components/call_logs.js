// import { useEffect, useState } from "react";

// export default function CallLogs() {

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedTranscript, setSelectedTranscript] = useState(null);
//   const [selectedRawData, setSelectedRawData] = useState(null);
//   const [agents, setAgents] = useState([]);


//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         const res = await fetch('https://api.bolna.dev/v2/agent/all', {
//           headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
//         });
//         const data = await res.json();
//         setAgents(data);
//       } catch (err) {
//         console.error('Failed to fetch agents', err);
//       }
//     };
//     fetchAgents();
//   }, []);

  
//   const fetchExecutionIds = async () => {
//     try {
//       console.log("🔍 Fetching latest execution IDs...");
//       const response = await fetch(`https://api.bolna.dev/agent/${selectedAgentId}/executions`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch execution IDs");
//       }

//       const data = await response.json();
//       if (!Array.isArray(data) || data.length === 0) return [];

//       return data.map((execution) => execution.id);
//     } catch (error) {
//       console.error("❌ Error fetching execution IDs:", error);
//       return [];
//     }
//   };

//   const fetchBatchCallDetails = async (executionIds) => {
//     try {
//       const callsData = await Promise.all(
//         executionIds.map(async (executionId) => {
//           console.log(`🔍 Fetching call log for Execution ID: ${executionId}`);
//           const response = await fetch(`https://api.bolna.dev/executions/${executionId}`, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             },
//           });

//           return response.ok ? response.json() : null;
//         })
//       );

//       return callsData.filter((log) => log !== null);
//     } catch (error) {
//       console.error("❌ Error fetching call logs:", error);
//       return [];
//     }
//   };

//   const fetchCallDetails = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       let executionIds = await fetchExecutionIds();
//       if (executionIds.length === 0) {
//         console.log("⚠️ No new execution IDs found.");
//         setLoading(false);
//         return;
//       }

//       executionIds = executionIds.reverse();

//       const recentBatch = executionIds.slice(0, 5);
//       const recentCalls = await fetchBatchCallDetails(recentBatch);
//       setExecutions(recentCalls.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

//       setLoading(false);

//       const remainingBatch = executionIds.slice(5);
//       if (remainingBatch.length > 0) {
//         const olderCalls = await fetchBatchCallDetails(remainingBatch);
//         setExecutions((prev) => [...prev, ...olderCalls].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
//       }
//     } catch (error) {
//       console.error("❌ Error fetching call logs:", error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCallDetails();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 w-full h-screen flex flex-col">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">📞 Call Logs</h2>

//       {/* Scrollable Call Log Table */}
//       <div className="flex-1 overflow-auto border border-gray-300 bg-white shadow-md rounded-lg">
//         {loading ? (
//           <p className="text-gray-600 p-4">Loading recent calls...</p>
//         ) : error ? (
//           <p className="text-red-500 p-4">Error: {error}</p>
//         ) : executions.length === 0 ? (
//           <p className="text-gray-600 p-4">No calls made yet.</p>
//         ) : (
//           <table className="min-w-full">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="border px-6 py-3 text-left text-lg">Execution Details</th>
//                 <th className="border px-6 py-3 text-left text-lg">Raw Data</th>
//               </tr>
//             </thead>
//             <tbody>
//               {executions.map((log, index) => (
//                 <tr key={index} className="border hover:bg-gray-50 transition">
//                   {/* Execution Details */}
//                   <td className="border px-6 py-4">
//                     <div className="text-gray-800">
//                       <p><strong>Call Status:</strong> {log.status || "N/A"}</p>
//                       <p><strong>Call Duration:</strong> {log.conversation_duration ? `${log.conversation_duration} sec` : "N/A"}</p>
//                       <p><strong>Recipient Number:</strong> {log.context_details?.recipient_phone_number || "N/A"}</p>
//                       <p><strong>Hangup Reason:</strong> {log.telephony_data?.hangup_reason || "N/A"}</p>
//                       <p><strong>Created At:</strong> {new Date(log.created_at).toLocaleString()}</p>
//                     </div>

//                     {/* Call Recording */}
//                     {log.telephony_data?.recording_url && (
//                       <div className="mt-2">
//                         <h3 className="font-bold text-lg">🔊 Call Recording</h3>
//                         <audio controls className="w-full mt-1">
//                           <source src={log.telephony_data.recording_url} type="audio/mp3" />
//                           Your browser does not support the audio element.
//                         </audio>

//                         {/* View Transcript Button (Minimal Design) */}
//                         {log.transcript && (
//                           <button
//                             onClick={() => setSelectedTranscript(log)}
//                             className="text-gray-700 underline text-sm mt-2 block"
//                           >
//                             View Transcript
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </td>

//                   {/* Raw Data Modal Button */}
//                   <td className="border px-6 py-4 text-left">
//                     <button
//                       onClick={() => setSelectedRawData(log)}
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

//       {/* Transcript Modal */}
//       {selectedTranscript && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//           <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
//             <h2 className="text-lg font-semibold mb-4">Call Transcript</h2>
//             <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
//               {console.log(selectedTranscript.summary)}
//               {selectedTranscript.summary}
//             </pre>
//             <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
//               {selectedTranscript.transcript}
//             </pre>
//             <button onClick={() => setSelectedTranscript(null)} className="mt-4 text-gray-800 underline">
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Raw Data Modal */}
//       {selectedRawData && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//           <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
//             <h2 className="text-lg font-semibold mb-4">Raw Execution Data</h2>
//             <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
//               {JSON.stringify(selectedRawData, null, 2)}
//             </pre>
//             <button onClick={() => setSelectedRawData(null)} className="mt-4 text-gray-800 underline">
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
