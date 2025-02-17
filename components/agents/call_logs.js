// import { useEffect, useState } from "react";

// export default function CallLogs() {
//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedExecutions = JSON.parse(localStorage.getItem("callExecutions")) || {};
//     const executionIds = Object.values(storedExecutions).flat().map(log => log.executionId);

//     if (executionIds.length === 0) {
//       console.log("⚠️ No execution IDs found in localStorage.");
//       setLoading(false);
//       return;
//     }

//     const fetchCallDetails = async () => {
//       setLoading(true);
//       try {
//         const callsData = await Promise.all(executionIds.map(async (executionId) => {
//           console.log(`🔍 Fetching call log for Execution ID: ${executionId}`);
//           const response = await fetch(`https://api.bolna.dev/execution/${executionId}`, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             },
//           });

//           const data = await response.json();
//           console.log("📜 API Response for Execution:", executionId, data);
//           return data;
//         }));

//         setExecutions(callsData);
//       } catch (error) {
//         console.error("❌ Error fetching call logs:", error);
//       }
//       setLoading(false);
//     };

//     fetchCallDetails();
//   }, []);

//   return (
//     <div className="p-6 bg-white w-full">
//       <h2 className="text-lg font-semibold mb-4">Call Logs</h2>

//       {loading ? (
//         <p>Loading call logs...</p>
//       ) : executions.length === 0 ? (
//         <p>No calls made yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {executions.map((log, index) => (
//             <li key={index} className="border p-3 rounded-md">
//               <strong>Execution ID:</strong> {log.id || "N/A"} <br />
//               <strong>Call Status:</strong> {log.status || "N/A"} <br />
//               <strong>Call Duration:</strong> {log.conversation_duration ? `${log.conversation_duration} sec` : "N/A"} <br />
//               <strong>Total Cost:</strong> {log.total_cost ? `$${log.total_cost}` : "N/A"} <br />
//               <strong>Recipient Number:</strong> {log.context_details?.recipient_phone_number || "N/A"} <br />
//               <strong>Hangup Reason:</strong> {log.telephony_data?.hangup_reason || "N/A"} <br />
//               {log.transcript && (
//                 <>
//                   <strong>Transcript:</strong>
//                   <p className="italic text-gray-700">{log.transcript}</p>
//                 </>
//               )}
//               {log.telephony_data?.recording_url && (
//                 <div>
//                   <strong>Call Recording:</strong>
//                   <audio controls className="mt-2">
//                     <source src={log.telephony_data.recording_url} type="audio/mp3" />
//                     Your browser does not support the audio element.
//                   </audio>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
















// import { useEffect, useState } from "react";

// export default function CallLogs() {
//   // Hardcoded agent ID
//   const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Track fetched execution IDs to avoid duplicates
//   const [fetchedExecutionIds, setFetchedExecutionIds] = useState(new Set());

//   // Fetch execution IDs for the specific agent
//   const fetchExecutionIds = async () => {
//     try {
//       console.log("🔍 Fetching latest execution IDs for agent:", agentId);
//       const response = await fetch(`https://api.bolna.dev/agent/${agentId}/executions`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch execution IDs");
//       }

//       const data = await response.json();

//       if (!data || !Array.isArray(data)) {
//         console.warn("⚠️ Unexpected response format for execution IDs:", data);
//         return [];
//       }

//       // Extract execution IDs from the fetched data
//       const executionIds = data.map((execution) => execution.id);
//       console.log("✅ Fetched execution IDs:", executionIds);
//       return executionIds;
//     } catch (error) {
//       console.error("❌ Error fetching execution IDs:", error);
//       return [];
//     }
//   };

//   // Fetch detailed call log data for new executions
//   const fetchCallDetails = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const executionIds = await fetchExecutionIds();

//       if (executionIds.length === 0) {
//         console.log("⚠️ No new execution IDs found.");
//         setLoading(false);
//         return;
//       }

//       // Filter out IDs that have already been fetched
//       const newExecutionIds = executionIds.filter((id) => !fetchedExecutionIds.has(id));

//       if (newExecutionIds.length === 0) {
//         console.log("⚠️ No new calls to fetch, all are already fetched.");
//         setLoading(false);
//         return;
//       }

//       const callsData = await Promise.all(
//         newExecutionIds.map(async (executionId) => {
//           console.log(`🔍 Fetching call log for Execution ID: ${executionId}`);
//           const response = await fetch(`https://api.bolna.dev/executions/${executionId}`, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             },
//           });

