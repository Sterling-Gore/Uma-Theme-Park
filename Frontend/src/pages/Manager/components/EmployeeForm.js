import React from 'react';

const EmployeeForm = ({ formData, handleInputChange, handleSubmit, editMode, setActiveTab }) => {
  const getAttractionValue = () => {
    if (typeof formData.attraction_pos === 'number') {
      return 'attration1'; // Convert from number to string form representation
    }
    return formData.attraction_pos || '';
  };

  return (
    <div className="employee-form-container">
      <div className="content-header">
        <h2>{editMode ? 'Modify Employee' : 'Create New Employee'}</h2>
        {editMode && (
          <div className="employee-identifier">
            <p>Editing employee: <strong>{formData.email}</strong></p>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="employee">employee</option>
            <option value="manager">manager</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="attraction_pos">Attraction Position</label>
          <select
            id="attraction_pos"
            name="attraction_pos"
            value={getAttractionValue()}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Attraction</option>
            <option value="attration1">attration1</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email{editMode ? ' (New)' : ''}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {editMode && (
            <small className="form-help-text">
              Changing this will update the employee's login email.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
          />
        </div>

        {!editMode && (
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleInputChange}
              required={!editMode}
            />
          </div>
        )}

        {editMode && (
          <div className="form-group">
            <label htmlFor="password">New Password (Optional)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleInputChange}
            />
            <small className="form-help-text">
              Leave blank to keep current password.
            </small>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="supervisor_email">Supervisor Email (Optional)</label>
          <input
            type="text"
            id="supervisor_email"
            name="supervisor_email"
            value={formData.supervisor_email || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editMode ? 'Update Employee' : 'Create Employee'}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => setActiveTab('view')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;