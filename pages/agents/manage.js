

// D:\sampark\pages\agents\manage.js
import { useEffect, useState } from 'react';

import CallAgentModal from "@/components/agents/CallAgentModal";

import CreateAgentModal from "@/components/agents/CreateAgentModal";
import EditAgents from "@/components/agents/EditAgents";
import EditAgentForm from "@/components/agents/EditAgentForm";
import Sidebar from '@/components/sidebar';






export default function ManageAgents() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [activeTab, setActiveTab] = useState("agent");

  const [loading, setLoading] = useState(true);
  // Replace with your real API key
  const API_KEY = `${process.env.NEXT_PUBLIC_API_TOKEN}`;

  // Fetch agents from your backend
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.bolna.dev/v2/agent/all", {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAgents(data);
      } else {
        setAgents([]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      setAgents([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Handler: select agent from the sidebar
  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    setActiveTab("agent"); // default to "Agent" tab
  };

  // Example placeholders for the top header
  const agentName = selectedAgent?.agent_name || "Select an agent";
  // In real code, you might pull these from your agent's config
  const agentLang = "English";
  const agentVoice = "Matthew";
  const agentCost = "$0.07/min";
  const agentPlatform = "OpenAI";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <Sidebar>
        {/* Sidebar content can be inside the Sidebar component, or here */}
        <div className="p-4">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              + Add Agent
            </button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded">
              Import
            </button>
          </div>

          <h3 className="text-lg font-semibold">Your Agents</h3>
          {loading ? (
            <p className="text-gray-500 mt-2">Loading agents...</p>
          ) : (
            <ul className="mt-3 space-y-1">
              {agents.map((agent) => (
                <li
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                    selectedAgent?.id === agent.id ? "bg-gray-200 font-medium" : ""
                  }`}
                >
                  {agent.agent_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Sidebar>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {/* If no agent is selected, show a placeholder */}
        {!selectedAgent ? (
          <div className="text-gray-600">
            Select an agent from the sidebar to view/edit details.
          </div>
        ) : (
          <>
            {/* AGENT HEADER */}
            <div className="bg-white p-4 rounded shadow mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{agentName}</h1>
                <div className="text-sm text-gray-600 flex gap-4 mt-1">
                  <span>{agentLang}</span>
                  <span>{agentVoice}</span>
                  <span>{agentCost}</span>
                  <span>{agentPlatform}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Share agent not implemented")}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Share agent
                </button>
                <button
                  onClick={() => alert("Assign inbound agent not implemented")}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Assign inbound agent
                </button>
                <button
                  onClick={() => setShowCallModal(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Speak to your agent
                </button>
                <button
                  onClick={() => alert("Buy phone numbers not implemented")}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Buy phone numbers
                </button>
              </div>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "agent"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-700"
                }`}
                onClick={() => setActiveTab("agent")}
              >
                Agent
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "llm"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-700"
                }`}
                onClick={() => setActiveTab("llm")}
              >
                LLM
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "transcriber"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-700"
                }`}
                onClick={() => setActiveTab("transcriber")}
              >
                Transcriber
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "voice"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-700"
                }`}
                onClick={() => setActiveTab("voice")}
              >
                Voice
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "tools"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-700"
                }`}
                onClick={() => setActiveTab("tools")}
              >
                Tools
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "analytics"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-700"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "agent" && (
              <div className="bg-white p-4 rounded shadow space-y-4">
                {/* Inline edit form for welcome message, prompt, etc. */}
                <EditAgentForm agent={selectedAgent} refreshAgents={fetchAgents} />

                <div className="flex gap-2">
                  <button
                    onClick={() => alert("Save agent (EditAgentForm does actual save)")}
                    className="bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Save agent
                  </button>
                  <button
                    onClick={() => alert("Show call logs not implemented")}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    See call logs
                  </button>
                  <button
                    onClick={() => alert("Use chat to test agent not implemented")}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    Use chat to test agent & prompts
                  </button>
                  <button
                    onClick={() => alert("Test your prompt not implemented")}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    Test your prompt via chat
                  </button>
                </div>
              </div>
            )}
            {activeTab === "llm" && <div className="bg-white p-4 rounded shadow">LLM Settings</div>}
            {activeTab === "transcriber" && (
              <div className="bg-white p-4 rounded shadow">Transcriber Settings</div>
            )}
            {activeTab === "voice" && <div className="bg-white p-4 rounded shadow">Voice Settings</div>}
            {activeTab === "tools" && <div className="bg-white p-4 rounded shadow">Tools Config</div>}
            {activeTab === "analytics" && (
              <div className="bg-white p-4 rounded shadow">Analytics Data</div>
            )}
          </>
        )}
      </main>

      {/* CREATE AGENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-lg relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <CreateAgentModal
              onClose={() => setShowCreateModal(false)}
              refreshAgents={fetchAgents}
            />
          </div>
        </div>
      )}

      {/* CALL AGENT MODAL */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-md relative">
            <button
              onClick={() => setShowCallModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <CallAgentModal
              agentId={selectedAgent?.id}
              onClose={() => setShowCallModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
