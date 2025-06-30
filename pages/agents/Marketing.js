// import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar";
// import { FiCopy, FiPause, FiCalendar, FiPlay, FiDownload } from "react-icons/fi";
// import { FiSettings } from "react-icons/fi";


// const DEFAULT_PHONE_NUMBER = "4519aa32-fcb2-4bf6-9200-53a6959258e1";


// async function fetchAssistantsData() {
//   try {
//     // 1. Get mapped assistant IDs
//     const resMapping = await fetch("/api/map/getUserAgents");
//     const mappingData = await resMapping.json();

//     if (!resMapping.ok || !Array.isArray(mappingData.assistants)) {
//       console.error("❌ Failed to retrieve assistant IDs");
//       return [];
//     }

//     const assistantIds = mappingData.assistants;

//     // 2. Fetch each assistant individually
//     const fetchedAssistants = await Promise.all(
//       assistantIds.map(async (id) => {
//         try {
//           const res = await fetch(`https://api.vapi.ai/assistant/${id}`, {
//             headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}` },
//           });
//           if (!res.ok) throw new Error(`Failed to fetch assistant ${id}`);
//           return await res.json();
//         } catch (err) {
//           console.error(`❌ Error fetching Vapi assistant ${id}:`, err);
//           return null;
//         }
//       })
//     );

//     return fetchedAssistants.filter((a) => a !== null);
//   } catch (error) {
//     console.error("❌ Error fetching assistants:", error);
//     return [];
//   }
// }


// // Fetch batches for a specific assistant
// async function fetchBatchesData(assistantId) {
//   const res = await fetch(`/api/batches?assistant_id=${assistantId}`);
//   if (!res.ok) throw new Error("Failed to fetch batches");
//   return res.json();
// }


// export default function Marketing() {
//   const [assistants, setAssistants] = useState([]);
//   const [selectedAssistant, setSelectedAssistant] = useState("");
//   const [batches, setBatches] = useState([]);

//   // Modal state
//   const [showUpload, setShowUpload] = useState(false);
//   const [csvFile, setCsvFile] = useState(null);
//   const [scheduledAt, setScheduledAt] = useState("");
//   const [scheduleModal, setScheduleModal] = useState({ open: false, batchId: null, date: "" });

//   // On mount: load assistants and batches
//   useEffect(() => {
//     fetchAssistantsData().then(setAssistants).catch(console.error);
//     fetchBatchesData().then(setBatches).catch(console.error);
//   }, []);

//   // Load batches whenever an assistant is selected
// useEffect(() => {
//   if (!selectedAssistant) return;
//   fetchBatchesData(selectedAssistant).then(setBatches).catch(console.error);
// }, [selectedAssistant]);

//   // === Handlers ===


//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const running = batches.filter(b => b.status === "running");
//       await Promise.all(running.map(async b => {
//         const res = await fetch(`/api/batches/${b.batch_id}/status`);
//         if (!res.ok) return;
//         const fresh = await res.json();
//         setBatches(prev =>
//           prev.map(p => p.batch_id === b.batch_id ? { ...p, status: fresh.status } : p));
//       }));
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [batches]);



//   // Upload CSV and create batch
//   async function handleConfirmUpload() {
//     if (!csvFile || !selectedAssistant) {
//       alert("Please select an assistant and upload a CSV file.");
//       return;
//     }
//     try {
//       const fd = new FormData();
//       fd.append("file", csvFile);
//       fd.append("assistant_id", selectedAssistant);
//       // use the correct constant name here:
//       fd.append("from_phone_number", DEFAULT_PHONE_NUMBER);

//       const res = await fetch("/api/batches", { method: "POST", body: fd });
//       const body = await res.json();
//       if (!res.ok) throw new Error(body.message || "Upload failed");

//       // (optional) auto-schedule on upload
//       if (scheduledAt) {
//         const sch = await fetch(`/api/batches/${body.batch_id}/schedule`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ scheduled_at: scheduledAt })
//         });
//         if (!sch.ok) throw new Error((await sch.json()).message || "Schedule failed");
//       }

//       alert("✅ Campaign uploaded!");
//       setShowUpload(false);
//       setCsvFile(null);
//       setScheduledAt("");
//       setBatches(await fetchBatchesData());
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   }


