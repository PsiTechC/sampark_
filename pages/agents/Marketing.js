// import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar";
// import { FiCopy, FiDownload, FiCalendar, FiPause, FiTrash2, FiPlay } from "react-icons/fi";

// function Marketing() {
//   const [agents, setAgents] = useState([]);
//   const [selectedAgent, setSelectedAgent] = useState("");
//   const [batches, setBatches] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [phoneNumbers, setPhoneNumbers] = useState([]);
//   const [csvFile, setCsvFile] = useState(null);
//   const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
//   const [scheduledDate, setScheduledDate] = useState("");
//   const [scheduleModal, setScheduleModal] = useState({ show: false, batchId: null });


//   const handleFileChange = (e) => {
//     setCsvFile(e.target.files[0]);
//   };

//   const fetchBatchesForAgent = async (agentId) => {
//     try {
//       const res = await fetch(`https://api.bolna.dev/batches/${agentId}/all`, {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       });
//       const data = await res.json();
//       setBatches(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to fetch agent-specific batches", err);
//     }
//   };

//   useEffect(() => {
//     const fetchAgents = async () => {
//       const res = await fetch("https://api.bolna.dev/v2/agent/all", {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       });
//       const data = await res.json();
//       setAgents(data);
//     };
//     fetchAgents();
//   }, []);

//   useEffect(() => {
//     const fetchPhoneNumbers = async () => {
//       try {
//         const res = await fetch("https://api.bolna.dev/phone-numbers/all", {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//           },
//         });
//         const data = await res.json();
//         setPhoneNumbers(data);
//       } catch (err) {
//         console.error("Failed to fetch phone numbers", err);
//       }
//     };

//     fetchPhoneNumbers();
//   }, []);

//   useEffect(() => {
//     if (selectedAgent) {
//       fetchBatchesForAgent(selectedAgent);
//     }
//   }, [selectedAgent]);

//   const handleStopBatch = async (batchId) => {
//     try {
//       const res = await fetch(`https://api.bolna.dev/batches/${batchId}/stop`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Failed to stop batch");

//       alert("🛑 Batch stopped successfully");
//       fetchBatchesForAgent(selectedAgent); // Refresh
//     } catch (err) {
//       console.error("❌ Error stopping batch:", err);
//       alert(err.message);
//     }
//   };

//   const handleConfirmUpload = async () => {
//     if (!csvFile || !selectedAgent || !selectedPhoneNumber || !scheduledDate) {
//       alert("Please select all fields, a scheduled date, and upload a CSV file.");
//       return;
//     }


//     try {
//       // Step 1: Create batch
//       const formData = new FormData();
//       formData.append("file", csvFile);
//       formData.append("agent_id", selectedAgent);
//       formData.append("from_phone_number", selectedPhoneNumber);

//       const res = await fetch("https://api.bolna.dev/batches", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//         body: formData,
//       });

//       const responseData = await res.json();
//       if (!res.ok || !responseData.batch_id) {
//         throw new Error(responseData.message || "Failed to create batch.");
//       }

//       const batchId = responseData.batch_id;

//       // Step 2: Schedule batch
//       const scheduleForm = new FormData();
//       scheduleForm.append("scheduled_at", scheduledDate);

//       const scheduleRes = await fetch(`https://api.bolna.dev/batches/${batchId}/schedule`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//         body: scheduleForm,
//       });

//       const scheduleData = await scheduleRes.json();
//       if (!scheduleRes.ok) {
//         throw new Error(scheduleData.message || "Failed to schedule batch.");
//       }

//       alert("✅ Campaign created and scheduled successfully!");
//       setShowModal(false);
//       setScheduledDate("");
//       setCsvFile(null);
//       fetchBatchesForAgent(selectedAgent);
//     } catch (err) {
//       console.error("❌ Error during batch creation or scheduling:", err);
//       alert(err.message);
//     }
//   };

//   return (<div className="flex min-h-screen bg-gray-50">
//     <Sidebar />
//     <div className="flex-grow p-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Agent Marketing</h2>

