// import React, { useState } from 'react';
// import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// const CampaignsPage = () => {
//   const [formData, setFormData] = useState({
//     campaignName: '',
//     startDate: '',
//     endDate: '',
//     aiAssistant: '',
//     botVoice: '',
//     phoneNumber: '',
//     file: null,
//     preExistingMP3: '',
//     callerList: null,
//     messageTemplate: '',
//   });

//   const [showModal, setShowModal] = useState(false); // Modal state

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileUpload = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.files[0] });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form data:', formData);
//   };

//   // Dummy data for Recharts
//   const pieData = [
//     { name: 'Reached', value: 9000, fill: '#FFC6C6' },
//     { name: 'Not Reached', value: 6000, fill: '#FFEBD4' },
//     { name: 'Completion (mins)', value: 4500, fill: '#F0A8D0' },
//   ];

//   const barData = [
//     { name: 'Campaign 1', total: 5650 },
//     { name: 'Campaign 2', total: 7650 },
    
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
  
//       {/* Button to open modal */}
//       <button
//         onClick={() => setShowModal(true)}
//         className="px-6 py-3 mb-6 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//       >
//         Create Campaign
//       </button>

//       {/* Modal */}
//       <h1 className="text-3xl font-bold mb-8 text-indigo-800">Existing Campaigns</h1>
//       {showModal ? (
//         <>
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-8 relative overflow-y-auto h-4/5">
//               <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Create Campaign</h1>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
//                   <input
//                     type="text"
//                     name="campaignName"
//                     value={formData.campaignName}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Start Date</label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={formData.startDate}
//                       onChange={handleInputChange}
//                       className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">End Date</label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={formData.endDate}
//                       onChange={handleInputChange}
//                       className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">AI Assistant</label>
//                   <select
//                     name="aiAssistant"
//                     value={formData.aiAssistant}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select AI Assistant</option>
//                     <option value="assistant1">Assistant 1</option>
//                     <option value="assistant2">Assistant 2</option>
//                     <option value="assistant3">Assistant 3</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Bot Voice</label>
//                   <select
//                     name="botVoice"
//                     value={formData.botVoice}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select Voice</option>
//                     <option value="voice1">Voice 1</option>
//                     <option value="voice2">Voice 2</option>
//                     <option value="voice3">Voice 3</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <select
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select Phone Number</option>
//                     <option value="+1234567890">+1234567890</option>
//                     <option value="+0987654321">+0987654321</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Upload Audio/Video (MP3)</label>
//                   <input
//                     type="file"
//                     name="file"
//                     accept="audio/mp3"
//                     onChange={handleFileUpload}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Choose from Existing Voices</label>
//                   <select
//                     name="preExistingMP3"
//                     value={formData.preExistingMP3}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select Voice</option>
//                     <option value="/audio/voice1.mp3">Voice 1</option>
//                     <option value="/audio/voice2.mp3">Voice 2</option>
//                     <option value="/audio/voice3.mp3">Voice 3</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Caller List</label>
//                   <input
//                     type="file"
//                     name="callerList"
//                     onChange={handleFileUpload}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Message Template</label>
//                   <textarea
//                     name="messageTemplate"
//                     value={formData.messageTemplate}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-4 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </>
//       ) : null}

//       {/* Campaigns List with Pie and Bar Charts */}
//       <div className="grid grid-cols-1 gap-8 w-full max-w-3xl">
//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign 1: YES Bank credit card launch</h2>
//           <p className="text-center"><strong>Start Date:</strong> 2024-09-20</p>
//           <p className="text-center"><strong>Status:</strong> Ongoing</p>
//           <p className="text-center"><strong>Remaining Minutes :</strong> 6000 mins</p>
//           <p className="text-center"><strong>Completion:</strong> 65%</p>
//           <p className="text-center"><strong>Total Interactions:</strong> 5650 customers</p>
//           <div className="flex justify-center">
//             <PieChart width={300} height={200}>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign 2: Customer care at Taj Colaba</h2>
//           <p className="text-center"><strong>Start Date:</strong> 2024-07-20</p>
//           <p className="text-center"><strong>Status:</strong> Ongoing</p>
//           <p className="text-center"><strong>Remaining Minutes :</strong> 4500 mins</p>
//           <p className="text-center"><strong>Completion:</strong> 55%</p>
//           <p className="text-center"><strong>Total Interactions:</strong> 7650 customers</p>
//           <div className="flex justify-center">
//             <PieChart width={300} height={200}>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </div>
//         </div>

