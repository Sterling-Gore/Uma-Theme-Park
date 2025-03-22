import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ editMode, setActiveTab }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: '',
    attraction: '',
    email: '',
    phone_number: '',
    password: '',
    supervisor_email: ''
  });

  const [attractions, setAttractions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (editMode) {
      const storedEmployee = JSON.parse(localStorage.getItem('editEmployee') || '{}');
      setFormData({
        first_name: storedEmployee.first_name || '',
        last_name: storedEmployee.last_name || '',
        role: storedEmployee.role || '',
        attraction: storedEmployee.attraction || '',
        email: storedEmployee.email || '',
        phone_number: storedEmployee.phone_number || '',
        password: '',
        supervisor_email: storedEmployee.supervisor_email || ''
      });
    }
  }, [editMode]);


  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getAttractionName`);

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


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/viewEmployees`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        if (data.success) {
          setEmployees(data.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      try {
        const updateData = { ...formData };

        if (!updateData.email) {
          alert('Error: Email is missing. Cannot update.');
          return;
        }

        console.log("Sending update data:", updateData);

        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateEmployee`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Update error response:", errorText);
          throw new Error(`Failed to update employee: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Update response data:", data);

        if (data.success || data.message === "Success") {
          setActiveTab('view');

          localStorage.removeItem('editEmployee');
        } else {
          alert('Error updating employee: ' + data.message);
        }
      } catch (error) {
        console.error('Error updating employee:', error);
        alert('Error updating employee: ' + error.message);
      }
    } else {

      try {
        const createData = { ...formData };

        console.log("Sending create data:", createData);

        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/createEmployee`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Create error response:", errorText);
          throw new Error(`Failed to create employee: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Create response data:", data);

        if (data.message === "Success") {
          setActiveTab('view');
        } else {
          alert('Error creating employee: ' + data.message);
        }
      } catch (error) {
        console.error('Error creating employee:', error);
        alert('Error creating employee: ' + error.message);
      }
    }
  };

  const getAttractionValue = () => {
    if (formData.attraction) {
      return formData.attraction;
    }
    return '';
  };

  return (
    <div className="employee-form-container">
      <div className="content-header">
        <h2>{editMode ? 'Modify Employee' : 'Create New Employee'}</h2>
        {editMode && (
          <div className="employee-identifier">
            <p>Editing employee: <strong>{formData.first_name} {formData.last_name}</strong></p>
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
              required
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
            onClick={() => {
              setActiveTab('view');
              if (editMode) {
                localStorage.removeItem('editEmployee');
              }
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;