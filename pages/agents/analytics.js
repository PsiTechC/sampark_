import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { FiLoader } from "react-icons/fi";
import { LineChart } from "@mui/x-charts/LineChart";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [batchStats, setBatchStats] = useState(null);

  useEffect(() => {
    fetch("/api/analyticsBatches").then(r => r.json()).then(setData);
    fetch("/api/batches").then(r => r.json()).then(setBatches);
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return setBatchStats(null);
    fetch(`/api/batches/${selectedBatchId}/analytics`)
      .then(async r => {
        if (!r.ok) throw new Error(`API error ${r.status}`);
        const json = await r.json();
        setBatchStats(json);
      })
      .catch(err => {
        console.error("Failed to load batch analytics:", err);
        setBatchStats(null);
      });
  }, [selectedBatchId]);

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

  const lineData = [
    { name: "Total Batches", value: data.totalBatches },
    { name: "Total Calls",   value: data.totalCalls },
    { name: "Avg Retries",   value: typeof data.avgRetries === 'number' ? Number(data.avgRetries.toFixed(2)) : 0 },
    { name: "Success Rate",  value: typeof data.successRate === 'number' ? Number((data.successRate * 100).toFixed(1)) : 0 }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Batch Analytics</h1>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Batches</p>
            <p className="text-2xl font-bold">{data.totalBatches}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Calls</p>
            <p className="text-2xl font-bold">{data.totalCalls}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold">{typeof data.successRate === 'number' ? (data.successRate * 100).toFixed(1) + '%' : 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Avg Retries</p>
            <p className="text-2xl font-bold">{typeof data.avgRetries === 'number' ? data.avgRetries.toFixed(2) : 'N/A'}</p>
          </div>
        </div>

        {/* Cumulative Metrics Trend Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">📊 Cumulative Metrics Trend</h2>
          <div className="h-64">
            <LineChart
              height={240}
              xAxis={[{ scaleType: 'point', data: lineData.map(d => d.name) }]}
              series={[{
                label: 'Metric Value',
                data: lineData.map(d => d.value),
                showMark: () => true,
                showTag: () => true
              }]}
            />
          </div>
        </div>

        {/* Batch Selector */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <label className="font-medium text-gray-700">Select Batch:</label>
          <select
            value={selectedBatchId || ''}
            onChange={e => setSelectedBatchId(e.target.value)}
            className="border px-2 py-1 rounded shadow-sm w-full"
          >
            <option value="">-- All Batches --</option>
            {batches.map(b => (
              <option key={b.batch_id} value={b.batch_id}>
                {b.batch_id.slice(0, 8)} - {b.file_name}
              </option>
            ))}
          </select>
        </div>

        {/* Batch-specific Stats */}
        {batchStats && (
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3">📦 Selected Batch Analytics</h2>
            <p><strong>Total Calls:</strong> {batchStats.total ?? 'N/A'}</p>
            <p><strong>Success Rate:</strong> {
              typeof batchStats.successRate === 'number'
                ? (batchStats.successRate * 100).toFixed(1) + '%'
                : 'N/A'
            }</p>
            <p><strong>Avg Retries:</strong> {
              typeof batchStats.avgRetries === 'number'
                ? batchStats.avgRetries.toFixed(2)
                : 'N/A'
            }</p>

            <h3 className="mt-4 font-medium">Status Breakdown:</h3>
            {batchStats.byStatus && (
              <ul className="list-disc list-inside">
                {Object.entries(batchStats.byStatus).map(([k, v]) => (
                  <li key={k}>{k}: {v}</li>
                ))}
              </ul>
            )}

            {batchStats.byErrorReason && Object.keys(batchStats.byErrorReason).length > 0 && (
              <>
                <h3 className="mt-4 font-medium">Failure Reasons:</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(batchStats.byErrorReason).map(([k, v]) => (
                    <li key={k}>{k}: {v}</li>
                  ))}
                </ul>
              </>
            )}

            {batchStats.byRetryCount && Object.keys(batchStats.byRetryCount).length > 0 && (
              <>
                <h3 className="mt-4 font-medium">Retry Distribution:</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(batchStats.byRetryCount).map(([r, count]) => (
                    <li key={r}>{r} retry(s): {count}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}