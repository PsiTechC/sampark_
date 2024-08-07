import { useState } from 'react';

const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseValidFrom, setLicenseValidFrom] = useState('');
  const [assistant, setAssistant] = useState('');
  const [organization, setOrganization] = useState('');

  const handleSubmit = () => {
    onSave({
      name,
      email,
      phone,
      licenseValidFrom,
      assistant,
      organization,
    });
    setName('');
    setEmail('');
    setPhone('');
    setLicenseValidFrom('');
    setAssistant('');
    setOrganization('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Add Client</h2>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Phone</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">License Valid From</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={licenseValidFrom}
            onChange={(e) => setLicenseValidFrom(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Assistant</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={assistant}
            onChange={(e) => setAssistant(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Organization</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