//         {/* Bar Graph */}
//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign Statistics</h2>
//           <div className="flex justify-center">
//             <BarChart width={400} height={250} data={barData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="total" fill="rgba(75, 192, 192, 0.6)" />
//             </BarChart>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CampaignsPage;



// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// const CampaignsPage = () => {
//   const [formData, setFormData] = useState({
//     campaignName: '',
//     startDate: '',
//     endDate: '',
//     aiAssistant: '',
//     botVoice: '',
//     phoneNumber: '',
//     file: null,
//     preExistingMP3: '',
//     callerList: null,
//     messageTemplate: '',
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [audioSrc, setAudioSrc] = useState(''); // State to store the audio source
//   const audioRef = React.createRef();
//   const [isMounted, setIsMounted] = useState(false); // Check if the component is mounted

//   useEffect(() => {
//     setIsMounted(true); // Component is now mounted
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileUpload = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.files[0] });

//     // Create a URL for the uploaded file and set it as the audio source
//     if (e.target.files[0]) {
//       const fileUrl = URL.createObjectURL(e.target.files[0]);
//       setAudioSrc(fileUrl);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form data:', formData);
//   };

//   const handlePlayAudio = () => {
//     if (audioRef.current) {
//       audioRef.current.play();
//     }
//   };

//   if (!isMounted) {
//     return null; // Prevent rendering on the server
//   }

//   // Dummy data for Recharts
//   const pieData = [
//     { name: 'Reached', value: 9000, fill: '#FFC6C6' },
//     { name: 'Not Reached', value: 6000, fill: '#FFEBD4' },
//     { name: 'Completion (mins)', value: 4500, fill: '#F0A8D0' },
//   ];

//   const barData = [
//     { name: 'Campaign 1', total: 5650 },
//     { name: 'Campaign 2', total: 7650 },
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
//       {/* Button to open modal */}
//       <button
//         onClick={() => setShowModal(true)}
//         className="px-6 py-3 mb-6 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//       >
//         Create Campaign
//       </button>

//       {/* Modal */}
//       {showModal ? (
//         <>
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-8 relative overflow-y-auto h-4/5">
//               <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Create Campaign</h1>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
//                   <input
//                     type="text"
//                     name="campaignName"
//                     value={formData.campaignName}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Start Date</label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={formData.startDate}
//                       onChange={handleInputChange}
//                       className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">End Date</label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={formData.endDate}
//                       onChange={handleInputChange}
//                       className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">AI Assistant</label>
//                   <select
//                     name="aiAssistant"
//                     value={formData.aiAssistant}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select AI Assistant</option>
//                     <option value="assistant1">Assistant 1</option>
//                     <option value="assistant2">Assistant 2</option>
//                     <option value="assistant3">Assistant 3</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Bot Voice</label>
//                   <select
//                     name="botVoice"
//                     value={formData.botVoice}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select Voice</option>
//                     <option value="voice1">Voice 1</option>
//                     <option value="voice2">Voice 2</option>
//                     <option value="voice3">Voice 3</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <select
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select Phone Number</option>
//                     <option value="+1234567890">+1234567890</option>
//                     <option value="+0987654321">+0987654321</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Upload Audio/Video (MP3)</label>
//                   <input
//                     type="file"
//                     name="file"
//                     accept="audio/mp3"
//                     onChange={handleFileUpload}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Choose from Existing Voices</label>
//                   <select
//                     name="preExistingMP3"
//                     value={formData.preExistingMP3}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select Voice</option>
//                     <option value="audio\English_demo.mp3">Voice 1</option>
//                     <option value="audio\Hindi_demo.mp3">Voice 2</option>
//                     <option value="audio\marathi_demo.mp3">Voice 3</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Caller List</label>
//                   <input
//                     type="file"
//                     name="callerList"
//                     onChange={handleFileUpload}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Message Template</label>
//                   <textarea
//                     name="messageTemplate"
//                     value={formData.messageTemplate}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 {/* Play button for playing the MP3 */}
//                 <div>
//                   <button
//                     type="button"
//                     onClick={handlePlayAudio}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     Play Audio
//                   </button>
//                   <audio ref={audioRef} src={audioSrc || formData.preExistingMP3} controls hidden />
//                 </div>

//                 <div className="flex justify-end space-x-4 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </>
//       ) : null}

