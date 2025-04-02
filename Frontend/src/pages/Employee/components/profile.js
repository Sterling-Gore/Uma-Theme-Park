import React, { useState } from 'react';

const Profile = ({ setActiveTab }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Updated Data:', formData);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-4">My Account</h2>
      <div className="flex justify-end">
        {!isEditing && (
          <button onClick={handleEdit} className="px-4 py-2 bg-gray-300 rounded">Edit</button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block font-medium">First Name</label>
          <input 
            type="text" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            disabled={!isEditing}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Last Name</label>
          <input 
            type="text" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            disabled={!isEditing}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block font-medium">Email</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          disabled={!isEditing}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mt-4">
        <label className="block font-medium">Phone Number</label>
        <input 
          type="text" 
          name="phoneNumber" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
          disabled={!isEditing}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mt-4">
        <label className="block font-medium">Password</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          disabled={!isEditing}
          className="w-full border p-2 rounded"
        />
      </div>
      {isEditing && (
        <div className="mt-4 text-right">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      )}
      <div className="mt-4 text-center">
        <button onClick={() => setActiveTab('dashboard')} className="px-4 py-2 bg-gray-500 text-white rounded">Back to Dashboard</button>
      </div>
    </div>
  );
};

export default Profile;