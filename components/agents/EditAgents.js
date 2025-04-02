


import React, { useState, useEffect } from "react";

import {
  FaBrain,
  FaFileAlt,
  FaWaveSquare,
  FaVolumeUp,
  FaPhone,
  FaTools,
  FaChartLine,
  FaCalendarAlt
} from "react-icons/fa";

const tabs = [
  { id: "agent", label: "Agent", icon: <FaFileAlt /> },
  { id: "llm", label: "LLM", icon: <FaBrain /> },
  // { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
  { id: "transcriber", label: "Transcriber", icon: <FaWaveSquare /> },
  { id: "voice", label: "Voice", icon: <FaVolumeUp /> },
  { id: "call", label: "Call", icon: <FaPhone /> },
  { id: "tools", label: "Tools", icon: <FaTools /> },
  { id: "analytics", label: "Analytics", icon: <FaChartLine /> },


];

// Named export for EditAgent component
export function EditAgent({ agent, fetchAgents, agentId }) {
  const [formData, setFormData] = useState({
    agent_name: agent.agent_name,
    agent_welcome_message: agent.agent_welcome_message,
    model:
      agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.model || "gpt-3.5-turbo",
    temperature:
      agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.temperature || 0.1,
    max_tokens:
      agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.max_tokens || 150,
    voice:
      agent.tasks[0]?.tools_config?.synthesizer?.provider_config?.voice || "Matthew",
    transcriber_model:
      agent.tasks[0]?.tools_config?.transcriber?.model || "nova-2",
    webhook_url: agent.webhook_url || "",
    call_terminate: agent.tasks[0]?.task_config?.call_terminate || 90,
    hangup_after_silence:
      agent.tasks[0]?.task_config?.hangup_after_silence || 10,
  });

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold">Edit Agent</h2>
      {/* You can build your EditAgent UI here */}
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}

