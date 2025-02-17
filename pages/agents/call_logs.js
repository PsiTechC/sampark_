



// // C:\botGIT\botGIT-main\pages\agents\call_logs.js 

// import { useEffect, useState } from "react";
// import Sidebar from "../../components/sidebar"

// export default function CallLogs() {
//   const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedTranscript, setSelectedTranscript] = useState(null);
//   const [selectedRawData, setSelectedRawData] = useState(null);

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
//     <div className="p-6 bg-gray-50 w-full h-screen flex flex-col">
//          <Sidebar />
//       <h2 className="text-2xl font-bold mb-4 text-gray-800"> Call Logs</h2>

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



// // C:\botGIT\botGIT-main\pages\agents\call_logs.js

// import { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar"; // <-- Import your Sidebar component

// export default function CallLogs() {
//   const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedTranscript, setSelectedTranscript] = useState(null);
//   const [selectedRawData, setSelectedRawData] = useState(null);

//   // Fetch a list of execution IDs for the specified agent
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

//   // For each execution ID, fetch detailed call logs
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

//       // Filter out any null responses (failed fetches)
//       return callsData.filter((log) => log !== null);
//     } catch (error) {
//       console.error("❌ Error fetching call logs:", error);
//       return [];
//     }
//   };

//   // Main function to fetch and store call details
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

//       // Reverse so the newest is first
//       executionIds = executionIds.reverse();

//       // Fetch recent 5
//       const recentBatch = executionIds.slice(0, 5);
//       const recentCalls = await fetchBatchCallDetails(recentBatch);
//       setExecutions(
//         recentCalls.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//       );

//       setLoading(false);

//       // Fetch remaining
//       const remainingBatch = executionIds.slice(5);
//       if (remainingBatch.length > 0) {
//         const olderCalls = await fetchBatchCallDetails(remainingBatch);
//         setExecutions((prev) =>
//           [...prev, ...olderCalls].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//         );
//       }
//     } catch (error) {
//       console.error("❌ Error fetching call logs:", error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCallDetails();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar on the left */}
//       <Sidebar />

//       {/* Main content area on the right */}
//       <div className="flex-grow p-6 flex flex-col">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">📞 Call Logs</h2>

//         <div className="flex-1 overflow-auto border border-gray-300 bg-white shadow-md rounded-lg">
//           {loading ? (
//             <p className="text-gray-600 p-4">Loading recent calls...</p>
//           ) : error ? (
//             <p className="text-red-500 p-4">Error: {error}</p>
//           ) : executions.length === 0 ? (
//             <p className="text-gray-600 p-4">No calls made yet.</p>
//           ) : (
//             <table className="min-w-full">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="border px-6 py-3 text-left text-lg">Execution Details</th>
//                   <th className="border px-6 py-3 text-left text-lg">Raw Data</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {executions.map((log, index) => (
//                   <tr key={index} className="border hover:bg-gray-50 transition">
//                     {/* Execution Details */}
//                     <td className="border px-6 py-4">
//                       <div className="text-gray-800">
//                         <p><strong>Call Status:</strong> {log.status || "N/A"}</p>
//                         <p>
//                           <strong>Call Duration:</strong>{" "}
//                           {log.conversation_duration ? `${log.conversation_duration} sec` : "N/A"}
//                         </p>
//                         <p>
//                           <strong>Recipient Number:</strong>{" "}
//                           {log.context_details?.recipient_phone_number || "N/A"}
//                         </p>
//                         <p>
//                           <strong>Hangup Reason:</strong>{" "}
//                           {log.telephony_data?.hangup_reason || "N/A"}
//                         </p>
//                         <p>
//                           <strong>Created At:</strong>{" "}
//                           {new Date(log.created_at).toLocaleString()}
//                         </p>
//                       </div>

//                       {/* Call Recording */}
//                       {log.telephony_data?.recording_url && (
//                         <div className="mt-2">
//                           <h3 className="font-bold text-lg">🔊 Call Recording</h3>
//                           <audio controls className="w-full mt-1">
//                             <source src={log.telephony_data.recording_url} type="audio/mp3" />
//                             Your browser does not support the audio element.
//                           </audio>