//       {/* Campaigns List with Pie and Bar Charts */}
//       <div className="grid grid-cols-1 gap-8 w-full max-w-3xl">
//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign 1: YES Bank credit card launch</h2>
//           <p className="text-center"><strong>Start Date:</strong> 2024-09-20</p>
//           <p className="text-center"><strong>Status:</strong> Ongoing</p>
//           <p className="text-center"><strong>Remaining Minutes :</strong> 6000 mins</p>
//           <p className="text-center"><strong>Completion:</strong> 65%</p>
//           <p className="text-center"><strong>Total Interactions:</strong> 5650 customers</p>
//           <div className="flex justify-center">
//             <PieChart width={300} height={200}>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign 2: Customer care at Taj Colaba</h2>
//           <p className="text-center"><strong>Start Date:</strong> 2024-07-20</p>
//           <p className="text-center"><strong>Status:</strong> Ongoing</p>
//           <p className="text-center"><strong>Remaining Minutes :</strong> 4500 mins</p>
//           <p className="text-center"><strong>Completion:</strong> 55%</p>
//           <p className="text-center"><strong>Total Interactions:</strong> 7650 customers</p>
//           <div className="flex justify-center">
//             <PieChart width={300} height={200}>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </div>
//         </div>

//         {/* Bar Graph */}
//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign Statistics</h2>
//           <div className="flex justify-center">
//             <BarChart width={400} height={250} data={barData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="total" fill="rgba(75, 192, 192, 0.6)" />
//             </BarChart>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CampaignsPage;





// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// const CampaignsPage = () => {
//   const [formData, setFormData] = useState({
//     campaignName: '',
//     startDate: '',
//     endDate: '',
//     aiAssistant: '',
//     botVoice: '',
//     phoneNumber: '',
//     file: null,
//     preExistingMP3: '',
//     callerList: null,
//     messageTemplate: '',
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [botVoiceSrc, setBotVoiceSrc] = useState(''); // Separate state for bot voice
//   const [uploadedFileSrc, setUploadedFileSrc] = useState(''); // Separate state for uploaded file
//   const botVoiceAudioRef = React.createRef();
//   const uploadedFileAudioRef = React.createRef();
//   const [isMounted, setIsMounted] = useState(false); // Check if the component is mounted

//   useEffect(() => {
//     setIsMounted(true); // Component is now mounted
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileUpload = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.files[0] });

//     // Create a URL for the uploaded file and set it as the uploaded file audio source
//     if (e.target.files[0]) {
//       const fileUrl = URL.createObjectURL(e.target.files[0]);
//       setUploadedFileSrc(fileUrl);
//     }
//   };

//   const handleBotVoiceChange = (e) => {
//     handleInputChange(e);
//     // Set the bot voice source based on the selected option
//     setBotVoiceSrc(`/mnt/data/${e.target.value}`);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form data:', formData);
//   };

//   const handlePlayBotVoice = () => {
//     if (botVoiceSrc && botVoiceAudioRef.current) {
//       botVoiceAudioRef.current.play();
//     }
//   };

//   const handlePlayUploadedFile = () => {
//     if (uploadedFileSrc && uploadedFileAudioRef.current) {
//       uploadedFileAudioRef.current.play();
//     }
//   };

//   if (!isMounted) {
//     return null; // Prevent rendering on the server
//   }

//   // Dummy data for Recharts
//   const pieData = [
//     { name: 'Reached', value: 9000, fill: '#FFC6C6' },
//     { name: 'Not Reached', value: 6000, fill: '#FFEBD4' },
//     { name: 'Completion (mins)', value: 4500, fill: '#F0A8D0' },
//   ];

//   const barData = [
//     { name: 'Campaign 1', total: 5650 },
//     { name: 'Campaign 2', total: 7650 },
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
//       {/* Button to open modal */}
//       <button
//         onClick={() => setShowModal(true)}
//         className="px-6 py-3 mb-6 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//       >
//         Create Campaign
//       </button>

