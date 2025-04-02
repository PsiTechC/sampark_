// components/agents/CallAgentModal.js

import React, { useState } from "react";

export default function CallAgentModal({ agentId, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const API_KEY = `${process.env.NEXT_PUBLIC_API_TOKEN}`;

  const handleCallNow = async () => {
    if (!agentId) {
      alert("No agent selected!");
      return;
    }
    try {
      const res = await fetch("https://api.bolna.dev/call", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          recipient_phone_number: countryCode + phoneNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Call failed: " + JSON.stringify(data));
        return;
      }
      alert(`Call initiated! Execution ID: ${data.execution_id}`);
      onClose();
    } catch (err) {
      alert("Error placing call: " + err.message);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Place Outbound Call</h2>
      <div className="flex gap-2 items-center mb-4">
        <select
          className="border p-2 rounded"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="+1">+1 (US)</option>
          <option value="+91">+91 (India)</option>
          <option value="+44">+44 (UK)</option>
          {/* Add more country codes as needed */}
        </select>
        <input
          className="border p-2 rounded flex-1"
          type="text"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
          Cancel
        </button>
        <button
          onClick={handleCallNow}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Call Now
        </button>
      </div>
    </div>
  );
}