//           if (!response.ok) {
//             console.warn(`⚠️ Failed to fetch call log for ${executionId}`);
//             return null;
//           }

//           return response.json();
//         })
//       );

//       // Filter out any null responses
//       const validCalls = callsData.filter((log) => log !== null);

//       if (validCalls.length > 0) {
//         setExecutions((prevExecutions) =>
//           [...validCalls, ...prevExecutions].sort(
//             (a, b) => new Date(b.created_at) - new Date(a.created_at)
//           )
//         );
//         // Update the set of fetched execution IDs
//         setFetchedExecutionIds(new Set([...fetchedExecutionIds, ...newExecutionIds]));
//       }
//     } catch (error) {
//       console.error("❌ Error fetching call logs:", error);
//       setError(error.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     // Fetch immediately when the component mounts
//     fetchCallDetails();

//     // Set up polling every 10 seconds for real-time updates
//     const interval = setInterval(fetchCallDetails, 10000);
//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   return (
//     <div className="p-6 bg-white w-full">
//       <h2 className="text-lg font-semibold mb-4">Call Logs</h2>

//       {loading ? (
//         <p>Loading call logs...</p>
//       ) : error ? (
//         <p className="text-red-500">Error: {error}</p>
//       ) : executions.length === 0 ? (
//         <p>No calls made yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {executions.map((log, index) => (
//             <li key={index} className="border p-3 rounded-md">
//               <strong>Execution ID:</strong> {log.id || "N/A"} <br />
//               <strong>Call Status:</strong> {log.status || "N/A"} <br />
//               <strong>Call Duration:</strong> {log.conversation_duration ? `${log.conversation_duration} sec` : "N/A"} <br />
//               <strong>Total Cost:</strong> {log.total_cost ? `$${log.total_cost}` : "N/A"} <br />
//               <strong>Recipient Number:</strong> {log.context_details?.recipient_phone_number || "N/A"} <br />
//               <strong>Hangup Reason:</strong> {log.telephony_data?.hangup_reason || "N/A"} <br />
//               <strong>Created At:</strong> {new Date(log.created_at).toLocaleString()} <br />
//               {log.transcript && (
//                 <>
//                   <strong>Transcript:</strong>
//                   <p className="italic text-gray-700">{log.transcript}</p>
//                 </>
//               )}
//               {log.telephony_data?.recording_url && (
//                 <div>
//                   <strong>Call Recording:</strong>
//                   <audio controls className="mt-2">
//                     <source src={log.telephony_data.recording_url} type="audio/mp3" />
//                     Your browser does not support the audio element.
//                   </audio>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }









// import { useEffect, useState } from "react";

// export default function CallLogs() {
//   // Hardcoded agent ID
//   const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Track fetched execution IDs to avoid duplicates
//   const [fetchedExecutionIds, setFetchedExecutionIds] = useState(new Set());

//   // Fetch execution IDs for the specific agent
//   const fetchExecutionIds = async () => {
//     try {
//       console.log("🔍 Fetching latest execution IDs for agent:", agentId);
//       const response = await fetch(`https://api.bolna.dev/agent/${agentId}/executions`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch execution IDs");
//       }

//       const data = await response.json();

//       if (!data || !Array.isArray(data)) {
//         console.warn("⚠️ Unexpected response format for execution IDs:", data);
//         return [];
//       }

//       // Extract execution IDs from the fetched data
//       const executionIds = data.map((execution) => execution.id);
//       console.log("✅ Fetched execution IDs:", executionIds);
//       return executionIds;
//     } catch (error) {
//       console.error("❌ Error fetching execution IDs:", error);
//       return [];
//     }
//   };

//   // Fetch detailed call log data for new executions
//   const fetchCallDetails = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const executionIds = await fetchExecutionIds();

//       if (executionIds.length === 0) {
//         console.log("⚠️ No new execution IDs found.");
//         setLoading(false);
//         return;
//       }

//       // Filter out IDs that have already been fetched
//       const newExecutionIds = executionIds.filter((id) => !fetchedExecutionIds.has(id));

//       if (newExecutionIds.length === 0) {
//         console.log("⚠️ No new calls to fetch, all are already fetched.");
//         setLoading(false);
//         return;
//       }

//       const callsData = await Promise.all(
//         newExecutionIds.map(async (executionId) => {
//           console.log(`🔍 Fetching call log for Execution ID: ${executionId}`);
//           const response = await fetch(`https://api.bolna.dev/executions/${executionId}`, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             },
//           });

