// // C:\botGIT\botGIT-main\components\agents\edit_agents.js
// import { useState } from "react";

// export default function EditAgent({ agent, fetchAgents }) {
//   const [formData, setFormData] = useState({
//     agent_name: agent.agent_name,
//     agent_welcome_message: agent.agent_welcome_message,
//     model: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.model || "gpt-3.5-turbo",
//     temperature: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.temperature || 0.1,
//     max_tokens: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.max_tokens || 150,
//     voice: agent.tasks[0]?.tools_config?.synthesizer?.provider_config?.voice || "Matthew",
//     transcriber_model: agent.tasks[0]?.tools_config?.transcriber?.model || "nova-2",
//     webhook_url: agent.webhook_url || "",
//     call_terminate: agent.tasks[0]?.task_config?.call_terminate || 90,
//     hangup_after_silence: agent.tasks[0]?.task_config?.hangup_after_silence || 10,
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await fetch(`https://api.bolna.dev/v2/agent/${agent.id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           agent_config: {
//             agent_name: formData.agent_name,
//             agent_welcome_message: formData.agent_welcome_message,
//             webhook_url: formData.webhook_url,
//             tasks: [
//               {
//                 task_type: "conversation",
//                 tools_config: {
//                   llm_agent: {
//                     llm_config: {
//                       model: formData.model,
//                       temperature: parseFloat(formData.temperature),
//                       max_tokens: parseInt(formData.max_tokens),
//                     },
//                   },
//                   synthesizer: {
//                     provider_config: { voice: formData.voice },
//                   },
//                   transcriber: { model: formData.transcriber_model },
//                 },
//                 task_config: {
//                   call_terminate: parseInt(formData.call_terminate),
//                   hangup_after_silence: parseInt(formData.hangup_after_silence),
//                 },
//               },
//             ],
//           },
//         }),
//       });
//       await res.json();
//       fetchAgents();
//       alert("Agent updated successfully!");
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

 
//     return (
//       <div className="bg-white p-6  w-full">
//         {/* Speak to Your Agent Tab */}
//         <div className="flex justify-between border-b pb-3 mb-4">
//           <h3 className="text-lg font-semibold text-gray-700">Speak to Your Agent</h3>
//           <button className="bg-blue-900 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600 transition">
//             Call Now
//           </button>
//         </div>
  
//         <h3 className="text-lg font-semibold mb-3 text-gray-700">Edit Agent</h3>
  
//         <div className="space-y-3">
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Agent Name</label>
//             <input
//               type="text"
//               name="agent_name"
//               value={formData.agent_name}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//             />
//           </div>
  
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Agent Welcome Message</label>
//             <textarea
//               name="agent_welcome_message"
//               value={formData.agent_welcome_message}
//               onChange={handleChange}
//               rows="2"
//               className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//             />
//           </div>
  
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Webhook URL</label>
//             <input
//               type="text"
//               name="webhook_url"
//               value={formData.webhook_url}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//               placeholder="Enter webhook URL"
//             />
//           </div>
  
//           <div>
//             <label className="block text-sm font-medium text-gray-600">LLM Model</label>
//             <select
//               name="model"
//               value={formData.model}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring focus:ring-blue-200"
//             >
//               <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
//               <option value="gpt-4o-mini">GPT-4o Mini</option>
//             </select>
//           </div>
  
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-600">Temperature</label>
//               <input
//                 type="number"
//                 name="temperature"
//                 value={formData.temperature}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600">Max Tokens</label>
//               <input
//                 type="number"
//                 name="max_tokens"
//                 value={formData.max_tokens}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//               />
//             </div>
//           </div>
  
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Voice</label>
//             <select
//               name="voice"
//               value={formData.voice}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring focus:ring-blue-200"
//             >
//               <option value="Matthew">Matthew</option>
//               <option value="Vikram">Vikram</option>
//             </select>
//           </div>
  
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Transcriber Model</label>
//             <input
//               type="text"
//               name="transcriber_model"
//               value={formData.transcriber_model}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//             />
//           </div>
  
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-600">Call Termination Time (s)</label>
//               <input
//                 type="number"
//                 name="call_terminate"
//                 value={formData.call_terminate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600">Hangup After Silence (s)</label>
//               <input
//                 type="number"
//                 name="hangup_after_silence"
//                 value={formData.hangup_after_silence}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//               />
//             </div>
//           </div>
  
//           <button
//             onClick={handleUpdate}
//             className="w-full bg-blue-900 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
//           >
//             Update Agent
//           </button>
//         </div>
//       </div>
//     );
//   }
  





// import { useState } from "react";

// export default function EditAgent({ agent, fetchAgents }) {
//   const [formData, setFormData] = useState({
//         agent_name: agent.agent_name,
//         agent_welcome_message: agent.agent_welcome_message,
//         model: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.model || "gpt-3.5-turbo",
//         temperature: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.temperature || 0.1,
//         max_tokens: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.max_tokens || 150,
//         voice: agent.tasks[0]?.tools_config?.synthesizer?.provider_config?.voice || "Matthew",
//         transcriber_model: agent.tasks[0]?.tools_config?.transcriber?.model || "nova-2",
//         webhook_url: agent.webhook_url || "",
//         call_terminate: agent.tasks[0]?.task_config?.call_terminate || 90,
//         hangup_after_silence: agent.tasks[0]?.task_config?.hangup_after_silence || 10,
//       });
//   const [showModal, setShowModal] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");

//   // Update Agent API Request
//   const handleUpdate = async () => {
//     try {
//       const res = await fetch(`https://api.bolna.dev/v2/agent/${agent.id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           agent_config: {
//             agent_name: formData.agent_name,
//             agent_welcome_message: formData.agent_welcome_message,
//             webhook_url: formData.webhook_url,
//             tasks: [
//               {
//                 task_type: "conversation",
//                 tools_config: {
//                   llm_agent: {
//                     llm_config: {
//                       model: formData.model,
//                       temperature: parseFloat(formData.temperature),
//                       max_tokens: parseInt(formData.max_tokens),
//                     },
//                   },
//                   synthesizer: {
//                     provider_config: { voice: formData.voice },
//                   },
//                   transcriber: { model: formData.transcriber_model },
//                 },
//                 task_config: {
//                   call_terminate: parseInt(formData.call_terminate),
//                   hangup_after_silence: parseInt(formData.hangup_after_silence),
//                 },
//               },
//             ],
//           },
//         }),
//       });
//       await res.json();
//       fetchAgents();
//       alert("Agent updated successfully!");
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   // Make a Call API Request
//   const handleCallNow = async () => {
//     console.log("📞 Initiating call...");
  
//     const formattedPhoneNumber = phoneNumber.startsWith("+91")
//       ? phoneNumber
//       : `+91${phoneNumber.replace(/\D/g, "")}`;
  
//     const requestBody = {
//       agent_id: agent.id,
//       recipient_phone_number: formattedPhoneNumber,
//       from_phone_number: "+918035736988", // Ensure this is a registered number
//     };
  
//     console.log("📤 Sending API request with payload:", requestBody);
  
//     try {
//       const response = await fetch(`https://api.bolna.dev/call`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });
  
//       const data = await response.json();
//       console.log("✅ API Response:", data);
  
//       if (data.execution_id) {
//         console.log("🎯 Execution ID received:", data.execution_id);
//         saveCallExecution(agent.id, data.execution_id);
//         alert("Call initiated! Execution ID: " + data.execution_id);
//       } else {
//         console.warn("⚠️ No execution ID received in response!");
//       }
//     } catch (error) {
//       console.error("❌ Call failed:", error);
//       alert("Call failed!");
//     } finally {
//       setShowModal(false);
//     }
//   };
  
  
//   // Save Execution ID to Local Storage
//   const saveCallExecution = (agentId, executionId) => {
//     console.log("💾 Saving execution ID to localStorage...");
  
//     try {
//       const storedExecutions = JSON.parse(localStorage.getItem("callExecutions")) || {};
  
//       if (!storedExecutions[agentId]) {
//         storedExecutions[agentId] = [];
//       }
  
//       storedExecutions[agentId].push({
//         executionId,
//         timestamp: new Date().toISOString(),
//       });
  
//       localStorage.setItem("callExecutions", JSON.stringify(storedExecutions));
  
//       console.log("✅ Execution ID stored successfully:", storedExecutions);
//     } catch (error) {
//       console.error("❌ Error storing execution ID:", error);
//     }
//   };
  
//   return (
//     <div className="bg-white p-6 w-full">
//       {/* Speak to Your Agent */}
//       <div className="flex justify-between border-b pb-3 mb-4">
//         <h3 className="text-lg font-semibold text-gray-700">Speak to Your Agent</h3>
//         <button 
//           className="bg-blue-900 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600 transition"
//           onClick={() => setShowModal(true)}
//         >
//           Call Now
//         </button>
//       </div>

//       {/* Modal for Phone Number */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Enter Phone Number</h2>
//             <input
//               type="text"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="Enter phone number"
//               className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//             />
//             <div className="flex justify-end space-x-3 mt-4">
//               <button 
//                 className="bg-gray-400 text-white px-4 py-2 rounded-md" 
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="bg-blue-900 text-white px-4 py-2 rounded-md" 
//                 onClick={handleCallNow}
//               >
//                 Call
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Agent Section */}
//       <h3 className="text-lg font-semibold mb-3 text-gray-700">Edit Agent</h3>

