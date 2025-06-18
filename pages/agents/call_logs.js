// import { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar"; // <-- Reuse your sidebar
// import { FaDownload, FaCloud, FaCalendarAlt, FaHourglassStart } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import { DateTime } from "luxon";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


// export default function CallLogs() {
//   const agentId = "-";

//   const [executions, setExecutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [platform, setPlatform] = useState("vapi");
//   const [agents, setAgents] = useState([]);
//   const [selectedAgentId, setSelectedAgentId] = useState("-");
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [vapiAgents, setVapiAgents] = useState([]);
//   const [bolnaAgents, setBolnaAgents] = useState([]);
//   const [executionQueue, setExecutionQueue] = useState([]);
//   const [userDataMap, setUserDataMap] = useState({});
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [isDateModalOpen, setIsDateModalOpen] = useState(false);
//   const [durationSortOrder, setDurationSortOrder] = useState(null);
//   const [showDurationSortMenu, setShowDurationSortMenu] = useState(false);
//   const [timestampSortOrder, setTimestampSortOrder] = useState("desc");
//   const [timezones, setTimezones] = useState([]);

//   const [timezone, setTimezone] = useState("Asia/Kolkata");

//   function formatTimestampByTimezone(utcDateString, timezone) {
//     if (!utcDateString || !timezone) return "N/A";
//     try {
//       const date = DateTime.fromISO(utcDateString, { zone: "utc" }).setZone(timezone);
//       return date.toFormat("dd-MM-yyyy hh:mm:ss a");
//     } catch (err) {
//       console.error("❌ Error formatting timestamp:", err);
//       return utcDateString;
//     }
//   }

//   useEffect(() => {
//     const fetchTimezones = async () => {
//       try {
//         const res = await fetch("/api/map/timezones");
//         if (!res.ok) throw new Error("Failed to fetch timezones");
//         const data = await res.json();
//         setTimezones(data.timezones || []);
//       } catch (err) {
//         console.error("❌ Error loading timezones:", err);
//       }
//     };

//     fetchTimezones();
//   }, []);

//   const saveTimezone = async (tz) => {
//     try {
//       const res = await fetch("/api/map/userTZ", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ timezone: tz })
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Failed to save timezone");
//       }

//       console.log("✅ Timezone saved:", tz);
//     } catch (err) {
//       console.error("❌ Error saving timezone:", err);
//     }
//   };


//   const isWithinDateRange = (timestamp) => {
//     if (!startDate || !endDate) return true;
//     const date = new Date(timestamp);
//     return date >= startDate && date <= endDate;
//   };



//   const getShortSummary = (text) => {
//     if (!text) return "—";
//     const words = text.trim().split(/\s+/);
//     const firstLine = words.slice(0, 5).join(" ");
//     const secondLine = words.slice(5, 12).join(" ");
//     return (
//       <>
//         <span>{firstLine}</span>
//         <br />
//         <span>{secondLine}{words.length > 12 ? "..." : ""}</span>
//       </>
//     );
//   };




//   const [selectedTranscript, setSelectedTranscript] = useState(null);

//   const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   useEffect(() => {
//     const fetchUserDataAndThenCallMap = async () => {
//       try {
//         const callUserMap = {};

//         // Step 1: Fetch initial user data
//         const res = await fetch(`${BASE_URL}/api/clients/fetchUserData`);
//         if (!res.ok) throw new Error("Failed to fetch user data");

//         await res.json(); // Ignoring the response since it's just a trigger

//         // Step 2: Now fetch user data from call
//         const res2 = await fetch(`${BASE_URL}/api/clients/userDataFromCall`);
//         const userDataFromCall = await res2.json();

//         (userDataFromCall.data || []).forEach((entry) => {
//           const assistantId = entry.assistantId;
//           const callData = entry.data || {};
//           Object.entries(callData).forEach(([callId, userDetails]) => {
//             callUserMap[callId] = userDetails;
//           });
//         });

//         // Step 3: Set the final map
//         setUserDataMap(callUserMap);

//       } catch (err) {
//         console.error("❌ Error in chained user data fetch:", err);
//       }
//     };

//     fetchUserDataAndThenCallMap();
//   }, []);


//   useEffect(() => {
//     const fetchBothAgents = async () => {
//       try {
//         // Fetch mapped Vapi assistant IDs
//         const resMapping = await fetch("/api/map/getUserAgents");
//         const mappingData = await resMapping.json();

//         let fetchedVapi = [];
//         if (Array.isArray(mappingData.assistants)) {
//           const assistantIds = mappingData.assistants;
//           const fetchedDetails = await Promise.all(
//             assistantIds.map(async (id) => {
//               try {
//                 const res = await fetch(`https://api.vapi.ai/assistant/${id}`, {
//                   headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}` },
//                 });
//                 if (!res.ok) throw new Error(`Failed to fetch assistant ${id}`);
//                 return await res.json();
//               } catch (err) {
//                 console.error(`❌ Error fetching Vapi assistant ${id}:`, err);
//                 return null;
//               }
//             })
//           );
//           fetchedVapi = fetchedDetails.filter((a) => a !== null).map((a) => ({
//             id: a.id,
//             agent_name: a.name,
//           }));
//         }