//   // Immediately run the batch now
//   async function handleRunNow(batchId) {
//     try {
//       const res = await fetch(`/api/batches/${batchId}/run`, { method: "POST" });
//       if (!res.ok) throw new Error((await res.json()).message);
//       alert("🚀 Batch started immediately");
//       setBatches(await fetchBatchesData());
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to run batch now");
//     }
//   }

//   // Schedule batch for later
//   function openSchedule(batchId) {
//     setScheduleModal({ open: true, batchId, date: "" });
//   }
//   async function handleScheduleSubmit() {
//     const { batchId, date } = scheduleModal;
//     if (!date) {
//       alert("Please pick a date/time");
//       return;
//     }
//     try {
//       const res = await fetch(`/api/batches/${batchId}/schedule`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scheduled_at: date })
//       });
//       if (!res.ok) throw new Error((await res.json()).message);
//       const { batch } = await res.json();
//       setBatches(bs => bs.map(b => b.batch_id === batch.batch_id ? batch : b));
//       alert("📅 Batch scheduled");
//       setScheduleModal({ open: false, batchId: null, date: "" });
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   }


//   // ­­­­­­­­­­­­­­­­­­­­­­­ inside your <Marketing /> component — e.g. just below openSchedule()
//   async function openReport(batchId) {
//     try {
//       // 1. Fetch the JSON summary that the API route already returns
//       const res = await fetch(`/api/batches/${batchId}/report`);
//       if (!res.ok) throw new Error(`Server responded ${res.status}`);
//       const batch = await res.json();

//       // 2. Turn the summary array into a CSV string
//       const headers = ['phone', 'status', 'duration', 'transcript'];
//       const rows = batch.summary.map(r => [
//         r.phone,
//         r.status,
//         r.duration ?? '',
//         (r.transcript ?? '').replace(/"/g, '""')    // escape quotes
//       ]);
//       const csv =
//         [headers, ...rows]
//           .map(row => row.map(col => `"${col}"`).join(','))
//           .join('\n');

//       // 3. Trigger a download in the browser
//       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `batch_${batchId}_report.csv`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       alert(err.message || 'Failed to download report');
//     }
//   }


//   async function handleScheduleBatch(batchId) {
//     try {
//       const res = await fetch(`/api/batches/${batchId}/schedule`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scheduled_at: scheduledAt })
//       });
//       if (!res.ok) {
//         const { message } = await res.json();
//         throw new Error(message);
//       }
//       const { batch } = await res.json();
//       // merge the updated batch into state
//       setBatches(bs =>
//         bs.map(b => (b.batch_id === batch.batch_id ? batch : b))
//       );
//       alert("📅 Batch scheduled!");
//     } catch (err) {
//       console.error("Error scheduling batch:", err);
//       alert(err.message);
//     }
//   }





//   // Stop a running batch
//   async function handleStopBatch(batchId) {
//     try {
//       const res = await fetch(`/api/batches/${batchId}/stop`, { method: "POST" });
//       if (!res.ok) {
//         const { message } = await res.json();
//         throw new Error(message || "Failed to stop batch");
//       }
//       const { batch } = await res.json();
//       setBatches(bs => bs.map(b => b.batch_id === batch.batch_id ? batch : b));
//       alert("🛑 Batch stopped");
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-grow p-6">


//         {/* Assistant selector & Upload trigger */}
//         <div className="mb-6 flex items-center space-x-4">
//           <select
//             className="border rounded px-4 py-2"
//             value={selectedAssistant}
//             onChange={e => setSelectedAssistant(e.target.value)}>
//             <option value="">Select Assistant</option>
//             {assistants.map(a => (
//               <option key={a.id} value={a.id}>{a.name}</option>
//             ))}
//           </select>
//           <button
//             onClick={() => setShowUpload(true)}
//             disabled={!selectedAssistant}
//             className={`px-4 py-2 rounded ${selectedAssistant ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
//               }`}
//           >
//             Upload Batch
//           </button>
//         </div>

//         {/* Upload Modal */}
//         {showUpload && (
//           <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
//               <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
//                 Upload CSV Batch
//               </h3>

