

// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => setRecognizing(true);
//       recognition.onend = () => setRecognizing(false);
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, []);

//   const sendMessage = async (message) => {
//     if (message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages([...messages, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await axios.post('/api/assistant', { message });
//       const botMessage = { sender: 'bot', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);

//       // Text-to-Speech
//       const utterance = new SpeechSynthesisUtterance(response.data.message);
//       utterance.lang = 'en-US';
//       window.speechSynthesis.speak(utterance);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     sendMessage(input);
//   };

//   const handleMicClick = () => {
//     if (recognizing) {
//       recognitionRef.current.stop();
//     } else {
//       recognitionRef.current.start();
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
//         <h1 className="text-xl font-bold">Chatbot Assistant</h1>
//         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//           Add New Assistant
//         </button>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-4 rounded-lg shadow-md max-w-md ${
//               msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-white self-start'
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white p-4 flex items-center shadow-md">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Assistant is replying...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
//           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" className="w-6 h-6" />
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import AddAssistantModal from '../components/AddAssistantModal';

// export default function Home() {
//   const [assistants, setAssistants] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchAssistants = async () => {
//       const response = await axios.get('/api/assistants');
//       setAssistants(response.data);
//     };
//     fetchAssistants();
//   }, []);

//   const handleSave = (newAssistant) => {
//     setAssistants((prev) => [...prev, newAssistant]);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
//         <h1 className="text-xl font-bold">Chatbot Assistant</h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Add New Assistant
//         </button>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {assistants.map((assistant) => (
//           <div key={assistant.id} className="p-4 bg-white rounded-lg shadow-md">
//             <h2 className="text-lg font-bold">{assistant.name}</h2>
//             <p>Model: {assistant.model}</p>
//             <p>File Search: {assistant.file_search ? 'Enabled' : 'Disabled'}</p>
//             <p>Code Interpreter: {assistant.code_interpreter ? 'Enabled' : 'Disabled'}</p>
//             <p>Temperature: {assistant.temperature}</p>
//             <p>Top P: {assistant.top_p}</p>
//             <p>Instructions: {assistant.instructions}</p>
//           </div>
//         ))}
//       </div>
//       {showModal && (
//         <AddAssistantModal onClose={() => setShowModal(false)} onSave={handleSave} />
//       )}
//     </div>
//   );
// }


// pages/api/chat.js
import pool from '../../lib/db';
import axios from 'axios';

export default async function handler(req, res) {
  const { message, assistantId } = req.body;

  console.log(`Received message: ${message}, assistantId: ${assistantId}`);

  if (!message || !assistantId) {
    console.log('Message or assistantId missing');
    return res.status(400).json({ error: 'Message and assistantId are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM assistants WHERE id = $1', [assistantId]);
    const assistant = result.rows[0];

    if (!assistant) {
      console.log('Assistant not found');
      return res.status(404).json({ error: 'Assistant not found' });
    }

    console.log(`Assistant found: ${JSON.stringify(assistant)}`);
    console.log('Sending request to OpenAI API');
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: assistant.instructions },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: assistant.temperature,
      top_p: assistant.top_p
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response from OpenAI API:', response.data);
    const botMessage = response.data.choices[0].message.content.trim();

    console.log(`Bot message: ${botMessage}`);

    // Save user and bot messages to the database
    await pool.query(
      'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
      [assistantId, 'user', message]
    );
    await pool.query(
      'INSERT INTO messages (assistant_id, sender, content) VALUES ($1, $2, $3)',
      [assistantId, 'assistant', botMessage]
    );

    res.status(200).json({ message: botMessage });
  } catch (error) {
    console.error('Error handling chat:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