// Default export for ManageAgent component
export default function ManageAgent({ agentId }) {
  const [activeTab, setActiveTab] = useState("agent");

  // State for Agent tab
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Loading..."
  );
  const [agentPrompt, setAgentPrompt] = useState(
    "Loading..."
  );

  // State for LLM tab
  const [llmProvider, setLlmProvider] = useState("Openai");
  const [llmModel, setLlmModel] = useState("gpt-3.5-turbo");
  const [maxTokens, setMaxTokens] = useState(1000);
  const [temperature, setTemperature] = useState(0.1);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [googleSheetName, setGoogleSheetName] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [faqsGuardrails, setFaqsGuardrails] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [transcriber, setTranscriber] = useState("Deepgram");
  const [transcriberModel, setTranscriberModel] = useState("nova-2");
  const [keywords, setKeywords] = useState("Bruce:100");
  const [interruptWords, setInterruptWords] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  
  const handleSaveAgent = async () => {
    if (!agentId) {
      alert("Agent ID is missing.");
      return;
    }

    const payload = {
      agent_config: {
        agent_welcome_message: welcomeMessage, // Update the welcome message
      },
      agent_prompts: {
        task_1: {
          system_prompt: agentPrompt, // Update the system prompt
        },
      },
    };

    try {
      const res = await fetch(`https://api.bolna.dev/v2/agent/${agentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Failed to update agent:", data);
        alert("Failed to update agent. " + (data.message || JSON.stringify(data)));
        return;
      }


      alert("✅ Agent updated successfully!");
    } catch (err) {
      console.error("❌ Error during update:", err);
      alert("An error occurred while saving the agent.");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length) {
      alert("Please select at least one file first.");
      return;
    }
  
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
  
    try {
      const res = await fetch("/api/Knowledgebase/uploadKnowledgebase", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      console.log("✅ Upload result:", data);
  
      if (data.sessionId) {
        setSessionId(data.sessionId);
  
        const textRes = await fetch(`/api/Knowledgebase/uploadKnowledgebase?sessionId=${data.sessionId}`);
        const textData = await textRes.json();
        
        if (textData.text) {
          setAgentPrompt((prevPrompt) => `${prevPrompt.trim()}\n\n${textData.text}`);
        }
        
  
        const newText = textData.text?.trim();
        if (newText) {
          setAgentPrompt((prevPrompt) => `${prevPrompt.trim()}\n\n${newText}`);
          setExtractedText(newText); // Optional: in case you want to use this elsewhere
        }
      }
  
      alert("✅ Files uploaded and processed successfully.");
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("❌ Failed to upload files.");
    }
  };
  
  


  useEffect(() => {
    if (!agentId) return;

    const fetchAgentDetails = async () => {
      try {
        const res = await fetch(`https://api.bolna.dev/v2/agent/${agentId}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("Fetched agent details:", data);

        if (data) {
          setWelcomeMessage(data.agent_welcome_message || "");
          const agentPromptFromResponse =
            data.agent_prompts?.task_1?.system_prompt || "";
          setAgentPrompt(agentPromptFromResponse);
        }
      } catch (err) {
        console.error("Error fetching detailed agent info:", err);
      }
    };

    fetchAgentDetails();
  }, [agentId]);




  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-gray-200 mb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium 
                ${isActive
                  ? "bg-white border border-gray-200 border-b-0 rounded-t-md text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
              style={{ marginBottom: isActive ? "-1px" : "0" }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "agent" && (
        <div className="bg-white p-4 rounded-b-md shadow space-y-4">
          <h2 className="text-lg font-bold mb-2">Agent</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agent Welcome Message
            </label>
            <textarea
              className="w-full border p-2 rounded mt-1 text-sm focus:ring focus:ring-blue-200"
              rows={4}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agent Prompt
            </label>
            <textarea
              className="w-full border p-2 rounded mt-1 text-sm focus:ring focus:ring-blue-200"
              rows={12}
              style={{ width: "100%", resize: "vertical" }}
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
            />
          </div>
          <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Upload Knowledge Base
  </label>
  <input
    type="file"
    accept=".pdf,.doc,.docx,.txt"
    multiple
    onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
    className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer p-2"
  />

  <button
    onClick={handleFileUpload}
    className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded text-sm shadow"
  >
    Upload Selected Files
  </button>

  <p className="text-sm text-gray-500 mt-2">
    Supported formats: PDF, Word (.doc/.docx), or Text (.txt)
  </p>
</div>



          <button
            onClick={handleSaveAgent}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Save Agent
          </button>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="bg-white p-4 rounded-b-md shadow space-y-4">
          <h2 className="text-lg font-bold mb-2">Calendar Integration</h2>

          <button
            onClick={() => {
              const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=254745577605-gcilpc49ub26ug3a1jucf8tjee2207bq.apps.googleusercontent.com&redirect_uri=http://localhost:8080/api/testcal&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;
              window.open(authUrl, "_blank");
            }}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            Connect Google Calendar
          </button>

          <p className="text-gray-500 text-sm">
            After connecting, your AI agent will be able to check availability and book meetings on your behalf.
          </p>
        </div>
      )}

      {activeTab === "llm" && (
        <div className="bg-white p-4 rounded-b-md shadow space-y-4">
          <h2 className="text-lg font-bold mb-2">LLM</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Choose LLM provider
              </label>
              <select
                className="w-full border p-2 rounded mt-1 text-sm bg-white focus:ring focus:ring-blue-200"
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
              >
                <option value="Openai">OpenAI</option>
                <option value="Anthropic">Anthropic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LLM Model
              </label>
              <select
                className="w-full border p-2 rounded mt-1 text-sm bg-white focus:ring focus:ring-blue-200"
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
              >
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-4">gpt-4</option>
                <option value="claude-v1">claude-v1</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tokens generated on each LLM output
              </label>
              <input
                type="range"
                min={1}
                max={2000}
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                className="w-full mt-1"
              />
              <span className="text-sm text-gray-500">{maxTokens} tokens</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperature
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full border p-2 rounded mt-1 text-sm focus:ring focus:ring-blue-200"
              />
              <p className="text-gray-500 text-sm">
                Higher temperature = more creative but more deviation
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add Google Sheet URL and sheet name
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <input
                type="text"
                placeholder="Enter Google Sheet URL"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                className="border p-2 rounded text-sm focus:ring focus:ring-blue-200"
              />
              <input
                type="text"
                placeholder="Enter Google Sheet Name"
                value={googleSheetName}
                onChange={(e) => setGoogleSheetName(e.target.value)}
                className="border p-2 rounded text-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              The sheet should include a mobile_number column for phone calls, if relevant.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add knowledge base <span className="text-xs">(currently in Beta)</span>
            </label>
            <input
              type="text"
              placeholder="Enter knowledge base info"
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
              className="w-full border p-2 rounded mt-1 text-sm focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add FAQs & Guardrails
            </label>
            <textarea
              rows={3}
              placeholder="Enter any FAQs or guardrails"
              value={faqsGuardrails}
              onChange={(e) => setFaqsGuardrails(e.target.value)}
              className="w-full border p-2 rounded mt-1 text-sm focus:ring focus:ring-blue-200"
            />
            <a
              href="https://docs.yourapp.com/faqs-guardrails"
              className="text-blue-600 text-sm"
              target="_blank"
              rel="noreferrer"
            >
              Read docs
            </a>
          </div>
          <button
            onClick={handleSaveAgent}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Save LLM Settings
          </button>
        </div>
      )}

      {activeTab === "transcriber" && (
        <div className="bg-white p-4 rounded-b-md shadow space-y-4">
          <h2 className="text-lg font-bold mb-2">Transcriber</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Choose Transcriber
            </label>
            <select
              className="w-full border p-2 rounded mt-1 text-sm bg-white focus:ring focus:ring-blue-200"
              value={transcriber}
              onChange={(e) => setTranscriber(e.target.value)}
            >
              <option value="Deepgram">Deepgram</option>
              <option value="GoogleCloud">Google Cloud</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1 text-sm focus:ring focus:ring-blue-200"
              value={transcriberModel}
              onChange={(e) => setTranscriberModel(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1 text-sm focus:ring focus:ring-blue-200"
              placeholder="Bruce:100"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <p className="text-gray-500 text-sm mt-1">
              Enter certain keywords or proper nouns you want to boost while understanding speech.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of words to wait for before interrupting
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={interruptWords}
              onChange={(e) => setInterruptWords(e.target.value)}
              className="w-full mt-1"
            />
            <p className="text-gray-500 text-sm">
              Agent will not consider interruptions until {interruptWords} words are spoken.
              <br />
              (Stopwords such as "Stop," "Wait," "Hold On," etc., cause the agent to pause by default.)
            </p>
          </div>
          <button
            onClick={handleSaveAgent}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Save Transcriber Settings
          </button>
        </div>
      )}

      {activeTab === "voice" && (
        <div className="bg-white p-4 rounded-b-md shadow">
          <h2 className="text-lg font-bold mb-2">Voice</h2>
          <p className="text-sm text-gray-600">Voice settings coming soon...</p>
        </div>
      )}

      {activeTab === "call" && (
        <div className="bg-white p-4 rounded-b-md shadow">
          <h2 className="text-lg font-bold mb-2">Call</h2>
          <p className="text-sm text-gray-600">Call settings coming soon...</p>
        </div>
      )}

      {activeTab === "tools" && (
        <div className="bg-white p-4 rounded-b-md shadow">
          <h2 className="text-lg font-bold mb-2">Tools</h2>
          <p className="text-sm text-gray-600">Tools configuration coming soon...</p>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white p-4 rounded-b-md shadow">
          <h2 className="text-lg font-bold mb-2">Analytics</h2>
          <p className="text-sm text-gray-600">Analytics data coming soon...</p>
        </div>
      )}
    </div>
  );
}