//       <div className="mb-6 max-w-md">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Select Agent</label>
//         <select
//           className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={selectedAgent}
//           onChange={(e) => setSelectedAgent(e.target.value)}
//         >
//           <option value="">-- Select Agent --</option>
//           {agents.map((agent) => (
//             <option key={agent.id} value={agent.id}>{agent.agent_name || "Unnamed Agent"}</option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-6 max-w-md flex justify-between items-end">
//         <button
//           onClick={() => setShowModal(true)}
//           disabled={!selectedAgent}
//           className={`px-4 py-2 text-sm rounded transition ${selectedAgent ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//         >
//           Create Campaign
//         </button>
//       </div>
//       {scheduleModal.open && (
//         <div className="fixed inset-0 z-20 bg-black bg-opacity-30 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//             <h3 className="text-lg font-semibold mb-4">📅 Schedule Batch</h3>

//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Date & Time</label>
//             <input
//               type="datetime-local"
//               value={scheduledAt}
//               onChange={(e) => setScheduledAt(e.target.value)}
//               className="mb-4 block w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setScheduleModal({ open: false, batchId: null })}
//                 className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleScheduleSubmit}
//                 className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
//               >
//                 Schedule
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//             <h3 className="text-lg font-semibold mb-4">Create Campaign</h3>
//             <p className="text-sm text-gray-600 mb-2">
//               <span className="font-medium text-gray-800">Note:</span> Ensure that your CSV file includes a column labeled <span className="font-semibold">contact_number</span> for phone numbers.
//             </p>

//             <p className="text-sm text-gray-600 mb-2">
//               <a
//                 href="/assets/sample_csv_file.csv"
//                 download
//                 className="font-medium text-blue-800 hover:underline"
//               >
//                 Download sample CSV file
//               </a>

//             </p>
//             <label className="block text-sm font-medium text-gray-700 mb-1 mt-6">Upload CSV</label>
//             <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4 block w-full text-sm" />
//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Number</label>
//             <select
//               className="w-full mb-4 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
//               value={selectedPhoneNumber}
//               onChange={(e) => setSelectedPhoneNumber(e.target.value)}
//             >
//               <option value="">-- Choose Number --</option>
//               {phoneNumbers.map((number) => (
//                 <option key={number.phone_number} value={number.phone_number}>{number.phone_number}</option>
//               ))}
//             </select>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
//             <input
//               type="datetime-local"
//               value={scheduledDate}
//               onChange={(e) => setScheduledDate(e.target.value)}
//               className="w-full mb-4 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
//             />


//             <div className="flex justify-end gap-2">
//               <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400">
//                 Cancel
//               </button>
//               <button onClick={handleConfirmUpload} className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Batch Table */}
//       <h3 className="text-lg font-semibold mb-3">Uploaded Champaigns</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm text-left border border-gray-200">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="p-3">Champaigns ID</th>
//               <th className="p-3">File name</th>
//               <th className="p-3">Uploaded contacts<br /><span className="text-xs">(# valid / # total)</span></th>
//               <th className="p-3">Execution Status</th>
//               <th className="p-3">Champaigns Status</th>
//               {/* <th className="p-3">Run now</th> */}
//               {/* <th className="p-3">Schedule later</th> */}
//               <th className="p-3">Stop batch</th>
//               <th className="p-3">Champaigns uploaded</th>
//               {/* <th className="p-3">Delete batch</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(batches) && batches.length > 0 ? (
//               batches.map((batch) => (
//                 <tr key={batch.batch_id} className="border-t hover:bg-gray-50 transition">
//                   <td className="p-3 flex items-center gap-2">
//                     <span className="font-mono">{batch.batch_id.slice(0, 16)}...</span>
//                     <button onClick={() => navigator.clipboard.writeText(batch.batch_id)}>
//                       <FiCopy className="text-gray-500 hover:text-gray-700" />
//                     </button>
//                   </td>
//                   <td className="p-3">{batch.file_name}</td>
//                   <td className="p-3">{batch.valid_contacts} valid / {batch.total_contacts} total</td>
//                   <td className="p-3 text-sm">
//                     {batch.execution_status ? (
//                       <>
//                         {Object.entries(batch.execution_status).map(([key, value]) => (
//                           <div key={key}>
//                             {key === "error" ? "unreachable" : key}: {value}
//                           </div>
//                         ))}
//                       </>
//                     ) : (
//                       "-"
//                     )}

