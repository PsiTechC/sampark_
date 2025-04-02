// components/agents/CreateAgentModal.js

import React, { useState } from "react";

export default function CreateAgentModal({ onClose, refreshAgents }) {
  const [agentName, setAgentName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("Hello! Welcome to our AI Agent.");
  const [systemPrompt, setSystemPrompt] = useState("You are an AI agent...");
  // ... any other fields you want
  const API_KEY = "${process.env.NEXT_PUBLIC_API_TOKEN}";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      agent_config: {
        agent_name: agentName,
        agent_welcome_message: welcomeMessage,
        // ...
      },
      agent_prompts: {
        task_1: {
          system_prompt: systemPrompt,
        },
      },
    };

    try {
      const res = await fetch("https://api.bolna.dev/v2/agent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Failed to create agent: " + JSON.stringify(data));
        return;
      }
      alert("Agent created successfully!");
      refreshAgents();
      onClose();
    } catch (err) {
      alert("Error creating agent: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Create AI Agent</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Agent Name</label>
        <input
          type="text"
          className="border w-full p-2 rounded"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Welcome Message</label>
        <textarea
          className="border w-full p-2 rounded"
          rows={3}
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">System Prompt</label>
        <textarea
          className="border w-full p-2 rounded"
          rows={3}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>

      {/* Add more fields as needed... */}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Agent
        </button>
      </div>
    </form>
  );
}