//           if (!response.ok) {
//             console.warn(`⚠️ Failed to fetch call log for ${executionId}`);
//             return null;
//           }

//           return response.json();
//         })
//       );

//       // Filter out any null responses
//       const validCalls = callsData.filter((log) => log !== null);

//       if (validCalls.length > 0) {
//         setExecutions((prevExecutions) =>
//           [...validCalls, ...prevExecutions].sort(
//             (a, b) => new Date(b.created_at) - new Date(a.created_at)
//           )
//         );
//         // Update the set of fetched execution IDs
//         setFetchedExecutionIds(new Set([...fetchedExecutionIds, ...newExecutionIds]));
//       }
//     } catch (error) {
//       console.error("❌ Error fetching call logs:", error);
//       setError(error.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     // Fetch immediately when the component mounts
//     fetchCallDetails();

//     // Set up polling every 10 seconds for real-time updates
//     const interval = setInterval(fetchCallDetails, 10000);
//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   return (
//     <div className="p-6 bg-white w-full">
//       <h2 className="text-lg font-semibold mb-4">Call Logs</h2>

//       {loading ? (
//         <p>Loading call logs...</p>
//       ) : error ? (
//         <p className="text-red-500">Error: {error}</p>
//       ) : executions.length === 0 ? (
//         <p>No calls made yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {executions.map((log, index) => (
//             <li key={index} className="border p-3 rounded-md">
//               <strong>Execution ID:</strong> {log.id || "N/A"} <br />
//               <strong>Call Status:</strong> {log.status || "N/A"} <br />
//               <strong>Call Duration:</strong> {log.conversation_duration ? `${log.conversation_duration} sec` : "N/A"} <br />
//               <strong>Total Cost:</strong> {log.total_cost ? `$${log.total_cost}` : "N/A"} <br />
//               <strong>Recipient Number:</strong> {log.context_details?.recipient_phone_number || "N/A"} <br />
//               <strong>Hangup Reason:</strong> {log.telephony_data?.hangup_reason || "N/A"} <br />
//               <strong>Created At:</strong> {new Date(log.created_at).toLocaleString()} <br />
              
//               {log.transcript && (
//                 <>
//                   <strong>Transcript:</strong>
//                   <ul className="list-disc pl-5">
//                     {log.transcript.split("\n").map((line, idx) => (
//                       <li key={idx} className="italic text-gray-700">{line}</li>
//                     ))}
//                   </ul>
//                 </>
//               )}
              
//               {log.telephony_data?.recording_url && (
//                 <div>
//                   <strong>Call Recording:</strong>
//                   <audio controls className="mt-2">
//                     <source src={log.telephony_data.recording_url} type="audio/mp3" />
//                     Your browser does not support the audio element.
//                   </audio>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }





// import { useEffect, useState } from "react";

// export default function CallLogs() {
//   // Hardcoded agent ID
//   const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch execution IDs for the specific agent
//   const fetchExecutionIds = async () => {
//     try {
//       console.log("🔍 Fetching latest execution IDs for agent:", agentId);
//       const response = await fetch(`https://api.bolna.dev/agent/${agentId}/executions`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch execution IDs");
//       }

//       const data = await response.json();
//       return Array.isArray(data) ? data.map((execution) => execution.id) : [];
//     } catch (error) {
//       console.error("❌ Error fetching execution IDs:", error);
//       return [];
//     }
//   };

//   // Fetch detailed call log data for new executions
//   const fetchCallDetails = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const executionIds = await fetchExecutionIds();

//       if (executionIds.length === 0) {
//         console.log("⚠️ No new execution IDs found.");
//         setLoading(false);
//         return;
//       }

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

//       setExecutions(callsData.filter((log) => log !== null));
//     } catch (error) {
//       console.error("❌ Error fetching call logs:", error);
//       setError(error.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchCallDetails();
//     const interval = setInterval(fetchCallDetails, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="p-6 bg-white w-full">
//       <h2 className="text-lg font-semibold mb-4">Call Logs</h2>

