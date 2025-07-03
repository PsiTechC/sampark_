import React, { useState, useEffect } from "react";
import Alert from "../ui/Alerts";
import Loader from "../ui/Loader";


import {
  FaBrain,
  FaFileAlt,
  FaVolumeUp,
  FaPhone,
  FaChartLine,
  FaTrash
} from "react-icons/fa";

const tabs = [
  { id: "agent", label: "Agent", icon: <FaFileAlt /> },
  { id: "knowledge", label: "Knowledge Base", icon: <FaBrain /> },
  { id: "voice", label: "Voice", icon: <FaVolumeUp /> },
  { id: "analytics", label: "Tools", icon: <FaChartLine /> },
];


const vapiVoices = [
  {
    id: "andrea-11labs",
    name: "Andrea",
    description: "Warm, professional female voice with clear articulation"
  },
  {
    id: "pGYsZruQzo8cpdFVZyJc",
    name: "Smriti",
    description: "Clear and graceful female voice with a polite tone"
  },
  {
    id: "mCQMfsqGDT6IDkEKR20a",
    name: "Jeevan",
    description: "Confident and friendly male voice with a natural Indian accent"
  },
  {
    id: "MF4J4IDTRo0AxOO4dpFR",
    name: "Devi",
    description: "Soft-spoken female voice with a calm and warm delivery"
  },
  {
    id: "Hmz0MdhDqv9vPpSMfDkh",
    name: "Bobby",
    description: "Energetic and approachable male voice with a modern tone"
  },
  {
    id: "Z55vjGJIfg7PlYv2c1k6",
    name: "Daksh",
    description: "Authoritative yet friendly male voice with clear enunciation"
  },
  {
    id: "burt-11labs",
    name: "Burt",
    description: "Deep, authoritative male voice with rich tones"
  },
  {
    id: "drew-11labs",
    name: "Drew",
    description: "Friendly, conversational male voice with natural delivery"
  },
  {
    id: "joseph-11labs",
    name: "Joseph",
    description: "Smooth, confident male voice with professional tone"
  },
  {
    id: "mark-11labs",
    name: "Mark",
    description: "Clear, articulate male voice suitable for narration"
  },
  {
    id: "marissa-11labs",
    name: "Marissa",
    description: "Bright, engaging female voice with energetic delivery"
  },
  {
    id: "myra-11labs",
    name: "Myra",
    description: "Elegant, sophisticated female voice with refined delivery"
  },
  {
    id: "paul-11labs",
    name: "Paul",
    description: "Versatile, natural male voice perfect for various content"
  },
  {
    id: "paula-11labs",
    name: "Paula",
    description: "Friendly, approachable female voice with warm personality"
  },
  {
    id: "phillip-11labs",
    name: "Phillip",
    description: "Distinguished, mature male voice with authoritative presence"
  },
  {
    id: "ryan-11labs",
    name: "Ryan",
    description: "Youthful, energetic male voice with modern appeal"
  },
  {
    id: "sarah-11labs",
    name: "Sarah",
    description: "Clear, professional female voice with neutral accent"
  },
  {
    id: "steve-11labs",
    name: "Steve",
    description: "Reliable, trustworthy male voice with steady delivery"
  }
];