//         // Fetch Bolna agents
//         const bolnaRes = await fetch("https://api.bolna.dev/v2/agent/all", {
//           headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
//         });
//         const bolnaData = await bolnaRes.json();
//         const formattedBolna = bolnaData.map((item) => ({
//           id: item.id,
//           agent_name: item.agent_name,
//         }));

//         setVapiAgents(fetchedVapi);
//         setBolnaAgents(formattedBolna);

//         // Initialize default selection
//         const initialAgents = platform === "vapi" ? fetchedVapi : formattedBolna;
//         setAgents(initialAgents);
//         setSelectedAgentId(initialAgents[0]?.id || "-");
//       } catch (err) {
//         console.error("❌ Error fetching agents:", err);
//       }
//     };

//     fetchBothAgents();
//   }, []);


//   const fetchVapiCallDetails = async (assistantId) => {
//     try {
//       const response = await fetch(`https://api.vapi.ai/call?assistantId=${assistantId}`, {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//         },
//       });
//       const data = await response.json();
//       console.log("Vapi Calls:", data);
//       return Array.isArray(data) ? data : [];
//     } catch (error) {
//       console.error("❌ Error fetching Vapi call logs:", error);
//       return [];
//     }
//   };


//   useEffect(() => {
//     const selectedSet = platform === "vapi" ? vapiAgents : bolnaAgents;
//     setAgents(selectedSet);
//     setSelectedAgentId(selectedSet[0]?.id || "-");
//   }, [platform, vapiAgents, bolnaAgents]);


//   // ===== Fetching Logic =====
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

//   function formatUTCtoISTReadable(utcDateString) {
//     if (!utcDateString) return "N/A";
//     const utcDate = new Date(utcDateString);

//     // IST = UTC + 5 hours 30 minutes
//     const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
//     const istTime = new Date(utcDate.getTime() + istOffset);

//     return istTime.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true,
//     });
//   }




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
//       const executionIds = await fetchExecutionIds();
//       if (executionIds.length === 0) {
//         setLoading(false);
//         return;
//       }

//       const firstBatch = executionIds.slice(0, 10);
//       const queue = executionIds.slice(10);
//       const firstCalls = await fetchBatchCallDetails(firstBatch);

//       setExecutions(firstCalls);
//       setExecutionQueue(queue);
//       setLoading(false);
//     } catch (error) {
//       console.error("❌ Error fetching call logs:", error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     if (!selectedAgentId) return;

//     if (platform === "bolna") {
//       fetchCallDetails(); // your bolna function
//     } else {
//       setLoading(true);
//       fetchVapiCallDetails(selectedAgentId).then((calls) => {
//         setExecutions(calls);
//         setLoading(false);
//       });
//     }
//   }, [selectedAgentId]);


//   useEffect(() => {
//     const getUserTimezone = async () => {
//       try {
//         const res = await fetch("/api/map/userTZ");
//         if (!res.ok) throw new Error("Failed to fetch timezone");
//         const data = await res.json();

//         if (data?.timezone) {
//           setTimezone(data.timezone);
//         }
//       } catch (err) {
//         console.error("❌ Error fetching saved timezone:", err);
//       }
//     };

//     getUserTimezone();
//   }, []);


//   useEffect(() => {
//     const container = document.getElementById("scroll-container");

//     const handleScroll = async () => {
//       if (!container || loadingMore || executionQueue.length === 0) return;

//       if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
//         setLoadingMore(true);

//         const nextBatch = executionQueue.slice(0, 10);
//         const remaining = executionQueue.slice(10);
//         const newCalls = await fetchBatchCallDetails(nextBatch);

//         setExecutions((prev) => [...prev, ...newCalls]);
//         setExecutionQueue(remaining);
//         setLoadingMore(false);
//       }
//     };

//     container?.addEventListener("scroll", handleScroll);
//     return () => container?.removeEventListener("scroll", handleScroll);
//   }, [executionQueue, loadingMore]);

//   // ===== UI =====
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-grow p-6 flex flex-col">
//         <h2 className="text-2xl font-bold mb-8 text-gray-800">Call Logs</h2>

//         {/* Top Toolbar */}
//         <div className="flex items-center flex-wrap gap-4 mb-6">


//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
//             <select
//               value={platform}
//               onChange={(e) => setPlatform(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
//             >
//               <option value="vapi">Vapi</option>
//               <option value="bolna">Bolna</option>
//             </select>
//           </div> */}

//           {/* Agent Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
//             <select
//               value={selectedAgentId}
//               onChange={(e) => setSelectedAgentId(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
//               disabled={agents.length === 0}
//             >
//               {agents.map((agent) => (
//                 <option key={agent.id} value={agent.id}>
//                   {agent.agent_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {/* Timestamp Sort Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
//             <select
//               value={timestampSortOrder}
//               onChange={(e) => setTimestampSortOrder(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
//             >
//               <option value="desc">Latest to Oldest</option>
//               <option value="asc">Oldest to Latest</option>
//             </select>
//           </div>
//           <div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
//               <select
//                 value={timezone}
//                 onChange={(e) => {
//                   const newTz = e.target.value;
//                   setTimezone(newTz);
//                   saveTimezone(newTz);
//                 }}
//                 className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
//               >
//                 {timezones.map((tz) => (
//                   <option key={tz.id} value={tz.id}>
//                     {tz.id}
//                   </option>
//                 ))}
//               </select>
//             </div>


