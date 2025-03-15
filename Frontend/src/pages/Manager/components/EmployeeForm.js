import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ formData, handleInputChange, handleSubmit, editMode, setActiveTab, employees }) => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/getAttractionName');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setAttractions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching attractions:', err);
        setError('Failed to load attractions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  // Get attraction value from formData
  const getAttractionValue = () => {
    if (formData.attraction) {
      return formData.attraction;
    }
    return '';
  };

  // Find supervisor information if available
  useEffect(() => {
    if (editMode && formData.email && !formData.supervisor_email && employees) {
      const employee = employees.find(emp => emp.email === formData.email);
      if (employee && employee.supervisors_id) {
        const supervisor = employees.find(emp => emp.employee_id === employee.supervisors_id);
        if (supervisor) {
          // Create a synthetic event to update the supervisor email
          const event = {
            target: {
              name: 'supervisor_email',
              value: supervisor.email
            }
          };
          handleInputChange(event);
        }
      }
    }
  }, [editMode, formData.email, formData.supervisor_email, employees, handleInputChange]);

  return (
    <div className="employee-form-container">
      <div className="content-header">
        <h2>{editMode ? 'Modify Employee' : 'Create New Employee'}</h2>
        {editMode && (
          <div className="employee-identifier">
            <p>Editing employee: <strong>{formData.first_name}</strong></p>
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
            value={formData.first_name || ''}
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
            value={formData.last_name || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="employee">employee</option>
            <option value="manager">manager</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="attraction">Assigned Attraction</label>
          <select
            id="attraction"
            name="attraction"
            value={getAttractionValue()}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            <option value="">Select Attraction</option>
            {error ? (
              <option value="" disabled>{error}</option>
            ) : loading ? (
              <option value="" disabled>Loading attractions...</option>
            ) : (
              attractions.map(attraction => (
                <option 
                  key={attraction.attraction_id} 
                  value={attraction.attraction_id}
                >
                  {attraction.attraction_name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email{editMode ? ' (New)' : ''}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
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
            value={formData.phone_number || ''}
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