//       <div className="space-y-3">
//         {/* Agent Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-600">Agent Name</label>
//           <input
//             type="text"
//             name="agent_name"
//             value={formData.agent_name}
//             onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
//             className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//           />
//         </div>

     
//           <div>
//              <label className="block text-sm font-medium text-gray-600">Agent Welcome Message</label>
//              <textarea
//                name="agent_welcome_message"
//               value={formData.agent_welcome_message}
//                onChange={handleChange}
//                rows="2"
//                className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//              />
//            </div>

//         {/* Call Termination Time */}
//         <div>
//           <label className="block text-sm font-medium text-gray-600">Call Termination Time (s)</label>
//           <input
//             type="number"
//             name="call_terminate"
//             value={formData.call_terminate}
//             onChange={(e) => setFormData({ ...formData, call_terminate: e.target.value })}
//             className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={handleUpdate}
//           className="w-full bg-blue-900 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
//         >
//           Update Agent
//         </button>
//       </div>
//     </div>
//   );
// }




// C:\botGIT\botGIT-main\components\agents\edit_agents.js
import { useState } from "react";

export default function EditAgent({ agent, fetchAgents }) 
{
  const [formData, setFormData] = useState({
    agent_name: agent.agent_name,
    agent_welcome_message: agent.agent_welcome_message,
    model: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.model || "gpt-3.5-turbo",
    temperature: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.temperature || 0.1,
    max_tokens: agent.tasks[0]?.tools_config?.llm_agent?.llm_config?.max_tokens || 150,
    voice: agent.tasks[0]?.tools_config?.synthesizer?.provider_config?.voice || "Matthew",
    transcriber_model: agent.tasks[0]?.tools_config?.transcriber?.model || "nova-2",
    webhook_url: agent.webhook_url || "",
    call_terminate: agent.tasks[0]?.task_config?.call_terminate || 90,
    hangup_after_silence: agent.tasks[0]?.task_config?.hangup_after_silence || 10,
  });

  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("IN"); // Default to India

  // Update Agent API Request
  const handleUpdate = async () => {
    if (!formData.agent_name || !formData.agent_welcome_message) {
     alert("Agent Name and Welcome Message are required!");
      return;
    }
    try {
      const requestBody = {
        agent_config: {
          agent_name: formData.agent_name,
          agent_welcome_message: formData.agent_welcome_message,
          agent_type: formData.agent_type,
          tasks: [
            {
              task_type: "conversation",
              toolchain: { execution: "parallel", pipelines: [["transcriber", "llm", "synthesizer"]] },
              task_config: {
                check_if_user_online: true,
                check_user_online_message: "Hey, are you still there?",
                trigger_user_online_message_after: 6,
                number_of_words_for_interruption: 2,
              },
              tools_config: {
                llm_agent: { agent_type: "simple_llm_agent", agent_flow_type: "streaming", llm_config: { model: formData.model, max_tokens: formData.max_tokens, temperature: formData.temperature } },
                synthesizer: { provider: "elevenlabs", provider_config: { voice: formData.voice, model: "eleven_turbo_v2_5" } },
                transcriber: { provider: "deepgram", model: formData.transcriber_model }
              }
            }
          ]
        }
      };

      const res = await fetch(`https://api.bolna.dev/v2/agent/${agent.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error("API Error");
      alert("Agent updated successfully!");
      fetchAgents();
    } catch (error) {
      alert("Failed to update agent.");
    }
  };




 // Country codes
 const countryCodes = {
  IN: "+91",
  US: "+1",
  UK: "+44",
  CA: "+1",
  AU: "+61",
  DE: "+49",
  FR: "+33",
  SG: "+65",
   } ;

const handleCallNow = async () => {
  console.log("📞 Initiating call...");

  const formattedPhoneNumber = `${countryCodes[selectedCountry]}${phoneNumber.replace(/\D/g, "")}`;

  console.log("📤 Sending API request with phone number:", formattedPhoneNumber);

  const requestData = {
    agent_id: "5ad4dace-34fa-44bd-a184-c7d6fedf737c",
    recipient_phone_number: formattedPhoneNumber,
  };

  console.log("📡 API Request Payload:", requestData);

  try {
    const response = await fetch(`https://api.bolna.dev/call`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error("⚠️ API Error:", response.status, response.statusText);
      alert(`Call failed! API returned ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log("✅ API Response:", data);

    if (data.execution_id) {
      console.log("🎯 Execution ID received:", data.execution_id);
      alert(`Call initiated successfully! Execution ID: ${data.execution_id}`);
    } else {
      console.warn("⚠️ No execution ID received in response!", data);
      alert("Call failed! No execution ID received.");
    }
  } catch (error) {
    console.error("❌ Call failed:", error);
    alert("An error occurred while making the call.");
  }
};


return (
  <div className="bg-white p-6 w-full">
    {/* Speak to Your Agent */}
    
    <div className="flex justify-between  pb-3 mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Talk to Your Agent</h3>
      <button
        className="bg-blue-900 text-white px-4 py-2 text-sm rounded-md font-semibold shadow-md hover:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105"
        onClick={() => setShowModal(true)}
      >
        Call Agent
      </button>
    </div>

    {/* Call Modal */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Place Outbound Call</h2>

          <p className="text-sm text-gray-600 mb-2">
            Enter phone numbers with country code (e.g., +16507638870)
          </p>

          <div className="flex items-center border rounded-md overflow-hidden">
            {/* Country Code Selector */}
            <select
              className="px-3 py-2 bg-gray-200 border-r text-sm"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {Object.keys(countryCodes).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            {/* Phone Number Input */}
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-3 py-2 text-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              onClick={handleCallNow}
            >
              Call Now
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Agent Section */}
    <h3 className="text-lg font-semibold mb-3 text-gray-700">Edit Agent</h3>

    <div className="space-y-3">
      {/* Agent Name & Webhook URL (Side by Side) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Agent Name</label>
          <input
            type="text"
            name="agent_name"
            value={formData.agent_name}
            onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Webhook URL</label>
          <input
            type="text"
            name="webhook_url"
            value={formData.webhook_url}
            onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Agent Welcome Message (Large Input Box) */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Agent Welcome Message</label>
        <textarea
          name="agent_welcome_message"
          value={formData.agent_welcome_message}
          onChange={(e) => setFormData({ ...formData, agent_welcome_message: e.target.value })}
          rows="4"
          className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200 resize-none"
        />
      </div>

      {/* Model & Voice Selection (Side by Side) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">LLM Model</label>
          <select
            name="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring focus:ring-blue-200"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Voice</label>
          <select
            name="voice"
            value={formData.voice}
            onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring focus:ring-blue-200"
          >
            <option value="Matthew">Matthew</option>
            <option value="Vikram">Vikram</option>
          </select>
        </div>
      </div>

      {/* Temperature & Max Tokens (Side by Side) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Temperature</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Max Tokens</label>
          <input
            type="number"
            name="max_tokens"
            value={formData.max_tokens}
            onChange={(e) => setFormData({ ...formData, max_tokens: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Transcriber Model */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Transcriber Model</label>
        <input
          type="text"
          name="transcriber_model"
          value={formData.transcriber_model}
          onChange={(e) => setFormData({ ...formData, transcriber_model: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Termination & Hangup Settings (Side by Side) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Call Termination Time (s)</label>
          <input
            type="number"
            name="call_terminate"
            value={formData.call_terminate}
            onChange={(e) => setFormData({ ...formData, call_terminate: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Hangup After Silence (s)</label>
          <input
            type="number"
            name="hangup_after_silence"
            value={formData.hangup_after_silence}
            onChange={(e) => setFormData({ ...formData, hangup_after_silence: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      <button 
        onClick={handleUpdate} 
        className="w-full bg-blue-900 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
      >
        Update Agent
      </button>
    </div>
  </div>
  
);
}