//                   </td>
//                   <td className="p-3 capitalize">{batch.status || "-"}</td>
//                   {/* <td className="p-3"><FiPlay
//                       className="text-gray-600 hover:text-black cursor-pointer"
//                       onClick={() => handleRunNow(batch.batch_id)}
//                     />
//                     </td> */}
//                   {/* <td className="p-3"><td className="p-3">
//                       <FiCalendar
//                         className="text-gray-600 hover:text-black cursor-pointer"
//                         onClick={() => setScheduleModal({ open: true, batchId: batch.batch_id })}
//                       />
//                     </td>
//                     </td> */}
//                   <td className="p-3"><td className="p-3">
//                     <FiPause
//                       className="text-gray-600 hover:text-black cursor-pointer"
//                       onClick={() => handleStopBatch(batch.batch_id)}
//                     />
//                   </td>
//                   </td>
//                   <td className="p-3">{batch.humanized_created_at || "-"}</td>
//                   <td className="p-3">
//                     {/* <button onClick={() => handleDeleteBatch(batch.batch_id)}>
//                         <FiTrash2 className="text-red-500 hover:text-red-700 cursor-pointer" />
//                       </button> */}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan="11" className="p-4 text-center text-gray-500">No batches available</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>);
// }

// export default Marketing;


//  C:\sanket\sampark\pages\agents\Marketing.js
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { FiCopy, FiPause, FiCalendar, FiPlay, FiDownload } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";


const DEFAULT_PHONE_NUMBER = "4519aa32-fcb2-4bf6-9200-53a6959258e1";


