// components/AddClientModal.js

import { useState } from 'react';

const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [client, setClient] = useState({
    name: '',
    licenseValidFrom: '',
    licenseValidTo: '',
    email: '',
    phone: '',
    organization: '',
    purpose: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(client);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Client</h2>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={client.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>License Valid From</label>
            <input type="date" name="licenseValidFrom" value={client.licenseValidFrom} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>License Valid To</label>
            <input type="date" name="licenseValidTo" value={client.licenseValidTo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={client.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={client.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Organization</label>
            <input type="text" name="organization" value={client.organization} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Purpose</label>
            <input type="text" name="purpose" value={client.purpose} onChange={handleChange} required />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 400px;
          max-width: 100%;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          margin-right: 1rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background: #0070f3;
          color: white;
          cursor: pointer;
        }
        button[type="button"] {
          background: #ccc;
        }
      `}</style>
    </div>
  );
};

export default AddClientModal;
