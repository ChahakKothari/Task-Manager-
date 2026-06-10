import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { tasksApi } from '../../services/api';

const ViewTaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await tasksApi.getOne(id);
        setTask(response.data.task);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load task details');
      }
    };

    loadTask();
  }, [id]);

  const handleToggle = async () => {
    try {
      const response = await tasksApi.toggleStatus(id);
      setTask(response.data.task);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    try {
      await tasksApi.remove(id);
      navigate(user?.role === 'admin' ? '/admin/tasks' : '/my-tasks');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="workspace-shell">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="workspace-main">
        <section className="details-shell">
          {error ? <p className="form-error">{error}</p> : null}

          {task ? (
            <>
              <div className="details-header">
                <div>
                  <p className="meta-note">Task Details</p>
                  <h1 className="details-title">{task.title}</h1>
                  <p className="section-subtitle">View and manage the selected task from a dedicated detail screen.</p>
                </div>
                <StatusBadge status={task.status} />
              </div>

              <div className="details-grid">
                <div className="workspace-card">
                  <h3 className="section-title">Description</h3>
                  <p className="task-description">{task.description}</p>
                </div>
                <div className="workspace-card">
                  <h3 className="section-title">Assignment</h3>
                  <p className="task-description">Assigned to: {task.userId?.name || 'Unassigned'}</p>
                  <p className="task-description">Priority: {task.priority}</p>
                  <p className="task-description">
                    Due date: {task.dueDate ? new Intl.DateTimeFormat('en-GB').format(new Date(task.dueDate)) : 'No due date'}
                  </p>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '18px' }}>
                <button type="button" className="button button-ghost" onClick={() => navigate(-1)}>
                  Back
                </button>
                <button type="button" className="button button-primary" onClick={handleToggle}>
                  Toggle Status
                </button>
                <button type="button" className="button button-ghost" onClick={handleDelete}>
                  Delete Task
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">Loading task details...</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ViewTaskDetails;
