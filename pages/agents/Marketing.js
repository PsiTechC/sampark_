
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { FiCopy, FiDownload, FiCalendar, FiPause, FiTrash2, FiPlay } from "react-icons/fi";

function Marketing() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [scheduleModal, setScheduleModal] = useState({ show: false, batchId: null });
  const [scheduledAt, setScheduledAt] = useState("");



  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleScheduleSubmit = async () => {
    if (!scheduledAt || !scheduleModal.batchId) return alert("Pick a date and time");

    try {
      const formData = new FormData();
      formData.append("scheduled_at", scheduledAt); // ISO 8601 with timezone only

      const res = await fetch(`https://api.bolna.dev/batches/${scheduleModal.batchId}/schedule`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to schedule");

      alert(`✅ Batch scheduled for ${scheduledAt}`);
      setScheduleModal({ open: false, batchId: null });
      setScheduledAt("");
      fetchBatchesForAgent(selectedAgent); // Refresh
    } catch (err) {
      console.error("❌ Scheduling error:", err);
      alert(err.message);
    }
  };


  const handleRunNow = async (batchId) => {
    const now = new Date();

    // Format to ISO with +05:30 offset manually
    const pad = (num) => String(num).padStart(2, '0');
    const yyyy = now.getFullYear();
    const MM = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());

    const isoWithOffset = `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}+05:30`;

    try {
      const formData = new FormData();
      formData.append("scheduled_at", isoWithOffset);
      formData.append("is_scheduled", "false"); // Important

      const res = await fetch(`https://api.bolna.dev/batches/${batchId}/schedule`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          // Don't manually set Content-Type
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to schedule batch.");
      }

      console.log("✅ Batch scheduled:", result);
      alert(`✅ Batch scheduled at ${isoWithOffset}`);
    } catch (err) {
      console.error("❌ Error scheduling batch:", err);
      alert(err.message);
    }
  };








  const fetchBatchesForAgent = async (agentId) => {
    try {
      const res = await fetch(`https://api.bolna.dev/batches/${agentId}/all`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      const data = await res.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch agent-specific batches", err);
    }
  };

  useEffect(() => {
    const fetchAgents = async () => {
      const res = await fetch("https://api.bolna.dev/v2/agent/all", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      const data = await res.json();
      setAgents(data);
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const res = await fetch("https://api.bolna.dev/phone-numbers/all", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        });
        const data = await res.json();
        setPhoneNumbers(data);
      } catch (err) {
        console.error("Failed to fetch phone numbers", err);
      }
    };

    fetchPhoneNumbers();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      fetchBatchesForAgent(selectedAgent);
    }
  }, [selectedAgent]);

  const handleStopBatch = async (batchId) => {
    try {
      const res = await fetch(`https://api.bolna.dev/batches/${batchId}/stop`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to stop batch");

      alert("🛑 Batch stopped successfully");
      fetchBatchesForAgent(selectedAgent); // Refresh
    } catch (err) {
      console.error("❌ Error stopping batch:", err);
      alert(err.message);
    }
  };


  const handleConfirmUpload = async () => {
    if (!csvFile || !selectedAgent || !selectedPhoneNumber) {
      alert("Please select all fields and upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("agent_id", selectedAgent);
    formData.append("from_phone_number", selectedPhoneNumber);

    try {
      const res = await fetch("https://api.bolna.dev/batches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: formData,
      });

      const responseData = await res.json();
      console.log("📦 Batch API response:", responseData);
      alert("✅ Campaign created successfully!");
      setShowModal(false);
      fetchBatchesForAgent(selectedAgent); // Refresh batches
    } catch (err) {
      console.error("❌ Error uploading batch:", err);
      alert("Failed to create campaign.");
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;

    try {
      await fetch(`https://api.bolna.dev/batches/${batchId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      fetchBatchesForAgent(selectedAgent); // Refresh after delete
    } catch (err) {
      console.error("❌ Error deleting batch:", err);
      alert("Failed to delete batch.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Agent Marketing</h2>

        <div className="mb-6 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Agent</label>
          <select
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <option value="">-- Select Agent --</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.agent_name || "Unnamed Agent"}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 max-w-md flex justify-between items-end">
          <button
            onClick={() => setShowModal(true)}
            disabled={!selectedAgent}
            className={`px-4 py-2 text-sm rounded transition ${selectedAgent ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Create Campaign
          </button>
        </div>
        {scheduleModal.open && (
          <div className="fixed inset-0 z-20 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">📅 Schedule Batch</h3>

              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mb-4 block w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setScheduleModal({ open: false, batchId: null })}
                  className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleSubmit}
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Create Campaign</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV</label>
              <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4 block w-full text-sm" />
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Number</label>
              <select
                className="w-full mb-4 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
                value={selectedPhoneNumber}
                onChange={(e) => setSelectedPhoneNumber(e.target.value)}
              >
                <option value="">-- Choose Number --</option>
                {phoneNumbers.map((number) => (
                  <option key={number.phone_number} value={number.phone_number}>{number.phone_number}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400">
                  Cancel
                </button>
                <button onClick={handleConfirmUpload} className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Confirm Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Table */}
        <h3 className="text-lg font-semibold mb-3">Uploaded Batches</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Batch ID</th>
                <th className="p-3">File name</th>
                <th className="p-3">Uploaded contacts<br /><span className="text-xs">(# valid / # total)</span></th>
                <th className="p-3">Execution Status</th>
                <th className="p-3">Batch Status</th>
                <th className="p-3">Run now</th>
                <th className="p-3">Schedule later</th>
                <th className="p-3">Stop batch</th>
                <th className="p-3">Batch uploaded</th>
                <th className="p-3">Delete batch</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(batches) && batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch.batch_id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 flex items-center gap-2">
                      <span className="font-mono">{batch.batch_id.slice(0, 16)}...</span>
                      <button onClick={() => navigator.clipboard.writeText(batch.batch_id)}>
                        <FiCopy className="text-gray-500 hover:text-gray-700" />
                      </button>
                    </td>
                    <td className="p-3">{batch.file_name}</td>
                    <td className="p-3">{batch.valid_contacts} valid / {batch.total_contacts} total</td>
                    <td className="p-3 text-sm">
                      {batch.execution_status ? (
                        <>
                          busy: {batch.execution_status.busy || 0}<br />
                          completed: {batch.execution_status.completed || 0}<br />
                          error: {batch.execution_status.error || 0}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3 capitalize">{batch.status || "-"}</td>
                    <td className="p-3"><FiPlay
                      className="text-gray-600 hover:text-black cursor-pointer"
                      onClick={() => handleRunNow(batch.batch_id)}
                    />
                    </td>
                    <td className="p-3"><td className="p-3">
                      <FiCalendar
                        className="text-gray-600 hover:text-black cursor-pointer"
                        onClick={() => setScheduleModal({ open: true, batchId: batch.batch_id })}
                      />
                    </td>
                    </td>
                    <td className="p-3"><td className="p-3">
                      <FiPause
                        className="text-gray-600 hover:text-black cursor-pointer"
                        onClick={() => handleStopBatch(batch.batch_id)}
                      />
                    </td>
                    </td>
                    <td className="p-3">{batch.humanized_created_at || "-"}</td>
                    <td className="p-3">
                      <button onClick={() => handleDeleteBatch(batch.batch_id)}>
                        <FiTrash2 className="text-red-500 hover:text-red-700 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="11" className="p-4 text-center text-gray-500">No batches available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Marketing;