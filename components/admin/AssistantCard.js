// import { useEffect, useState } from 'react';

// export default function AssistantCard({ assistantId }) {
//   const [details, setDetails] = useState(null);

//   useEffect(() => {
//     async function fetchAssistant() {
//       try {
//         const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//           },
//         });
//         const data = await res.json();
//         setDetails(data);
//       } catch (error) {
//         console.error(`Failed to fetch assistant ${assistantId}:`, error);
//       }
//     }

//     fetchAssistant();
//   }, [assistantId]);

//   if (!details) return <p>Loading bot details...</p>;

//   return (
//     <div className="border p-2 mt-2 rounded shadow-sm">
//       <p className="font-semibold">{details.name}</p>
//       <p className="text-sm text-gray-600">{details.description || 'No description'}</p>
//       {details.avatarUrl && (
//         <img src={details.avatarUrl} alt={details.name} className="h-16 w-16 rounded-full mt-2" />
//       )}
//     </div>
//   );
// }


// import { useEffect, useState } from 'react';

// export default function AssistantCard({ assistantId }) {
//   const [details, setDetails] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [form, setForm] = useState({ name: '', description: '' });

//   useEffect(() => {
//     async function fetchAssistant() {
//       try {
//         const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//           },
//         });
//         const data = await res.json();
//         setDetails(data);
//         setForm({ name: data.name || '', description: data.description || '' });
//       } catch (error) {
//         console.error(`Failed to fetch assistant ${assistantId}:`, error);
//       }
//     }

//     fetchAssistant();
//   }, [assistantId]);

// const handleSave = async () => {
//   try {
//     const payload = {
//       name: form.name,
//       firstMessage: form.firstMessage,
//     };

//     const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (res.ok) {
//       const updated = await res.json();
//       setDetails(updated);
//       setEditing(false);
//       alert('Assistant updated successfully!');
//     } else {
//       const errorData = await res.json();
//       console.error(errorData);
//       alert(errorData.message?.[0] || 'Update failed');
//     }
//   } catch (err) {
//     console.error('Failed to update assistant:', err);
//     alert('Error updating assistant');
//   }
// };


//   if (!details) return <p>Loading assistant details...</p>;

//   return (
//     <div className="bg-white border rounded p-4 shadow mb-4">
//       {editing ? (
//         <div className="space-y-2">
//       <input
//   className="border p-2 w-full rounded"
//   value={form.name}
//   onChange={(e) => setForm({ ...form, name: e.target.value })}
//   placeholder="Assistant Name"
// />

// <textarea
//   className="border p-2 w-full rounded"
//   rows="2"
//   value={form.firstMessage}
//   onChange={(e) => setForm({ ...form, firstMessage: e.target.value })}
//   placeholder="First message spoken by assistant"
// />

//           <div className="flex space-x-2 mt-2">
//             <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1 rounded">
//               Save
//             </button>
//             <button onClick={() => setEditing(false)} className="border px-3 py-1 rounded">
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <>
//           <p className="font-semibold text-lg">{details.name}</p>
//           <p className="text-gray-600 text-sm mb-2">{details.description}</p>
//           <button onClick={() => setEditing(true)} className="text-blue-600 underline text-sm">
//             Edit
//           </button>
//         </>
//       )}
//     </div>
//   );
// }








// import { useEffect, useState } from 'react';

// export default function AssistantCard({ assistantId }) {
//   const [details, setDetails] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [form, setForm] = useState({
//     name: '',
//     firstMessage: '',
//     voicemailMessage: '',
//     endCallMessage: ''
//   });

//   useEffect(() => {
//     async function fetchAssistant() {
//       try {
//         const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//           },
//         });
//         const data = await res.json();
//         setDetails(data);

//         // Pre-fill form only after data loads
//         setForm({
//           name: data.name || '',
//           firstMessage: data.firstMessage || '',
//           voicemailMessage: data.voicemailMessage || '',
//           endCallMessage: data.endCallMessage || ''
//         });
//       } catch (error) {
//         console.error(`Failed to fetch assistant ${assistantId}:`, error);
//       }
//     }

//     fetchAssistant();
//   }, [assistantId]);

//   const handleSave = async () => {
//     try {
//       const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
//         },
//         body: JSON.stringify({
//           name: form.name,
//           firstMessage: form.firstMessage,
//           voicemailMessage: form.voicemailMessage,
//           endCallMessage: form.endCallMessage
//         }),
//       });

//       if (res.ok) {
//         const updated = await res.json();
//         setDetails(updated);
//         setEditing(false);
//         alert('Assistant updated successfully!');
//       } else {
//         const err = await res.json();
//         alert(err.message?.[0] || 'Update failed.');
//       }
//     } catch (err) {
//       console.error('Update failed:', err);
//       alert('Something went wrong.');
//     }
//   };

//   if (!details) return <p>Loading assistant...</p>;