//               <div className="text-sm text-gray-600 mb-4">
//                 <p className="mb-2">
//                   <span className="font-medium text-gray-800">Note:</span> Your CSV file must contain a column labeled <span className="font-semibold">contact_number</span>.
//                 </p>
//                 <a
//                   href="/assets/sample_csv_file.csv"
//                   download
//                   className="inline-block mt-1 text-blue-700 hover:underline font-medium"
//                 >
//                   📄 Download sample CSV file
//                 </a>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
//                 <input
//                   type="file"
//                   accept=".csv"
//                   onChange={e => setCsvFile(e.target.files[0])}
//                   className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex justify-end space-x-3 pt-2">
//                 <button
//                   onClick={() => setShowUpload(false)}
//                   className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConfirmUpload}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
//                 >
//                   Confirm Upload
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}


//         {/* Schedule Modal */}
//         {scheduleModal.open && (
//           <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg w-full max-w-sm">
//               <h3 className="text-lg font-semibold mb-4">Schedule Campaign</h3>
//               <input
//                 type="datetime-local"
//                 value={scheduleModal.date}
//                 onChange={e => setScheduleModal({ ...scheduleModal, date: e.target.value })}
//                 className="mb-4 w-full"
//               />
//               <div className="flex justify-end space-x-2">
//                 <button
//                   onClick={() => setScheduleModal({ open: false, batchId: null, date: "" })}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                 >Cancel</button>
//                 <button
//                   onClick={handleScheduleSubmit}
//                   className="px-4 py-1 bg-blue-600 text-white rounded"
//                 >Set Schedule</button>
//               </div>
//             </div>
//           </div>
//         )}

// {/* Batches Table Container */}
// <div id="scroll-container" className="flex-1 overflow-y-auto border border-gray-300 bg-white shadow-md rounded-lg max-h-[85vh]">
//   <div className="overflow-x-auto">
//     <table className="min-w-full text-sm table-fixed">
//       <thead className="bg-gray-100 text-gray-700">
//         <tr>
//           <th className="p-2">ID</th>
//           <th>File</th>
//           <th>Contacts</th>
//           <th>Status</th>
//           <th>Run Now</th>
//           <th>Schedule Later</th>
//           <th>Stop</th>
//           <th>Created</th>
//           <th className="p-2">Settings</th>
//         </tr>
//       </thead>
//       <tbody>
//         {batches.length ? batches.map(b => (
//           <tr key={b.batch_id} className="border-t hover:bg-gray-50">
//             <td className="p-3 flex items-center gap-1">
//               <span className="font-mono">{b.batch_id.slice(0, 16)}…</span>
//               <FiCopy
//                 className="cursor-pointer text-gray-500 hover:text-gray-700"
//                 onClick={() => navigator.clipboard.writeText(b.batch_id)}
//               />
//             </td>
//             <td className="p-3">{b.file_name}</td>
//             <td className="p-3">{b.valid_contacts}/{b.total_contacts}</td>
//             <td className="p-3 capitalize">{b.status}</td>
//             <td className="p-3">
//               <FiPlay
//                 className="cursor-pointer text-green-600 hover:text-green-800"
//                 onClick={() => handleRunNow(b.batch_id)}
//               />
//             </td>
//             <td className="p-3">
//               <FiCalendar
//                 className="cursor-pointer text-blue-600 hover:text-blue-800"
//                 onClick={() => openSchedule(b.batch_id)}
//               />
//             </td>
//             <td className="p-3">
//               <FiPause
//                 className="cursor-pointer text-gray-500 hover:text-gray-700"
//                 onClick={() => handleStopBatch(b.batch_id)}
//               />
//             </td>
//             <td className="p-3">
//               <FiDownload
//                 className="cursor-pointer text-indigo-600 hover:text-indigo-800"
//                 title="View Report"
//                 onClick={() => openReport(b.batch_id)}
//               />
//             </td>
//             <td className="p-3">{new Date(b.created_at).toLocaleString()}</td>
//           </tr>
//         )) : (
//           <tr><td colSpan={9} className="p-4 text-center">No batches</td></tr>
//         )}
//       </tbody>
//     </table>
//   </div>
// </div>

//       </div>
//     </div>
//   );
// }
//  C:\sanket\sampark\pages\agents\Marketing.js


// import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar";
// import { FiCopy, FiPause, FiCalendar, FiPlay, FiDownload } from "react-icons/fi";
// import Link from "next/link";


// const DEFAULT_PHONE_NUMBER = "4519aa32-fcb2-4bf6-9200-53a6959258e1";


