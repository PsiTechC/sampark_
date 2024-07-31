// // import { useState, useRef, useEffect } from 'react';
// // import axios from 'axios';
// // import { format } from 'date-fns';

// // export default function ChatInterface({ assistant }) {
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [recognizing, setRecognizing] = useState(false);
// //   const messagesEndRef = useRef(null);
// //   const recognitionRef = useRef(null);

// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       try {
// //         const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
// //         setMessages(response.data);
// //       } catch (error) {
// //         console.error('Error fetching messages:', error);
// //       }
// //     };

// //     fetchMessages();

// //     if ('webkitSpeechRecognition' in window) {
// //       const recognition = new window.webkitSpeechRecognition();
// //       recognition.continuous = false;
// //       recognition.interimResults = false;
// //       recognition.lang = 'en-US';

// //       recognition.onstart = () => {
// //         console.log('Speech recognition started');
// //         setRecognizing(true);
// //       };
// //       recognition.onend = () => {
// //         console.log('Speech recognition ended');
// //         setRecognizing(false);
// //       };
// //       recognition.onresult = async (event) => {
// //         const transcript = event.results[0][0].transcript;
// //         console.log('Speech recognition result:', transcript);
// //         setInput(transcript);
// //         await sendMessage(transcript);
// //       };

// //       recognitionRef.current = recognition;
// //     }
// //   }, [assistant]);

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   const sendMessage = async (message) => {
// //     if (message.trim() === '') return;

// //     const newMessage = { sender: 'user', content: message };
// //     setMessages([...messages, newMessage]);
// //     setInput('');
// //     setLoading(true);

// //     try {
// //       console.log('Sending message to API:', message);
// //       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
// //       console.log('Received response from API:', response.data);
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
// //     console.log('Send button clicked');
// //     sendMessage(input);
// //   };

// //   const handleMicClick = () => {
// //     console.log('Mic button clicked');
// //     if (recognizing) {
// //       console.log('Stopping speech recognition');
// //       recognitionRef.current.stop();
// //     } else {
// //       console.log('Starting speech recognition');
// //       recognitionRef.current.start();
// //     }
// //   };

// //   const handleReadAloud = (message) => {
// //     const utterance = new SpeechSynthesisUtterance(message);
// //     utterance.lang = 'en-US';
// //     window.speechSynthesis.speak(utterance);
// //   };

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //     console.log('Scrolled to bottom');
// //   };

// //   return (
// //     <div className="flex flex-col h-full">
// //       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
// //         {messages.map((msg, index) => (
// //           <div
// //             key={index}
// //             className={`p-2 rounded-md max-w-xs ${
// //               msg.sender === 'user' ? 'bg-blue-600 text-white self-end text-right ml-auto' : ' text-black self-start text-left mr-auto'
// //             }`}
// //           >
// //             <div>
// //               <span>{msg.content}</span>
// //               <span className="text-xs text-gray-500 ml-2">{format(new Date(msg.timestamp), 'p')}</span>
// //               <button
// //                 onClick={() => handleReadAloud(msg.content)}
// //                 className="ml-2 text-blue-500 hover:text-blue-700"
// //               >
// //                 🔊
// //               </button>
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>
// //       <div className="bg-white text-black p-4 flex items-center">
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
// //           {loading ? 'Sending...' : 'Send'}
// //         </button>
// //         <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
// //           <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';

// export default function ChatInterface({ assistant }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recognizing, setRecognizing] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
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
//     setMessages([...messages, newMessage]);
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
//     const utterance = new SpeechSynthesisUtterance(message);
//     utterance.lang = 'en-US';
//     window.speechSynthesis.speak(utterance);
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log('Scrolled to bottom');
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
//               <span className="text-xs text-gray-500 ml-2">{format(new Date(msg.timestamp), 'p')}</span>
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
//           placeholder="Type your message..."
//           autoFocus
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
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
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
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
//   const [usingMic, setUsingMic] = useState(false); // Flag to indicate if the user is using the mic
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
//         setUsingMic(true); // Set the flag when speech recognition starts
//       };
//       recognition.onend = () => {
//         console.log('Speech recognition ended');
//         setRecognizing(false);
//       };
//       recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log('Speech recognition result:', transcript);
//         setInput(transcript);
//         await sendMessage(transcript, true);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [assistant]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (message, fromMic = false) => {
//     if (message.trim() === '') return;

//     const newMessage = { sender: 'user', content: message, timestamp: new Date().toISOString() }; // Add timestamp here
//     setMessages((prev) => [...prev, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('Sending message to API:', message);
//       const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
//       console.log('Received response from API:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() }; // Add timestamp here
//       setMessages((prev) => [...prev, botMessage]);

//       // Read aloud the assistant's response if the user is using the mic
//       if (fromMic || usingMic) {
//         handleReadAloud(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setLoading(false);
//       setUsingMic(false); // Clear the flag after the response
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
//       console.log('Stopping speech synthesis');
//       window.speechSynthesis.cancel();
//       setSpeaking(false);
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
//           className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
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

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ChatInterface({ assistant }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages');
        const response = await axios.get(`/api/messages?assistantId=${assistant.id}`);
        setMessages(response.data);
        console.log('Messages fetched', response.data);
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
        console.log('Speech recognition started');
        setRecognizing(true);
      };
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setRecognizing(false);
      };
      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognition result:', transcript);
        setInput(transcript);
        await sendMessage(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, [assistant]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message) => {
    if (message.trim() === '') return;

    const newMessage = { sender: 'user', content: message };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      console.log('Sending message to API:', message);
      const response = await axios.post('/api/chat', { message, assistantId: assistant.id });
      console.log('Received response from API:', response.data);
      const botMessage = { sender: 'assistant', content: response.data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    console.log('Send button clicked');
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleMicClick = () => {
    console.log('Mic button clicked');
    if (recognizing) {
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();
    } else {
      console.log('Starting speech recognition');
      recognitionRef.current.start();
    }
  };

  const handleReadAloud = (message) => {
    if (speaking) {
      console.log('Pausing speech synthesis');
      window.speechSynthesis.pause();
      setPaused(true);
    } else if (paused) {
      console.log('Resuming speech synthesis');
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      console.log('Starting speech synthesis');
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      utteranceRef.current = utterance;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log('Scrolled to bottom');
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date)) {
        throw new Error('Invalid Date');
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-md max-w-xs ${
              msg.sender === 'user' ? 'bg-blue-600 text-white self-end text-right ml-auto' : ' text-black self-start text-left mr-auto'
            }`}
          >
            <div>
              <span>{msg.content}</span>
              <span className="text-xs text-gray-500 ml-2">{formatTime(msg.timestamp)}</span>
              <button
                onClick={() => handleReadAloud(msg.content)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                🔊
              </button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white text-black p-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          autoFocus
          className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:border-green-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
        <button onClick={handleMicClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          <img src={recognizing ? '/mic-active.png' : '/mic.png'} alt="Mic" />
        </button>
      </div>
    </div>
  );
}
