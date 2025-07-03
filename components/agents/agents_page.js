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
