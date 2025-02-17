




import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/sidebar";
import AgentsPage from "../../components/agents/agents_page";
import EditAgent from "../../components/agents/edit_agents";
import CallLogs from "../../components/agents/call_logs"; // New Call Logs Component
import PhoneNumbers from "../agents/numbers"

export default function Dashboard() {
  const [activePage, setActivePage] = useState("agents");
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  const [agents, setAgents] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Agents
  const fetchAgents = useCallback(async () => {
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
        console.error("Invalid data format for agents");
        setAgents([]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      setAgents([]);  // Set fallback to avoid runtime errors
    }
    setLoading(false);
  }, []);
  

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Fetch Phone Numbers
  const API_URL = "https://api.bolna.dev/phone-numbers/all";
  const API_KEY = "bn-08f3037613b4452a9509040887bc5d48";

  const fetchPhoneNumbers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      const data = await response.json();
      setPhoneNumbers(data);
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhoneNumbers();
  }, [fetchPhoneNumbers]);

  
  // Get the selected agent
  const selectedAgent = Array.isArray(agents) ? agents.find(agent => agent.id === selectedAgentId) : null;


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-grow p-6 flex gap-6">
        {/* Sidebar Left Panel */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
          {/* Action Buttons */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setShowCreateAgentModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Agent
            </button>
            <button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
              📥 Import
            </button>
          </div>

          {/* Agents List */}
          <h3 className="text-lg font-semibold text-gray-800">Your Agents</h3>
          {loading ? (
            <p className="text-gray-500">Loading agents...</p>
          ) : (
            <div className="mt-4 space-y-2">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer ${
                      selectedAgentId === agent.id ? "border-l-4 border-blue-600" : ""
                    }`}
                    onClick={() => setSelectedAgentId(agent.id)}
                  >
                    <h4 className="font-medium text-gray-900">{agent.agent_name}</h4>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No agents found.</p>
              )}
            </div>
          )}
        </div>

               


<div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          {activePage === "agents" && selectedAgent ? (
            <EditAgent key={selectedAgent.id} agent={selectedAgent} fetchAgents={fetchAgents} />
          ) : activePage === "call_logs" ? (
            <CallLogs />
          ) : activePage === "numbers" ? (
            <PhoneNumbers />
          ) : (
            <p className="text-gray-500 text-center">Select an option from the sidebar</p>
          )}
        </div>


      </div>
      

      {/* Create Agent Modal */}
      {showCreateAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setShowCreateAgentModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>

            {/* Agent Form Inside Modal */}
            <AgentsPage setShowCreateAgentModal={setShowCreateAgentModal} fetchAgents={fetchAgents} />
          </div>
        </div>
      )}
    </div>
  );
}