//       {loading ? (
//         <p>Loading call logs...</p>
//       ) : error ? (
//         <p className="text-red-500">Error: {error}</p>
//       ) : executions.length === 0 ? (
//         <p>No calls made yet.</p>
//       ) : (
//         <table className="min-w-full border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-4 py-2">Conversation Data</th>
//               <th className="border px-4 py-2">Execution Logs</th>
//               <th className="border px-4 py-2">Raw Payload</th>
//             </tr>
//           </thead>
//           <tbody>
//             {executions.map((log, index) => (
//               <tr key={index} className="border">
//                 {/* Conversation Data - Transcript and Recording */}
//                 <td className="border px-4 py-2">
//                   {log.transcript ? (
//                     <div className="text-blue-500 underline cursor-pointer">
//                       <a href="#" onClick={() => alert(log.transcript)}>View Transcript</a>
//                     </div>
//                   ) : (
//                     "No Transcript"
//                   )}
//                   {log.telephony_data?.recording_url && (
//                     <div className="mt-2">
//                       <audio controls>
//                         <source src={log.telephony_data.recording_url} type="audio/mp3" />
//                         Your browser does not support the audio element.
//                       </audio>
//                     </div>
//                   )}
//                 </td>

//                 {/* Execution Logs */}
//                 <td className="border px-4 py-2 text-blue-500 underline cursor-pointer">
//                   <a href="#" onClick={() => alert(`Execution ID: ${log.id}\nStatus: ${log.status}`)}>More info</a>
//                 </td>

//                 {/* Raw Payload */}
//                 <td className="border px-4 py-2 text-blue-500 underline cursor-pointer">
//                   <a href="#" onClick={() => alert(JSON.stringify(log, null, 2))}>Show raw data</a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }






// import { useEffect, useState } from "react";

// export default function CallLogs() {
//   const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedTranscript, setSelectedTranscript] = useState(null); // For modal view

//   // Fetch execution IDs (Fetches only first 5 initially)
//   const fetchExecutionIds = async () => {
//     try {
//       console.log("🔍 Fetching latest execution IDs...");
//       const response = await fetch(`https://api.bolna.dev/agent/${agentId}/executions`, {
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

//   // Fetch details for a batch of execution IDs
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

//   // Main function to fetch and display calls efficiently
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

//       executionIds = executionIds.reverse(); // Ensures latest calls are loaded first

//       // Fetch the most recent 5 first
//       const recentBatch = executionIds.slice(0, 5);
//       const recentCalls = await fetchBatchCallDetails(recentBatch);
//       setExecutions(recentCalls.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

//       setLoading(false); // Stop showing loading indicator once first batch is ready

//       // Fetch remaining calls in background
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
//   }, []); // Runs only once when the component mounts

//   return (
//     <div className="p-6 bg-white w-full">
//       <h2 className="text-lg font-semibold mb-4">Call Logs</h2>

//       {loading ? (
//         <p>Loading recent calls...</p>
//       ) : error ? (
//         <p className="text-red-500">Error: {error}</p>
//       ) : executions.length === 0 ? (
//         <p>No calls made yet.</p>
//       ) : (
//         <table className="min-w-full border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-4 py-2">Execution Details</th>
//               <th className="border px-4 py-2">Execution Logs</th>
//               <th className="border px-4 py-2">Raw Payload</th>
//             </tr>
//           </thead>
//           <tbody>
//             {executions.map((log, index) => (
//               <tr key={index} className="border">
//                 {/* Execution Details with Transcript & Recording */}
//                 <td className="border px-4 py-2">
//                   <strong>Execution ID:</strong> {log.id || "N/A"} <br />
//                   <strong>Call Status:</strong> {log.status || "N/A"} <br />
//                   <strong>Call Duration:</strong> {log.conversation_duration ? `${log.conversation_duration} sec` : "N/A"} <br />
//                   <strong>Total Cost:</strong> {log.total_cost ? `$${log.total_cost}` : "N/A"} <br />
//                   <strong>Recipient Number:</strong> {log.context_details?.recipient_phone_number || "N/A"} <br />
//                   <strong>Hangup Reason:</strong> {log.telephony_data?.hangup_reason || "N/A"} <br />
//                   <strong>Created At:</strong> {new Date(log.created_at).toLocaleString()} <br />

//                   {/* Transcript View */}
//                   {log.transcript && (
//                     <div className="mt-2">
//                       <button
//                         onClick={() => setSelectedTranscript(log.transcript)}
//                         className="text-blue-500 underline"
//                       >
//                         View Transcript
//                       </button>
//                     </div>
//                   )}

//                   {/* Call Recording */}
//                   {log.telephony_data?.recording_url && (
//                     <div className="mt-2">
//                       <audio controls>
//                         <source src={log.telephony_data.recording_url} type="audio/mp3" />
//                         Your browser does not support the audio element.
//                       </audio>
//                     </div>
//                   )}
//                 </td>

