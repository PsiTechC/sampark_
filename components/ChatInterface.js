
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [speaking, setSpeaking] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const utteranceRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = (message) => {
//     if (speaking) {
//       console.log('Pausing speech synthesis');
//       window.speechSynthesis.pause();
//       setPaused(true);
//     } else if (paused) {
//       console.log('Resuming speech synthesis');
//       window.speechSynthesis.resume();
//       setPaused(false);
//     } else {
//       console.log('Starting speech synthesis');
//       const utterance = new SpeechSynthesisUtterance(message);
//       utterance.lang = 'en-US';
//       utterance.onend = () => setSpeaking(false);
//       window.speechSynthesis.speak(utterance);
//       setSpeaking(true);
//       utteranceRef.current = utterance;
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-md max-w-xs ${
//               msg.sender === 'user' ? 'bg-blue-600 text-white self-end text-right ml-auto' : ' text-black self-start text-left mr-auto'
//             }`}
//           >
//             <div>
//               <span>{msg.content}</span>
//               <span className="text-xs text-gray-500 ml-2">{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="ml-2 text-blue-500 hover:text-blue-700"
//               >
//                 🔊
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white text-black p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
//           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import styles from '../styles/chat.module.css'; // Import the CSS module

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [speaking, setSpeaking] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const utteranceRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = (message) => {
//     if (speaking) {
//       console.log('Pausing speech synthesis');
//       window.speechSynthesis.pause();
//       setPaused(true);
//     } else if (paused) {
//       console.log('Resuming speech synthesis');
//       window.speechSynthesis.resume();
//       setPaused(false);
//     } else {
//       console.log('Starting speech synthesis');
//       const utterance = new SpeechSynthesisUtterance(message);
//       utterance.lang = 'en-US';
//       utterance.onend = () => setSpeaking(false);
//       window.speechSynthesis.speak(utterance);
//       setSpeaking(true);
//       utteranceRef.current = utterance;
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-md max-w-xs ${
//               msg.sender === 'user' ? 'bg-blue-600 text-white self-end text-right ml-auto' : ' text-black self-start text-left mr-auto'
//             }`}
//           >
//             <div>
//               <span>{msg.content}</span>
//               <span className="text-xs text-gray-500 ml-2">{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="ml-2 text-blue-500 hover:text-blue-700"
//               >
//                 🔊
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white text-black p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
//           {recognizing ? (
//             <div className={styles.load}>
//               <div className={styles.progress}></div>
//               <div className={styles.progress}></div>
//               <div className={styles.progress}></div>
//             </div>
//           ) : (
//             <img src="/mic.png" alt="Mic" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [speaking, setSpeaking] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const utteranceRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);

//       // Start speaking the assistant's response
//       handleReadAloud(response.data.message);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = (message) => {
//     if (speaking) {
//       console.log('Pausing speech synthesis');
//       window.speechSynthesis.pause();
//       setPaused(true);
//     } else if (paused) {
//       console.log('Resuming speech synthesis');
//       window.speechSynthesis.resume();
//       setPaused(false);
//     } else {
//       console.log('Creating new SpeechSynthesisUtterance');
//       const utterance = new SpeechSynthesisUtterance(message);
//       utterance.lang = 'en-US';
//       utterance.onstart = () => {
//         console.log('Speech synthesis started');
//         setSpeaking(true);
//       };
//       utterance.onend = () => {
//         console.log('Speech synthesis ended');
//         setSpeaking(false);
//         setPaused(false);
//       };
//       utterance.onerror = (event) => {
//         console.error('Speech synthesis error', event);
//         setSpeaking(false);
//         setPaused(false);
//       };
//       console.log('Speaking:', utterance.text);
//       window.speechSynthesis.speak(utterance);
//       utteranceRef.current = utterance;
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-md max-w-xs ${
//               msg.sender === 'user' ? 'bg-blue-600 text-white self-end text-right ml-auto' : ' text-black self-start text-left mr-auto'
//             }`}
//           >
//             <div>
//               <span>{msg.content}</span>
//               <span className="text-xs text-gray-500 ml-2">{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="ml-2 text-blue-500 hover:text-blue-700"
//               >
//                 🔊
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white text-black p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
//           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [speaking, setSpeaking] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const utteranceRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);

//       // Start speaking the assistant's response
//       handleReadAloud(response.data.message);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = (message) => {
//     if (speaking) {
//       console.log('Pausing speech synthesis');
//       window.speechSynthesis.pause();
//       setPaused(true);
//     } else if (paused) {
//       console.log('Resuming speech synthesis');
//       window.speechSynthesis.resume();
//       setPaused(false);
//     } else {
//       console.log('Creating new SpeechSynthesisUtterance');
//       const utterance = new SpeechSynthesisUtterance(message);
//       utterance.lang = 'en-US';
//       utterance.onstart = () => {
//         console.log('Speech synthesis started');
//         setSpeaking(true);
//       };
//       utterance.onend = () => {
//         console.log('Speech synthesis ended');
//         setSpeaking(false);
//         setPaused(false);
//       };
//       utterance.onerror = (event) => {
//         console.error('Speech synthesis error', event);
//         setSpeaking(false);
//         setPaused(false);
//       };
//       console.log('Speaking:', utterance.text);
//       window.speechSynthesis.speak(utterance);
//       utteranceRef.current = utterance;
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-md max-w-xs ${
//               msg.sender === 'user' ? 'bg-blue-600 text-white self-end text-right ml-auto' : ' text-black self-start text-left mr-auto'
//             }`}
//           >
//             <div>
//               <span>{msg.content}</span>
//               <span className="text-xs text-gray-500 ml-2">{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="ml-2 text-blue-500 hover:text-blue-700"
//               >
//                 🔊
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white text-black p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
//           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
//         </button>
//       </div>
//     </div>
//   );
// }


// code is working fine
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (!assistant || message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);

//       // Start speaking the assistant's response
//       handleReadAloud(response.data.message);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = (message) => {
//     console.log('Creating new SpeechSynthesisUtterance');
//     const utterance = new SpeechSynthesisUtterance(message);
//     utterance.lang = 'en-US';
//     utterance.onstart = () => {
//       console.log('Speech synthesis started');
//     };
//     utterance.onend = () => {
//       console.log('Speech synthesis ended');
//     };
//     utterance.onerror = (event) => {
//       console.error('Speech synthesis error', event);
//     };
//     console.log('Speaking:', utterance.text);
//     window.speechSynthesis.speak(utterance);
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-md max-w-xs ${
//               msg.sender === 'user' ? 'bg-blue-600 text-white self-end text-right ml-auto' : 'bg-gray-200 text-black self-start text-left mr-auto'
//             }`}
//           >
//             <div>
//               <span>{msg.content}</span>
//               <span className="text-xs text-gray-500 ml-2">{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="ml-2 text-blue-500 hover:text-blue-700"
//               >
//                 🔊
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white text-black p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
//           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import OpenAI from 'openai';
// import fs from 'fs';
// import path from 'path';

// const openai = new OpenAI();

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (!assistant || message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);

//       // Start speaking the assistant's response
//       await handleReadAloud(response.data.message);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();
//     const speechFile = path.resolve(`./speech-${voice}.mp3`);

//     try {
//       const mp3 = await openai.audio.speech.create({
//         model: 'tts-1',
//         voice,
//         input: message,
//       });
//       const buffer = Buffer.from(await mp3.arrayBuffer());
//       await fs.promises.writeFile(speechFile, buffer);

//       const audio = new Audio(speechFile);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-md max-w-xs ${
//               msg.sender === 'user' ? 'bg-blue-600 text-white self-end text-right ml-auto' : 'bg-gray-200 text-black self-start text-left mr-auto'
//             }`}
//           >
//             <div>
//               <span>{msg.content}</span>
//               <span className="text-xs text-gray-500 ml-2">{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="ml-2 text-blue-500 hover:text-blue-700"
//               >
//                 🔊
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white text-black p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
//           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
//         </button>
//       </div>
//     </div>
//   );
// }
 

// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (!assistant || message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);

//       // Start speaking the assistant's response
//       await handleReadAloud(response.data.message);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-md max-w-xs ${
//               //msg.sender === 'user' ? 'bg-blue-200 text-black self-end text-right ml-auto rounded-lg p-3 max-w-full' : 'bg-gray-200 text-black self-start text-left mr-auto rounded-lg '
//               msg.sender === 'user' ? 'bg-blue-100 text-black  text-right rounded-full ml-auto' : 'bg-gray-200 text-black self-start rounded-lg text-left mr-auto'
//             }`}
//           >
//             <div>
//               <span>{msg.content}</span>
//               <span className="text-xs text-gray-500 ml-2">{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="ml-2 text-blue-500 hover:text-blue-700"
//               >
//                 🔊
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white text-black p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
//           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
//         </button>
//       </div>
//     </div>
//   );
// }











// //working with all different assistant but without pause and has voice overlay
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (!assistant || message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);

//       // Start speaking the assistant's response
//       await handleReadAloud(response.data.message);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button onClick={handleMicClick} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded">
//           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
//         </button>
//       </div>
//     </div>
//   );
// }


//code with correct mic, speech and assistant voice, but with invalid date error
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message) => {
//     if (!assistant || message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);

//       // Start speaking the assistant's response
//       await handleReadAloud(response.data.message);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date)) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }

//everything wroking but with invalid time error
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text'); // 'text' or 'mic'
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       // Start speaking the assistant's response only if the input type was 'mic'
//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>typing...</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }

//code with voice overlay error and no pause working, everything working
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text'); // 'text' or 'mic'
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       // Start speaking the assistant's response only if the input type was 'mic'
//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>typing...</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone, faPaperclip } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text'); // 'text' or 'mic'
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       // Start speaking the assistant's response only if the input type was 'mic'
//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     // Add logic to handle file upload
//     console.log('File uploaded:', file);
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>typing...</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <div className="flex items-center flex-1 border border-gray-300 dark:border-gray-700 rounded-md mr-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message..."
//             autoFocus
//             className="flex-1 p-2 border-none focus:ring-0"
//           />
//           <label className="cursor-pointer p-2">
//             <FontAwesomeIcon icon={faPaperclip} className="text-gray-600" />
//             <input type="file" className="hidden" onChange={handleFileUpload} />
//           </label>
//         </div>
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }

// working till 11.30pm 1st august 
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone, faPaperclip } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) 
// {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text'); // 'text' or 'mic'
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       // Start speaking the assistant's response only if the input type was 'mic'
//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     // Add logic to handle file upload
//     console.log('File uploaded:', file);
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>Assistant is typing</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <div className="flex items-center flex-1 border border-gray-300 dark:border-gray-700 rounded-md mr-2 relative">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message..."
//             autoFocus
//             className="flex-1 p-2 border-none focus:ring-0"
//           />
//           <label className="cursor-pointer p-2 absolute right-0 top-0 bottom-0 flex items-center justify-center">
//             <FontAwesomeIcon icon={faPaperclip} className="text-gray-600" />
//             <input type="file" className="hidden" onChange={handleFileUpload} />
//           </label>
//         </div>
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone, faPaperclip } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text'); // 'text' or 'mic'
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.abort();
//       }
//     };
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       // Start speaking the assistant's response only if the input type was 'mic'
//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     // Add logic to handle file upload
//     console.log('File uploaded:', file);
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => handleReadAloud(msg.content)}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>Assistant is typing</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <div className="flex items-center flex-1 border border-gray-300 dark:border-gray-700 rounded-md mr-2 relative">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message..."
//             autoFocus
//             className="flex-1 p-2 border-none focus:ring-0"
//           />
//           <label className="cursor-pointer p-2 absolute right-0 top-0 bottom-0 flex items-center justify-center">
//             <FontAwesomeIcon icon={faPaperclip} className="text-gray-600" />
//             <input type="file" className="hidden" onChange={handleFileUpload} />
//           </label>
//         </div>
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }




/// ver very wtf imp code 
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text'); // 'text' or 'mic'
//   const [currentAudio, setCurrentAudio] = useState(null); // Track the currently playing audio
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const audioRef = useRef(null); // Reference to the audio element

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       // Start speaking the assistant's response only if the input type was 'mic'
//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     // Stop any currently playing audio
//     if (currentAudio) {
//       currentAudio.pause();
//       currentAudio.currentTime = 0;
//       setCurrentAudio(null);
//       return; // Stop further execution if stopping the audio
//     }

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       setCurrentAudio(audio);

//       audio.play();
//       audio.onended = () => {
//         setCurrentAudio(null);
//       };
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => {
//                   handleReadAloud(msg.content);
//                 }}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>Assistant is typing....</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }

















// /// same code but the spinner feature in the send button 
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text'); // 'text' or 'mic'
//   const [currentAudio, setCurrentAudio] = useState(null); // Track the currently playing audio
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const audioRef = useRef(null); // Reference to the audio element

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         console.log('Fetching messages');
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//         console.log('Messages fetched', response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Speech recognition started');
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       // Start speaking the assistant's response only if the input type was 'mic'
//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log('Send button clicked');
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     console.log('Mic button clicked');
//     if (recognizing) {
//       console.log('Stopping speech recognition');
//       recognitionRef.current.stop();
//     } else {
//       console.log('Starting speech recognition');
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     // Stop any currently playing audio
//     if (currentAudio) {
//       currentAudio.pause();
//       currentAudio.currentTime = 0;
//       setCurrentAudio(null);
//       return; // Stop further execution if stopping the audio
//     }

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       setCurrentAudio(audio);

//       audio.play();
//       audio.onended = () => {
//         setCurrentAudio(null);
//       };
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error formatting timestamp:', error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => {
//                   handleReadAloud(msg.content);
//                 }}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>Assistant is typing.....</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }


//trying prompt like "who make you"
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text');
//   const [currentAudio, setCurrentAudio] = useState(null);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     if (recognizing) {
//       recognitionRef.current.stop();
//     } else {
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     if (currentAudio) {
//       currentAudio.pause();
//       currentAudio.currentTime = 0;
//       setCurrentAudio(null);
//       return;
//     }

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       setCurrentAudio(audio);

//       audio.play();
//       audio.onended = () => {
//         setCurrentAudio(null);
//       };
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => {
//                   handleReadAloud(msg.content);
//                 }}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>Assistant is typing.....</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-gray-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }

//everything working perfectly fine
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp, faMicrophone, faSpinner, faPaperclip } from '@fortawesome/free-solid-svg-icons';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputType, setInputType] = useState('text');
//   const [currentAudio, setCurrentAudio] = useState(null);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!assistant) return;

//       try {
//         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         setRecognizing(true);
//       };
//       recognition.onend = () => {
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInput(transcript);
//         await sendMessage(transcript, 'mic');
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, type = 'text') => {
//     if (!assistant || message.trim() === '') return;

//     setInputType(type);
//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);
//     setIsTyping(true);

//     try {
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

//       if (type === 'mic') {
//         await handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       setIsTyping(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     sendMessage(input, 'text');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const handleMicClick = () => {
//     if (recognizing) {
//       recognitionRef.current.stop();
//     } else {
//       recognitionRef.current.start();
//     }
//   };

//   const handleReadAloud = async (message) => {
//     const voice = assistant.voice.toLowerCase();

//     if (currentAudio) {
//       currentAudio.pause();
//       currentAudio.currentTime = 0;
//       setCurrentAudio(null);
//       return;
//     }

//     try {
//       const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
//       const audioUrl = URL.createObjectURL(response.data);
//       const audio = new Audio(audioUrl);
//       setCurrentAudio(audio);

//       audio.play();
//       audio.onended = () => {
//         setCurrentAudio(null);
//       };
//     } catch (error) {
//       console.error('Error generating speech:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid Date');
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full ' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               <span>{msg.content}</span>
//             </div>
//             <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//               <span>{formatTime(msg.timestamp)}</span>
//               <button
//                 onClick={() => {
//                   handleReadAloud(msg.content);
//                 }}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 <FontAwesomeIcon icon={faVolumeUp} />
//               </button>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-col items-start">
//             <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
//               <span>Assistant is typing.....</span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
//         <label className="cursor-pointer mr-2">
//           <input
//             type="file"
//             className="hidden"
//             onChange={(e) => {
//               // Handle file selection
//               const file = e.target.files[0];
//               console.log(file);
//             }}
//           />
//           <FontAwesomeIcon icon={faPaperclip} className="text-gray-500 hover:text-gray-700 fa-xl" />
//         </label>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-gray-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Send'}
//         </button>
//         <button
//           onClick={handleMicClick}
//           className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
//         >
//           <FontAwesomeIcon icon={faMicrophone} />
//         </button>
//       </div>
//     </div>
//   );
// }




// // import { useState, useEffect, useRef } from 'react';
// // import axios from 'axios';

// // export default function Chat({ assistant }) {
// //   const assistantId = assistant?._id;
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [recognizing, setRecognizing] = useState(false);
// //   const messagesEndRef = useRef(null);
// //   const recognitionRef = useRef(null);

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       try {
// //         const response = await axios.get(`/api/messages?assistantId=${assistantId}`);
// //         if (response.status === 200) {
// //           setMessages(response.data);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching messages:', error);
// //       }
// //     };

// //     if (assistantId) {
// //       fetchMessages();
// //     }
// //   }, [assistantId]);

// //   useEffect(() => {
// //     if ('webkitSpeechRecognition' in window) {
// //       const recognition = new window.webkitSpeechRecognition();
// //       recognition.continuous = false;
// //       recognition.interimResults = false;
// //       recognition.lang = 'en-US';

// //       recognition.onstart = () => setRecognizing(true);
// //       recognition.onend = () => setRecognizing(false);
// //       recognition.onresult = async (event) => {
// //         const transcript = event.results[0][0].transcript;
// //         setInput(transcript);
// //         await sendMessage(transcript);
// //       };

// //       recognitionRef.current = recognition;
// //     }
// //   }, []);

// //   const sendMessage = async (message) => {
// //     if (message.trim() === '' || !assistantId) return;

// //     const newMessage = { sender: 'user', content: message };
// //     setMessages([...messages, newMessage]);
// //     setInput('');
// //     setLoading(true);

// //     try {
// //       const response = await axios.post('/api/chat', { message, assistantId });
// //       const botMessage = { sender: 'assistant', content: response.data.message };
// //       setMessages((prev) => [...prev, botMessage]);

// //       // Text-to-Speech
// //       const utterance = new SpeechSynthesisUtterance(response.data.message);
// //       utterance.lang = 'en-US';
// //       window.speechSynthesis.speak(utterance);
// //     } catch (error) {
// //       console.error('Error sending message:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSend = () => {
// //     sendMessage(input);
// //   };

// //   const handleMicClick = () => {
// //     if (recognizing) {
// //       recognitionRef.current.stop();
// //     } else {
// //       recognitionRef.current.start();
// //     }
// //   };

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-gray-100">
// //       <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
// //         <h1 className="text-xl font-bold">Chatbot Assistant</h1>
// //       </div>
// //       <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //         {messages.map((msg, index) => (
// //           <div
// //             key={index}
// //             className={`p-4 rounded-lg shadow-md max-w-md ${
// //               msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-white self-start'
// //             }`}
// //           >
// //             {msg.content}
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>
// //       <div className="bg-white p-4 flex items-center shadow-md">
// //         <input
// //           type="text"
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           placeholder="Type your message..."
// //           autoFocus
// //           className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
// //         />
// //         <button
// //           onClick={handleSend}
// //           disabled={loading}
// //           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
// //         >
// //           {loading ? 'Assistant is replying...' : 'Send'}
// //         </button>
// //         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
// //           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" className="w-6 h-6" />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faMicrophone, faSpinner, faPaperclip } from '@fortawesome/free-solid-svg-icons';

export default function ChatInterface({ assistant }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputType, setInputType] = useState('text');
  const [currentAudio, setCurrentAudio] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!assistant) return;

      try {
        const response = await axios.get(`/api/messages?assistantId=${assistant._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setRecognizing(true);
      };
      recognition.onend = () => {
        setRecognizing(false);
      };
      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        await sendMessage(transcript, 'mic');
      };

      recognitionRef.current = recognition;
    }
  }, [assistant]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message, type = 'text') => {
    if (!assistant || message.trim() === '') return;

    setInputType(type);
    const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chat', { message, assistantId: assistant._id });
      console.log('Message sent, response:', response.data);
      const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      if (type === 'mic') {
        await handleReadAloud(response.data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input, 'text');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (recognizing) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleReadAloud = async (message) => {
    const voice = assistant.voice.toLowerCase();

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      return;
    }

    try {
      const response = await axios.post('/api/tts', { text: message, voice }, { responseType: 'blob' });
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);

      audio.play();
      audio.onended = () => {
        setCurrentAudio(null);
      };
    } catch (error) {
      console.error('Error generating speech:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date');
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`relative p-2 rounded-md max-w-xs ${
                msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full ' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
              }`}
            >
              <span>{msg.content}</span>
            </div>
            <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
              <span>{formatTime(msg.timestamp)}</span>
              <button
                onClick={() => {
                  handleReadAloud(msg.content);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faVolumeUp} />
              </button>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="relative p-2 rounded-md max-w-xs bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg">
              <span>Assistant is typing.....</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 flex items-center">
        <label className="cursor-pointer mr-2">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              // Handle file selection
              const file = e.target.files[0];
              console.log(file);
            }}
          />
          <FontAwesomeIcon icon={faPaperclip} className="text-gray-500 hover:text-gray-700 fa-xl" />
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          autoFocus
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md mr-2 focus:border-green-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-gray-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Send'}
        </button>
        <button
          onClick={handleMicClick}
          className={`font-bold py-2 px-4 rounded ${recognizing ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      </div>
    </div>
  );
}