//           </div>


//         </div>


//         {/* Call Logs Table */}
//         <div id="scroll-container" className="flex-1 overflow-y-auto border border-gray-300 bg-white shadow-md rounded-lg max-h-[75vh]">

//           {loading ? (
//             <div className="flex justify-center items-center p-8">
//               <div className="loader"></div>
//             </div>
//           ) : error ? (
//             <p className="text-red-500 p-4">Error: {error}</p>
//           ) : executions.length === 0 ? (
//             <p className="text-gray-600 p-4">No calls made yet.</p>
//           ) : (
//             <div className="overflow-x-auto ">
//               <table className="min-full text-sm table-fixed">
//                 <thead className="bg-gray-100 text-gray-700">
//                   <tr>
//                     <th className="border px-4 py-3 text-left">
//                       <div className="flex items-center justify-between">
//                         <span>Timestamp</span>
//                         <button
//                           className="text-blue-600 ml-2"
//                           onClick={() => setIsDateModalOpen(true)}
//                           title="Filter by date"
//                         >
//                           <FaCalendarAlt />
//                         </button>
//                       </div>
//                     </th>
//                     <th className="border px-4 py-3 text-left">Phone Number#</th>
//                     <th className="border px-4 py-3 text-left">Conversation Type</th>
//                     <th className="border px-4 py-3 text-left relative">
//                       <div className="flex items-center justify-between">
//                         <span>Duration (seconds)</span>
//                         <div className="relative">
//                           <button
//                             className="ml-2 text-blue-600"
//                             onClick={() => setShowDurationSortMenu((prev) => !prev)}
//                             title="Sort options"
//                           >
//                             <FaHourglassStart />
//                           </button>

//                           {showDurationSortMenu && (
//                             <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
//                               <button
//                                 className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                                 onClick={() => {
//                                   setDurationSortOrder("asc");
//                                   setShowDurationSortMenu(false);
//                                 }}
//                               >
//                                 Low to High
//                               </button>
//                               <button
//                                 className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                                 onClick={() => {
//                                   setDurationSortOrder("desc");
//                                   setShowDurationSortMenu(false);
//                                 }}
//                               >
//                                 High to Low
//                               </button>
//                               <button
//                                 className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
//                                 onClick={() => {
//                                   setDurationSortOrder(null);
//                                   setShowDurationSortMenu(false);
//                                 }}
//                               >
//                                 Reset
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </th>
//                     <th className="border px-4 py-3 text-left">Unique Call ID</th>
//                     <th className="border px-4 py-3 text-left">Customer Sentiment</th>

//                     <th className="border px-4 py-3 text-left">Conversation Logs</th>

//                     <th className="border px-4 py-3 text-left">Cost (USD)</th>
//                     {/* <th className="border px-4 py-3 text-left">Status</th> */}
//                     <th className="border px-4 py-3 text-left">Summary</th>
//                     <th className="border px-4 py-3 text-left">Customer Data</th>

//                   </tr>
//                 </thead>
//                 <tbody>
//                   {executions
//                     .filter((log) => isWithinDateRange(log.createdAt || log.created_at))
//                     .sort((a, b) => {
//                       // Duration sort has priority
//                       if (durationSortOrder) {
//                         const getDuration = (log) => {
//                           if (platform === "vapi") {
//                             if (log.startedAt && log.endedAt) {
//                               return new Date(log.endedAt) - new Date(log.startedAt);
//                             }
//                           } else {
//                             return log.conversation_duration || 0;
//                           }
//                           return 0;
//                         };

//                         const durationA = getDuration(a);
//                         const durationB = getDuration(b);

//                         return durationSortOrder === "asc" ? durationA - durationB : durationB - durationA;
//                       }

//                       // Fallback to timestamp sort
//                       const timeA = new Date(a.createdAt || a.created_at).getTime();
//                       const timeB = new Date(b.createdAt || b.created_at).getTime();
//                       return timestampSortOrder === "asc" ? timeA - timeB : timeB - timeA;
//                     })

//                     .map((log, index) => {

//                       const isVapi = platform === "vapi";
//                       const direction = isVapi
//                         ? log.type === "outboundPhoneCall"
//                           ? "outbound"
//                           : log.type === "inboundPhoneCall"
//                             ? "inbound"
//                             : "N/A"
//                         : log.telephony_data?.call_type || "outbound";

//                       const duration = isVapi
//                         ? log.startedAt && log.endedAt
//                           ? ((new Date(log.endedAt) - new Date(log.startedAt)) / 1000).toFixed(1)
//                           : "N/A"
//                         : log.conversation_duration
//                           ? log.conversation_duration.toFixed(1)
//                           : "N/A";
//                       const timestamp = formatTimestampByTimezone(log.createdAt || log.created_at, timezone);