const SAMPLE_TEXTS = {
  "andrea-11labs": "Hi, I'm Andrea, a warm and professional voice with clear articulation.",
  "burt-11labs": "Hello, I'm Burt. My deep and authoritative tone makes every word count.",
  "drew-11labs": "Hi there! I'm Drew, a friendly and conversational voice for any message.",
  "joseph-11labs": "Greetings, I'm Joseph. Confident, smooth, and always on point.",
  "mark-11labs": "Hi, I'm Mark. Clear and articulate — perfect for storytelling and narration.",
  "marissa-11labs": "Hey! I'm Marissa, bright and full of energy. Let's make your content pop.",
  "myra-11labs": "Good day, I'm Myra. Sophisticated, elegant, and refined for high-class delivery.",
  "paul-11labs": "Hey, I’m Paul. Versatile and natural — I fit into all kinds of content.",
  "paula-11labs": "Hi, I’m Paula. Friendly and approachable — perfect for welcoming messages.",
  "phillip-11labs": "Hello, I'm Phillip. Mature and distinguished, with a voice that commands respect.",
  "ryan-11labs": "What's up? I'm Ryan — young, energetic, and ready to go!",
  "sarah-11labs": "Hi, I'm Sarah. Clear, neutral, and perfect for professional communication.",
  "steve-11labs": "Hello, I'm Steve. Trustworthy, reliable, and steady — your go-to voice for calm delivery.",

  "pGYsZruQzo8cpdFVZyJc": "Namaste, I'm Smriti — clear and graceful, here to assist you.",
  "mCQMfsqGDT6IDkEKR20a": "Hello, I'm Jeevan. Confident, friendly, and naturally Indian in tone.",
  "MF4J4IDTRo0AxOO4dpFR": "Hi, I'm Devi. Calm and comforting, ready to guide you through.",
  "Hmz0MdhDqv9vPpSMfDkh": "Hey there! I'm Bobby — energetic, modern, and always approachable.",
  "Z55vjGJIfg7PlYv2c1k6": "Hello, I’m Daksh. Clear, assertive, and ready to lead the conversation."
};



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

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Default export for ManageAgent component
export default function ManageAgent({ agent, fetchAgents, agentId, isVapiAssistant }) {
  const [activeTab, setActiveTab] = useState("agent");
  const [loading, setLoading] = useState(false);

  // State for Agent tab
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Loading..."
  );
  const [agentPrompt, setAgentPrompt] = useState(
    "Loading..."
  );

  const [maxTokens, setMaxTokens] = useState(1000);
  const [temperature, setTemperature] = useState(0.1);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [pdfStatusMessage, setPdfStatusMessage] = useState("Checking for uploaded PDF...");
  const [existingPdfUrl, setExistingPdfUrl] = useState([]);


  const [selectedFiles, setSelectedFiles] = useState([]);

  const [transcriber, setTranscriber] = useState("Deepgram");
  const [transcriberModel, setTranscriberModel] = useState("nova-2");
  const [keywords, setKeywords] = useState("Bruce:100");
  const [interruptWords, setInterruptWords] = useState(1);
  const [model, setModel] = useState("gpt-4o");
  const [callTerminate, setCallTerminate] = useState(90);
  const [hangupAfterSilence, setHangupAfterSilence] = useState(10);
  const [voice, setVoice] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState({});

  const [agentPromptCore, setAgentPromptCore] = useState("");
  const [agentPromptKB, setAgentPromptKB] = useState("");


  const [selectedDepartment, setSelectedDepartment] = useState("sales");
  const [customDescription, setCustomDescription] = useState(""); // Store custom description

  const [descriptionSaved, setDescriptionSaved] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [existingMeetLink, setExistingMeetLink] = useState(null);



  const playPreview = async (voiceId) => {
    const text = SAMPLE_TEXTS[voiceId] || "Hi, I’m a sample voice from ElevenLabs.";
    try {
      const audio = new Audio(`/api/voices/voice-preview?voiceId=${voiceId}&text=${encodeURIComponent(text)}`);
      await audio.play();
    } catch (err) {
      console.error("❌ Error playing voice preview:", err);
      setAlert({
        type: "error",
        message: "❌ Failed to play preview: " + err.message,
        visible: true,
      });
    }
  };


  const handleKnowledgeBase = async () => {
    setLoading(true);
    if (!selectedFiles.length) {
      setAlert({ type: "warning", message: "⚠️ Please select at least one file.", visible: true });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(`${BASE_URL}/api/Knowledgebase/uploadKnowledgebase`, {
        method: "POST",
        body: formData,
      });

      // Ensure the response is handled correctly
      if (!res.ok) {
        const data = await res.json();
        setAlert({ type: "error", message: "❌ Upload failed: " + data.message, visible: true });
        return;
      }

      // If successful, process the response data
      const data = await res.json();

      // Assuming the 'preview' contains the extracted text
      if (data.preview) {
        setAgentPromptKB(data.preview); // Fill the Knowledge Base (auto-fill) input with the extracted text
      }

      setAlert({ type: "success", message: "✅ Files uploaded and processed successfully!", visible: true });
    } catch (err) {
      console.error("❌ Failed to upload and process files:", err);
      setAlert({ type: "error", message: "❌ Upload failed: " + err.message, visible: true });
    }

    setLoading(false);
  };


  const fetchExistingPdf = async () => {
    try {
      const res = await fetch(`${BASE_URL}//api/clients/ispdfupload?agentId=${agentId}`);
      const data = await res.json();

      if (res.ok && data.files) {
        setExistingPdfUrl(data.files);
        setPdfStatusMessage("✅ File already uploaded:");
      } else {
        setExistingPdfUrl(null);
        setPdfStatusMessage("❌ No file uploaded for this agent. Please upload.");
      }
    } catch (err) {
      console.error("❌ Failed to fetch existing File:", err);
      setPdfStatusMessage("❌ Failed to check File upload.");
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchExistingPdf();
    }
  }, [agentId]);


  const handleSaveAgent = async () => {
    if (!agentId) {
      setAlert({ type: "error", message: "Agent ID is missing.", visible: true });
      return;
    }

    setLoading(true);

    // 🔁 VAPI UPDATE LOGIC
    const fullPrompt = `${agentPromptCore}\n\n${agentPromptKB}`;
    const payload = {
      firstMessage: welcomeMessage,
      model: {
        provider: "openai", // or whatever model provider you use
        model: "gpt-4o",     // you can also use agentPrompt's model if dynamic
        temperature: 0.7,    // or pull from state if needed
        messages: [
          {
            role: "system",
            content: fullPrompt,
          },
        ],
      },
    };

    try {
      const res = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Failed to update assistant:", data);
        setAlert({ type: "error", message: "❌ Failed to update assistant. " + (data.message || JSON.stringify(data)), visible: true });

        return;
      }

      setAlert({ type: "success", message: "✅ Assistant updated successfully!", visible: true });

    } catch (err) {
      console.error("❌ Error updating assistant:", err);
      setAlert({ type: "error", message: "❌ An error occurred while saving the assistant. " + (err.message || JSON.stringify(err)), visible: true });
    } finally {
      setLoading(false);  // Hide loader once operation is complete
    }
  };

  const handleVoiceSave = async () => {
    setLoading(true);
    const endpoint = `https://api.vapi.ai/assistant/${agentId}`;

    const payload = {
      voice: {
        provider: "11labs",
        voiceId: voice,
        model: "eleven_turbo_v2_5",
        stability: 0.5,
        similarityBoost: 0.75,
      },
    };

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update voice");
      setAlert({ type: "success", message: "✅ Voice updated successfully!", visible: true });
    } catch (err) {
      setAlert({ type: "error", message: "❌ Error updating voice: " + err.message, visible: true });
    } finally {
      setLoading(false); // Hide the loader once the operation is complete
    }
  };


  const handleFileUpload = async () => {
    // Show loader when the process starts
    setLoading(true);

    if (!selectedFiles.length) {
      setAlert({ type: "warning", message: "⚠️ Please select at least one file.", visible: true });
      setLoading(false); // Hide loader if no files are selected
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      // Perform the file upload request
      const res = await fetch(`${BASE_URL}/api/clients/pdfupload?agentId=${agentId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // Handle successful upload
        setExistingPdfUrl((prev) => {
          const combined = [...(Array.isArray(prev) ? prev : []), ...data.files];

          // Remove duplicates based on URL
          const uniqueMap = new Map();
          for (const file of combined) {
            uniqueMap.set(file.url, file); // Last occurrence wins
          }

          return Array.from(uniqueMap.values());
        });

        setAlert({ type: "success", message: "✅ Files uploaded successfully!", visible: true });
      } else {
        // Handle error during the upload process
        setAlert({ type: "error", message: "❌ Upload failed: " + data.message, visible: true });
      }
    } catch (error) {
      // Handle any unexpected errors
      setAlert({ type: "error", message: "❌ An error occurred: " + error.message, visible: true });
    } finally {
      // Hide loader once the operation is complete (success or error)
      setLoading(false);
    }
  };


  const handleSaveCustomDescription = () => {
    if (!customDescription.trim()) {
      setAlert({ type: "error", message: "❌ Custom description cannot be empty.", visible: true });
      return;
    }
    setDescriptionSaved(true);
    // Now, save the custom description and continue with the process (you can call handleSavePhoneTool after saving)
    setAlert({ type: "success", message: "✅ Custom description saved! You can now save the number.", visible: true });
  };

  const handleDeletePDF = async (file) => {
    setLoading(true);
    setAlert({
      visible: true,
      type: "confirm",
      message: `Are you sure you want to delete "${file.name}"?`,
      isConfirm: true,
      onConfirm: async () => {
        setAlert(prev => ({ ...prev, visible: false }));

        try {
          const res = await fetch(
            `${BASE_URL}/api/clients/ispdfupload?agentId=${agentId}&fileName=${encodeURIComponent(file.name)}`,
            { method: "DELETE" }
          );

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to delete file");

          setExistingPdfUrl(prev => (Array.isArray(prev) ? prev.filter(f => f.name !== file.name) : []));


          setAlert({
            type: "success",
            message: "✅ File deleted successfully.",
            visible: true,
          });
        } catch (err) {
          setAlert({
            type: "error",
            message: "❌ Failed to delete file: " + err.message,
            visible: true,
          });
        }
        finally {
          setLoading(false);  // Set loading to false once the operation is complete
        }
      },
      onCancel: () => {
        setAlert(prev => ({ ...prev, visible: false }));
        setLoading(false);  // Set loading to false if the operation is canceled
      },
    });
  };



  const handleSavePhoneTool = async (isDelete = false, toolKey = null) => {
    setLoading(true);

    if (!agentId) {
      setAlert({
        type: "error",
        message: "❌ Agent ID is missing.",
        visible: true,
      });
      setLoading(false);
      return;
    }

    const fullNumber = `${countryCode}${phoneNumber}`;
    const departmentDescription =
      selectedDepartment === "custom" && customDescription.trim()
        ? customDescription
        : `Use this tool to transfer the call. Detect if the user wants to speak to the ${selectedDepartment} department. If they say anything like "Can I talk to a human from ${selectedDepartment}?", "I need help from ${selectedDepartment}", "Connect me to ${selectedDepartment}", or similar, trigger the call transfer.`;

    if (isVapiAssistant) {
      if (!phoneNumber) {
        setAlert({
          type: "error",
          message: "❌ Phone number is required.",
          visible: true,
        });
        setLoading(false);
        return;
      }

      if (selectedDepartment === "custom" && !customDescription.trim()) {
        setAlert({
          type: "error",
          message: "❌ Custom description cannot be empty.",
          visible: true,
        });
        setLoading(false);
        return;
      }

      const vapiToken = process.env.NEXT_PUBLIC_API_TOKEN_VAPI;

      try {
        // Step 1: Create the tool
        const toolRes = await fetch("https://api.vapi.ai/tool", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${vapiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "transferCall",
            destinations: [
              {
                type: "number",
                number: fullNumber,
                description: departmentDescription,
                message: "Sure, I'll transfer the call for you. Please wait a moment...",
              },
            ],
          }),
        });

        const toolData = await toolRes.json();
        if (!toolRes.ok) throw new Error(toolData.message || "Failed to create transferCall tool.");

        const newToolId = toolData.id;

        // Step 2: Fetch current assistant config
        const assistantRes = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
          headers: {
            Authorization: `Bearer ${vapiToken}`,
          },
        });
        const assistant = await assistantRes.json();
        if (!assistantRes.ok) throw new Error("Failed to fetch assistant config");

        // Step 3: Append toolId to existing toolIds (if any)
        const existingToolIds = assistant?.model?.toolIds || [];
        const updatedToolIds = [...new Set([...existingToolIds, newToolId])];

        // Step 4: PATCH the assistant with updated toolIds
        const updateRes = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${vapiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: {
              ...assistant.model,
              toolIds: updatedToolIds,
            },
          }),
        });

        const updateData = await updateRes.json();
        if (!updateRes.ok) throw new Error(updateData.message || "Failed to update assistant with new toolId");

        const newTool = {
          id: newToolId,
          number: fullNumber,
          description: departmentDescription,
        };

        setAdditionalDetails((prevState) => ({
          ...prevState,
          vapiTransferTools: [
            ...(Array.isArray(prevState.vapiTransferTools) ? prevState.vapiTransferTools : []),
            newTool
          ], // Add the new tool to the list
        }));

        setAlert({
          type: "success",
          message: "✅ Number added successfully!",
          visible: true,
        });
      } catch (err) {
        console.error("❌ Error setting up transfer tool:", err);
        setAlert({
          type: "error",
          message: "❌ Failed to create tool or update assistant: " + err.message,
          visible: true,
        });
      }
      finally {
        setLoading(false); // Stop loading after process is complete
      }

      return; // Skip Bolna flow
    }


    setLoading(false);
  };


  const handleDeleteMeetLink = () => {
    setLoading(true);
    setAlert({
      type: "confirm",
      message: "Are you sure you want to delete the meet link?",
      isConfirm: true,
      visible: true,
      onConfirm: async () => {
        setAlert(prev => ({ ...prev, visible: false }));
        try {
          const res = await fetch(`${BASE_URL}/api/clients/uploadmeetlink?assistantId=${agentId}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to delete meet link");
          setExistingMeetLink(null);
          setAlert({ type: "success", message: "✅ Meet link deleted successfully.", visible: true });
        } catch (err) {
          console.error("❌ Error deleting meet link:", err);
          setAlert({ type: "error", message: "❌ Failed to delete meet link: " + err.message, visible: true });
        }
        finally {
          setLoading(false);  // Set loading to false once the operation is complete
        }
      },
      onCancel: () => {
        setAlert(prev => ({ ...prev, visible: false }));
        setLoading(false);  // Set loading to false if the operation is canceled
      },
    });
  };


  const handleUploadMeetLink = async () => {
    if (!agentId || !meetLink.trim()) {
      setAlert({
        type: "error",
        message: "❌ Assistant ID and Meet link are required.",
        visible: true,
      });
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/clients/uploadmeetlink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assistantId: agentId, meetLink }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to upload meet link");

      setAlert({
        type: "success",
        message: "✅ Meet link uploaded successfully!",
        visible: true,
      });

      setMeetLink(""); // Clear the input field
      setExistingMeetLink(meetLink); // ✅ Immediately reflect saved link
    } catch (err) {
      console.error("❌ Error uploading meet link:", err);
      setAlert({
        type: "error",
        message: "❌ Failed to upload meet link: " + err.message,
        visible: true,
      });
    }
    finally {
      setLoading(false);  // Hide the loader once the operation is complete
    }
  };


  useEffect(() => {
    const fetchMeetLink = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/clients/uploadmeetlink?assistantId=${agentId}`);
        const data = await res.json();
        if (res.ok && data.meetLink) {
          setExistingMeetLink(data.meetLink);
        }
      } catch (err) {
        console.error("❌ Failed to fetch meet link:", err);
      }
    };
    if (agentId) fetchMeetLink();
  }, [agentId]);




  useEffect(() => {
    if (!agentId) return;

    const fetchAgentDetails = async () => {
      try {
        if (isVapiAssistant) {
          // Vapi Assistant logic
          const res = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          console.log("Fetched assistant details:", data);

          if (data) {
            setWelcomeMessage(data.firstMessage || "");
            const systemPrompt = data.model?.messages?.find(m => m.role === "system")?.content || "";
            setAgentPromptCore(systemPrompt);

            setModel(data.model?.model || "gpt-4o");
            setTemperature(data.model?.temperature || 0.3);
            setMaxTokens(data.model?.max_tokens || 1000);

            setCallTerminate(data.call_terminate || 90);
            setHangupAfterSilence(data.hangup_after_silence || 10);

            setVoice(data.voice?.voiceId || "");

            // ✅ Fetch associated tool numbers from toolIds
            const fetchToolNumbers = async (toolIds = []) => {
              const tools = [];

              for (const id of toolIds) {
                try {
                  const toolRes = await fetch(`https://api.vapi.ai/tool/${id}`, {
                    headers: {
                      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
                    },
                  });
                  if (!toolRes.ok) continue;
                  const tool = await toolRes.json();
                  if (tool?.destinations?.length > 0) {
                    tools.push({
                      id: tool.id,
                      number: tool.destinations[0].number,
                      description: tool.destinations[0].description,
                    });
                  }
                } catch (err) {
                  console.error("❌ Failed to fetch tool details:", err);
                }
              }

              setAdditionalDetails(prev => ({
                ...prev,
                vapiTransferTools: tools,
              }));
            };

            // Store other Vapi fields as needed
            setAdditionalDetails(prev => ({
              ...prev,
              voicemailMessage: data.voicemailMessage,
              endCallMessage: data.endCallMessage,
              modelProvider: data.model?.provider,
              toolIds: data.model?.toolIds,
              clientMessages: data.clientMessages,
              serverMessages: data.serverMessages,
              endCallPhrases: data.endCallPhrases,
              transcriber: data.transcriber,
              hipaaEnabled: data.hipaaEnabled,
              backchannelingEnabled: data.backchannelingEnabled,
              backgroundDenoisingEnabled: data.backgroundDenoisingEnabled,
              startSpeakingPlan: data.startSpeakingPlan,
              isServerUrlSecretSet: data.isServerUrlSecretSet,
            }));

            if (data.model?.toolIds?.length > 0) {
              await fetchToolNumbers(data.model.toolIds);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching detailed agent/assistant info:", err);
      }
    };

    fetchAgentDetails();
  }, [agentId, isVapiAssistant]);



  const handleDeleteVapiTool = async (toolId) => {
    if (!toolId || !agentId) return;
    setLoading(true);

    const vapiToken = process.env.NEXT_PUBLIC_API_TOKEN_VAPI;

    try {
      // Step 1: Fetch current assistant config
      const assistantRes = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
        headers: {
          Authorization: `Bearer ${vapiToken}`,
        },
      });
      const assistant = await assistantRes.json();
      if (!assistantRes.ok) throw new Error("Failed to fetch assistant config");

      // Step 2: Remove toolId from toolIds
      const updatedToolIds = (assistant?.model?.toolIds || []).filter(id => id !== toolId);

      // Step 3: Update assistant without the removed toolId
      const updateRes = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${vapiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: {
            ...assistant.model,
            toolIds: updatedToolIds,
          },
        }),
      });

      if (!updateRes.ok) throw new Error("Failed to update assistant without toolId");

      // Step 4: Delete the tool itself
      const deleteRes = await fetch(`https://api.vapi.ai/tool/${toolId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${vapiToken}`,
        },
      });

      if (!deleteRes.ok) throw new Error("Failed to delete the tool");

      // Step 5: Refresh UI
      setAdditionalDetails(prev => ({
        ...prev,
        vapiTransferTools: prev.vapiTransferTools.filter(tool => tool.id !== toolId),
      }));

      setAlert({ type: "success", message: "✅ Tool deleted successfully!", visible: true });
    } catch (err) {
      console.error("❌ Failed to delete tool:", err);
      setAlert({
        type: "error",
        message: "❌ Failed to delete tool: " + err.message,
        visible: true,
      });
    }
    finally {
      setLoading(false); // Hide the loader once the operation is complete (success or error)
    }
  };




  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      )}

      {!loading && (
        <>
          <div className="flex  justify-evenly items-center space-x-2 border-b border-gray-200 mb-4">
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
                  rows={6}
                  value={agentPromptCore}
                  onChange={(e) => setAgentPromptCore(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Knowledge Base (Auto-filled)
                </label>
                <textarea
                  className="w-full border p-2 rounded mt-1 text-sm focus:ring focus:ring-blue-200"
                  rows={6}
                  value={agentPromptKB}
                  onChange={(e) => setAgentPromptKB(e.target.value)}
                />
              </div>
              <div className="flex items-start mt-2 bg-gray-50 border border-blue-100 rounded p-3">
                <span className="text-blue-500 font-semibold text-sm mr-2">i</span>
                <p className="text-sm text-gray-600">
                  You can upload files from the <span className="font-medium text-gray-800">Knowledge Base</span> tab to automatically enhance your agent’s context and understanding.
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
                  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;

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
          {activeTab === "knowledge" && (
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
                onClick={handleKnowledgeBase}
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded text-sm shadow"
              >
                Upload Knowledge base
              </button>

              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, Word (.doc/.docx), or Text (.txt)
              </p>
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
            <div className="bg-white p-4 rounded-b-md shadow space-y-4">
              <h2 className="text-lg font-bold mb-2">Voice</h2>

              <label className="block text-sm font-medium text-gray-700 mb-1">Select Voice</label>
              <select
                className="w-full border p-2 rounded text-sm"
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
              >
                <option value="">Select Voice</option>
                {(isVapiAssistant ? vapiVoices : bolnaVoices).map((v) => {
                  if (isVapiAssistant) {
                    return (
                      <option key={v.id} value={v.id}>
                        {v.name} - {v.description}
                      </option>
                    );
                  } else {
                    const display = v;
                    return (
                      <option key={v} value={v}>
                        {display.charAt(0).toUpperCase() + display.slice(1)}
                      </option>
                    );
                  }
                })}
              </select>

              {/* Play Sample Preview */}
              {isVapiAssistant && voice && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => playPreview(voice)}
                    className="bg-gray-100 px-3 py-1 rounded text-sm border"
                  >
                    ▶️ Play Preview
                  </button>
                  <span className="text-sm text-gray-500">
                    {vapiVoices.find((v) => v.id === voice)?.name}
                  </span>
                </div>
              )}

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                onClick={handleVoiceSave}
              >
                Save Voice
              </button>
            </div>
          )}


          {activeTab === "call" && (
            <div className="bg-white p-4 rounded-b-md shadow">
              <h2 className="text-lg font-bold mb-2">Call</h2>
              <p className="text-sm text-gray-600">Call settings coming soon...</p>
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="bg-white p-4 rounded-b-md shadow space-y-8">

              {/* Call Transfer Tool */}
              <div>
                <h2 className="text-xl font-bold border-b pb-1 mb-4">Call Transfer Tool</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Transfers calls to the configured number when a user asks to speak with a human or a specific department such as Sales, Technical, or a custom team.
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                  {/* Country Code */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Country Code</label>
                    <select
                      className="w-full border p-2 rounded text-sm"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+91">+91 (India)</option>
                      <option value="+1">+1 (US)</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded text-sm"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter number without country code"
                    />
                  </div>

                  {/* Department Dropdown */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Select Department</label>
                    <select
                      className="w-full border p-2 rounded text-sm"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <option value="sales">Sales</option>
                      <option value="technical">Technical</option>
                      <option value="support">Support</option>
                      <option value="custom">Add Custom Department</option>
                    </select>
                  </div>
                </div>

                {/* Custom Description */}
                {selectedDepartment === "custom" && !descriptionSaved && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Description</label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded text-sm"
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Enter custom description"
                    />
                    <button
                      onClick={handleSaveCustomDescription}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-2"
                    >
                      Save Description
                    </button>
                  </div>
                )}

                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-4 mb-6"
                  onClick={handleSavePhoneTool}
                >
                  Save Number
                </button>

                {/* Existing Tools */}
                {isVapiAssistant && additionalDetails?.vapiTransferTools?.length > 0 && (
                  additionalDetails.vapiTransferTools.map((tool) => (
                    <p key={tool.id} className="flex items-center text-sm text-gray-700 mt-1">
                      <strong className="mr-1">Transfer call for:</strong>
                      <span className="text-gray-900 font-medium mr-2">{tool.number}</span>
                      <button
                        onClick={() => handleDeleteVapiTool(tool.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </p>
                  ))
                )}

                {Object.entries(agent?.tasks?.[0]?.tools_config?.api_tools?.tools_params || {}).map(
                  ([key, config]) => {
                    const num = config?.param?.call_transfer_number;
                    return (
                      num && (
                        <p key={key} className="flex items-center text-sm text-gray-700 mt-1">
                          <strong className="mr-1">Transfer call for:</strong>
                          <span className="text-gray-900 font-medium mr-2">{num}</span>
                          <button
                            onClick={() => handleSavePhoneTool(true, key)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </p>
                      )
                    );
                  }
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold border-b pb-1 mb-4">Upload Files</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Automatically sends the uploaded PDF and Meet link when a user requests a brochure or books an appointment, and adds the link to your connected calendar.
                </p>

                {existingPdfUrl?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Uploaded Files:</p>
                    <ul className="space-y-2 text-sm">
                      {existingPdfUrl.map((file, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            📄 {file.name || file.url.split("/").pop().replace(/^[^_]+_/, "")}
                          </a>
                          {file.uploadedAt && (
                            <span className="text-gray-400 text-xs">
                              ({new Date(file.uploadedAt).toLocaleString()})
                            </span>
                          )}
                          <button
                            onClick={() => handleDeletePDF(file)}
                            className="text-red-600 hover:underline ml-2"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files?.length) {
                      setSelectedFiles(Array.from(files));
                    }
                  }}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer p-2"
                />

                <button
                  onClick={handleFileUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-2"
                >
                  Upload Selected Files
                </button>
              </div>

              {/* Google Meet Link Section */}
              <div>
                <h2 className="text-xl font-bold border-b pb-1 mb-4">Google Meet Link</h2>

                {existingMeetLink ? (
                  <div className="flex items-center gap-3 text-sm mb-2">
                    <a
                      href={existingMeetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {existingMeetLink}
                    </a>
                    <button
                      onClick={handleDeleteMeetLink}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full border p-2 rounded text-sm"
                    />
                    <button
                      onClick={handleUploadMeetLink}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Save Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </>
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