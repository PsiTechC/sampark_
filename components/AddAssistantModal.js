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

import { useState } from 'react';
import axios from 'axios';

export default function AddAssistantModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [model, setModel] = useState('gpt-4-turbo');
  const [fileSearch, setFileSearch] = useState(true);
  const [codeInterpreter, setCodeInterpreter] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(256);
  const [stopSequences, setStopSequences] = useState('');
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [assistantInfo, setAssistantInfo] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        stopSequences: stopSequences.split(',').map(seq => seq.trim()), // Convert comma-separated strings to an array
        frequencyPenalty,
        presencePenalty
      },
      assistantInfo
    };

    const formData = new FormData();
    formData.append('image', image);
    formData.append('assistant', JSON.stringify(newAssistant));

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

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl h-auto max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assistant</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
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
              max="1"
              step="0.1"
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full"
            />
            <span>{temperature}</span>
          </div>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Assistant Info</label>
            <input
              type="text"
              value={assistantInfo}
              onChange={(e) => setAssistantInfo(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Upload Picture</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
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
