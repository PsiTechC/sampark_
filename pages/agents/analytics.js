// import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar";
// import { FiLoader } from "react-icons/fi";
// import { LineChart } from "@mui/x-charts/LineChart";

// export default function AnalyticsPage() {
//   const [data, setData] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [selectedBatchId, setSelectedBatchId] = useState(null);
//   const [batchStats, setBatchStats] = useState(null);

//   useEffect(() => {
//     fetch("/api/analyticsBatches").then(r => r.json()).then(setData);
//     fetch("/api/batches").then(r => r.json()).then(setBatches);
//   }, []);

//   useEffect(() => {
//     if (!selectedBatchId) return setBatchStats(null);
//     fetch(`/api/batches/${selectedBatchId}/analytics`)
//       .then(async r => {
//         if (!r.ok) throw new Error(`API error ${r.status}`);
//         const json = await r.json();
//         setBatchStats(json);
//       })
//       .catch(err => {
//         console.error("Failed to load batch analytics:", err);
//         setBatchStats(null);
//       });
//   }, [selectedBatchId]);

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center h-screen text-gray-600">
//         <FiLoader className="animate-spin mr-2" />
//         Loading analytics…
//       </div>
//     );
//   }

//   if (data.totalBatches === 0) {
//     return (
//       <div className="flex min-h-screen bg-gray-50">
//         <Sidebar />
//         <div className="flex-grow flex items-center justify-center">
//           <p className="text-gray-500">No batches have been run yet.</p>
//         </div>
//       </div>
//     );
//   }

//   const lineData = [
//     { name: "Total Batches", value: data.totalBatches },
//     { name: "Total Calls",   value: data.totalCalls },
//     { name: "Avg Retries",   value: typeof data.avgRetries === 'number' ? Number(data.avgRetries.toFixed(2)) : 0 },
//     { name: "Success Rate",  value: typeof data.successRate === 'number' ? Number((data.successRate * 100).toFixed(1)) : 0 }
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
//       <div className="flex-grow p-6 space-y-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">Batch Analytics</h1>

//         {/* KPI Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-xl shadow">
//             <p className="text-gray-500">Total Batches</p>
//             <p className="text-2xl font-bold">{data.totalBatches}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow">
//             <p className="text-gray-500">Total Calls</p>
//             <p className="text-2xl font-bold">{data.totalCalls}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow">
//             <p className="text-gray-500">Success Rate</p>
//             <p className="text-2xl font-bold">{typeof data.successRate === 'number' ? (data.successRate * 100).toFixed(1) + '%' : 'N/A'}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow">
//             <p className="text-gray-500">Avg Retries</p>
//             <p className="text-2xl font-bold">{typeof data.avgRetries === 'number' ? data.avgRetries.toFixed(2) : 'N/A'}</p>
//           </div>
//         </div>

//         {/* Cumulative Metrics Trend Chart */}
//         <div className="bg-white p-4 rounded-xl shadow">
//           <h2 className="text-xl font-semibold mb-3">📊 Cumulative Metrics Trend</h2>
//           <div className="h-64">
//             <LineChart
//               height={240}
//               xAxis={[{ scaleType: 'point', data: lineData.map(d => d.name) }]}
//               series={[{
//                 label: 'Metric Value',
//                 data: lineData.map(d => d.value),
//                 showMark: () => true,
//                 showTag: () => true
//               }]}
//             />
//           </div>
//         </div>

