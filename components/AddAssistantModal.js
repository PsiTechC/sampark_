// import { useState } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(0.7);
//   const [topP, setTopP] = useState(1.0);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newAssistant = {
//       name,
//       instructions,
//       model,
//       tools: {
//         fileSearch,
//         codeInterpreter
//       },
//       settings: {
//         temperature,
//         topP
//       }
//     };
//     try {
//       const response = await axios.post('/api/assistants', newAssistant);
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
//             <textarea
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//             <select
//               value={model}
//               onChange={(e) => setModel(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="gpt-4-turbo">gpt-4-turbo</option>
//               <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//               {/* Add more models as needed */}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={fileSearch}
//                 onChange={() => setFileSearch(!fileSearch)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">File Search</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={codeInterpreter}
//                 onChange={() => setCodeInterpreter(!codeInterpreter)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">Code Interpreter</span>
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//             <input
//               type="range"
//               value={temperature}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTemperature(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{temperature}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//             <input
//               type="range"
//               value={topP}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTopP(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{topP}</span>
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// code working 
// import { useState } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(0.7);
//   const [topP, setTopP] = useState(1.0);
//   const [maxTokens, setMaxTokens] = useState(256);
//   const [stopSequences, setStopSequences] = useState('');
//   const [frequencyPenalty, setFrequencyPenalty] = useState(0);
//   const [presencePenalty, setPresencePenalty] = useState(0);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newAssistant = {
//       name,
//       instructions,
//       model,
//       tools: {
//         fileSearch,
//         codeInterpreter
//       },
//       settings: {
//         temperature,
//         topP,
//         maxTokens,
//         stopSequences: stopSequences.split(',').map(seq => seq.trim()), // Convert comma-separated strings to an array
//         frequencyPenalty,
//         presencePenalty
//       }
//     };
//     try {
//       const response = await axios.post('/api/assistants', newAssistant);
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
//             <textarea
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//             <select
//               value={model}
//               onChange={(e) => setModel(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="gpt-4-turbo">gpt-4-turbo</option>
//               <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//               {/* Add more models as needed */}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={fileSearch}
//                 onChange={() => setFileSearch(!fileSearch)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">File Search</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={codeInterpreter}
//                 onChange={() => setCodeInterpreter(!codeInterpreter)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">Code Interpreter</span>
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//             <input
//               type="range"
//               value={temperature}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTemperature(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{temperature}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//             <input
//               type="range"
//               value={topP}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTopP(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{topP}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Tokens</label>
//             <input
//               type="number"
//               value={maxTokens}
//               onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
//             <input
//               type="text"
//               value={stopSequences}
//               onChange={(e) => setStopSequences(e.target.value)}
//               placeholder="Enter sequences separated by commas"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
//             <input
//               type="range"
//               value={frequencyPenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{frequencyPenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
//             <input
//               type="range"
//               value={presencePenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{presencePenalty}</span>
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// import { useState } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(0.7);
//   const [topP, setTopP] = useState(1.0);
//   const [maxTokens, setMaxTokens] = useState(256);
//   const [stopSequences, setStopSequences] = useState('');
//   const [frequencyPenalty, setFrequencyPenalty] = useState(0);
//   const [presencePenalty, setPresencePenalty] = useState(0);
//   const [voice, setVoice] = useState('Nova'); // New state for voice

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newAssistant = {
//       name,
//       instructions,
//       model,
//       tools: {
//         fileSearch,
//         codeInterpreter
//       },
//       settings: {
//         temperature,
//         topP,
//         maxTokens,
//         stopSequences: stopSequences.split(',').map(seq => seq.trim()), // Convert comma-separated strings to an array
//         frequencyPenalty,
//         presencePenalty
//       },
//       voice // Include voice in the payload
//     };
//     try {
//       const response = await axios.post('/api/assistants', newAssistant);
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
//             <textarea
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//             <select
//               value={model}
//               onChange={(e) => setModel(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="gpt-4-turbo">gpt-4-turbo</option>
//               <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//               {/* Add more models as needed */}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={fileSearch}
//                 onChange={() => setFileSearch(!fileSearch)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">File Search</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={codeInterpreter}
//                 onChange={() => setCodeInterpreter(!codeInterpreter)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">Code Interpreter</span>
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//             <input
//               type="range"
//               value={temperature}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTemperature(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{temperature}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//             <input
//               type="range"
//               value={topP}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTopP(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{topP}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Tokens</label>
//             <input
//               type="number"
//               value={maxTokens}
//               onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
//             <input
//               type="text"
//               value={stopSequences}
//               onChange={(e) => setStopSequences(e.target.value)}
//               placeholder="Enter sequences separated by commas"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
//             <input
//               type="range"
//               value={frequencyPenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{frequencyPenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
//             <input
//               type="range"
//               value={presencePenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{presencePenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Voice</label>
//             <select
//               value={voice}
//               onChange={(e) => setVoice(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="Alloy">Alloy</option>
//               <option value="Echo">Echo</option>
//               <option value="Fable">Fable</option>
//               <option value="Onyx">Onyx</option>
//               <option value="Nova">Nova</option>
//               <option value="Shimmer">Shimmer</option>
//             </select>
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// import { useState } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(0.7);
//   const [topP, setTopP] = useState(1.0);
//   const [maxTokens, setMaxTokens] = useState(256);
//   const [stopSequences, setStopSequences] = useState('');
//   const [frequencyPenalty, setFrequencyPenalty] = useState(0);
//   const [presencePenalty, setPresencePenalty] = useState(0);
//   const [voice, setVoice] = useState('Nova');
//   const [countryCode, setCountryCode] = useState('+1'); // Default to US country code
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [country, setCountry] = useState('');
//   const [assistantShowMsg, setAssistantShowMsg] = useState('');
//   const [assistantInfo, setAssistantInfo] = useState('');
//   const [image, setImage] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('instructions', instructions);
//     formData.append('model', model);
//     formData.append('fileSearch', fileSearch);
//     formData.append('codeInterpreter', codeInterpreter);
//     formData.append('temperature', temperature);
//     formData.append('topP', topP);
//     formData.append('maxTokens', maxTokens);
//     formData.append('stopSequences', stopSequences.split(',').map(seq => seq.trim())); // Convert comma-separated strings to an array
//     formData.append('frequencyPenalty', frequencyPenalty);
//     formData.append('presencePenalty', presencePenalty);
//     formData.append('voice', voice);
//     formData.append('phoneNumber', `${countryCode}${phoneNumber}`); // Combine country code and phone number
//     formData.append('country', country);
//     formData.append('assistantShowMsg', assistantShowMsg);
//     formData.append('assistantInfo', assistantInfo);
//     if (image) {
//       formData.append('image', image);
//     }

//     try {
//       const response = await axios.post('/api/assistants', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
//   };

//   const countryCodes = [
//     { code: '+1', name: 'United States' },
//     { code: '+44', name: 'United Kingdom' },
//     { code: '+91', name: 'India' },
//     // Add more country codes as needed
//   ];

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
//             <textarea
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//             <select
//               value={model}
//               onChange={(e) => setModel(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="gpt-4-turbo">gpt-4-turbo</option>
//               <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//               {/* Add more models as needed */}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={fileSearch}
//                 onChange={() => setFileSearch(!fileSearch)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">File Search</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={codeInterpreter}
//                 onChange={() => setCodeInterpreter(!codeInterpreter)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">Code Interpreter</span>
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//             <input
//               type="range"
//               value={temperature}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTemperature(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{temperature}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//             <input
//               type="range"
//               value={topP}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTopP(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{topP}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Tokens</label>
//             <input
//               type="number"
//               value={maxTokens}
//               onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
//             <input
//               type="text"
//               value={stopSequences}
//               onChange={(e) => setStopSequences(e.target.value)}
//               placeholder="Enter sequences separated by commas"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
//             <input
//               type="range"
//               value={frequencyPenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{frequencyPenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
//             <input
//               type="range"
//               value={presencePenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{presencePenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Voice</label>
//             <select
//               value={voice}
//               onChange={(e) => setVoice(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="Alloy">Alloy</





// import { useState } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(0.7);
//   const [topP, setTopP] = useState(1.0);
//   const [maxTokens, setMaxTokens] = useState(256);
//   const [stopSequences, setStopSequences] = useState('');
//   const [frequencyPenalty, setFrequencyPenalty] = useState(0);
//   const [presencePenalty, setPresencePenalty] = useState(0);
//   const [voice, setVoice] = useState('Nova');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [country, setCountry] = useState('');
//   const [assistantShowMsg, setAssistantShowMsg] = useState('');
//   const [countryCode, setCountryCode] = useState('+1');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newAssistant = {
//       name,
//       instructions,
//       model,
//       tools: {
//         fileSearch,
//         codeInterpreter
//       },
//       settings: {
//         temperature,
//         topP,
//         maxTokens,
//         stopSequences: stopSequences.split(',').map(seq => seq.trim()), // Convert comma-separated strings to an array
//         frequencyPenalty,
//         presencePenalty
//       },
//       voice,
//       phoneNumber: `${countryCode}${phoneNumber}`, // Combine country code and phone number
//       country,
//       assistantShowMsg
//     };
//     try {
//       const response = await axios.post('/api/assistants', newAssistant);
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
//   };

//   const countryCodes = [
//     { code: '+1', name: 'United States' },
//     { code: '+44', name: 'United Kingdom' },
//     { code: '+91', name: 'India' },
//     // Add more country codes as needed
//   ];

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
//             <textarea
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//             <select
//               value={model}
//               onChange={(e) => setModel(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="gpt-4-turbo">gpt-4-turbo</option>
//               <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//               {/* Add more models as needed */}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={fileSearch}
//                 onChange={() => setFileSearch(!fileSearch)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">File Search</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={codeInterpreter}
//                 onChange={() => setCodeInterpreter(!codeInterpreter)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">Code Interpreter</span>
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//             <input
//               type="range"
//               value={temperature}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTemperature(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{temperature}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//             <input
//               type="range"
//               value={topP}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTopP(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{topP}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Tokens</label>
//             <input
//               type="number"
//               value={maxTokens}
//               onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
//             <input
//               type="text"
//               value={stopSequences}
//               onChange={(e) => setStopSequences(e.target.value)}
//               placeholder="Enter sequences separated by commas"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
//             <input
//               type="range"
//               value={frequencyPenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{frequencyPenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
//             <input
//               type="range"
//               value={presencePenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{presencePenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Voice</label>
//             <select
//               value={voice}
//               onChange={(e) => setVoice(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="Alloy">Alloy</option>
//               <option value="Echo">Echo</option>
//               <option value="Fable">Fable</option>
//               <option value="Onyx">Onyx</option>
//               <option value="Nova">Nova</option>
//               <option value="Shimmer">Shimmer</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
//             <div className="flex">
//               <select
//                 value={countryCode}
//                 onChange={(e) => setCountryCode(e.target.value)}
//                 className="shadow appearance-none border rounded-l w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               >
//                 {countryCodes.map((code) => (
//                   <option key={code.code} value={code.code}>
//                     {code.name} ({code.code})
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="shadow appearance-none border rounded-r w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               />
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
//             <input
//               type="text"
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Assistant Show Message</label>
//             <input
//               type="text"
//               value={assistantShowMsg}
//               onChange={(e) => setAssistantShowMsg(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


//working but with scroll
// import { useState } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(1);
//   const [topP, setTopP] = useState(1.0);
//   const [maxTokens, setMaxTokens] = useState(256);
//   const [stopSequences, setStopSequences] = useState('');
//   const [frequencyPenalty, setFrequencyPenalty] = useState(0);
//   const [presencePenalty, setPresencePenalty] = useState(0);
//   const [voice, setVoice] = useState('Nova');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [country, setCountry] = useState('');
//   const [assistantShowMsg, setAssistantShowMsg] = useState('');
//   const [countryCode, setCountryCode] = useState('+91');
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   const handleFileChange = (e) => {
//     setSelectedFiles(Array.from(e.target.files));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newAssistant = {
//       name,
//       instructions,
//       model,
//       tools: {
//         fileSearch,
//         codeInterpreter
//       },
//       settings: {
//         temperature,
//         topP,
//         maxTokens,
//         stopSequences: stopSequences.split(',').map(seq => seq.trim()),
//         frequencyPenalty,
//         presencePenalty
//       },
//       voice,
//       phoneNumber: `${countryCode}${phoneNumber}`,
//       country,
//       assistantShowMsg
//     };

//     const formData = new FormData();
//     formData.append('assistantData', JSON.stringify(newAssistant));
//     selectedFiles.forEach(file => {
//       formData.append('images', file);
//     });

//     try {
//       const response = await axios.post('/api/assistants', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
//   };

//   const countryCodes = [
//     { code: '+1', name: 'United States' },
//     { code: '+44', name: 'United Kingdom' },
//     { code: '+91', name: 'India' },
//     // Add more country codes as needed
//   ];

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Instructions/Context</label>
//             <textarea
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Assistant Description</label>
//             <input
//               type="text"
//               value={assistantShowMsg}
//               onChange={(e) => setAssistantShowMsg(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
//             <div className="flex">
//               <select
//                 value={countryCode}
//                 onChange={(e) => setCountryCode(e.target.value)}
//                 className="shadow appearance-none border rounded-l w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               >
//                 {countryCodes.map((code) => (
//                   <option key={code.code} value={code.code}>
//                     {code.name} ({code.code})
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="shadow appearance-none border rounded-r w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               />
//             </div>
//           </div>



//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//             <select
//               value={model}
//               onChange={(e) => setModel(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="gpt-4-turbo">gpt-4-turbo</option>
//               <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//               {/* Add more models as needed */}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={fileSearch}
//                 onChange={() => setFileSearch(!fileSearch)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">File Search</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={codeInterpreter}
//                 onChange={() => setCodeInterpreter(!codeInterpreter)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">Code Interpreter</span>
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//             <input
//               type="range"
//               value={temperature}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setTemperature(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{temperature}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//             <input
//               type="range"
//               value={topP}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTopP(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{topP}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Tokens</label>
//             <input
//               type="number"
//               value={maxTokens}
//               onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
//             <input
//               type="text"
//               value={stopSequences}
//               onChange={(e) => setStopSequences(e.target.value)}
//               placeholder="Enter sequences separated by commas"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
//             <input
//               type="range"
//               value={frequencyPenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{frequencyPenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
//             <input
//               type="range"
//               value={presencePenalty}
//               min="0"
//               max="2"
//               step="0.1"
//               onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{presencePenalty}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Voice</label>
//             <select
//               value={voice}
//               onChange={(e) => setVoice(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="Alloy">Alloy</option>
//               <option value="Echo">Echo</option>
//               <option value="Fable">Fable</option>
//               <option value="Onyx">Onyx</option>
//               <option value="Nova">Nova</option>
//               <option value="Shimmer">Shimmer</option>
//             </select>
//           </div>
       
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
//             <input
//               type="text"
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
       
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
//             <input
//               type="file"
//               onChange={handleFileChange}
//               multiple
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// import { useState } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(1);
//   const [topP, setTopP] = useState(1.0);
//   const [maxTokens, setMaxTokens] = useState(40);
//   const [stopSequences, setStopSequences] = useState('');
//   const [frequencyPenalty, setFrequencyPenalty] = useState(0);
//   const [presencePenalty, setPresencePenalty] = useState(0);
//   const [voice, setVoice] = useState('Fable');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [country, setCountry] = useState('');
//   const [assistantShowMsg, setAssistantShowMsg] = useState('');
//   const [countryCode, setCountryCode] = useState('+91');
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   const handleFileChange = (e) => {
//     setSelectedFiles(Array.from(e.target.files));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newAssistant = {
//       name,
//       instructions,
//       model,
//       tools: {
//         fileSearch,
//         codeInterpreter
//       },
//       settings: {
//         temperature,
//         topP,
//         maxTokens,
//         stopSequences: stopSequences.split(',').map(seq => seq.trim()),
//         frequencyPenalty,
//         presencePenalty
//       },
//       voice,
//       phoneNumber: `${countryCode}${phoneNumber}`,
//       country,
//       assistantShowMsg
//     };


//     const validatePhoneNumber = (number) => {
//       const regex = /^\d{8,15}$/;
//       return regex.test(number);
//     };



//     const formData = new FormData();
//     formData.append('assistantData', JSON.stringify(newAssistant));
//     selectedFiles.forEach(file => {
//       formData.append('images', file);
//     });

//     try {
//       const response = await axios.post('/api/assistants', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
//   };

//   const countryCodes = [
//     { code: '+1', name: 'United States' },
//     { code: '+44', name: 'United Kingdom' },
//     { code: '+91', name: 'India' },
//     // Add more country codes as needed
//   ];

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-1">
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Name*</label>
//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Instructions/Context*</label>
//                 <textarea
//                   value={instructions}
//                   required
//                   onChange={(e) => setInstructions(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 ></textarea>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Assistant Description</label>
//                 <input
//                   type="text"
//                   value={assistantShowMsg}
//                   onChange={(e) => setAssistantShowMsg(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number*</label>
//                 <div className="flex">
//                   <select
//                     value={countryCode}
//                     required
//                     onChange={(e) => setCountryCode(e.target.value)}
//                     className="shadow appearance-none border rounded-l w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   >
//                     {countryCodes.map((code) => (
//                       <option key={code.code} value={code.code}>
//                         {code.name} ({code.code})
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="text"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     className="shadow appearance-none border rounded-r w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   />
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//                 <select
//                   value={model}
//                   onChange={(e) => setModel(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 >
//                   <option value="gpt-4-turbo">gpt-4-turbo</option>
//                   <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//                   {/* Add more models as needed */}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={fileSearch}
//                     onChange={() => setFileSearch(!fileSearch)}
//                     className="mr-2 leading-tight"
//                   />
//                   <span className="text-gray-700">File Search</span>
//                 </div>
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={codeInterpreter}
//                     onChange={() => setCodeInterpreter(!codeInterpreter)}
//                     className="mr-2 leading-tight"
//                   />
//                   <span className="text-gray-700">Code Interpreter</span>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//                 <input
//                   type="range"
//                   value={temperature}
//                   min="0"
//                   max="2"
//                   step="0.1"
//                   onChange={(e) => setTemperature(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//                 <span>{temperature}</span>
//               </div>
//             </div>
//             <div className="col-span-1">
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//                 <input
//                   type="range"
//                   value={topP}
//                   min="0"
//                   max="1"
//                   step="0.1"
//                   onChange={(e) => setTopP(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//                 <span>{topP}</span>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Tokens</label>
//                 <input
//                   type="number"
//                   value={maxTokens}
//                   onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
//                 <input
//                   type="text"
//                   value={stopSequences}
//                   onChange={(e) => setStopSequences(e.target.value)}
//                   placeholder="Enter sequences separated by commas"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
//                 <input
//                   type="range"
//                   value={frequencyPenalty}
//                   min="0"
//                   max="2"
//                   step="0.1"
//                   onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//                 <span>{frequencyPenalty}</span>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
//                 <input
//                   type="range"
//                   value={presencePenalty}
//                   min="0"
//                   max="2"
//                   step="0.1"
//                   onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//                 <span>{presencePenalty}</span>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Voice</label>
//                 <select
//                   value={voice}
//                   onChange={(e) => setVoice(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 >
//                   <option value="Alloy">Alloy</option>
//                   <option value="Echo">Echo</option>
//                   <option value="Fable">Fable</option>
//                   <option value="Onyx">Onyx</option>
//                   <option value="Nova">Nova</option>
//                   <option value="Shimmer">Shimmer</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
//                 <input
//                   type="text"
//                   value={country}
//                   onChange={(e) => setCountry(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
//                 <input
//                   type="file"
//                   onChange={handleFileChange}
//                   multiple
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




// import { useState } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(0.7);
//   const [topP, setTopP] = useState(1.0);
//   const [maxTokens, setMaxTokens] = useState(256);
//   const [stopSequences, setStopSequences] = useState('');
//   const [frequencyPenalty, setFrequencyPenalty] = useState(0);
//   const [presencePenalty, setPresencePenalty] = useState(0);
//   const [voice, setVoice] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [country, setCountry] = useState('');
//   const [assistantShowMsg, setAssistantShowMsg] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newAssistant = {
//       name,
//       instructions,
//       model,
//       tools: {
//         fileSearch,
//         codeInterpreter
//       },
//       settings: {
//         temperature,
//         topP,
//         maxTokens,
//         stopSequences: stopSequences.split(',').map(seq => seq.trim()), // Convert comma-separated strings to an array
//         frequencyPenalty,
//         presencePenalty
//       },
//       voice,
//       phoneNumber,
//       country,
//       assistantShowMsg
//     };
//     try {
//       const response = await axios.post('/api/assistants', newAssistant);
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
  
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
//             <textarea
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//             <select
//               value={model}
//               onChange={(e) => setModel(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="gpt-4-turbo">gpt-4-turbo</option>
//               <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={fileSearch}
//                 onChange={() => setFileSearch(!fileSearch)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">File Search</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={codeInterpreter}
//                 onChange={() => setCodeInterpreter(!codeInterpreter)}
//                 className="mr-2 leading-tight"
//               />
//               <span className="text-gray-700">Code Interpreter</span>
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//             <input
//               type="range"
//               value={temperature}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTemperature(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{temperature}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//             <input
//               type="range"
//               value={topP}
//               min="0"
//               max="1"
//               step="0.1"
//               onChange={(e) => setTopP(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <span>{topP}</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Max Tokens</label>
//             <input
//               type="number"
//               value={maxTokens}
//               onChange={(e) => setMaxTokens(parseInt(e.target.value))}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
//             <input
//               type="text"
//               value={stopSequences}
//               onChange={(e) => setStopSequences(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//             <span className="text-gray-500 text-sm">Comma-separated values</span>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
//             <input
//               type="number"
//               value={frequencyPenalty}
//               onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
//             <input
//               type="number"
//               value={presencePenalty}
//               onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Voice</label>
//             <input
//               type="text"
//               value={voice}
//               onChange={(e) => setVoice(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
//             <input
//               type="text"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
//             <input
//               type="text"
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Assistant Show Message</label>
//             <textarea
//               value={assistantShowMsg}
//               onChange={(e) => setAssistantShowMsg(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></textarea>
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function AddAssistantModal({ onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [model, setModel] = useState('gpt-4-turbo');
//   const [fileSearch, setFileSearch] = useState(true);
//   const [codeInterpreter, setCodeInterpreter] = useState(false);
//   const [temperature, setTemperature] = useState(1);
//   const [topP, setTopP] = useState(1.0);
//   const [maxTokens, setMaxTokens] = useState(40);
//   const [stopSequences, setStopSequences] = useState('');
//   const [frequencyPenalty, setFrequencyPenalty] = useState(0);
//   const [presencePenalty, setPresencePenalty] = useState(0);
//   const [voice, setVoice] = useState('Fable');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [country, setCountry] = useState('');
//   const [assistantShowMsg, setAssistantShowMsg] = useState('');
//   const [countryCode, setCountryCode] = useState('+91');
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Enter') {
//         handleSubmit(e);
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [name, instructions, model, fileSearch, codeInterpreter, temperature, topP, maxTokens, stopSequences, frequencyPenalty, presencePenalty, voice, phoneNumber, country, assistantShowMsg, selectedFiles]);

//   const handleFileChange = (e) => {
//     setSelectedFiles(Array.from(e.target.files));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newAssistant = {
//       name,
//       instructions,
//       model,
//       tools: {
//         fileSearch,
//         codeInterpreter
//       },
//       settings: {
//         temperature,
//         topP,
//         maxTokens,
//         stopSequences: stopSequences.split(',').map(seq => seq.trim()),
//         frequencyPenalty,
//         presencePenalty
//       },
//       voice,
//       phoneNumber: `${countryCode}${phoneNumber}`,
//       country,
//       assistantShowMsg
//     };

//     const formData = new FormData();
//     formData.append('assistantData', JSON.stringify(newAssistant));
//     selectedFiles.forEach(file => {
//       formData.append('images', file);
//     });

//     try {
//       const response = await axios.post('/api/assistants', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//     }
//   };

//   const countryCodes = [
//     { code: '+1', name: 'United States' },
//     { code: '+44', name: 'United Kingdom' },
//     { code: '+91', name: 'India' },
//     // Add more country codes as needed
//   ];

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-1">
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Name*</label>
//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Instructions/Context*</label>
//                 <textarea
//                   value={instructions}
//                   required
//                   onChange={(e) => setInstructions(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 ></textarea>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Assistant Description</label>
//                 <input
//                   type="text"
//                   value={assistantShowMsg}
//                   onChange={(e) => setAssistantShowMsg(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number*</label>
//                 <div className="flex">
//                   <select
//                     value={countryCode}
//                     required
//                     onChange={(e) => setCountryCode(e.target.value)}
//                     className="shadow appearance-none border rounded-l w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   >
//                     {countryCodes.map((code) => (
//                       <option key={code.code} value={code.code}>
//                         {code.name} ({code.code})
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="text"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     className="shadow appearance-none border rounded-r w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   />
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
//                 <select
//                   value={model}
//                   onChange={(e) => setModel(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 >
//                   <option value="gpt-4-turbo">gpt-4-turbo</option>
//                   <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
//                   {/* Add more models as needed */}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={fileSearch}
//                     onChange={() => setFileSearch(!fileSearch)}
//                     className="mr-2 leading-tight"
//                   />
//                   <span className="text-gray-700">File Search</span>
//                 </div>
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={codeInterpreter}
//                     onChange={() => setCodeInterpreter(!codeInterpreter)}
//                     className="mr-2 leading-tight"
//                   />
//                   <span className="text-gray-700">Code Interpreter</span>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
//                 <input
//                   type="range"
//                   value={temperature}
//                   min="0"
//                   max="2"
//                   step="0.1"
//                   onChange={(e) => setTemperature(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//                 <span>{temperature}</span>
//               </div>
//             </div>
//             <div className="col-span-1">
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
//                 <input
//                   type="range"
//                   value={topP}
//                   min="0"
//                   max="1"
//                   step="0.1"
//                   onChange={(e) => setTopP(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//                 <span>{topP}</span>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Tokens</label>
//                 <input
//                   type="number"
//                   value={maxTokens}
//                   onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
//                 <input
//                   type="text"
//                   value={stopSequences}
//                   onChange={(e) => setStopSequences(e.target.value)}
//                   placeholder="Enter sequences separated by commas"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
//                 <input
//                   type="range"
//                   value={frequencyPenalty}
//                   min="0"
//                   max="2"
//                   step="0.1"
//                   onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//                 <span>{frequencyPenalty}</span>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
//                 <input
//                   type="range"
//                   value={presencePenalty}
//                   min="0"
//                   max="2"
//                   step="0.1"
//                   onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//                 <span>{presencePenalty}</span>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Voice</label>
//                 <select
//                   value={voice}
//                   onChange={(e) => setVoice(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 >
//                   <option value="Alloy">Alloy</option>
//                   <option value="Echo">Echo</option>
//                   <option value="Fable">Fable</option>
//                   <option value="Onyx">Onyx</option>
//                   <option value="Nova">Nova</option>
//                   <option value="Shimmer">Shimmer</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
//                 <input
//                   type="text"
//                   value={country}
//                   onChange={(e) => setCountry(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
//                 <input
//                   type="file"
//                   onChange={handleFileChange}
//                   multiple
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
 

//working with checks
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddAssistantModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [model, setModel] = useState('gpt-4-turbo');
  const [fileSearch, setFileSearch] = useState(true);
  const [codeInterpreter, setCodeInterpreter] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(40);
  const [stopSequences, setStopSequences] = useState('');
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [voice, setVoice] = useState('Fable');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [assistantShowMsg, setAssistantShowMsg] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [name, instructions, model, fileSearch, codeInterpreter, temperature, topP, maxTokens, stopSequences, frequencyPenalty, presencePenalty, voice, phoneNumber, country, assistantShowMsg, selectedFiles]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!instructions.trim()) newErrors.instructions = 'Instructions are required';
    if (!/^\d{8,15}$/.test(phoneNumber)) newErrors.phoneNumber = 'Phone number must be a number between 8 to 15 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newAssistant = {
      name,
      instructions,
      model,
      tools: {
        fileSearch,
        codeInterpreter
      },
      settings: {
        temperature,
        topP,
        maxTokens,
        stopSequences: stopSequences.split(',').map(seq => seq.trim()),
        frequencyPenalty,
        presencePenalty
      },
      voice,
      phoneNumber: `${countryCode}${phoneNumber}`,
      country,
      assistantShowMsg
    };

    const formData = new FormData();
    formData.append('assistantData', JSON.stringify(newAssistant));
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('/api/assistants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating assistant:', error);
    }
  };

  const countryCodes = [
    { code: '+1', name: 'United States' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+91', name: 'India' },
    // Add more country codes as needed
  ];

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Instructions/Context*</label>
                <textarea
                  value={instructions}
                  required
                  onChange={(e) => setInstructions(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
                {errors.instructions && <p className="text-red-500 text-xs mt-1">{errors.instructions}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Assistant Description</label>
                <input
                  type="text"
                  value={assistantShowMsg}
                  onChange={(e) => setAssistantShowMsg(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number*</label>
                <div className="flex">
                  <select
                    value={countryCode}
                    required
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="shadow appearance-none border rounded-l w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {countryCodes.map((code) => (
                      <option key={code.code} value={code.code}>
                        {code.name} ({code.code})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="shadow appearance-none border rounded-r w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                  {/* Add more models as needed */}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tools</label>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={fileSearch}
                    onChange={() => setFileSearch(!fileSearch)}
                    className="mr-2 leading-tight"
                  />
                  <span className="text-gray-700">File Search</span>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={codeInterpreter}
                    onChange={() => setCodeInterpreter(!codeInterpreter)}
                    className="mr-2 leading-tight"
                  />
                  <span className="text-gray-700">Code Interpreter</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Temperature</label>
                <input
                  type="range"
                  value={temperature}
                  min="0"
                  max="2"
                  step="0.1"
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span>{temperature}</span>
              </div>
            </div>
            <div className="col-span-1">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Top P</label>
                <input
                  type="range"
                  value={topP}
                  min="0"
                  max="1"
                  step="0.1"
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span>{topP}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Tokens</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Stop Sequences</label>
                <input
                  type="text"
                  value={stopSequences}
                  onChange={(e) => setStopSequences(e.target.value)}
                  placeholder="Enter sequences separated by commas"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Frequency Penalty</label>
                <input
                  type="range"
                  value={frequencyPenalty}
                  min="0"
                  max="2"
                  step="0.1"
                  onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span>{frequencyPenalty}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Presence Penalty</label>
                <input
                  type="range"
                  value={presencePenalty}
                  min="0"
                  max="2"
                  step="0.1"
                  onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span>{presencePenalty}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Voice</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Alloy">Alloy</option>
                  <option value="Echo">Echo</option>
                  <option value="Fable">Fable</option>
                  <option value="Onyx">Onyx</option>
                  <option value="Nova">Nova</option>
                  <option value="Shimmer">Shimmer</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
