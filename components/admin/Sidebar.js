import { useState } from 'react';

export default function Sidebar({ currentTab, onChangeTab }) {
  const tabs = ['Clients', 'Assistants'];

  return (
    <div className="w-64 min-h-screen bg-white border-r shadow-sm">
      <div className="p-6 font-bold text-lg">Admin Dashboard</div>
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`px-6 py-3 cursor-pointer hover:bg-gray-100 ${
              currentTab === tab ? 'bg-gray-100 font-semibold' : ''
            }`}
            onClick={() => onChangeTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
}