//       {/* Modal */}
//       {showModal ? (
//         <>
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-8 relative overflow-y-auto h-4/5">
//               <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Create Campaign</h1>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
//                   <input
//                     type="text"
//                     name="campaignName"
//                     value={formData.campaignName}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Start Date</label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={formData.startDate}
//                       onChange={handleInputChange}
//                       className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">End Date</label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={formData.endDate}
//                       onChange={handleInputChange}
//                       className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">AI Assistant</label>
//                   <select
//                     name="aiAssistant"
//                     value={formData.aiAssistant}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select AI Assistant</option>
//                     <option value="assistant1">Assistant 1</option>
//                     <option value="assistant2">Assistant 2</option>
//                     <option value="assistant3">Assistant 3</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Bot Voice</label>
//                   <select
//                     name="botVoice"
//                     value={formData.botVoice}
//                     onChange={handleBotVoiceChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select Voice</option>
//                     <option value="English_demo.mp3">Voice 1</option>
//                     <option value="Hindi_demo.mp3">Voice 2</option>
//                     <option value="marathi_demo.mp3">Voice 3</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <select
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select Phone Number</option>
//                     <option value="+1234567890">+1234567890</option>
//                     <option value="+0987654321">+0987654321</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Upload Audio/Video (MP3)</label>
//                   <input
//                     type="file"
//                     name="file"
//                     accept="audio/mp3"
//                     onChange={handleFileUpload}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Caller List</label>
//                   <input
//                     type="file"
//                     name="callerList"
//                     onChange={handleFileUpload}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Message Template</label>
//                   <textarea
//                     name="messageTemplate"
//                     value={formData.messageTemplate}
//                     onChange={handleInputChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 {/* Buttons for playing both the uploaded file and bot voice */}
//                 <div className="space-y-4">
//                   {/* Play Bot Voice */}
//                   <div>
//                     <button
//                       type="button"
//                       onClick={handlePlayBotVoice}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       Play Bot Voice
//                     </button>
//                     <audio ref={botVoiceAudioRef} src={botVoiceSrc} controls hidden />
//                   </div>

//                   {/* Play Uploaded Audio */}
//                   <div>
//                     <button
//                       type="button"
//                       onClick={handlePlayUploadedFile}
//                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     >
//                       Play Uploaded Audio
//                     </button>
//                     <audio ref={uploadedFileAudioRef} src={uploadedFileSrc} controls hidden />
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-4 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </>
//       ) : null}

//       {/* Campaigns List with Pie and Bar Charts */}
//       <div className="grid grid-cols-1 gap-8 w-full max-w-3xl">
//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign 1: YES Bank credit card launch</h2>
//           <p className="text-center"><strong>Start Date:</strong> 2024-09-20</p>
//           <p className="text-center"><strong>Status:</strong> Ongoing</p>
//           <p className="text-center"><strong>Remaining Minutes :</strong> 6000 mins</p>
//           <p className="text-center"><strong>Completion:</strong> 65%</p>
//           <p className="text-center"><strong>Total Interactions:</strong> 5650 customers</p>
//           <div className="flex justify-center">
//             <PieChart width={300} height={200}>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign 2: Customer care at Taj Colaba</h2>
//           <p className="text-center"><strong>Start Date:</strong> 2024-07-20</p>
//           <p className="text-center"><strong>Status:</strong> Ongoing</p>
//           <p className="text-center"><strong>Remaining Minutes :</strong> 4500 mins</p>
//           <p className="text-center"><strong>Completion:</strong> 55%</p>
//           <p className="text-center"><strong>Total Interactions:</strong> 7650 customers</p>
//           <div className="flex justify-center">
//             <PieChart width={300} height={200}>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </div>
//         </div>

//         {/* Bar Graph */}
//         <div className="bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign Statistics</h2>
//           <div className="flex justify-center">
//             <BarChart width={400} height={250} data={barData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="total" fill="rgba(75, 192, 192, 0.6)" />
//             </BarChart>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CampaignsPage;