//                 {/* Execution Logs */}
//                 <td className="border px-4 py-2 text-blue-500 underline cursor-pointer">
//                   <a href="#" onClick={() => alert(`Execution ID: ${log.id}\nStatus: ${log.status}`)}>More info</a>
//                 </td>

//                 {/* Raw Payload */}
//                 <td className="border px-4 py-2 text-blue-500 underline cursor-pointer">
//                   <a href="#" onClick={() => alert(JSON.stringify(log, null, 2))}>Show raw data</a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Transcript Modal */}
//       {selectedTranscript && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//           <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
//             <h2 className="text-lg font-semibold mb-4">Call Transcript</h2>
//             <div className="border p-3 rounded-md max-h-60 overflow-auto">
//               {selectedTranscript.split("\n").map((line, idx) => (
//                 <p key={idx} className="text-gray-700">{line}</p>
//               ))}
//             </div>
//             <button
//               onClick={() => setSelectedTranscript(null)}
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
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

// export default function CallLogs() {
//   const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedTranscript, setSelectedTranscript] = useState(null);

//   const fetchExecutionIds = async () => {
//     try {
//       console.log("🔍 Fetching latest execution IDs...");
//       const response = await fetch(`https://api.bolna.dev/agent/${agentId}/executions`, {
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
//     <div className="p-6 bg-gray-100 w-full">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">📞 Call Logs</h2>

//       {loading ? (
//         <p className="text-gray-600">Loading recent calls...</p>
//       ) : error ? (
//         <p className="text-red-500">Error: {error}</p>
//       ) : executions.length === 0 ? (
//         <p className="text-gray-600">No calls made yet.</p>
//       ) : (
//         <table className="min-w-full border border-gray-300 bg-white shadow-md">
//           <thead className="bg-gray-200 text-gray-700">
//             <tr>
//               <th className="border px-6 py-3 text-center text-lg">Execution Details</th>
//               <th className="border px-6 py-3 text-center text-lg">Execution Logs</th>
//               <th className="border px-6 py-3 text-center text-lg">Raw Payload</th>
//             </tr>
//           </thead>
//           <tbody>
//             {executions.map((log, index) => (
//               <tr key={index} className="border hover:bg-gray-50 transition">
//                 {/* Execution Details with Transcript & Recording */}
//                 <td className="border px-6 py-4">
//                   <div className="text-gray-800">
//                     <p><strong>Call Status:</strong> {log.status || "N/A"}</p>
//                     <p><strong>Call Duration:</strong> {log.conversation_duration ? `${log.conversation_duration} sec` : "N/A"}</p>
//                     <p><strong>Total Cost:</strong> {log.total_cost ? `$${log.total_cost}` : "N/A"}</p>
//                     <p><strong>Recipient Number:</strong> {log.context_details?.recipient_phone_number || "N/A"}</p>
//                     <p><strong>Hangup Reason:</strong> {log.telephony_data?.hangup_reason || "N/A"}</p>
//                     <p><strong>Created At:</strong> {new Date(log.created_at).toLocaleString()}</p>
//                   </div>

//                   {/* Transcript View */}
//                   {log.transcript && (
//                     <div className="mt-2 p-3 bg-gray-100 rounded-md text-gray-700">
//                       <h3 className="font-bold text-lg mb-1">📜 Transcript</h3>
//                       <p className="text-sm whitespace-pre-wrap">{log.transcript}</p>
//                     </div>
//                   )}

//                   {/* Call Recording */}
//                   {log.telephony_data?.recording_url && (
//                     <div className="mt-2">
//                       <h3 className="font-bold text-lg">🔊 Call Recording</h3>
//                       <audio controls className="w-full mt-1">
//                         <source src={log.telephony_data.recording_url} type="audio/mp3" />
//                         Your browser does not support the audio element.
//                       </audio>
//                     </div>
//                   )}
//                 </td>

//                 {/* Execution Logs (No Execution ID) */}
//                 <td className="border px-6 py-4 text-blue-600 hover:underline text-center cursor-pointer">
//                   <a href="#">More info</a>
//                 </td>

//                 {/* Raw Payload */}
//                 <td className="border px-6 py-4 text-blue-600 hover:underline text-center cursor-pointer">
//                   <a href="#" onClick={() => alert(JSON.stringify(log, null, 2))}>Show raw data</a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }






// C:\botGIT\botGIT-main\components\agents\call_logs.js 

import { useEffect, useState } from "react";