//         {/* Batch Selector */}
//         <div className="flex items-center gap-3 w-full max-w-xs">
//           <label className="font-medium text-gray-700">Select Batch:</label>
//           <select
//             value={selectedBatchId || ''}
//             onChange={e => setSelectedBatchId(e.target.value)}
//             className="border px-2 py-1 rounded shadow-sm w-full"
//           >
//             <option value="">-- All Batches --</option>
//             {batches.map(b => (
//               <option key={b.batch_id} value={b.batch_id}>
//                 {b.batch_id.slice(0, 8)} - {b.file_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Batch-specific Stats */}
//         {batchStats && (
//           <div className="bg-white p-4 rounded-xl shadow">
//             <h2 className="text-xl font-semibold mb-3">📦 Selected Batch Analytics</h2>
//             <p><strong>Total Calls:</strong> {batchStats.total ?? 'N/A'}</p>
//             <p><strong>Success Rate:</strong> {
//               typeof batchStats.successRate === 'number'
//                 ? (batchStats.successRate * 100).toFixed(1) + '%'
//                 : 'N/A'
//             }</p>
//             <p><strong>Avg Retries:</strong> {
//               typeof batchStats.avgRetries === 'number'
//                 ? batchStats.avgRetries.toFixed(2)
//                 : 'N/A'
//             }</p>

//             <h3 className="mt-4 font-medium">Status Breakdown:</h3>
//             {batchStats.byStatus && (
//               <ul className="list-disc list-inside">
//                 {Object.entries(batchStats.byStatus).map(([k, v]) => (
//                   <li key={k}>{k}: {v}</li>
//                 ))}
//               </ul>
//             )}

//             {batchStats.byErrorReason && Object.keys(batchStats.byErrorReason).length > 0 && (
//               <>
//                 <h3 className="mt-4 font-medium">Failure Reasons:</h3>
//                 <ul className="list-disc list-inside">
//                   {Object.entries(batchStats.byErrorReason).map(([k, v]) => (
//                     <li key={k}>{k}: {v}</li>
//                   ))}
//                 </ul>
//               </>
//             )}

//             {batchStats.byRetryCount && Object.keys(batchStats.byRetryCount).length > 0 && (
//               <>
//                 <h3 className="mt-4 font-medium">Retry Distribution:</h3>
//                 <ul className="list-disc list-inside">
//                   {Object.entries(batchStats.byRetryCount).map(([r, count]) => (
//                     <li key={r}>{r} retry(s): {count}</li>
//                   ))}
//                 </ul>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


