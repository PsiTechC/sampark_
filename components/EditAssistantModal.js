// import { useState } from 'react';
// import axios from 'axios';

// const EditAssistantModal = ({ assistant, onClose, onSave }) => {
//   const [name, setName] = useState(assistant.name);
//   const [instructions, setInstructions] = useState(assistant.instructions);
//   const [model, setModel] = useState(assistant.model);
//   const [phoneNumber, setPhoneNumber] = useState(assistant.phone_number);
//   const [country, setCountry] = useState(assistant.country);
//   const [assistantShowMsg, setAssistantShowMsg] = useState(assistant.assistant_show_msg);

//   const handleSubmit = async () => {
//     const updatedAssistant = {
//       id: assistant.id,
//       name,
//       instructions,
//       model,
//       tools: assistant.tools || {}, // Provide default value if missing
//       settings: assistant.settings || {}, // Provide default value if missing
//       voice: assistant.voice, // Assuming this should be included
//       phoneNumber,
//       country,
//       assistantShowMsg,
//     };

//     try {
//       const response = await axios.put('/api/assistants', updatedAssistant);
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error updating assistant:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-4 rounded shadow-md w-96">
//         <h2 className="text-lg font-bold mb-4">Edit Assistant</h2>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Instructions</label>
//           <input
//             type="text"
//             value={instructions}
//             onChange={(e) => setInstructions(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Model</label>
//           <input
//             type="text"
//             value={model}
//             onChange={(e) => setModel(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//           <input
//             type="text"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Country</label>
//           <input
//             type="text"
//             value={country}
//             onChange={(e) => setCountry(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Show Message</label>
//           <input
//             type="text"
//             value={assistantShowMsg}
//             onChange={(e) => setAssistantShowMsg(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             onClick={onClose}
//             className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditAssistantModal;



// import { useState } from 'react';
// import axios from 'axios';

// const EditAssistantModal = ({ assistant, onClose, onSave }) => {
//   const [name, setName] = useState(assistant.name);
//   const [instructions, setInstructions] = useState(assistant.instructions);
//   const [model, setModel] = useState(assistant.model);
//   const [phoneNumber, setPhoneNumber] = useState(assistant.phoneNumber);
//   const [country, setCountry] = useState(assistant.country);
//   const [assistantShowMsg, setAssistantShowMsg] = useState(assistant.assistantShowMsg);
//   const [voice, setVoice] = useState(assistant.voice);

//   const validVoices = ['nova', 'shimmer', 'echo', 'onyx', 'fable', 'alloy'];

//   const handleSubmit = async () => {
//     if (!validVoices.includes(voice.toLowerCase())) {
//       alert(`Invalid voice option. Please select one of: ${validVoices.join(', ')}`);
//       return;
//     }

//     const updatedAssistant = {
//       id: assistant._id,
//       name,
//       instructions,
//       model,
//       tools: assistant.tools || {},
//       settings: assistant.settings || {},
//       voice,
//       phoneNumber,
//       country,
//       assistantShowMsg,
//     };

//     try {
//       const response = await axios.put('/api/assistants', updatedAssistant);
//       onSave(response.data);
//       onClose();
//     } catch (error) {
//       console.error('Error updating assistant:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-4 rounded shadow-md w-96">
//         <h2 className="text-lg font-bold mb-4">Edit Assistant</h2>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Instructions</label>
//           <input
//             type="text"
//             value={instructions}
//             onChange={(e) => setInstructions(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Model</label>
//           <input
//             type="text"
//             value={model}
//             onChange={(e) => setModel(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Voice</label>
//           <select
//             value={voice}
//             onChange={(e) => setVoice(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           >
//             {validVoices.map((v) => (
//               <option key={v} value={v}>
//                 {v}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//           <input
//             type="text"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Country</label>
//           <input
//             type="text"
//             value={country}
//             onChange={(e) => setCountry(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Show Message</label>
//           <input
//             type="text"
//             value={assistantShowMsg}
//             onChange={(e) => setAssistantShowMsg(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             onClick={onClose}
//             className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditAssistantModal;


import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditAssistantModal({ assistant, onClose, onSave }) {
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

  useEffect(() => {
    if (assistant) {
      setName(assistant.name);
      setInstructions(assistant.instructions);
      setModel(assistant.model);
      setFileSearch(assistant.tools.fileSearch);
      setCodeInterpreter(assistant.tools.codeInterpreter);
      setTemperature(assistant.settings.temperature);
      setTopP(assistant.settings.topP);
      setMaxTokens(assistant.settings.maxTokens);
      setStopSequences(assistant.settings.stopSequences.join(', '));
      setFrequencyPenalty(assistant.settings.frequencyPenalty);
      setPresencePenalty(assistant.settings.presencePenalty);
      setVoice(assistant.voice);
      setPhoneNumber(assistant.phoneNumber.replace(/^\+\d+/, ''));
      setCountryCode(assistant.phoneNumber.match(/^\+\d+/)[0]);
      setCountry(assistant.country);
      setAssistantShowMsg(assistant.assistantShowMsg);
      setSelectedFiles([]);
    }
  }, [assistant]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedAssistant = {
      id: assistant._id,
      name,
      instructions,
      model,
      tools: {
        fileSearch,
        codeInterpreter,
      },
      settings: {
        temperature,
        topP,
        maxTokens,
        stopSequences: stopSequences.split(',').map((seq) => seq.trim()),
        frequencyPenalty,
        presencePenalty,
      },
      voice,
      phoneNumber: `${countryCode}${phoneNumber}`,
      country,
      assistantShowMsg,
    };

    const formData = new FormData();
    formData.append('assistantData', JSON.stringify(updatedAssistant));
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axios.put('/api/assistants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSave(response.data);
      onClose();
      window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error('Error updating assistant:', error);
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Assistant</h2>
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
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Instructions/Context*</label>
                <textarea
                  value={instructions}
                  required
                  onChange={(e) => setInstructions(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
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

