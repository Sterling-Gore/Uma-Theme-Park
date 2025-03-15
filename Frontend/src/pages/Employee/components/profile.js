import React from 'react';

const Profile = ({ setActiveTab }) => {
  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <p>View and update your profile information here.</p>
      <button onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default Profile;