//                           {/* View Transcript Button */}
//                           {log.transcript && (
//                             <button
//                               onClick={() => setSelectedTranscript(log)}
//                               className="text-gray-700 underline text-sm mt-2 block"
//                             >
//                               View Transcript
//                             </button>
//                           )}
//                         </div>
//                       )}
//                     </td>

//                     {/* Raw Data Modal Button */}
//                     <td className="border px-6 py-4 text-left">
//                       <button
//                         onClick={() => setSelectedRawData(log)}
//                         className="text-gray-700 underline text-sm"
//                       >
//                         Show Raw Data
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Transcript Modal */}
//         {selectedTranscript && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
//               <h2 className="text-lg font-semibold mb-4">Call Transcript</h2>
//               <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
//                 {selectedTranscript.transcript}
//               </pre>
//               <button
//                 onClick={() => setSelectedTranscript(null)}
//                 className="mt-4 text-gray-800 underline"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Raw Data Modal */}
//         {selectedRawData && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
//               <h2 className="text-lg font-semibold mb-4">Raw Execution Data</h2>
//               <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
//                 {JSON.stringify(selectedRawData, null, 2)}
//               </pre>
//               <button
//                 onClick={() => setSelectedRawData(null)}
//                 className="mt-4 text-gray-800 underline"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








// C:\botGIT\botGIT-main\pages\agents\call_logs.js

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar"; // <-- Reuse your sidebar
import { FaDownload, FaCloud, FaCalendarAlt } from "react-icons/fa";