// // Fetch assistants from VAPI
// async function fetchAssistantsData() {
//   const res = await fetch("https://api.vapi.ai/assistant", {
//     headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}` }
//   });
//   if (!res.ok) throw new Error("Failed to fetch assistants");
//   return res.json();
// }

// // Fetch all batches
// async function fetchBatchesData() {
//   const res = await fetch("/api/batches");
//   if (!res.ok) throw new Error("Failed to fetch batches");
//   return res.json();
// }

// export default function Marketing() {
//   const [assistants, setAssistants] = useState([]);
//   const [selectedAssistant, setSelectedAssistant] = useState("");
//   const [batches, setBatches] = useState([]);
//   const [filteredBatches, setFilteredBatches] = useState([]);
// const [batchName, setBatchName] = useState("");


//   // Modal state
//   const [showUpload, setShowUpload] = useState(false);
//   const [csvFile, setCsvFile] = useState(null);
//   const [scheduledAt, setScheduledAt] = useState("");
//   const [scheduleModal, setScheduleModal] = useState({ open: false, batchId: null, date: "" });


// useEffect(() => {
//   if (!selectedAssistant) {
//     setFilteredBatches(batches); // Show all user batches
//   } else {
//     setFilteredBatches(
//       batches.filter(b => b.assistant_id === selectedAssistant)
//     );
//   }
// }, [selectedAssistant, batches]);



//   // On mount: load assistants and batches
//   useEffect(() => {
//     fetchAssistantsData().then(setAssistants).catch(console.error);
//  fetchBatchesData()
//     .then(data => {
//       console.log("📦 Batches fetched:", data);  // <-- see it in browser console
//       setBatches(data);
//     })
//     .catch(console.error);
// }, []);

//   // === Handlers ===


//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const running = batches.filter(b => b.status === "running");
//       await Promise.all(running.map(async b => {
//         const res = await fetch(`/api/batches/${b.batch_id}/status`);
//         if (!res.ok) return;
//         const fresh = await res.json();
//         setBatches(prev =>
//           prev.map(p => p.batch_id === b.batch_id ? { ...p, status: fresh.status } : p));
//       }));
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [batches]);



//   // Upload CSV and create batch
//   async function handleConfirmUpload() {
//     if (!csvFile || !selectedAssistant) {
//       alert("Please upload a CSV file.");
//       return;
//     }
//     try {
//       const fd = new FormData();
//       fd.append("file", csvFile);
//       fd.append("assistant_id", selectedAssistant);
//       // use the correct constant name here:
//       fd.append("from_phone_number", DEFAULT_PHONE_NUMBER);
// fd.append("batch_name", batchName);  // Add this line

//       const res = await fetch("/api/batches", { method: "POST", body: fd });
//       const body = await res.json();
//       if (!res.ok) throw new Error(body.message || "Upload failed");

//       // (optional) auto-schedule on upload
//       if (scheduledAt) {
//         const sch = await fetch(`/api/batches/${body.batch_id}/schedule`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ scheduled_at: scheduledAt })
//         });
//         if (!sch.ok) throw new Error((await sch.json()).message || "Schedule failed");
//       }

//       alert("✅ Campaign uploaded!");
//       setShowUpload(false);
//       setCsvFile(null);
//       setScheduledAt("");
//       setBatches(await fetchBatchesData());
//       setBatchName("");

//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   }


//   // Immediately run the batch now
//   async function handleRunNow(batchId) {
//     try {
//       const res = await fetch(`/api/batches/${batchId}/run`, { method: "POST" });
//       if (!res.ok) throw new Error((await res.json()).message);
//       alert("🚀 Batch started immediately");
//       setBatches(await fetchBatchesData());
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to run batch now");
//     }
//   }

//   // Schedule batch for later
//   function openSchedule(batchId) {
//     setScheduleModal({ open: true, batchId, date: "" });
//   }
//   async function handleScheduleSubmit() {
//     const { batchId, date } = scheduleModal;
//     if (!date) {
//       alert("Please pick a date/time");
//       return;
//     }
//     try {
//       const res = await fetch(`/api/batches/${batchId}/schedule`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scheduled_at: date })
//       });
//       if (!res.ok) throw new Error((await res.json()).message);
//       const { batch } = await res.json();
//       setBatches(bs => bs.map(b => b.batch_id === batch.batch_id ? batch : b));
//       alert("📅 Batch scheduled");
//       setScheduleModal({ open: false, batchId: null, date: "" });
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   }


