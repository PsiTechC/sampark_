
// // //working adding vapi
// import { useState, useEffect } from "react";
// import Alert from "../ui/Alerts";


// export default function CreateAgent() {
//   const [market, setMarket] = useState("india"); // india or us
//   const [formData, setFormData] = useState({
//     agentName: "",
//     businessName: "",
//     welcomeMessage: "Hello! Welcome to our AI Agent. How can I assist you today?",
//     systemPrompt: "You are an AI agent helping customers with inquiries, pricing, and support. Keep responses clear, concise, and helpful.",
//     voice: "burt-11labs",
//     voiceProvider: "elevenlabs",
//     callTerminate: 300,
//     aboutProduct: "",
//     aboutBusiness: "",
//     transcriberProvider: "deepgram",
//     transcriberModel: "nova-2",
//     phoneNumber: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [agents, setAgents] = useState([]);
//   const [alert, setAlert] = useState({ type: "", message: "", visible: false });

//   const toolKey = `transfer_call_${Math.random().toString(36).substring(2, 12)}`;



//   const voiceOptions = {
//     india: ["Monika Sogam", "Vikram", "Roshni", "Anjali", "Sara", "Sanjay", "Vijay"],
//     us: [
//       { label: "Burt", voiceId: "burt", provider: "11labs" },
//       { label: "Sarah", voiceId: "sarah", provider: "11labs" },
//       { label: "Mark", voiceId: "mark", provider: "11labs" },
//       { label: "Ryan", voiceId: "ryan", provider: "11labs" }
//     ]


//   };

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       voice: voiceOptions[market][0] || "",
//     }));
//   }, [market]);


//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         const res = await fetch('https://api.bolna.dev/v2/agent/all', {
//           headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
//         });
//         const data = await res.json();
//         setAgents(data);
//       } catch (err) {
//         console.error('Failed to fetch agents', err);
//       }
//     };
//     fetchAgents();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let res;
//       if (market === "india") {
//         const requestBody = {
//           agent_config: {
//             agent_name: formData.agentName,
//             agent_welcome_message: formData.welcomeMessage,
//             agent_type: "sales",
//             tasks: [
//               {
//                 task_type: "conversation",
//                 task_config: {
//                   ambient_noise: false,
//                   backchanneling: false,
//                   call_terminate: formData.callTerminate
//                 },
//                 toolchain: {
//                   execution: "sequential",
//                   pipelines: [["transcriber", "llm", "synthesizer"]]
//                 },
//                 tools_config: {
//                   input: { format: "audio", provider: "default" },
//                   llm_agent: {
//                     model: "gpt-4o",
//                     provider: "openai",
//                     temperature: 0.7,
//                     agent_flow_type: "streaming",
//                     agent_type: "simple_llm_agent",
//                     llm_config: { max_tokens: 1000 }
//                   },
//                   synthesizer: {
//                     provider: formData.voiceProvider,
//                     provider_config: {
//                       model: "eleven_turbo_v2_5",
//                       voice: formData.voice,
//                       voice_id: "7Q6qcYvsTRgb4IVcoAdK",
//                       temperature: 0.5,
//                       similarity_boost: 0.5
//                     }
//                   },
//                   transcriber: {
//                     provider: formData.transcriberProvider,
//                     task: "transcribe",
//                     model: formData.transcriberModel,
//                     stream: true,
//                     encoding: "linear16",
//                     language: formData.language || 'en'
//                   },
//                   api_tools: {
//                     tools: [
//                       {
//                         name: "transfer_call_support",
//                         key: "transfer_call",
//                         description: "Use this tool to transfer the call",
//                         pre_call_message: "Sure, I'll transfer the call for you. Please wait a moment...",
//                         parameters: {
//                           type: "object",
//                           properties: {
//                             call_sid: {
//                               type: "string",
//                               description: "unique call id"
//                             }
//                           },
//                           required: ["call_sid"]
//                         }
//                       }
//                     ],
//                     tools_params: {
//                       transfer_call_support: {
//                         param: JSON.stringify({
//                           call_transfer_number: formData.phoneNumber,
//                           call_sid: "{{call_sid}}"
//                         })
//                       }
//                     }
//                   }