// Fetch assistants from VAPI
async function fetchAssistantsData() {
  const res = await fetch("https://api.vapi.ai/assistant", {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}` }
  });
  if (!res.ok) throw new Error("Failed to fetch assistants");
  return res.json();
}

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

  // Modal state
  const [showUpload, setShowUpload] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleModal, setScheduleModal] = useState({ open: false, batchId: null, date: "" });

  // On mount: load assistants and batches
  useEffect(() => {
    fetchAssistantsData().then(setAssistants).catch(console.error);
    fetchBatchesData().then(setBatches).catch(console.error);
  }, []);

  // === Handlers ===


  useEffect(() => {
    const interval = setInterval(async () => {
      const running = batches.filter(b => b.status === "running");
      await Promise.all(running.map(async b => {
        const res = await fetch(`/api/batches/${b.batch_id}/status`);
        if (!res.ok) return;
        const fresh = await res.json();
        setBatches(prev =>
          prev.map(p => p.batch_id === b.batch_id ? { ...p, status: fresh.status } : p));
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [batches]);



  // Upload CSV and create batch
  async function handleConfirmUpload() {
    if (!csvFile || !selectedAssistant) {
      alert("Please select an assistant and upload a CSV file.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("file", csvFile);
      fd.append("assistant_id", selectedAssistant);
      // use the correct constant name here:
      fd.append("from_phone_number", DEFAULT_PHONE_NUMBER);

      const res = await fetch("/api/batches", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Upload failed");

      // (optional) auto-schedule on upload
      if (scheduledAt) {
        const sch = await fetch(`/api/batches/${body.batch_id}/schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduled_at: scheduledAt })
        });
        if (!sch.ok) throw new Error((await sch.json()).message || "Schedule failed");
      }

      alert("✅ Campaign uploaded!");
      setShowUpload(false);
      setCsvFile(null);
      setScheduledAt("");
      setBatches(await fetchBatchesData());
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }


  // Immediately run the batch now
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

  // Schedule batch for later
  function openSchedule(batchId) {
    setScheduleModal({ open: true, batchId, date: "" });
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
        body: JSON.stringify({ scheduled_at: date })
      });
      if (!res.ok) throw new Error((await res.json()).message);
      const { batch } = await res.json();
      setBatches(bs => bs.map(b => b.batch_id === batch.batch_id ? batch : b));
      alert("📅 Batch scheduled");
      setScheduleModal({ open: false, batchId: null, date: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }


  // ­­­­­­­­­­­­­­­­­­­­­­­ inside your <Marketing /> component — e.g. just below openSchedule()
  async function openReport(batchId) {
    try {
      // 1. Fetch the JSON summary that the API route already returns
      const res = await fetch(`/api/batches/${batchId}/report`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const batch = await res.json();

      // 2. Turn the summary array into a CSV string
      const headers = ['phone', 'status', 'duration', 'transcript'];
      const rows = batch.summary.map(r => [
        r.phone,
        r.status,
        r.duration ?? '',
        (r.transcript ?? '').replace(/"/g, '""')    // escape quotes
      ]);
      const csv =
        [headers, ...rows]
          .map(row => row.map(col => `"${col}"`).join(','))
          .join('\n');

      // 3. Trigger a download in the browser
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch_${batchId}_report.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Failed to download report');
    }
  }


  async function handleScheduleBatch(batchId) {
    try {
      const res = await fetch(`/api/batches/${batchId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduled_at: scheduledAt })
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      const { batch } = await res.json();
      // merge the updated batch into state
      setBatches(bs =>
        bs.map(b => (b.batch_id === batch.batch_id ? batch : b))
      );
      alert("📅 Batch scheduled!");
    } catch (err) {
      console.error("Error scheduling batch:", err);
      alert(err.message);
    }
  }





  // Stop a running batch
  async function handleStopBatch(batchId) {
    try {
      const res = await fetch(`/api/batches/${batchId}/stop`, { method: "POST" });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Failed to stop batch");
      }
      const { batch } = await res.json();
      setBatches(bs => bs.map(b => b.batch_id === batch.batch_id ? batch : b));
      alert("🛑 Batch stopped");
    } catch (err) {
      console.error(err);
      alert(err.message);
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
            onChange={e => setSelectedAssistant(e.target.value)}>
            <option value="">Select Assistant</option>
            {assistants.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowUpload(true)}
            disabled={!selectedAssistant}
            className={`px-4 py-2 rounded ${selectedAssistant ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
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
                  <span className="font-medium text-gray-800">Note:</span> Your CSV file must contain a column labeled <span className="font-semibold">contact_number</span>.
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={e => setCsvFile(e.target.files[0])}
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
                  Confirm Upload
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
                onChange={e => setScheduleModal({ ...scheduleModal, date: e.target.value })}
                className="mb-4 w-full"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setScheduleModal({ open: false, batchId: null, date: "" })}
                  className="px-3 py-1 bg-gray-200 rounded"
                >Cancel</button>
                <button
                  onClick={handleScheduleSubmit}
                  className="px-4 py-1 bg-blue-600 text-white rounded"
                >Set Schedule</button>
              </div>
            </div>
          </div>
        )}

        {/* Batches Table */}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="p-2">ID</th>
              <th>File</th>
              <th>Contacts</th>
              <th>Status</th>
              <th>Run Now</th>
              <th>Schedule Later</th>
              <th>Stop</th>
              <th>Created</th>
              <th className="p-2">Settings</th>
            </tr>
          </thead>
          <tbody>
            {batches.length ? batches.map(b => (
              <tr key={b.batch_id} className="border-t hover:bg-gray-50">
                <td className="p-3 flex items-center gap-1">
                  <span className="font-mono">{b.batch_id.slice(0, 16)}…</span>
                  <FiCopy
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => navigator.clipboard.writeText(b.batch_id)}
                  />
                </td>
                <td className="p-3">{b.file_name}</td>
                <td className="p-3">{b.valid_contacts}/{b.total_contacts}</td>
                <td className="p-3 capitalize">{b.status}</td>
                <td className="p-3">
                  <FiPlay
                    className="cursor-pointer text-green-600 hover:text-green-800"
                    onClick={() => handleRunNow(b.batch_id)}
                  />
                </td>
                <td className="p-3">
                  <FiCalendar
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => openSchedule(b.batch_id)}
                  />
                </td>
                <td className="p-3">
                  <FiPause
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => handleStopBatch(b.batch_id)}
                  />
                </td>
                <td className="p-3">
                  <FiDownload
                    className="cursor-pointer text-indigo-600 hover:text-indigo-800"
                    title="View Report"
                    onClick={() => openReport(b.batch_id)}
                  />
                </td>
                <td className="p-3">{new Date(b.created_at).toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={8} className="p-4 text-center">No batches</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}