import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const CampaignsPage = () => {
  const [formData, setFormData] = useState({
    campaignName: '',
    startDate: '',
    endDate: '',
    aiAssistant: '',
    botVoice: '',
    phoneNumber: '',
    file: null,
    preExistingMP3: '',
    callerList: null,
    messageTemplate: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [botVoiceSrc, setBotVoiceSrc] = useState(''); // State for bot voice audio source
  const [uploadedFileSrc, setUploadedFileSrc] = useState(''); // State for uploaded file audio source
  const botVoiceAudioRef = React.createRef();
  const uploadedFileAudioRef = React.createRef();
  const [isMounted, setIsMounted] = useState(false); // Check if the component is mounted

  useEffect(() => {
    setIsMounted(true); // Component is now mounted
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

    // Create a URL for the uploaded file and set it as the uploaded file audio source
    if (e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setUploadedFileSrc(fileUrl);
    }
  };

  const handleBotVoiceChange = (e) => {
    handleInputChange(e);
    // Set the bot voice source based on the selected option, assuming the files are now in the public folder
    setBotVoiceSrc(`/${e.target.value}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  const handlePlayBotVoice = () => {
    if (botVoiceAudioRef.current && botVoiceSrc) {
      botVoiceAudioRef.current.src = botVoiceSrc; // Ensure the audio element gets updated
      botVoiceAudioRef.current.play();
    }
  };

  const handlePlayUploadedFile = () => {
    if (uploadedFileAudioRef.current && uploadedFileSrc) {
      uploadedFileAudioRef.current.src = uploadedFileSrc; // Ensure the audio element gets updated
      uploadedFileAudioRef.current.play();
    }
  };

  if (!isMounted) {
    return null; // Prevent rendering on the server
  }

  // Dummy data for Recharts
  const pieData = [
    { name: 'Reached', value: 9000, fill: '#FFC6C6' },
    { name: 'Not Reached', value: 6000, fill: '#FFEBD4' },
    { name: 'Completion (mins)', value: 4500, fill: '#F0A8D0' },
  ];

  const barData = [
    { name: 'Campaign 1', total: 5650 },
    { name: 'Campaign 2', total: 7650 },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      {/* Button to open modal */}
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 mb-6 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Create Campaign
      </button>

      {/* Modal */}
      {showModal ? (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-8 relative overflow-y-auto h-4/5">
              <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Create Campaign</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                  <input
                    type="text"
                    name="campaignName"
                    value={formData.campaignName}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">AI Assistant</label>
                  <select
                    name="aiAssistant"
                    value={formData.aiAssistant}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select AI Assistant</option>
                   
                    <option value="assistant2">customer care at Taj </option>
                    <option value="assistant3">Campaign for IDFC Bank </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Voice</label>
                  <select
                    name="botVoice"
                    value={formData.botVoice}
                    onChange={handleBotVoiceChange}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Voice</option>
                    <option value="English_demo.mp3">English</option>
                    <option value="Hindi_demo.mp3">Hindi</option>
                    <option value="marathi_demo.mp3">Marathi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <select
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Phone Number</option>
                    <option value="+1234567890">+1234567890</option>
                    <option value="+0987654321">+0987654321</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Audio (MP3)</label>
                  <input
                    type="file"
                    name="file"
                    accept="audio/mp3"
                    onChange={handleFileUpload}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Caller List</label>
                  <input
                    type="file"
                    name="callerList"
                    onChange={handleFileUpload}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message Template</label>
                  <textarea
                    name="messageTemplate"
                    value={formData.messageTemplate}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Buttons for playing both the uploaded file and bot voice */}
                <div className="space-y-4">
                  {/* Play Bot Voice */}
                  <div>
                    <button
                      type="button"
                      onClick={handlePlayBotVoice}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Play Bot Voice
                    </button>
                    <audio ref={botVoiceAudioRef} controls hidden />
                  </div>

                  {/* Play Uploaded Audio */}
                  <div>
                    <button
                      type="button"
                      onClick={handlePlayUploadedFile}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Play Uploaded Audio
                    </button>
                    <audio ref={uploadedFileAudioRef} controls hidden />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : null}

      {/* Campaigns List with Pie and Bar Charts */}
      <div className="grid grid-cols-1 gap-8 w-full max-w-3xl">
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign 1: YES Bank credit card launch</h2>
          <p className="text-center"><strong>Start Date:</strong> 2024-09-20</p>
          <p className="text-center"><strong>Status:</strong> Ongoing</p>
          <p className="text-center"><strong>Remaining Minutes :</strong> 6000 mins</p>
          <p className="text-center"><strong>Completion:</strong> 65%</p>
          <p className="text-center"><strong>Total Interactions:</strong> 5650 customers</p>
          <div className="flex justify-center">
            <PieChart width={300} height={200}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign 2: Customer care at Taj Colaba</h2>
          <p className="text-center"><strong>Start Date:</strong> 2024-07-20</p>
          <p className="text-center"><strong>Status:</strong> Ongoing</p>
          <p className="text-center"><strong>Remaining Minutes :</strong> 4500 mins</p>
          <p className="text-center"><strong>Completion:</strong> 55%</p>
          <p className="text-center"><strong>Total Interactions:</strong> 7650 customers</p>
          <div className="flex justify-center">
            <PieChart width={300} height={200}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Bar Graph */}
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold text-indigo-700 text-center">Campaign Statistics</h2>
          <div className="flex justify-center">
            <BarChart width={400} height={250} data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="rgba(75, 192, 192, 0.6)" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