//   // ­­­­­­­­­­­­­­­­­­­­­­­ inside your <Marketing /> component — e.g. just below openSchedule()
// async function openReport(batchId) {
//   try {
//     const res = await fetch(`/api/batches/${batchId}/report`);
//     if (!res.ok) throw new Error(`Server responded ${res.status}`);
//     const batch = await res.json();

//     const headers = [
//       'row','firstName','lastName','callId','customerNumber','timezone',
//       'status','endedReason','retryCount','duration','transcript',
//       'monitorListenUrl','monitorControlUrl','callSid','recordingUrl'
//     ];

//     const rows = batch.summary.map(r => [
//       r.row,
//       r.firstName,
//       r.lastName,
//       r.callId,
//       r.customerNumber,
//       r.timezone,
//       r.status,
//       r.endedReason,
//       r.retryCount,
//       r.duration,
//  (r.transcript || '').replace(/"/g, '""'),
//       r.monitorListenUrl,
//       r.monitorControlUrl,
//       r.callSid,
//       r.recordingUrl
//     ]);

//     const csv = [headers, ...rows]
//       .map(row => row.map(col => `"${col}"`).join(','))
//       .join('\n');

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement('a');
//     a.href     = url;
//     a.download = `batch_${batchId}_report.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   } catch (err) {
//     alert(err.message || 'Failed to download report');
//   }
// }


//   async function handleScheduleBatch(batchId) {
//     try {
//       const res = await fetch(`/api/batches/${batchId}/schedule`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scheduled_at: scheduledAt })
//       });
//       if (!res.ok) {
//         const { message } = await res.json();
//         throw new Error(message);
//       }
//       const { batch } = await res.json();
//       // merge the updated batch into state
//       setBatches(bs =>
//         bs.map(b => (b.batch_id === batch.batch_id ? batch : b))
//       );
//       alert("📅 Batch scheduled!");
//     } catch (err) {
//       console.error("Error scheduling batch:", err);
//       alert(err.message);
//     }
//   }





//   // Stop a running batch
//   async function handleStopBatch(batchId) {
//     try {
//       const res = await fetch(`/api/batches/${batchId}/stop`, { method: "POST" });
//       if (!res.ok) {
//         const { message } = await res.json();
//         throw new Error(message || "Failed to stop batch");
//       }
//       const { batch } = await res.json();
//       setBatches(bs => bs.map(b => b.batch_id === batch.batch_id ? batch : b));
//       alert("🛑 Batch stopped");
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-grow p-6">


//         {/* Assistant selector & Upload trigger */}
//         <div className="mb-6 flex items-center space-x-4">
//           <select
//             className="border rounded px-4 py-2"
//             value={selectedAssistant}
//             onChange={e => setSelectedAssistant(e.target.value)}>
//             <option value="">Select Assistant</option>
//             {assistants.map(a => (
//               <option key={a.id} value={a.id}>{a.name}</option>
//             ))}
//           </select>
//           <button
//             onClick={() => setShowUpload(true)}
//             disabled={!selectedAssistant}
//             className={`px-4 py-2 rounded ${selectedAssistant ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
//               }`}
//           >
//             Upload Batch
//           </button>
//         </div>


//   {/* ← step 2: Analytics button */}
//          {/* <Link href="/agents/analytics">
//     <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
//       Analytics
//     </button>
//   </Link> */}
//         {/* Upload Modal */}
//         {showUpload && (
//           <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
//               <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
//                 Upload CSV Batch
//               </h3>

//               <div className="text-sm text-gray-600 mb-4">
//                 <p className="mb-2">
//                   <span className="font-medium text-gray-800">Note:</span> Your CSV file must contain a column labeled <span className="font-semibold">contact_number</span>.
//                 </p>
//                 <a
//                   href="/assets/sample_csv_file.csv"
//                   download
//                   className="inline-block mt-1 text-blue-700 hover:underline font-medium"
//                 >
//                   📄 Download sample CSV file
//                 </a>
//               </div>
              