export default function CallLogs() {
  const agentId = "5ad4dace-34fa-44bd-a184-c7d6fedf737c";

  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [selectedRawData, setSelectedRawData] = useState(null);

  // ===== Fetching Logic =====
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

      // Reverse so the newest is first
      executionIds = executionIds.reverse();

      // Fetch recent 5
      const recentBatch = executionIds.slice(0, 5);
      const recentCalls = await fetchBatchCallDetails(recentBatch);
      const sortedRecent = recentCalls.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setExecutions(sortedRecent);

      setLoading(false);

      // Fetch remaining
      const remainingBatch = executionIds.slice(5);
      if (remainingBatch.length > 0) {
        const olderCalls = await fetchBatchCallDetails(remainingBatch);
        setExecutions((prev) =>
          [...prev, ...olderCalls].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
      }
    } catch (error) {
      console.error("❌ Error fetching call logs:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== UI =====
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Call Logs</h2>

        {/* Top Toolbar */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {/* Batch Selector (placeholder) */}
          {/* <select
            className="border border-gray-300 rounded px-3 py-1"
            defaultValue=""
            onChange={(e) => {
              // handle batch change
              console.log("Selected batch:", e.target.value);
            }}
          >
            <option value="">Select batch</option>
            <option value="batch1">Batch 1</option>
            <option value="batch2">Batch 2</option>
          </select> */}

          {/* Pick a date (placeholder) */}
          <div className="flex items-center border border-gray-300 rounded px-2 py-1">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input
              type="date"
              className="border-none outline-none"
              onChange={(e) => {
                // handle date change
                console.log("Selected date:", e.target.value);
              }}
            />
          </div>

          {/* Fetch Records */}
          <button
            onClick={fetchCallDetails}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Fetch records
          </button>

          {/* Download these records (placeholder) */}
          <button
            onClick={() => console.log("Downloading records...")}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 flex items-center"
          >
            <FaDownload className="mr-2" />
            Download these records
          </button>

          {/* Get these details using APIs (placeholder) */}
          <button
            onClick={() => console.log("Get details using APIs...")}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 flex items-center"
          >
            <FaCloud className="mr-2" />
            Get these details using APIs
          </button>
        </div>

        {/* Call Logs Table */}
        <div className="flex-1 overflow-auto border border-gray-300 bg-white shadow-md rounded-lg">
          {loading ? (
            <p className="text-gray-600 p-4">Loading recent calls...</p>
          ) : error ? (
            <p className="text-red-500 p-4">Error: {error}</p>
          ) : executions.length === 0 ? (
            <p className="text-gray-600 p-4">No calls made yet.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-3 text-left">Execution ID</th>
                  <th className="border px-4 py-3 text-left">Conversation Type</th>
                  <th className="border px-4 py-3 text-left">Duration (seconds)</th>
                 
                  <th className="border px-4 py-3 text-left">Timestamp</th>
                  <th className="border px-4 py-3 text-left">Cost (in dollars)</th>
                  <th className="border px-4 py-3 text-left">Status</th>
                  <th className="border px-4 py-3 text-left">Conversation Logs</th>
                  <th className="border px-4 py-3 text-left">Execution Logs</th>
                  <th className="border px-4 py-3 text-left">Raw Payload</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((log, index) => {
                  const direction = log.telephony_data?.direction || "outbound";
                  const duration = log.conversation_duration
                    ? log.conversation_duration.toFixed(1)
                    : "N/A";
                  const timestamp = new Date(log.created_at).toLocaleString();
                  const cost = log.telephony_data?.cost
                    ? `$${log.telephony_data.cost}`
                    : "$0.00"; // or "N/A"
                  const status = log.status || "N/A";

                  return (
                    <tr key={index} className="border hover:bg-gray-50 transition">
                      {/* Execution ID */}
                      <td className="border px-4 py-2">{log.id || "N/A"}</td>

                      {/* Conversation Type */}
                      <td className="border px-4 py-2">
                        {log.telephony_data?.provider || "twilio"} {direction}
                      </td>

                      {/* Duration */}
                      <td className="border px-4 py-2 text-center">{duration}</td>

                      {/* Batch (Placeholder) */}
                      <td className="border px-4 py-2">Batch #1</td>

                      {/* Timestamp */}
                      <td className="border px-4 py-2">{timestamp}</td>

                      {/* Cost */}
                      <td className="border px-4 py-2">{cost}</td>

                      {/* Status */}
                      <td className="border px-4 py-2">{status}</td>

                      {/* Conversation Logs (Recordings, transcripts, etc) */}
                      <td className="border px-4 py-2">
                        {log.telephony_data?.recording_url || log.transcript ? (
                          <button
                            className="text-blue-600 underline"
                            onClick={() => {
                              // For example, open a modal with call recordings or transcripts
                              setSelectedTranscript(log);
                            }}
                          >
                            Recordings, transcripts, etc
                          </button>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Execution Logs (Placeholder) */}
                      <td className="border px-4 py-2">
                        <button
                          className="text-blue-600 underline"
                          onClick={() => {
                            // e.g. open a "More info" modal or logs
                            alert("Execution logs for: " + (log.id || "N/A"));
                          }}
                        >
                          More info
                        </button>
                      </td>

                      {/* Raw Payload */}
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => setSelectedRawData(log)}
                          className="text-blue-600 underline"
                        >
                          Show raw
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Transcript Modal */}
        {selectedTranscript && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
              <h2 className="text-lg font-semibold mb-4">Call Transcript</h2>

              {selectedTranscript.transcript ? (
                <pre className="border p-3 rounded-md max-h-60 overflow-auto text-gray-700">
                  {selectedTranscript.transcript}
                </pre>
              ) : (
                <p className="text-gray-600">No transcript available.</p>
              )}

              {/* If there's a recording */}
              {selectedTranscript.telephony_data?.recording_url && (
                <div className="mt-4">
                  <h3 className="font-bold text-lg">🔊 Call Recording</h3>
                  <audio controls className="w-full mt-1">
                    <source
                      src={selectedTranscript.telephony_data.recording_url}
                      type="audio/mp3"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              <button
                onClick={() => setSelectedTranscript(null)}
                className="mt-4 text-gray-800 underline"
              >
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
              <button
                onClick={() => setSelectedRawData(null)}
                className="mt-4 text-gray-800 underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
