// // components/agents/EditAgentForm.js

// import React, { useState } from "react";

// export default function EditAgentForm({ agent, refreshAgents }) {
//   // Pre-fill from the existing agent config
//   const [welcomeMessage, setWelcomeMessage] = useState(agent.agent_welcome_message || "");
//   const [systemPrompt, setSystemPrompt] = useState(
//     // This depends on how your agent stores prompts
//     agent.tasks?.[0]?.agent_prompt || "You are an AI agent..."
//   );
//   const API_KEY = "${process.env.NEXT_PUBLIC_API_TOKEN}";

//   const handleSave = async () => {
//     // Build the payload according to your backend schema
//     const requestBody = {
//       agent_config: {
//         agent_name: agent.agent_name,
//         agent_welcome_message: welcomeMessage,
//         // ...
//       },
//       agent_prompts: {
//         task_1: {
//           system_prompt: systemPrompt,
//         },
//       },
//     };

//     try {
//       const res = await fetch(`https://api.bolna.dev/v2/agent/${agent.id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         alert("Failed to update agent: " + JSON.stringify(data));
//         return;
//       }
//       alert("Agent updated successfully!");
//       refreshAgents();
//     } catch (err) {
//       alert("Error updating agent: " + err.message);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Agent Welcome Message
//         </label>
//         <textarea
//           value={welcomeMessage}
//           onChange={(e) => setWelcomeMessage(e.target.value)}
//           className="w-full border p-2 rounded"
//           rows={3}
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Agent Prompt
//         </label>
//         <textarea
//           value={systemPrompt}
//           onChange={(e) => setSystemPrompt(e.target.value)}
//           className="w-full border p-2 rounded"
//           rows={3}
//         />
//       </div>

//       <button
//         onClick={handleSave}
//         className="bg-blue-700 text-white px-4 py-2 rounded"
//       >
//         Save Changes
//       </button>
//     </div>
//   );
// }
