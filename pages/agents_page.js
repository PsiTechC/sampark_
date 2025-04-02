import { useState } from "react";

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    agentName: "",
    businessName: "",
    aboutProduct: "",
    aboutBusiness: "",
    welcomeMessage: "Hello! Welcome to our AI Agent. How can I assist you today?",
    aiModel: "gpt-4o-mini",
    voice: "Vikram",
    agentType: "sales",
    systemPrompt: "You are an AI agent helping customers with inquiries, pricing, and support. Keep responses clear, concise, and helpful.",
    callTerminate: 300,
    transcriberProvider: "deepgram",
    transcriberModel: "nova-2"
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestBody = {
      agent_config: {
        agent_name: formData.agentName,
        agent_welcome_message: formData.welcomeMessage,
        agent_type: formData.agentType,
        tasks: [
          {
            task_type: "conversation",
            task_config: { ambient_noise: false, backchanneling: false, call_terminate: formData.callTerminate },
            toolchain: { execution: "sequential", pipelines: [["transcriber", "llm", "synthesizer"]] },
            tools_config: {
              input: { format: "audio", provider: "default" },
              llm_agent: {
                model: formData.aiModel,
                provider: "openai",
                temperature: 0.7,
                agent_flow_type: "streaming",
                agent_type: "simple_llm_agent",
                llm_config: { max_tokens: 1000 },
              },
              synthesizer: {
                provider: "elevenlabs",
                provider_config: {
                  model: "eleven_turbo_v2_5",
                  voice: formData.voice,
                  voice_id: "7Q6qcYvsTRgb4IVcoAdK",
                  temperature: 0.5,
                  similarity_boost: 0.5,
                },
              },
              transcriber: {
                provider: formData.transcriberProvider,
                task: "transcribe",
                model: formData.transcriberModel,
                stream: true,
                encoding: "linear16",
                language: "en",
              },
            },
          },
        ],
      },
      agent_prompts: {
        task_1: {
          system_prompt: formData.systemPrompt,
        },
      },
    };

    try {
      const res = await fetch("https://api.bolna.dev/v2/agent", {
        method: "POST",
        headers: {
          "Authorization": "Bearer bn-b142c4a604bb40479de01dbd9ca769b0",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error creating agent:", error);
      setResponse({ error: "Failed to create agent" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create AI Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="agentName" placeholder="Agent Name" value={formData.agentName} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="aboutProduct" placeholder="About Product" value={formData.aboutProduct} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="aboutBusiness" placeholder="About Business" value={formData.aboutBusiness} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="welcomeMessage" placeholder="Welcome Message" value={formData.welcomeMessage} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="systemPrompt" placeholder="System Prompt" value={formData.systemPrompt} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
        <select name="aiModel" value={formData.aiModel} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="gpt-3.5-turbo-1106">GPT-3.5 Turbo</option>
          <option value="groq/gemma-7b-it">Gemma-7B-IT (Groq)</option>
          <option value="deepinfra/cognitivecomputations/dolphin-2.6-mixtral-8x7b">Dolphin 2.6 Mixtral (DeepInfra)</option>
        </select>
        <select name="voice" value={formData.voice} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Vikram">Vikram</option>
          <option value="Roshni">Roshni</option>
          <option value="Matthew">Matthew (Polly)</option>
        </select>
        <select name="callTerminate" value={formData.callTerminate} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="180">180 Seconds</option>
          <option value="300">300 Seconds</option>
          <option value="355">355 Seconds</option>
          <option value="420">420 Seconds</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? "Creating..." : "Create Agent"}
        </button>
      </form>
      {response && <p className="mt-4 text-sm text-gray-700">{JSON.stringify(response)}</p>}
    </div>
  );
}
