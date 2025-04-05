import React, { useEffect, useState } from 'react';
import "../../../App.css";
import "./tasks.css"

const Tasks = ({ setActiveTab }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getTasks`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        if (data.tasks) {
          setTasks(data.tasks);
        } else {
          setTasks([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [refreshTasks]);

  const handleMarkCompleted = async (notificationId, merchandiseID) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateTaskStatus`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationId,
          isCompleted: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      const orderResponse = await fetch(`${process.env.REACT_APP_BACKEND_API}/makeMerchOrder`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({merchandise_id: merchandiseID})
      });

      if(!orderResponse.ok) {
        throw new Error('Failed to make merchandise order');
      }

      setRefreshTasks(!refreshTasks);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const filteredTasks = showCompleted
    ? tasks
    : tasks.filter(task => !task.isCompleted);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric'

    });
  };

  return (
    <div className="task-container">
      <div className="content-header">
        <h2>My Tasks</h2>
        <div className="filter-buttons">
          <button
            className={!showCompleted ? "active-filter" : ""}
            onClick={() => setShowCompleted(false)}
          >
            Pending Tasks
          </button>
          <button
            className={showCompleted ? "active-filter" : ""}
            onClick={() => setShowCompleted(true)}
          >
            All Tasks
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredTasks.length === 0 ? (
        <p>No {showCompleted ? '' : 'pending'} tasks available.</p>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <div
              key={task.merchandise_notification_id}
              className={`task-card ${task.isCompleted ? 'completed-task' : 'pending-task'}`}
            >
              <div className="task-content">
                <div className="task-header">
                  <h3>
                    {task.notification_message || 'Merchandise Task'}
                    <span className={`task-status ${task.isCompleted ? 'status-completed' : 'status-pending'}`}>
                      {task.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </h3>
                  <p className="task-date">{formatDate(task.created_at)}</p>
                </div>
                <div className="task-details">
                  <p><strong>Message:</strong> {task.message}</p>
                  {task.merchandise_id && <p><strong>Merchandise ID:</strong> {task.merchandise_id}</p>}
                </div>
                {!task.isCompleted && (
                  <button
                    className="complete-task-btn"
                    onClick={() => handleMarkCompleted(task.merchandise_notification_id, task.merchandise_id)}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="back-button"
        onClick={() => setActiveTab('dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Tasks;