//                 <div className="mb-4">
//   <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
//   <input
//     type="text"
//     value={batchName}
//     onChange={e => setBatchName(e.target.value)}
//     placeholder="e.g. Summer Sales Campaign"
//     className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//   />
// </div>


//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
//                 <input
//                   type="file"
//                   accept=".csv"
//                   onChange={e => setCsvFile(e.target.files[0])}
//                   className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex justify-end space-x-3 pt-2">
//                 <button
//                   onClick={() => setShowUpload(false)}
//                   className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConfirmUpload}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
//                 >
//                   Confirm Upload
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}


//         {/* Schedule Modal */}
//         {scheduleModal.open && (
//           <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg w-full max-w-sm">
//               <h3 className="text-lg font-semibold mb-4">Schedule Campaign</h3>
//               <input
//                 type="datetime-local"
//                 value={scheduleModal.date}
//                 onChange={e => setScheduleModal({ ...scheduleModal, date: e.target.value })}
//                 className="mb-4 w-full"
//               />
//               <div className="flex justify-end space-x-2">
//                 <button
//                   onClick={() => setScheduleModal({ open: false, batchId: null, date: "" })}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                 >Cancel</button>
//                 <button
//                   onClick={handleScheduleSubmit}
//                   className="px-4 py-1 bg-blue-600 text-white rounded"
//                 >Set Schedule</button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Batches Table */}
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="p-2">ID</th>
//                <th>Name</th>
//               <th>File</th>
//               <th>Contacts</th>
//               <th>Status</th>
//               <th>Run Now</th>
//               <th>Schedule Later</th>
//               <th>Stop</th>
//               <th>Created</th>
//               <th className="p-2">Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredBatches.length ? filteredBatches.map(b => (

//               <tr key={b.batch_id} className="border-t hover:bg-gray-50">
//                 <td className="p-3 flex items-center gap-1">
//                   <span className="font-mono">{b.batch_id.slice(0, 16)}…</span>
//                   <FiCopy
//                     className="cursor-pointer text-gray-500 hover:text-gray-700"
//                     onClick={() => navigator.clipboard.writeText(b.batch_id)}
//                   />
//                 </td>
//                     <td className="p-3">{b.batch_name || "-"}</td>
//                 <td className="p-3">{b.file_name}</td>
//                 <td className="p-3">{b.valid_contacts}/{b.total_contacts}</td>
//                 <td className="p-3 capitalize">{b.status}</td>
//                 <td className="p-3">
//                   <FiPlay
//                     className="cursor-pointer text-green-600 hover:text-green-800"
//                     onClick={() => handleRunNow(b.batch_id)}
//                   />
//                 </td>
//                 <td className="p-3">
//                   <FiCalendar
//                     className="cursor-pointer text-blue-600 hover:text-blue-800"
//                     onClick={() => openSchedule(b.batch_id)}
//                   />
//                 </td>
//                 <td className="p-3">
//                   <FiPause
//                     className="cursor-pointer text-gray-500 hover:text-gray-700"
//                     onClick={() => handleStopBatch(b.batch_id)}
//                   />
//                 </td>
//                 <td className="p-3">
//                   <FiDownload
//                     className="cursor-pointer text-indigo-600 hover:text-indigo-800"
//                     title="View Report"
//                     onClick={() => openReport(b.batch_id)}
//                   />
//                 </td>
//                 <td className="p-3">{new Date(b.created_at).toLocaleString()}</td>
//               </tr>
//             )) : (
//               <tr><td colSpan={8} className="p-4 text-center">No batches</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { FiCopy, FiPause, FiCalendar, FiPlay, FiDownload } from "react-icons/fi";

const DEFAULT_PHONE_NUMBER = "4519aa32-fcb2-4bf6-9200-53a6959258e1";

// Fetch all batches
async function fetchBatchesData() {
  const res = await fetch("/api/batches");
  if (!res.ok) throw new Error("Failed to fetch batches");
  return res.json();
}