//                 }
//               }
//             ]

//           },
//           agent_prompts: {
//             task_1: {
//               system_prompt: formData.systemPrompt
//             }
//           }
//         };

//         res = await fetch("https://api.bolna.dev/v2/agent", {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(requestBody)
//         });
//       } else {
//         const requestBody = {
//           name: formData.agentName,
//           firstMessage: formData.welcomeMessage,
//           voice: {
//             provider: formData.voice.provider,
//             voiceId: formData.voice.voiceId,
//             model: "eleven_turbo_v2_5",
//             stability: 0.5,
//             similarityBoost: 0.75
//           },
//           transcriber: {
//             model: "scribe_v1",
//             language: "en",
//             provider: "11labs"
//           }
//         };


//         res = await fetch("https://api.vapi.ai/assistant", {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(requestBody)
//         });
//       }

//       const data = await res.json();

//       if (!res.ok) {
//         const errorMessage = data?.detail || data?.message || "Failed to create agent.";
//         setAlert({ type: "error", message: `❌ ${errorMessage}`, visible: true });
//       } else {
//         setAlert({ type: "success", message: "✅ Agent created successfully!", visible: true });
//         if (data?.id) {
//           await fetch("/api/map/usernewagents", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ agentId: data.id }),
//           });
//         }
//       }



//     } catch (error) {
//       console.error("Error creating agent:", error);
//       setAlert({ type: "error", message: `Failed to create agent. Please check the console for more details.`, visible: true });
//     }

//     setLoading(false);
//   };


//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
//       <div className="flex space-x-2 mb-4">
//         <button
//           onClick={() => setMarket("india")}
//           className={`px-4 py-2 rounded ${market === "india" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//         >
//           For Indian Market
//         </button>
//         <button
//           onClick={() => setMarket("us")}
//           className={`px-4 py-2 rounded ${market === "us" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//         >
//           For US Market
//         </button>
//       </div>

//       <h2 className="text-xl font-bold mb-4">Create AI Agent ({market === "india" ? "Bolna" : "Vapi"})</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" name="agentName" placeholder="Agent Name" value={formData.agentName} onChange={handleChange} className="w-full p-2 border rounded" required />
//         <input type="text" name="welcomeMessage" placeholder="Welcome Message" value={formData.welcomeMessage} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input
//           type="text"
//           name="phoneNumber"
//           placeholder="Add number"
//           value={formData.phoneNumber || ""}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <select
//           name="language"
//           value={formData.language}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         >
//           <option value="en">English</option>
//           <option value="hi">Hindi</option>
//         </select>

//         <textarea name="systemPrompt" placeholder="System Prompt" value={formData.systemPrompt} onChange={handleChange} className="w-full p-2 border rounded"></textarea>

//         <select
//           name="voice"
//           value={formData.voice.voiceId}
//           onChange={(e) => {
//             const selected = voiceOptions[market].find(v => v.voiceId === e.target.value);
//             setFormData(prev => ({ ...prev, voice: selected }));
//           }}
//           className="w-full p-2 border rounded"
//         >
//           {voiceOptions[market].map(v => (
//             <option key={v.voiceId} value={v.voiceId}>{v.label}</option>
//           ))}
//         </select>


//         {/* <select name="callTerminate" value={formData.callTerminate} onChange={handleChange} className="w-full p-2 border rounded">
//           <option value="180">180 Seconds</option>
//           <option value="300">300 Seconds</option>
//           <option value="355">355 Seconds</option>
//           <option value="420">420 Seconds</option>
//         </select> */}

//         {market === "india" && (
//           <>
//             {/* <select name="voiceProvider" value={formData.voiceProvider} onChange={handleChange} className="w-full p-2 border rounded">
//               <option value="elevenlabs">11 Labs</option>
//               <option value="polly">Polly</option>
//             </select> */}
//           </>
//         )}