//   return (
//     <div className="bg-white border rounded p-4 shadow mb-4">
//       {!editing ? (
//         <>
//           <h3 className="text-lg font-semibold">{details.name}</h3>
//           <p className="text-sm text-gray-600 mb-2">
//             <strong>Welcome Message:</strong> {details.firstMessage}
//           </p>


//           {/* <p className="text-sm text-gray-600 mb-2">
//             <strong>Prompt:</strong> {details.model?.messages?.[0]?.content || 'N/A'}
//           </p> */}



//           <p className="text-sm text-gray-600 mb-2">
//             <strong>Voicemail Message:</strong> {details.voicemailMessage}
//           </p>
//           <p className="text-sm text-gray-600 mb-2">
//             <strong>End Call Message:</strong> {details.endCallMessage}
//           </p>

//           <button
//             onClick={() => setEditing(true)}
//             className="text-blue-600 underline text-sm mt-2"
//           >
//             Edit
//           </button>
//         </>
//       ) : (
//         <>
//           <input
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className="border p-2 w-full rounded mb-2"
//             placeholder="Assistant Name"
//           />
//           <textarea
//             value={form.firstMessage}
//             onChange={(e) => setForm({ ...form, firstMessage: e.target.value })}
//             className="border p-2 w-full rounded mb-2"
//             placeholder="First Message"
//             rows={2}
//           />
//           <textarea
//             value={form.voicemailMessage}
//             onChange={(e) => setForm({ ...form, voicemailMessage: e.target.value })}
//             className="border p-2 w-full rounded mb-2"
//             placeholder="Voicemail Message"
//             rows={2}
//           />
//           <textarea
//             value={form.endCallMessage}
//             onChange={(e) => setForm({ ...form, endCallMessage: e.target.value })}
//             className="border p-2 w-full rounded mb-2"
//             placeholder="End Call Message"
//             rows={2}
//           />

//           <div className="flex gap-3 mt-2">
//             <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1 rounded">
//               Save
//             </button>
//             <button
//               onClick={() => {
//                 setEditing(false);
//                 // reset form to original
//                 setForm({
//                   name: details.name,
//                   firstMessage: details.firstMessage,
//                   voicemailMessage: details.voicemailMessage,
//                   endCallMessage: details.endCallMessage
//                 });
//               }}
//               className="border px-4 py-1 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';

export default function AssistantCard({ assistantId }) {
  const [details, setDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    name: '',
    firstMessage: '',
    voicemailMessage: '',
    endCallMessage: ''
  });

  useEffect(() => {
    async function fetchAssistant() {
      try {
        const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
          },
        });
        const data = await res.json();
        setDetails(data);
        setForm({
          name: data.name || '',
          firstMessage: data.firstMessage || '',
          voicemailMessage: data.voicemailMessage || '',
          endCallMessage: data.endCallMessage || ''
        });
      } catch (error) {
        console.error(`Failed to fetch assistant ${assistantId}:`, error);
      }
    }

    fetchAssistant();
  }, [assistantId]);

  if (!details) return <p>Loading assistant...</p>;

  return (
    <div className="bg-white border rounded p-4 shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{details.name}</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-sm underline"
        >
          {expanded ? 'Hide' : 'View'} Details {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <>
          {!editing ? (
            <div className="space-y-2">
              <p>
                <strong>Welcome Message:</strong> {details.firstMessage}
              </p>

              <div className="text-sm text-gray-600">
                <strong>Prompt:</strong>
                <div className="max-h-24 overflow-y-auto mt-1 p-2 border rounded bg-gray-50">
                  {details.model?.messages?.[0]?.content || 'N/A'}
                </div>
              </div>

              <p>
                <strong>Voicemail Message:</strong> {details.voicemailMessage}
              </p>
              <p>
                <strong>End Call Message:</strong> {details.endCallMessage}
              </p>

              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 underline text-sm"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 w-full rounded"
                placeholder="Assistant Name"
              />
              <textarea
                value={form.firstMessage}
                onChange={(e) => setForm({ ...form, firstMessage: e.target.value })}
                className="border p-2 w-full rounded"
                placeholder="First Message"
              />
              <textarea
                value={form.voicemailMessage}
                onChange={(e) => setForm({ ...form, voicemailMessage: e.target.value })}
                className="border p-2 w-full rounded"
                placeholder="Voicemail Message"
              />
              <textarea
                value={form.endCallMessage}
                onChange={(e) => setForm({ ...form, endCallMessage: e.target.value })}
                className="border p-2 w-full rounded"
                placeholder="End Call Message"
              />
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
                        },
                        body: JSON.stringify(form),
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setDetails(updated);
                        setEditing(false);
                        alert('Assistant updated successfully!');
                      } else {
                        const err = await res.json();
                        alert(err.message?.[0] || 'Update failed.');
                      }
                    } catch (err) {
                      console.error('Update failed:', err);
                      alert('Something went wrong.');
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      name: details.name,
                      firstMessage: details.firstMessage,
                      voicemailMessage: details.voicemailMessage,
                      endCallMessage: details.endCallMessage
                    });
                  }}
                  className="border px-4 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
