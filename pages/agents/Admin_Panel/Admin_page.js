import { useState } from 'react';
import Sidebar from '../../../components/admin/Sidebar';
import ClientView from '../../../components/admin/ClientView';
import AssistantView from '../../../components/admin/AssistantView';

export default function AdminPage() {
  const [tab, setTab] = useState('Clients');

  return (
    <div className="flex">
      <Sidebar currentTab={tab} onChangeTab={setTab} />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        {tab === 'Clients' && <ClientView />}
        {tab === 'Assistants' && <AssistantView />}
      </div>
    </div>
  );
}