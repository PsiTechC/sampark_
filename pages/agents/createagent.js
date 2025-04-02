import React, { useState, useEffect } from "react";
import EditAgent from "../../components/agents/EditAgents";
import CreateAgentModal from "../../components/agents/CreateAgentModal";
import Sidebar from "@/components/sidebar";


export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch all agents from API
  const fetchAgents = async () => {
    try {
      const res = await fetch("https://api.bolna.dev/v2/agent/all", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Agents</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add New Agent
          </button>
        </div>

        {/* List all agents */}
        <ul className="space-y-2">
          {agents.map((agent) => (
            <li
              key={agent.id}
              className="p-4 border rounded flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{agent.agent_name}</p>
                <p className="text-sm text-gray-600">
                  Agent ID: {agent.id}
                </p>
              </div>
              <button
                onClick={() => handleSelectAgent(agent)}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>

        {/* If an agent is selected, show the edit panel */}
        {selectedAgent && (
          <div className="mt-6 border p-4 rounded">
            <h2 className="text-lg font-bold mb-3">
              Editing: {selectedAgent.agent_name}
            </h2>
            {/* Pass the selected agent and refresh function to EditAgent */}
            <EditAgent agent={selectedAgent} fetchAgents={fetchAgents} />
          </div>
        )}

        {/* Create Agent Modal */}
        {showCreateModal && (
          <CreateAgentModal
            onClose={() => setShowCreateModal(false)}
            fetchAgents={fetchAgents}
          />
        )}
      </div>
    </div>
  );
}