//                       const cost = isVapi
//                         ? `$${(log.cost || 0).toFixed(2)}`
//                         : typeof log.total_cost === "number"
//                           ? `$${(log.total_cost / 100).toFixed(2)}`
//                           : "$0.00";
//                       const status = (log.status === "error" || log.status === "failed") ? "unreachable" : log.status || "N/A";
//                       const phoneNumber = isVapi ? log.customer?.number || "N/A" : log.telephony_data?.to_number || log.context_details?.recipient_phone_number || "N/A";

//                       return (
//                         <tr key={index} className="border hover:bg-gray-50 transition">
//                           <td className="border px-4 py-2 break-words">{timestamp}</td>
//                           <td className="border px-2 py-2 break-words">{phoneNumber}</td>
//                           <td className="border px-2 py-2 break-words">{direction}</td>
//                           <td className="border px-2 py-2 text-center break-words">{duration}</td>
//                           <td className="border px-4 py-2 break-words">{log.id || "N/A"}</td>
//                           <td className="border px-4 py-2 break-words">
//                             {userDataMap[log.id]?.sentiment || "—"}
//                           </td>

//                           <td className="border px-4 py-2">
//                             {log.recordingUrl || log.telephony_data?.recording_url || log.transcript ? (
//                               <button
//                                 className="text-blue-600 underline"
//                                 onClick={() => setSelectedTranscript(log)}
//                               >
//                                 Recordings, transcripts, etc
//                               </button>
//                             ) : (
//                               "—"
//                             )}
//                           </td>
//                           <td className="border px-4 py-2">{cost}</td>
//                           {/* <td className="border px-4 py-2">{status}</td> */}
//                           <td className="border px-4 py-2 max-w-xs relative group">
//                             <div className="whitespace-normal text-gray-800 leading-snug">
//                               {getShortSummary(log.summary)}
//                             </div>
//                             {log.summary && (
//                               <div className="absolute z-10 hidden group-hover:block bg-white border border-gray-300 p-2 rounded shadow-md text-sm text-gray-900 w-64 top-full left-0 -translate-x-20 mt-1 whitespace-normal">
//                                 {log.summary}
//                               </div>
//                             )}
//                           </td>
//                           <td className="border px-4 py-2 whitespace-normal text-gray-800 leading-snug text-sm">
//                             {(() => {
//                               const userData = userDataMap[log.id];
//                               if (!userData) return "—";

//                               const allowedKeys = ["name", "email", "appointmentDate", "purpose"];
//                               const entries = Object.entries(userData).filter(
//                                 ([key, value]) => allowedKeys.includes(key) && value && value !== "-"
//                               );

//                               const formatDate = (raw) => {
//                                 const date = new Date(raw);
//                                 return isNaN(date.getTime())
//                                   ? raw
//                                   : date.toLocaleString("en-IN", {
//                                     weekday: "short",
//                                     year: "numeric",
//                                     month: "short",
//                                     day: "numeric",
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                   });
//                               };

//                               return entries.length === 0
//                                 ? "—"
//                                 : entries.map(([key, value]) => (
//                                   <div key={key}>
//                                     <strong>{key}:</strong>{" "}
//                                     {key === "appointmentDate" ? formatDate(value) : value}
//                                   </div>
//                                 ));

//                             })()}
//                           </td>

//                         </tr>

//                       );
//                     })}

//                   {loadingMore && (
//                     <tr>
//                       <td colSpan="9" className="py-4 text-center">
//                         <div className="loader"></div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>

//                 {isDateModalOpen && (
//                   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//                     <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
//                       <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Date Range</h2>

//                       <div className="mb-4">
//                         <label className="block mb-1 text-gray-700 font-medium">Start Date</label>
//                         <DatePicker
//                           selected={startDate}
//                           onChange={(date) => setStartDate(date)}
//                           className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
//                           dateFormat="yyyy-MM-dd"
//                           maxDate={endDate || new Date()}
//                           placeholderText="Select start date"
//                         />
//                       </div>

//                       <div className="mb-4">
//                         <label className="block mb-1 text-gray-700 font-medium">End Date</label>
//                         <DatePicker
//                           selected={endDate}
//                           onChange={(date) => setEndDate(date)}
//                           className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
//                           dateFormat="yyyy-MM-dd"
//                           minDate={startDate}
//                           maxDate={new Date()}
//                           placeholderText="Select end date"
//                         />
//                       </div>

//                       <div className="flex justify-end gap-4">
//                         <button
//                           onClick={() => {
//                             setStartDate(null);
//                             setEndDate(null);
//                             setIsDateModalOpen(false);
//                           }}
//                           className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
//                         >
//                           Clear
//                         </button>
//                         <button
//                           onClick={() => setIsDateModalOpen(false)}
//                           className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
//                         >
//                           Apply Filter
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//               </table>    </div>
//           )}
//         </div>

//         {/* Transcript Modal */}
//         {selectedTranscript && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
//               <h2 className="text-lg font-semibold mb-4">Call Transcript</h2>

//               {selectedTranscript.transcript ? (
//                 <div className="border p-3 rounded-md max-h-60 overflow-y-auto overflow-x-hidden text-gray-700 whitespace-pre-wrap break-words">
//                   {selectedTranscript.transcript
//                     .split(/(?=AI:|User:)/i)
//                     .map((segment, index) => (
//                       <div key={index} className="mb-2">
//                         {segment.trim()}
//                       </div>
//                     ))}
//                 </div>