//         <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
//           {loading ? "Creating..." : "Create Agent"}
//         </button>
//       </form>
//       {alert.visible && (
//         <Alert
//           type={alert.type}
//           message={alert.message}
//           onClose={() => setAlert({ ...alert, visible: false })}
//         />
//       )}

//     </div>
//   );
// }


import { useState } from "react";
import Alert from "../ui/Alerts";

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    agentName: "",
    welcomeMessage: "Hello! Welcome to our AI Agent. How can I assist you today?",
    systemPrompt:
      "You are an AI agent helping customers with inquiries, pricing, and support. Keep responses clear, concise, and helpful.",
    voice: {
      label: "Burt",
      voiceId: "burt",
      provider: "11labs",
    },
    phoneNumber: "",
    language: "en",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  const voiceOptions = [
    { label: "Andrea", voiceId: "andrea-11labs", provider: "11labs" },
    { label: "Burt", voiceId: "burt-11labs", provider: "11labs" },
    { label: "Drew", voiceId: "drew-11labs", provider: "11labs" },
    { label: "Joseph", voiceId: "joseph-11labs", provider: "11labs" },
    { label: "Mark", voiceId: "mark-11labs", provider: "11labs" },
    { label: "Marissa", voiceId: "marissa-11labs", provider: "11labs" },
    { label: "Matilda", voiceId: "matilda-11labs", provider: "11labs" },
    { label: "MrB", voiceId: "mrb-11labs", provider: "11labs" },
    { label: "Myra", voiceId: "myra-11labs", provider: "11labs" },
    { label: "Paul", voiceId: "paul-11labs", provider: "11labs" },
    { label: "Paula", voiceId: "paula-11labs", provider: "11labs" },
    { label: "Phillip", voiceId: "phillip-11labs", provider: "11labs" },
    { label: "Ryan", voiceId: "ryan-11labs", provider: "11labs" },
    { label: "Sarah", voiceId: "sarah-11labs", provider: "11labs" },
    { label: "Steve", voiceId: "steve-11labs", provider: "11labs" }
  ];
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        name: formData.agentName,
        firstMessage: formData.welcomeMessage,
        voice: {
          provider: formData.voice.provider,
          voiceId: formData.voice.voiceId,
          model: "eleven_turbo_v2_5",
          stability: 0.5,
          similarityBoost: 0.75,
        },
        transcriber: {
          model: "scribe_v1",
          language: "en",
          provider: "11labs",
        },
      };

      const res = await fetch("https://api.vapi.ai/assistant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data?.detail || data?.message || "Failed to create agent.";
        setAlert({ type: "error", message: `❌ ${errorMessage}`, visible: true });
      } else {
        setAlert({ type: "success", message: "✅ Agent created successfully!", visible: true });

        if (data?.id) {
          await fetch("/api/map/usernewagents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ agentId: data.id }),
          });
        }
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      setAlert({
        type: "error",
        message: `Failed to create agent. Please check the console for more details.`,
        visible: true,
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create AI Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="agentName"
          placeholder="Assistant Name"
          value={formData.agentName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="welcomeMessage"
          placeholder="Welcome Message"
          value={formData.welcomeMessage}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {/* <input
          type="text"
          name="phoneNumber"
          placeholder="Add number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        /> */}
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
        <textarea
          name="systemPrompt"
          placeholder="Assistant Prompt"
          value={formData.systemPrompt}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        <select
          name="voice"
          value={formData.voice.voiceId}
          onChange={(e) => {
            const selected = voiceOptions.find((v) => v.voiceId === e.target.value);
            setFormData((prev) => ({ ...prev, voice: selected }));
          }}
          className="w-full p-2 border rounded"
        >
          {voiceOptions.map((v) => (
            <option key={v.voiceId} value={v.voiceId}>
              {v.label}
            </option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? "Creating..." : "Create Assistant"}
        </button>
      </form>

      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}
    </div>
  );
}