export default function Marketing() {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState("");
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [batchName, setBatchName] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleModal, setScheduleModal] = useState({ open: false, batchId: null, date: "" });

  // Fetch assistants and batches on mount
  useEffect(() => {
    const fetchVapiAssistants = async () => {
      try {
        let assistantIds = [];
        const cached = localStorage.getItem("assistant_ids");
  
        // Step 1: Load from cache if available
        if (cached) {
          assistantIds = JSON.parse(cached);
          const placeholderAssistants = assistantIds.map(id => ({ id, name: "...loading" }));
          setAssistants(placeholderAssistants);
          setSelectedAssistant(placeholderAssistants[0]?.id || "");
        }
  
        // Step 2: Fetch from API only if not cached
        if (assistantIds.length === 0) {
          const mapRes = await fetch("/api/map/getUserAgents");
          const { assistants } = await mapRes.json();
  
          if (!Array.isArray(assistants)) throw new Error("Invalid assistant data");
          assistantIds = assistants;
          localStorage.setItem("assistant_ids", JSON.stringify(assistantIds));
  
          const placeholderAssistants = assistantIds.map(id => ({ id, name: "...loading" }));
          setAssistants(placeholderAssistants);
          setSelectedAssistant(placeholderAssistants[0]?.id || "");
        }
  
        // Step 3: Resolve assistant names
        const assistantDetails = await Promise.all(
          assistantIds.map(async (id) => {
            try {
              const res = await fetch(`https://api.vapi.ai/assistant/${id}`, {
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
                },
              });
              if (!res.ok) throw new Error(`Failed to fetch assistant ${id}`);
              return await res.json();
            } catch (err) {
              console.error(`❌ Error fetching assistant ${id}:`, err);
              return null;
            }
          })
        );
  
        const cleaned = assistantDetails
          .filter((a) => a !== null)
          .map((a) => ({ id: a.id, name: a.name }));
  
        setAssistants(cleaned);
        setSelectedAssistant(cleaned[0]?.id || "");
      } catch (err) {
        console.error("Failed to load Vapi agents", err);
        alert("Error loading Vapi agents");
        setAssistants([]);
        setSelectedAssistant("");
      }
    };
  
    fetchVapiAssistants();
  
    // Load batch data
    fetchBatchesData()
      .then(setBatches)
      .catch(console.error);
  }, []);
  

  // Filter batches based on selected assistant
  useEffect(() => {
    if (!selectedAssistant) {
      setFilteredBatches(batches);
    } else {
      setFilteredBatches(batches.filter((b) => b.assistant_id === selectedAssistant));
    }
  }, [selectedAssistant, batches]);

  // Poll running batches
  useEffect(() => {
    const interval = setInterval(async () => {
      const running = batches.filter((b) => b.status === "running");
      await Promise.all(
        running.map(async (b) => {
          const res = await fetch(`/api/batches/${b.batch_id}/status`);
          if (!res.ok) return;
          const fresh = await res.json();
          setBatches((prev) =>
            prev.map((p) => (p.batch_id === b.batch_id ? { ...p, status: fresh.status } : p))
          );
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [batches]);

  async function handleConfirmUpload() {
    if (!csvFile || !selectedAssistant) {
      alert("Please upload a CSV file.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("file", csvFile);
      fd.append("assistant_id", selectedAssistant);
      fd.append("from_phone_number", DEFAULT_PHONE_NUMBER);
      fd.append("batch_name", batchName);

      const res = await fetch("/api/batches", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Upload failed");

      if (scheduledAt) {
        const sch = await fetch(`/api/batches/${body.batch_id}/schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduled_at: scheduledAt }),
        });
        if (!sch.ok) throw new Error((await sch.json()).message || "Schedule failed");
      }

      alert("✅ Campaign uploaded!");
      setShowUpload(false);
      setCsvFile(null);
      setScheduledAt("");
      setBatchName("");
      setBatches(await fetchBatchesData());
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function handleRunNow(batchId) {
    try {
      const res = await fetch(`/api/batches/${batchId}/run`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).message);
      alert("🚀 Batch started immediately");
      setBatches(await fetchBatchesData());
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to run batch now");
    }
  }

  async function handleScheduleSubmit() {
    const { batchId, date } = scheduleModal;
    if (!date) {
      alert("Please pick a date/time");
      return;
    }
    try {
      const res = await fetch(`/api/batches/${batchId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduled_at: date }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      const { batch } = await res.json();
      setBatches((bs) => bs.map((b) => (b.batch_id === batch.batch_id ? batch : b)));
      alert("📅 Batch scheduled");
      setScheduleModal({ open: false, batchId: null, date: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function handleStopBatch(batchId) {
    try {
      const res = await fetch(`/api/batches/${batchId}/stop`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to stop batch");
      const { batch } = await res.json();
      setBatches((bs) => bs.map((b) => (b.batch_id === batch.batch_id ? batch : b)));
      alert("🛑 Batch stopped");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function openReport(batchId) {
    try {
      const res = await fetch(`/api/batches/${batchId}/report`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const batch = await res.json();

      const headers = [
        "row",
        "firstName",
        "lastName",
        "callId",
        "customerNumber",
        "timezone",
        "status",
        "endedReason",
        "retryCount",
        "duration",
        "transcript",
        "monitorListenUrl",
        "monitorControlUrl",
        "callSid",
        "recordingUrl",
      ];

      const rows = batch.summary.map((r) => [
        r.row,
        r.firstName,
        r.lastName,
        r.callId,
        r.customerNumber,
        r.timezone,
        r.status,
        r.endedReason,
        r.retryCount,
        r.duration,
        (r.transcript || "").replace(/"/g, '""'),
        r.monitorListenUrl,
        r.monitorControlUrl,
        r.callSid,
        r.recordingUrl,
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map((col) => `"${col}"`).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `batch_${batchId}_report.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Failed to download report");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow p-6">
        {/* Assistant selector & Upload trigger */}
        <div className="mb-6 flex items-center space-x-4">
          <select
            className="border rounded px-4 py-2"
            value={selectedAssistant}
            onChange={(e) => setSelectedAssistant(e.target.value)}
          >
            <option value="">Select Assistant</option>
            {assistants.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowUpload(true)}
            disabled={!selectedAssistant}
            className={`px-4 py-2 rounded ${
              selectedAssistant
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            Upload Batch
          </button>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Upload CSV Batch
              </h3>

              <div className="text-sm text-gray-600 mb-4">
                <p className="mb-2">
                  <span className="font-medium text-gray-800">Note:</span> Your CSV file must contain a column labeled{" "}
                  <span className="font-semibold">contact_number</span>.
                </p>
                <a
                  href="/assets/sample_csv_file.csv"
                  download
                  className="inline-block mt-1 text-blue-700 hover:underline font-medium"
                >
                  📄 Download sample CSV file
                </a>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Name
                </label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="e.g. Summer Sales Campaign"
                  className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {scheduleModal.open && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Schedule Campaign</h3>
              <input
                type="datetime-local"
                value={scheduleModal.date}
                onChange={(e) => setScheduleModal({ ...scheduleModal, date: e.target.value })}
                className="mb-4 w-full"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setScheduleModal({ open: false, batchId: null, date: "" })}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleSubmit}
                  className="px-4 py-1 bg-blue-600 text-white rounded"
                >
                  Set Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batches Table */}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="p-2">ID</th>
              <th>Name</th>
              <th>File</th>
              <th>Contacts</th>
              <th>Status</th>
              <th>Run Now</th>
              <th>Schedule Later</th>
              <th>Stop</th>
              <th>Report</th>
              <th className="p-2">Time Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.length ? (
              filteredBatches.map((b) => (
                <tr key={b.batch_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-1">
                    <span className="font-mono">{b.batch_id.slice(0, 16)}…</span>
                    <FiCopy
                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => navigator.clipboard.writeText(b.batch_id)}
                    />
                  </td>
                  <td className="p-3">{b.batch_name || "-"}</td>
                  <td className="p-3">{b.file_name}</td>
                  <td className="p-3">{b.valid_contacts}/{b.total_contacts}</td>
                  <td className="p-3 capitalize">{b.status}</td>
                  <td className="p-3">
                    <FiPlay className="cursor-pointer text-green-600 hover:text-green-800" onClick={() => handleRunNow(b.batch_id)} />
                  </td>
                  <td className="p-3">
                    <FiCalendar className="cursor-pointer text-blue-600 hover:text-blue-800" onClick={() => setScheduleModal({ open: true, batchId: b.batch_id, date: "" })} />
                  </td>
                  <td className="p-3">
                    <FiPause className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => handleStopBatch(b.batch_id)} />
                  </td>
                  <td className="p-3">
                    <FiDownload className="cursor-pointer text-indigo-600 hover:text-indigo-800" title="View Report" onClick={() => openReport(b.batch_id)} />
                  </td>
                  <td className="p-3">{new Date(b.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={10} className="p-4 text-center">No batches</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
