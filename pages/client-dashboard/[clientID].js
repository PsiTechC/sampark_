import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/sidebar";
import AgentsPage from "../../components/agents/agents_page";
import EditAgent from "../../components/agents/EditAgents";
import CallAgentModal from "../../components/agents/CallAgentModal";
import CallLogs from "../../components/call_logs";
import PhoneNumbers from "../agents/numbers";
import ClientDashboard from "../agents/ClientDashboard";
import Marketing from "../agents/Marketing";
import ConnectCalender from "../agents/ConnectCalender";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCopy, faArrowDownAZ, faArrowUpAZ, faChevronDown, faPen } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../components/ui/Alerts";



const convertVapiAssistantToAgent = (assistant) => ({
  id: assistant.id,
  agent_name: assistant.name,
  agent_welcome_message: assistant.firstMessage || "",
  webhook_url: "", // You can map this if your assistants have one
  tasks: [
    {
      tools_config: {
        llm_agent: {
          llm_config: {
            model: assistant.model?.model || "gpt-4o",
            temperature: assistant.model?.temperature || 0.5,
            max_tokens: 150,
          },
        },
        synthesizer: {
          provider_config: {
            voice: typeof assistant.voice === "string" ? assistant.voice : assistant.voice?.voiceId || "N/A",
          },
        },
        transcriber: {
          model: assistant.transcriber?.model || "nova-3",
        },
      },
      task_config: {
        call_terminate: 90,
        hangup_after_silence: 10,
      },
    },
  ],
});


