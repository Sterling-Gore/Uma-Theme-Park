import React from 'react';

const EmployeeForm = ({ formData, handleInputChange, handleSubmit, editMode, setActiveTab }) => {
  return (
    <div className="employee-form-container">
      <div className="content-header">
        <h2>{editMode ? 'Modify Employee' : 'Create New Employee'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Attractions">Attractions</option>
            <option value="Dining">Dining</option>
            <option value="Retail">Retail</option>
            <option value="Custodial">Custodial</option>
            <option value="Administration">Administration</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
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