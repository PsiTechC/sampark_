// //working with multiple call ended statements
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
//         const response = await axios.get(`/api/messages?assistantId=${assistant._id}`);
//         const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//         setMessages(sortedMessages);
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
//       const response = await axios.post('/api/chat', { message, assistantId: assistant._id });
//       console.log('Message sent, response:', response.data);
//       const botMessage = { sender: 'assistant', content: response.data.message, timestamp: new Date().toISOString() };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsTyping(false);

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
//           <div key={index} className={`flex flex-col ${msg.content.includes('call') && msg.sender === 'system' ? 'items-center' : msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
//             <div
//               className={`relative p-2 rounded-md max-w-xs ${
//                 msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full ' : msg.content.includes('call') && msg.sender === 'system' ? '' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
//               }`}
//             >
//               {msg.content.includes('call started with') && msg.sender === 'system' ? (
//                 <span className="text-gray-400 text-s">{msg.content}</span>
//               ) : msg.content.includes('call ended') && msg.sender === 'system' ? (
//                 <span className="text-gray-400 text-s">{msg.content}</span>
//               ) : (
//                 <span>{msg.content}</span>
//               )}
//             </div>
//             {msg.sender !== 'system' && (
//               <div className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 justify-end`}>
//                 <span>{formatTime(msg.timestamp)}</span>
//                 <button
//                   onClick={() => {
//                     handleReadAloud(msg.content);
//                   }}
//                   className="text-blue-500 hover:text-blue-700"
//                 >
//                   <FontAwesomeIcon icon={faVolumeUp} />
//                 </button>
//               </div>
//             )}
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
  const [callActive, setCallActive] = useState(false); // Track if a call is active
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!assistant) return;

      try {
        const response = await axios.get(`/api/messages?assistantId=${assistant._id}`);
        const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sortedMessages);
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
          <div key={index} className={`flex flex-col ${msg.content.includes('call') && msg.sender === 'system' ? 'items-center' : msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`relative p-2 rounded-md max-w-xs ${
                msg.sender === 'user' ? 'bg-blue-100 text-black text-right rounded-full ' : msg.content.includes('call') && msg.sender === 'system' ? '' : 'bg-gray-200 dark:bg-gray-700 text-black text-left rounded-lg'
              }`}
            >
              {msg.content.includes('call started with') && msg.sender === 'system' ? (
                <span className="text-gray-400 text-s">{msg.content}</span>
              ) : msg.content.includes('call ended') && msg.sender === 'system' && !callActive ? (
                <span className="text-gray-400 text-s">{msg.content}</span>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
            {msg.sender !== 'system' && (
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
            )}
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