export default function Dashboard() {
  const [activePage, setActivePage] = useState("agents");
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  const [showCallAgentModal, setShowCallAgentModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vapiAssistants, setVapiAssistants] = useState([]);
  const [selectedVapiAssistant, setSelectedVapiAssistant] = useState(null);
  const [alert, setAlert] = useState({ visible: false, type: "", message: "", isConfirm: false, onConfirm: null });
  const [sortAsc, setSortAsc] = useState(true);
  const [sortOption, setSortOption] = useState("name");
  const [showSortDirectionMenu, setShowSortDirectionMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameInput, setRenameInput] = useState("");
  const [renameTarget, setRenameTarget] = useState({ id: null, isVapi: false });



  // const sortedAgents = [...agents].sort((a, b) =>
  //   sortAsc ? a.agent_name.localeCompare(b.agent_name) : b.agent_name.localeCompare(a.agent_name)
  // );
  // const sortedVapiAssistants = [...vapiAssistants].sort((a, b) =>
  //   sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  // );

  const [sortDropdown, setSortDropdown] = useState(null);

  const compareBy = (fieldA, fieldB) => {
    if (!fieldA || !fieldB) return 0;
    return sortAsc ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
  };

  const sortedAgents = [...agents].sort((a, b) => {
    if (sortOption === "name") return compareBy(a.agent_name, b.agent_name);
    if (sortOption === "created") return compareBy(a.created_at, b.created_at);
    if (sortOption === "updated") return compareBy(a.updated_at, b.updated_at);
    return 0;
  });

  const sortedVapiAssistants = [...vapiAssistants].sort((a, b) => {
    if (sortOption === "name") return compareBy(a.name, b.name);
    if (sortOption === "created") return compareBy(a.createdAt, b.createdAt);
    if (sortOption === "updated") return compareBy(a.updatedAt, b.updatedAt);
    return 0;
  });

  const toggleSortDirection = (option) => {
    setSortAsc(prev => !prev);
    setSortOption(option);
    setSortDropdown(null);
  };

  // Fetch Agents
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.bolna.dev/v2/agent/all", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
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
      setAgents([]);
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);


  const fetchVapiAssistants = async () => {
    try {
      const res = await fetch('https://api.vapi.ai/assistant', {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}` },
      });
      const data = await res.json();
      setVapiAssistants(data);

    } catch (err) {
      console.error('Failed to fetch Vapi assistants', err);
    }
  };

  useEffect(() => {
    fetchVapiAssistants();
  }, []);
  // Get selected agent details
  const selectedAgent = agents.find(agent => agent.id === selectedAgentId) || null;

  const handleDeleteAgent = async (agentId) => {
    try {
      const res = await fetch(`https://api.bolna.ai/v2/agent/${agentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      if (res.ok) {
        setAgents((prev) => prev.filter((a) => a.id !== agentId));
        setSelectedAgentId(null);
        setAlert({
          visible: true,
          type: "success",
          message: "✅ Bolna agent deleted successfully.",
          isConfirm: false,
          onConfirm: null,
        });
      } else {
        console.error("Failed to delete Bolna agent");
      }
    } catch (err) {
      console.error("Error deleting Bolna agent:", err);
      setAlert({
        visible: true,
        type: "error",
        message: "❌ " + err.message,
        isConfirm: false,
        onConfirm: null,
      });
    }
  };

  const handleDeleteVapiAssistant = async (assistantId) => {
    try {
      const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
        },
      });
      if (res.ok) {
        setVapiAssistants((prev) => prev.filter((a) => a.id !== assistantId));
        setSelectedVapiAssistant(null);
        setAlert({
          visible: true,
          type: "success",
          message: "✅ Vapi assistant deleted successfully.",
          isConfirm: false,
          onConfirm: null,
        });
      } else {
        console.error("Failed to delete Vapi assistant");
      }
    } catch (err) {
      console.error("Error deleting Vapi assistant:", err);
      setAlert({
        visible: true,
        type: "error",
        message: "❌ " + err.message,
        isConfirm: false,
        onConfirm: null,
      });
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-grow p-6 flex gap-6">

        {/* Sidebar Left Panel */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md overflow-y-auto max-h-[100vh] scrollbar-none">

          {/* Action Buttons */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setShowCreateAgentModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Agent
            </button>

            <button
              onClick={() => {
                console.log("Opening CallAgentModal"); // Debug log
                setShowCallAgentModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📞 Call Agent
            </button>

          </div>
          <hr className="border-t border-gray-300 my-2" />
          <div className="flex gap-2 items-center mt-5 mb-5 ml-5 relative">
            <button
              onClick={() => {
                if (sortOption === "name") {
                  setSortAsc((prev) => !prev); // Toggle direction
                } else {
                  setSortOption("name"); // Switch to name sort
                  setSortAsc(true); // Default to ascending
                }
              }}
              className={`text-gray-600 hover:text-black flex items-center gap-2 ${sortOption === "name" ? "font-semibold" : ""}`}
              title={`Sort ${sortAsc ? "Z → A" : "A → Z"}`}
            >
              <FontAwesomeIcon icon={sortAsc ? faArrowDownAZ : faArrowUpAZ} className="text-base" />
            </button>



            <div className="relative">
              <button
                onClick={() => setSortDropdown(sortDropdown === "updated" ? null : "updated")}
                className={`px-2 py-1 rounded text-sm border ${sortOption === "updated" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
              >
                Modified At <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
              </button>
              {sortDropdown === "updated" && (
                <div className="absolute z-10 mt-1 bg-white border rounded shadow text-sm">
                  <button onClick={() => { setSortOption("updated"); setSortAsc(false); setSortDropdown(null); }} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Newest First</button>
                  <button onClick={() => { setSortOption("updated"); setSortAsc(true); setSortDropdown(null); }} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Oldest First</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setSortDropdown(sortDropdown === "created" ? null : "created")}
                className={`px-2 py-1 rounded text-sm border ${sortOption === "created" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
              >
                Created At <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
              </button>
              {sortDropdown === "created" && (
                <div className="absolute z-10 mt-1 bg-white border rounded shadow text-sm">
                  <button onClick={() => { setSortOption("created"); setSortAsc(false); setSortDropdown(null); }} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Newest First</button>
                  <button onClick={() => { setSortOption("created"); setSortAsc(true); setSortDropdown(null); }} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Oldest First</button>
                </div>
              )}
            </div>
          </div>
          <hr className="border-t border-gray-300 my-2" />

          <h3 className="text-lg font-semibold text-gray-800">Bolna Agents</h3>
          {loading ? (
            <p className="text-gray-500">Loading agents...</p>
          ) : (
            <div className="mt-4 space-y-2">
              {sortedAgents.length > 0 ? (
                sortedAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer flex justify-between items-center ${selectedAgentId === agent.id ? "border-l-4 border-blue-600" : ""}`}
                    onClick={() => {
                      setSelectedVapiAssistant(null);
                      setSelectedAgentId(agent.id);
                    }}
                  >
                    <h4 className="font-medium text-gray-900">{agent.agent_name}</h4>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentName = agent.agent_name || assistant.name;
                          setRenameInput(agent.agent_name);
                          setRenameTarget({
                            id: agent.id,
                            isVapi: false,
                          });
                          
                          setShowRenameModal(true);
                        }}
                        className="text-gray-400 hover:text-green-600 text-sm mr-3"
                        title="Edit Name"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlert({
                            visible: true,
                            type: "confirm",
                            message: `Do you want to create a copy of ${agent.agent_name}?`,
                            isConfirm: true,
                            onConfirm: async () => {
                              setAlert({ ...alert, visible: false });
                              const newAgentName = `${agent.agent_name}`;
                              const requestBody = {
                                agent_config: {
                                  agent_name: newAgentName,
                                  agent_welcome_message: agent.agent_welcome_message,
                                  agent_type: "sales",
                                  tasks: agent.tasks
                                },
                                agent_prompts: {
                                  task_1: {
                                    system_prompt: agent.agent_prompts?.task_1?.system_prompt || ""
                                  }
                                }
                              };

                              try {
                                const res = await fetch("https://api.bolna.dev/v2/agent", {
                                  method: "POST",
                                  headers: {
                                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                                    "Content-Type": "application/json"
                                  },
                                  body: JSON.stringify(requestBody)
                                });
                                const data = await res.json();
                                if (!res.ok) {
                                  const errorMessage = data?.detail || data?.message || "Failed to copy agent.";
                                  setAlert({ type: "error", message: `❌ ${errorMessage}`, visible: true });
                                } else {
                                  setAlert({ type: "success", message: `✅ ${newAgentName} created successfully!`, visible: true });
                                  fetchAgents();
                                }
                              } catch (error) {
                                console.error("Error copying agent:", error);
                                setAlert({ type: "error", message: "Failed to copy agent. See console.", visible: true });
                              }
                            }
                          });
                        }}
                        className="text-gray-400 hover:text-blue-600 text-sm mr-3"
                        title="Copy Agent"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>


                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlert({
                            visible: true,
                            type: "confirm",
                            message: "Are you sure you want to delete this Bolna agent?",
                            isConfirm: true,
                            onConfirm: () => {
                              handleDeleteAgent(agent.id);
                              setAlert({ ...alert, visible: false });
                            }
                          });
                        }}
                        className="text-gray-400 hover:text-red-600 text-sm"
                        title="Delete Agent"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>      </div>
                ))
              ) : (
                <p className="text-gray-500">No agents found.</p>
              )}
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mt-6">Vapi Assistants</h3>
          <div className="mt-4 space-y-2">
            {sortedVapiAssistants.length > 0 ? (
              sortedVapiAssistants.map((assistant) => (
                <div
                  key={assistant.id}
                  className={`p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer flex justify-between items-center ${selectedVapiAssistant?.id === assistant.id ? "border-l-4 border-green-600" : ""}`}
                  onClick={() => {
                    setSelectedAgentId(null);
                    setSelectedVapiAssistant(assistant);
                  }}
                >
                  <h4 className="font-medium text-gray-900">{assistant.name}</h4>
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenameInput(assistant.name);
                        setRenameTarget({
                          id: assistant.id,
                          isVapi: true,
                        });
                        
                        
                        setShowRenameModal(true);
                      }}
                      className="text-gray-400 hover:text-green-600 text-sm mr-3"
                      title="Edit Name"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlert({
                          visible: true,
                          type: "confirm",
                          message: `Do you want to create a copy of ${assistant.name}?`,
                          isConfirm: true,
                          onConfirm: async () => {
                            setAlert({ ...alert, visible: false });
                            const newAssistantName = `${assistant.name}`;
                            const requestBody = {
                              name: newAssistantName,
                              firstMessage: assistant.firstMessage,
                              voice: typeof assistant.voice === "string" ? assistant.voice : assistant.voice?.voiceId || "",
                              model: assistant.model,
                              transcriber: assistant.transcriber,
                              endCallMessage: assistant.endCallMessage,
                              voicemailMessage: assistant.voicemailMessage,
                              endCallPhrases: assistant.endCallPhrases,
                              clientMessages: assistant.clientMessages,
                              serverMessages: assistant.serverMessages,
                              startSpeakingPlan: assistant.startSpeakingPlan,
                              hipaaEnabled: assistant.hipaaEnabled,
                              backchannelingEnabled: assistant.backchannelingEnabled,
                              backgroundDenoisingEnabled: assistant.backgroundDenoisingEnabled,
                            };

                            try {
                              const res = await fetch("https://api.vapi.ai/assistant", {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(requestBody)
                              });
                              const data = await res.json();
                              if (!res.ok) {
                                const errorMessage = data?.detail || data?.message || "Failed to copy assistant.";
                                setAlert({ type: "error", message: `❌ ${errorMessage}`, visible: true });
                              } else {
                                setAlert({ type: "success", message: `✅ ${newAssistantName} created successfully!`, visible: true });
                                fetchVapiAssistants();
                              }
                            } catch (error) {
                              console.error("Error copying assistant:", error);
                              setAlert({ type: "error", message: "Failed to copy assistant. See console.", visible: true });
                            }
                          }
                        });
                      }}
                      className="text-gray-400 hover:text-blue-600 text-sm mr-3"
                      title="Copy Assistant"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlert({
                          visible: true,
                          type: "confirm",
                          message: "Are you sure you want to delete this Vapi assistant?",
                          isConfirm: true,
                          onConfirm: () => {
                            handleDeleteVapiAssistant(assistant.id);
                            setAlert({ ...alert, visible: false });
                          }
                        });
                      }}
                      className="text-gray-400 hover:text-red-600 text-sm"
                      title="Delete Assistant"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No Vapi assistants found.</p>
            )}
          </div>



        </div>

        {/* Right Panel */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          {activePage === "agents" && (selectedAgent || selectedVapiAssistant) ? (
            <EditAgent
              key={selectedAgent?.id || selectedVapiAssistant?.id}
              agent={
                selectedAgent
                  ? selectedAgent
                  : convertVapiAssistantToAgent(selectedVapiAssistant)
              }
              fetchAgents={fetchAgents}
              agentId={selectedAgent?.id || selectedVapiAssistant?.id}
              isVapiAssistant={!!selectedVapiAssistant}
            />


          ) : activePage === "call_logs" ? (
            <CallLogs />
          ) : activePage === "numbers" ? (
            <PhoneNumbers />
          ) : activePage === "ClientDashboard" ? (
            <ClientDashboard />

          ) : activePage === "Marketing" ? (
            <Marketing />
          ) : activePage === "ConnectCalender" ? (
            <ConnectCalender />
          ) : (
            <p className="text-gray-500 text-center">Select an option from the sidebar</p>
          )}
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-auto relative">
            <button
              onClick={() => setShowCreateAgentModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <AgentsPage setShowCreateAgentModal={setShowCreateAgentModal} fetchAgents={fetchAgents} />
          </div>
        </div>
      )}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-auto relative">
            <button
              onClick={() => setShowRenameModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Name</h2>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />
            <button
              onClick={async () => {
                const endpoint = renameTarget.isVapi
                  ? `https://api.vapi.ai/assistant/${renameTarget.id}`
                  : `https://api.bolna.dev/v2/agent/${renameTarget.id}`;

                const payload = renameTarget.isVapi
                  ? { name: renameInput }
                  : { agent_config: { agent_name: renameInput } };

                try {
                  const res = await fetch(endpoint, {
                    method: "PATCH",
                    headers: {
                      Authorization: `Bearer ${renameTarget.isVapi ? process.env.NEXT_PUBLIC_API_TOKEN_VAPI : process.env.NEXT_PUBLIC_API_TOKEN}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || "Failed to rename");
                  setAlert({ type: "success", message: "✅ Name updated!", visible: true });
                  renameTarget.isVapi ? fetchVapiAssistants() : fetchAgents();
                  setShowRenameModal(false);
                } catch (err) {
                  setAlert({ type: "error", message: "❌ " + err.message, visible: true });
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Call Agent Modal */}
      {showCallAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-auto relative">
            <button
              onClick={() => setShowCallAgentModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <CallAgentModal
              onClose={() => setShowCallAgentModal(false)}
              agentId={selectedAgentId || selectedVapiAssistant?.id}
              isVapiAssistant={!!selectedVapiAssistant}
            />

          </div>
        </div>
      )}
      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          isConfirm={alert.isConfirm}
          onClose={() => setAlert({ ...alert, visible: false })}
          onConfirm={alert.onConfirm}
        />
      )}

    </div>
  );
}