//  C:\sanket\psitech\sampark_\pages\agents\analytics.js
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { FiLoader } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { FaCog } from "react-icons/fa";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [batchStats, setBatchStats] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [selectedCall, setSelectedCall] = useState(null);
  const [sentimentPrompt, setSentimentPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [sentiments, setSentiments] = useState([]);

  useEffect(() => {
    fetch("/api/analyticsBatches").then(r => r.json()).then(setData);
    fetch("/api/batches").then(r => r.json()).then(setBatches);
  }, []);

  useEffect(() => {
    if (!selectedBatchId) {
      setBatchStats(null);
      setReportData(null);
      return;
    }

    fetch(`/api/batches/${selectedBatchId}/analytics`, { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(json => {
        setBatchStats(json);
        setReportData(json.calls);
      })
      .catch(err => {
        console.error("Failed to load batch analytics:", err);
        setBatchStats(null);
        setReportData(null);
      });
  }, [selectedBatchId]);

  useEffect(() => {
    if (!selectedBatchId || !showSettings) return;

    const fetchPrompt = async () => {
      try {
        const res = await fetch(`/api/batches/${selectedBatchId}/sentimentPrompt`);
        if (!res.ok) throw new Error("Failed to fetch prompt");
        const data = await res.json();
        if (data.prompt) setSentimentPrompt(data.prompt);
      } catch (err) {
        console.error("❌ Failed to load saved sentiment prompt:", err.message);
      }
    };

    fetchPrompt();
  }, [selectedBatchId, showSettings]);


  const runSentimentAnalysis = () => {
    fetch(`/api/batches/${selectedBatchId}/sentiments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: sentimentPrompt })
    })
      .then(r => r.json())
      .then(setSentiments)
      .catch(err => console.error("Sentiment error:", err));
  };

  const getSentiment = (callId) => {
    const entry = sentiments.find(s => s.callId === callId);
    return entry ? entry.sentiment : "—";
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <FiLoader className="animate-spin mr-2" />
        Loading analytics…
      </div>
    );
  }

  if (data.totalBatches === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">No batches have been run yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 w-full max-w-sm">
            <label className="font-medium text-gray-700">Select Batch:</label>
            <select
              value={selectedBatchId || ''}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="border px-2 py-1 rounded shadow-sm w-full"
            >
              <option value="">-- Select Batches --</option>
              {batches.map(b => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_name || b.batch_id.slice(0, 8)} {b.agentName ? `- ${b.agentName}` : ''}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => setShowSettings(true)} className="text-gray-600 hover:text-black">
            <FaCog size={20} />
          </button>
        </div>



        {reportData && (
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Detailed Call Data</h2>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Call ID</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Duration</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Ended Reason</th>
                    <th className="p-2">Conversation Logs</th>
                    <th className="p-2">Sentiment</th>
                    <th className="p-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((call, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{call.callId || '—'}</td>
                      <td className="p-2">{call.customerName || '—'}</td>
                      <td className="p-2">{call.customerNumber || '—'}</td>
                      <td className="p-2">{call.duration?.toFixed(1) ?? '—'}</td>
                      <td className="p-2">{call.status}</td>
                      <td className="p-2">{call.endedReason || '—'}</td>
                      <td className="p-2">
                        {(call.transcript || call.recordingUrl) ? (
                          <button
                            className="text-blue-600 underline"
                            onClick={() => setSelectedCall(call)}
                          >View</button>
                        ) : '—'}
                      </td>
                      <td className="p-2">{getSentiment(call.callId)}</td>
                      <td className="p-2">${typeof call.cost === 'number' ? call.cost.toFixed(4) : '0.0000'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedCall && (
          <Dialog open={true} onClose={() => setSelectedCall(null)} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                <Dialog.Title className="text-xl font-bold mb-4">Call Transcript</Dialog.Title>

                <div className="border p-4 rounded bg-gray-50 max-h-[300px] overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-gray-800">
                  {selectedCall.transcript || 'No transcript available.'}
                </div>

                {selectedCall.recordingUrl && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
                      <span role="img" aria-label="speaker">🔉</span> Call Recording
                    </h3>
                    <audio controls src={selectedCall.recordingUrl} className="w-full rounded-md border" />
                  </div>
                )}

                <div className="mt-6 text-right">
                  <button onClick={() => setSelectedCall(null)} className="text-blue-600 underline">Close</button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}

        {showSettings && (
          <Dialog open={true} onClose={() => setShowSettings(false)} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6">
                <Dialog.Title className="text-xl font-bold mb-4">Sentiment Evaluation Prompt</Dialog.Title>

                <textarea
                  rows={6}
                  className="w-full border rounded p-2 text-sm text-gray-800"
                  placeholder="Define what counts as positive/negative/neutral..."
                  value={sentimentPrompt}
                  onChange={e => setSentimentPrompt(e.target.value)}
                />

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 underline"
                  >
                    Cancel
                  </button>

                  <button
                    className="bg-blue-600 text-white px-4 py-1.5 rounded shadow"
                    onClick={async () => {
                      if (!selectedBatchId || !sentimentPrompt.trim()) return;

                      try {
                        // Save the prompt to backend
                        await fetch(`/api/batches/${selectedBatchId}/sentimentPrompt`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ prompt: sentimentPrompt })
                        });

                        // Run sentiment analysis using saved prompt
                        const sentimentRes = await fetch(`/api/batches/${selectedBatchId}/sentiments`, {
                          method: "POST"
                        });

                        const sentiments = await sentimentRes.json();
                        setSentiments(sentiments);

                        // Refresh call data after sentiment analysis
                        const r = await fetch(`/api/batches/${selectedBatchId}/analytics`);
                        const json = await r.json();
                        setReportData(json.calls);

                        setShowSettings(false);
                      } catch (err) {
                        console.error("Failed to run sentiment analysis:", err);
                      }
                    }}
                  >
                    Save & Analyze
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}

      </div>
    </div>
  );
}