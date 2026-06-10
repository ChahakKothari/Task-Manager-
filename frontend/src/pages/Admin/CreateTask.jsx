import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TaskForm from '../../components/TaskForm';
import { useAuth } from '../../context/AuthContext';
import { tasksApi, usersApi } from '../../services/api';
import { useEffect, useState } from 'react';

const CreateTask = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      if (user?.role !== 'admin') {
        return;
      }

      try {
        const response = await usersApi.list();
        setUsers(response.data.users || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load team members');
      }
    };

    loadUsers();
  }, [user?.role]);

  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      await tasksApi.create(payload);
      navigate(user?.role === 'admin' ? '/admin/tasks' : '/my-tasks', {
        replace: true,
        state: { notice: 'Task created successfully.' },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create task');
    } finally {
      setSubmitting(false);
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
        <section className="create-task-shell">
          <div className="page-topbar">
            <div>
              <h1 className="section-title">Create Task</h1>
              <p className="section-subtitle">Capture the task details, assign ownership, and keep the board moving.</p>
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}

          <TaskForm
            users={users}
            isAdmin={user?.role === 'admin'}
            onSubmit={handleSubmit}
            submitLabel="Create Task"
            onCancel={() => navigate(user?.role === 'admin' ? '/admin/tasks' : '/my-tasks')}
            isSubmitting={submitting}
          />
        </section>
      </main>
    </div>
  );
};

export default CreateTask;