//               ) : (
//                 <p className="text-gray-600">No transcript available.</p>
//               )}

//               {(selectedTranscript.telephony_data?.recording_url || selectedTranscript.recordingUrl) && (
//                 <div className="mt-4">
//                   <h3 className="font-bold text-lg">🔊 Call Recording</h3>
//                   <audio controls className="w-full mt-1">
//                     <source
//                       src={selectedTranscript.telephony_data?.recording_url || selectedTranscript.recordingUrl}
//                       type="audio/mp3"
//                     />
//                     Your browser does not support the audio element.
//                   </audio>
//                 </div>
//               )}


//               <button
//                 onClick={() => setSelectedTranscript(null)}
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


// C:\sanket\psitech\sampark_\pages\agents\call_logs.js

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar"; // <-- Reuse your sidebar
import { FaDownload, FaCloud, FaCalendarAlt, FaHourglassStart } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export default function CallLogs() {
  const agentId = "-";

  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [platform, setPlatform] = useState("vapi");
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("-");
  const [loadingMore, setLoadingMore] = useState(false);
  const [vapiAgents, setVapiAgents] = useState([]);
  const [bolnaAgents, setBolnaAgents] = useState([]);
  const [executionQueue, setExecutionQueue] = useState([]);
  const [userDataMap, setUserDataMap] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [durationSortOrder, setDurationSortOrder] = useState(null);
  const [showDurationSortMenu, setShowDurationSortMenu] = useState(false);
  const [timestampSortOrder, setTimestampSortOrder] = useState("desc");
  const [timezones, setTimezones] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  const isBatchMode = !!selectedBatchId;


  const [timezone, setTimezone] = useState("Asia/Kolkata");

  function formatTimestampByTimezone(utcDateString, timezone) {
    if (!utcDateString || !timezone) return "N/A";
    try {
      const date = DateTime.fromISO(utcDateString, { zone: "utc" }).setZone(timezone);
      return date.toFormat("dd-MM-yyyy hh:mm:ss a");
    } catch (err) {
      console.error("❌ Error formatting timestamp:", err);
      return utcDateString;
    }
  }

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const res = await fetch("/api/map/timezones");
        if (!res.ok) throw new Error("Failed to fetch timezones");
        const data = await res.json();
        setTimezones(data.timezones || []);
      } catch (err) {
        console.error("❌ Error loading timezones:", err);
      }
    };

    fetchTimezones();
  }, []);

  const saveTimezone = async (tz) => {
    try {
      const res = await fetch("/api/map/userTZ", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ timezone: tz })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save timezone");
      }

      console.log("✅ Timezone saved:", tz);
    } catch (err) {
      console.error("❌ Error saving timezone:", err);
    }
  };


  const isWithinDateRange = (timestamp) => {
    if (!startDate || !endDate) return true;
    const date = new Date(timestamp);
    return date >= startDate && date <= endDate;
  };



  const getShortSummary = (text) => {
    if (!text) return "—";
    const words = text.trim().split(/\s+/);
    const firstLine = words.slice(0, 5).join(" ");
    const secondLine = words.slice(5, 12).join(" ");
    return (
      <>
        <span>{firstLine}</span>
        <br />
        <span>{secondLine}{words.length > 12 ? "..." : ""}</span>
      </>
    );
  };




  const [selectedTranscript, setSelectedTranscript] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchUserDataAndThenCallMap = async () => {
      try {
        const callUserMap = {};

        // Step 1: Fetch initial user data
        const res = await fetch(`${BASE_URL}/api/clients/fetchUserData`);
        if (!res.ok) throw new Error("Failed to fetch user data");

        await res.json(); // Ignoring the response since it's just a trigger

        // Step 2: Now fetch user data from call
        const res2 = await fetch(`${BASE_URL}/api/clients/userDataFromCall`);
        const userDataFromCall = await res2.json();

        (userDataFromCall.data || []).forEach((entry) => {
          const assistantId = entry.assistantId;
          const callData = entry.data || {};
          Object.entries(callData).forEach(([callId, userDetails]) => {
            callUserMap[callId] = userDetails;
          });
        });

        // Step 3: Set the final map
        setUserDataMap(callUserMap);

      } catch (err) {
        console.error("❌ Error in chained user data fetch:", err);
      }
    };

    fetchUserDataAndThenCallMap();
  }, []);


  useEffect(() => {
    const fetchBothAgents = async () => {
      try {
        // Fetch mapped Vapi assistant IDs
        const resMapping = await fetch("/api/map/getUserAgents");
        const mappingData = await resMapping.json();

        let fetchedVapi = [];
        if (Array.isArray(mappingData.assistants)) {
          const assistantIds = mappingData.assistants;
          const fetchedDetails = await Promise.all(
            assistantIds.map(async (id) => {
              try {
                const res = await fetch(`https://api.vapi.ai/assistant/${id}`, {
                  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}` },
                });
                if (!res.ok) throw new Error(`Failed to fetch assistant ${id}`);
                return await res.json();
              } catch (err) {
                console.error(`❌ Error fetching Vapi assistant ${id}:`, err);
                return null;
              }
            })
          );
          fetchedVapi = fetchedDetails.filter((a) => a !== null).map((a) => ({
            id: a.id,
            agent_name: a.name,
          }));
        }

        // Fetch Bolna agents
        const bolnaRes = await fetch("https://api.bolna.dev/v2/agent/all", {
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
        });
        const bolnaData = await bolnaRes.json();
        const formattedBolna = bolnaData.map((item) => ({
          id: item.id,
          agent_name: item.agent_name,
        }));

        setVapiAgents(fetchedVapi);
        setBolnaAgents(formattedBolna);

        // Initialize default selection
        const initialAgents = platform === "vapi" ? fetchedVapi : formattedBolna;
        setAgents(initialAgents);
        setSelectedAgentId(initialAgents[0]?.id || "-");
        console.log("✅ Available agents:", initialAgents);
      } catch (err) {
        console.error("❌ Error fetching agents:", err);
      }
    };

    fetchBothAgents();
  }, []);


  const fetchVapiCallDetails = async (assistantId) => {
    try {
      const response = await fetch(`https://api.vapi.ai/call?assistantId=${assistantId}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
        },
      });
      const data = await response.json();
      console.log("Vapi Calls:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error fetching Vapi call logs:", error);
      return [];
    }
  };


  // useEffect(() => {
  //   const selectedSet = platform === "vapi" ? vapiAgents : bolnaAgents;
  //   setAgents(selectedSet);
  //   setSelectedAgentId(selectedSet[0]?.id || "-");
  // }, [platform, vapiAgents, bolnaAgents]);




  // ===== Fetching Logic =====
  const fetchExecutionIds = async () => {
    try {
      console.log("🔍 Fetching latest execution IDs...");
      const response = await fetch(`https://api.bolna.dev/agent/${selectedAgentId}/executions`, {
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

  function formatUTCtoISTReadable(utcDateString) {
    if (!utcDateString) return "N/A";
    const utcDate = new Date(utcDateString);

    // IST = UTC + 5 hours 30 minutes
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(utcDate.getTime() + istOffset);

    return istTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }




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


  // const fetchCallDetails = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const executionIds = await fetchExecutionIds();
  //     if (executionIds.length === 0) {
  //       setLoading(false);
  //       return;
  //     }

  //     const firstBatch = executionIds.slice(0, 10);
  //     const queue = executionIds.slice(10);
  //     const firstCalls = await fetchBatchCallDetails(firstBatch);

  //     setExecutions(firstCalls);
  //     setExecutionQueue(queue);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("❌ Error fetching call logs:", error);
  //     setError(error.message);
  //     setLoading(false);
  //   }
  // };


  const fetchCallDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `/api/batches/${selectedBatchId}/call_logs_for_batches`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      setExecutions(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch call logs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  //   useEffect(() => {
  //     if (!selectedAgentId) return;

  //  // Replace with your actual API endpoint to get batches for agent
  //   fetch(`/api/agents/${selectedAgentId}/batches`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setBatches(data || []);
  //       setSelectedBatchId(null); // reset selected batch
  //     })
  //     .catch(err => {
  //       console.error("❌ Failed to fetch batches:", err);
  //       setBatches([]);
  //     });


  //     if (platform === "bolna") {
  //       fetchCallDetails(); // your bolna function
  //     } else {
  //       setLoading(true);
  //       fetchVapiCallDetails(selectedAgentId).then((calls) => {
  //         setExecutions(calls);
  //         setLoading(false);
  //       });
  //     }
  //   }, [selectedAgentId]);


  useEffect(() => {
    if (!selectedAgentId) return;

    // 1. Fetch available batches for the selected agent
    // fetch(`/api/agents/${selectedAgentId}/batches`)
    fetch(`/api/batches/${selectedAgentId}/batches`)

      .then(res => res.json())
      .then(data => {
        setBatches(data || []);
        setSelectedBatchId(null); // Reset batch selection
      })
      .catch(err => {
        console.error("❌ Failed to fetch batches:", err);
        setBatches([]);
      });

    // 2. For vapi platform, fetch calls immediately (batch-based filtering is only for bolna)
    // if (platform === "vapi") {
    //   setLoading(true);
    //   fetchVapiCallDetails(selectedAgentId).then((calls) => {
    //     setExecutions(calls);
    //     setLoading(false);
    //   });
    // }
  }, [selectedAgentId]);

  useEffect(() => {
    if (!selectedAgentId) return;

    setLoading(true);
    if (selectedBatchId) {
      fetchCallDetails(); // from batch-specific API
    } else {
      fetchVapiCallDetails(selectedAgentId).then((calls) => {
        setExecutions(calls);
        setLoading(false);
      });
    }
  }, [selectedAgentId, selectedBatchId]);





  useEffect(() => {
    const getUserTimezone = async () => {
      try {
        const res = await fetch("/api/map/userTZ");
        if (!res.ok) throw new Error("Failed to fetch timezone");
        const data = await res.json();

        if (data?.timezone) {
          setTimezone(data.timezone);
        }
      } catch (err) {
        console.error("❌ Error fetching saved timezone:", err);
      }
    };

    getUserTimezone();
  }, []);


  useEffect(() => {
    const container = document.getElementById("scroll-container");

    const handleScroll = async () => {
      if (!container || loadingMore || executionQueue.length === 0) return;

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
        setLoadingMore(true);

        const nextBatch = executionQueue.slice(0, 10);
        const remaining = executionQueue.slice(10);
        const newCalls = await fetchBatchCallDetails(nextBatch);

        setExecutions((prev) => [...prev, ...newCalls]);
        setExecutionQueue(remaining);
        setLoadingMore(false);
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [executionQueue, loadingMore]);

  // ===== UI =====
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Call Logs</h2>

        {/* Top Toolbar */}
        <div className="flex items-center flex-wrap gap-4 mb-6">


          {/* <div>


          {/* Agent Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            // disabled={agents.length === 0}
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.agent_name}
                </option>
              ))}
            </select>
          </div>
          {/* Timestamp Sort Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
            <select
              value={timestampSortOrder}
              onChange={(e) => setTimestampSortOrder(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            >
              <option value="desc">Latest to Oldest</option>
              <option value="asc">Oldest to Latest</option>
            </select>
          </div>
          {/* dropdown for batches */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <select
              value={selectedBatchId || ""}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
              disabled={batches.length === 0}
            >
              <option value="">All Batches</option>
              {batches.map(batch => (
                <option key={batch.batch_id} value={batch.batch_id}>
                  {batch.batch_name || batch.batch_id.slice(0, 6)}
                </option>
              ))}
            </select>
          </div>


          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => {
                  const newTz = e.target.value;
                  setTimezone(newTz);
                  saveTimezone(newTz);
                }}
                className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
              >
                {timezones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.id}
                  </option>
                ))}
              </select>
            </div>


          </div>


        </div>


        {/* Call Logs Table */}
        <div id="scroll-container" className="flex-1 overflow-y-auto border border-gray-300 bg-white shadow-md rounded-lg max-h-[75vh]">

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 p-4">Error: {error}</p>
          ) : executions.length === 0 ? (
            <p className="text-gray-600 p-4">No calls made yet.</p>
          ) : (
            <div className="overflow-x-auto ">

              <table className="min-full text-sm table-fixed">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border px-4 py-3 text-left">
                      <div className="flex items-center justify-between">
                        <span>Timestamp</span>
                        <button
                          className="text-blue-600 ml-2"
                          onClick={() => setIsDateModalOpen(true)}
                          title="Filter by date"
                        >
                          <FaCalendarAlt />
                        </button>
                      </div>
                    </th>
                    <th className="border px-4 py-3 text-left">Phone Number#</th>
                    <th className="border px-4 py-3 text-left">Conversation Type</th>
                    <th className="border px-4 py-3 text-left relative">
                      <div className="flex items-center justify-between">
                        <span>Duration (seconds)</span>
                        <div className="relative">
                          <button
                            className="ml-2 text-blue-600"
                            onClick={() => setShowDurationSortMenu((prev) => !prev)}
                            title="Sort options"
                          >
                            <FaHourglassStart />
                          </button>

                          {showDurationSortMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                onClick={() => {
                                  setDurationSortOrder("asc");
                                  setShowDurationSortMenu(false);
                                }}
                              >
                                Low to High
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                onClick={() => {
                                  setDurationSortOrder("desc");
                                  setShowDurationSortMenu(false);
                                }}
                              >
                                High to Low
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                                onClick={() => {
                                  setDurationSortOrder(null);
                                  setShowDurationSortMenu(false);
                                }}
                              >
                                Reset
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="border px-4 py-3 text-left">Unique Call ID</th>
                    <th className="border px-4 py-3 text-left">Customer Sentiment</th>

                    <th className="border px-4 py-3 text-left">Conversation Logs</th>

                    <th className="border px-4 py-3 text-left">Cost (USD)</th>
                    {/* <th className="border px-4 py-3 text-left">Status</th> */}
                    <th className="border px-4 py-3 text-left">Summary</th>
                    <th className="border px-4 py-3 text-left">Customer Data</th>

                  </tr>
                </thead>
                <tbody>
                  {executions
                    .filter((log) => isWithinDateRange(log.createdAt || log.created_at))
                    .sort((a, b) => {
                      // Duration sort has priority
                      if (durationSortOrder) {
                        const getDuration = (log) => {
                          if (platform === "vapi") {
                            if (log.startedAt && log.endedAt) {
                              return new Date(log.endedAt) - new Date(log.startedAt);
                            }
                          } else {
                            return log.conversation_duration || 0;
                          }
                          return 0;
                        };

                        const durationA = getDuration(a);
                        const durationB = getDuration(b);

                        return durationSortOrder === "asc" ? durationA - durationB : durationB - durationA;
                      }

                      // Fallback to timestamp sort
                      const timeA = new Date(a.createdAt || a.created_at).getTime();
                      const timeB = new Date(b.createdAt || b.created_at).getTime();
                      return timestampSortOrder === "asc" ? timeA - timeB : timeB - timeA;
                    })

                    .map((log, index) => {
                      const isVapi = platform === "vapi";
                      const callId = log.callId || log.id;
                      const timestamp = formatTimestampByTimezone(log.timestamp || log.createdAt || log.created_at, timezone);
                      const duration = log.duration?.toFixed(1) || "N/A";
                      const direction = log.type?.includes("inbound") ? "inbound"
                        : log.type?.includes("outbound") ? "outbound"
                          : log.telephony_data?.call_type || "N/A";
                      const phoneNumber = log.customerNumber || log.customer?.number || "N/A";
                      const sentiment = userDataMap[callId]?.sentiment || log.sentiment || "—";
                      const cost = typeof log.cost === "number" ? `$${log.cost.toFixed(2)}` : "$0.00";
                      const summary = getShortSummary(log.summary);

                      return (
                        <tr key={index} className="border hover:bg-gray-50 transition">
                          <td className="border px-4 py-2 break-words">{timestamp}</td>
                          <td className="border px-2 py-2 break-words">{phoneNumber}</td>
                          <td className="border px-2 py-2 break-words">{direction}</td>
                          <td className="border px-2 py-2 text-center break-words">{duration}</td>
                          <td className="border px-4 py-2 break-words">{callId}</td>
                          <td className="border px-4 py-2 break-words">{sentiment}</td>
                          <td className="border px-4 py-2">
                            {log.recordingUrl || log.transcript ? (
                              <button onClick={() => setSelectedTranscript(log)} className="text-blue-600 underline">
                                Recordings, transcripts, etc
                              </button>
                            ) : "—"}
                          </td>
                          <td className="border px-4 py-2">{cost}</td>
                          <td className="border px-4 py-2 max-w-xs relative group">
                            <div className="whitespace-normal text-gray-800 leading-snug">
                              {summary}
                            </div>
                            {log.summary && (
                              <div className="absolute z-10 hidden group-hover:block bg-white border p-2 rounded shadow-md text-sm text-gray-900 w-64 top-full left-0 -translate-x-20 mt-1 whitespace-normal">
                                {log.summary}
                              </div>
                            )}
                          </td>
                          <td className="border px-4 py-2 whitespace-normal text-gray-800 leading-snug text-sm">
                            {/* Render userDataMap info */}
                            {(() => {
                              const userData = userDataMap[callId];
                              if (!userData) return "—";

                              const allowedKeys = ["name", "email", "appointmentDate", "purpose"];
                              const entries = Object.entries(userData).filter(
                                ([key, value]) => allowedKeys.includes(key) && value && value !== "-"
                              );

                              const formatDate = (raw) => {
                                const date = new Date(raw);
                                return isNaN(date.getTime())
                                  ? raw
                                  : date.toLocaleString("en-IN", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  });
                              };

                              return entries.length === 0
                                ? "—"
                                : entries.map(([key, value]) => (
                                  <div key={key}>
                                    <strong>{key}:</strong>{" "}
                                    {key === "appointmentDate" ? formatDate(value) : value}
                                  </div>
                                ));
                            })()}
                          </td>
                        </tr>
                      );
                    }



                    )}

                  {loadingMore && (
                    <tr>
                      <td colSpan="9" className="py-4 text-center">
                        <div className="loader"></div>
                      </td>
                    </tr>
                  )}
                </tbody>

                {isDateModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Date Range</h2>

                      <div className="mb-4">
                        <label className="block mb-1 text-gray-700 font-medium">Start Date</label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                          dateFormat="yyyy-MM-dd"
                          maxDate={endDate || new Date()}
                          placeholderText="Select start date"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 text-gray-700 font-medium">End Date</label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                          dateFormat="yyyy-MM-dd"
                          minDate={startDate}
                          maxDate={new Date()}
                          placeholderText="Select end date"
                        />
                      </div>

                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => {
                            setStartDate(null);
                            setEndDate(null);
                            setIsDateModalOpen(false);
                          }}
                          className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setIsDateModalOpen(false)}
                          className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Apply Filter
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </table>

            </div>
          )}
        </div>

        {/* Transcript Modal */}
        {selectedTranscript && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
              <h2 className="text-lg font-semibold mb-4">Call Transcript</h2>

              {selectedTranscript.transcript ? (
                <div className="border p-3 rounded-md max-h-60 overflow-y-auto overflow-x-hidden text-gray-700 whitespace-pre-wrap break-words">
                  {selectedTranscript.transcript
                    .split(/(?=AI:|User:)/i)
                    .map((segment, index) => (
                      <div key={index} className="mb-2">
                        {segment.trim()}
                      </div>
                    ))}
                </div>


              ) : (
                <p className="text-gray-600">No transcript available.</p>
              )}

              {(selectedTranscript.telephony_data?.recording_url || selectedTranscript.recordingUrl) && (
                <div className="mt-4">
                  <h3 className="font-bold text-lg">🔊 Call Recording</h3>
                  <audio controls className="w-full mt-1">
                    <source
                      src={selectedTranscript.telephony_data?.recording_url || selectedTranscript.recordingUrl}
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

              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="..."
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.agent_name}
                  </option>
                ))}
              </select>

            </div>
          </div>
        )}


      </div>
    </div>
  );
}