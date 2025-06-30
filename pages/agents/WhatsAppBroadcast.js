import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

export default function WhatsAppBroadcast() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });
    const [loading, setLoading] = useState(false);
    const [assistantList, setAssistantList] = useState([]);
    const [selectedAssistant, setSelectedAssistant] = useState("");

    useEffect(() => {
        const fetchAssistantList = async () => {
            try {
                let cached = localStorage.getItem("assistant_ids");
                let assistants = [];

                if (cached) {
                    const ids = JSON.parse(cached);
                    assistants = await Promise.all(
                        ids.map(async (id) => {
                            const res = await fetch(`https://api.vapi.ai/assistant/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
                                },
                            });
                            const json = await res.json();
                            return { id: json.id, name: json.name };
                        })
                    );
                } else {
                    const mapRes = await fetch("/api/map/getUserAgents");
                    const data = await mapRes.json();
                    const ids = data.assistants || [];

                    assistants = await Promise.all(
                        ids.map(async (id) => {
                            const res = await fetch(`https://api.vapi.ai/assistant/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
                                },
                            });
                            const json = await res.json();
                            return { id: json.id, name: json.name };
                        })
                    );

                    localStorage.setItem("assistant_ids", JSON.stringify(assistants.map(a => a.id)));
                }

                setAssistantList(assistants);
                if (assistants.length > 0) setSelectedAssistant(assistants[0].id);
            } catch (err) {
                console.error("Failed to load assistants", err);
                setAlert({ type: "error", message: "❌ Failed to load assistants.", visible: true });
            }
        };

        fetchAssistantList();
    }, []);


    const handleUploadWsBroadcastCsv = async () => {
        setLoading(true);

        if (!selectedAssistant) {
            setAlert({ type: "warning", message: "⚠️ Please select an assistant.", visible: true });
            setLoading(false);
            return;
        }

        if (!selectedFiles.length) {
            setAlert({ type: "warning", message: "⚠️ Please select a CSV file.", visible: true });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("file", file));
        formData.append("assistantId", selectedAssistant);

        try {
            const res = await fetch("/api/ws_broadcast/upload_csv_ws", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Upload failed");

            setAlert({
                type: "success",
                message: `✅ CSV uploaded successfully! Saved as: ${data.fileName}`,
                visible: true,
            });
        } catch (err) {
            setAlert({ type: "error", message: "❌ Upload failed: " + err.message, visible: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-grow p-6">
                <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
                    <h2 className="text-lg font-bold mb-4">WhatsApp Broadcast CSV Upload</h2>
                    {/* Sample CSV download link */}
                    <a
                        href="/assets/whatsApp_broadcast_sample_file.csv"
                        download
                        className="inline-block text-sm text-blue-600 underline mb-2"
                    >
                        📥 Download Sample CSV
                    </a>


                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Assistant</label>
                    <select
                        className="w-full border p-2 rounded text-sm mb-4"
                        value={selectedAssistant}
                        onChange={(e) => setSelectedAssistant(e.target.value)}
                    >
                        {assistantList.map((assistant) => (
                            <option key={assistant.id} value={assistant.id}>
                                {assistant.name || assistant.id}
                            </option>
                        ))}
                    </select>


                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer p-2 mb-2"
                    />

                    <button
                        onClick={handleUploadWsBroadcastCsv}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload CSV"}
                    </button>

                    {selectedFiles.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                            📄 Selected: {selectedFiles.map((f) => f.name).join(", ")}
                        </p>
                    )}

                    {alert.visible && (
                        <div
                            className={`mt-4 text-sm px-4 py-2 rounded ${alert.type === "success"
                                ? "bg-green-100 text-green-800"
                                : alert.type === "error"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                        >
                            {alert.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