export default function CallLogs() {
  const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [selectedRawData, setSelectedRawData] = useState(null);

  const fetchExecutionIds = async () => {
    try {
      console.log("🔍 Fetching latest execution IDs...");
      const response = await fetch(`https://api.bolna.dev/agent/${agentId}/executions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch execution IDs");
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return [];

      return data.map((execution) => execution.id);
    } catch (error) {
      console.error("❌ Error fetching execution IDs:", error);
      return [];
    }
  };

  const fetchBatchCallDetails = async (executionIds) => {
    try {
      const callsData = await Promise.all(
        executionIds.map(async (executionId) => {
          console.log(`🔍 Fetching call log for Execution ID: ${executionId}`);
          const response = await fetch(`https://api.bolna.dev/executions/${executionId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });

          return response.ok ? response.json() : null;
        })
      );

      return callsData.filter((log) => log !== null);
    } catch (error) {
      console.error("❌ Error fetching call logs:", error);
      return [];
    }
  };

  const fetchCallDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      let executionIds = await fetchExecutionIds();
      if (executionIds.length === 0) {
        console.log("⚠️ No new execution IDs found.");
        setLoading(false);
        return;
      }

      executionIds = executionIds.reverse();

      const recentBatch = executionIds.slice(0, 5);
      const recentCalls = await fetchBatchCallDetails(recentBatch);
      setExecutions(recentCalls.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

      setLoading(false);

      const remainingBatch = executionIds.slice(5);
      if (remainingBatch.length > 0) {
        const olderCalls = await fetchBatchCallDetails(remainingBatch);
        setExecutions((prev) => [...prev, ...olderCalls].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      }
    } catch (error) {
      console.error("❌ Error fetching call logs:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallDetails();
  }, []);

  return (
    <div className="p-6 bg-gray-50 w-full h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📞 Call Logs</h2>

      {/* Scrollable Call Log Table */}
      <div className="flex-1 overflow-auto border border-gray-300 bg-white shadow-md rounded-lg">
        {loading ? (
          <p className="text-gray-600 p-4">Loading recent calls...</p>
        ) : error ? (
          <p className="text-red-500 p-4">Error: {error}</p>
        ) : executions.length === 0 ? (
          <p className="text-gray-600 p-4">No calls made yet.</p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-6 py-3 text-left text-lg">Execution Details</th>
                <th className="border px-6 py-3 text-left text-lg">Raw Data</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((log, index) => (
                <tr key={index} className="border hover:bg-gray-50 transition">
                  {/* Execution Details */}
                  <td className="border px-6 py-4">
                    <div className="text-gray-800">
                      <p><strong>Call Status:</strong> {log.status || "N/A"}</p>
                      <p><strong>Call Duration:</strong> {log.conversation_duration ? `${log.conversation_duration} sec` : "N/A"}</p>
                      <p><strong>Recipient Number:</strong> {log.context_details?.recipient_phone_number || "N/A"}</p>
                      <p><strong>Hangup Reason:</strong> {log.telephony_data?.hangup_reason || "N/A"}</p>
                      <p><strong>Created At:</strong> {new Date(log.created_at).toLocaleString()}</p>
                    </div>

                    {/* Call Recording */}
                    {log.telephony_data?.recording_url && (
                      <div className="mt-2">
                        <h3 className="font-bold text-lg">🔊 Call Recording</h3>
                        <audio controls className="w-full mt-1">
                          <source src={log.telephony_data.recording_url} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>

                        {/* View Transcript Button (Minimal Design) */}
                        {log.transcript && (
                          <button
                            onClick={() => setSelectedTranscript(log)}
                            className="text-gray-700 underline text-sm mt-2 block"
                          >
                            View Transcript
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Raw Data Modal Button */}
                  <td className="border px-6 py-4 text-left">
                    <button
                      onClick={() => setSelectedRawData(log)}
                      className="text-gray-700 underline text-sm"
                    >
                      Show Raw Data
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transcript Modal */}
      {selectedTranscript && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">Call Transcript</h2>
            <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
              {selectedTranscript.transcript}
            </pre>
            <button onClick={() => setSelectedTranscript(null)} className="mt-4 text-gray-800 underline">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Raw Data Modal */}
      {selectedRawData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">Raw Execution Data</h2>
            <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
              {JSON.stringify(selectedRawData, null, 2)}
            </pre>
            <button onClick={() => setSelectedRawData(null)} className="mt-4 text-gray-800 underline">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
