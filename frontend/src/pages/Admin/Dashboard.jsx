import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Plus, Search, Sparkles } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import { useAuth } from '../../context/AuthContext';
import { invitesApi, tasksApi, usersApi } from '../../services/api';

const Dashboard = ({ title = 'My Tasks', subtitle = 'Track project work, status, and ownership from a single workspace.' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalMode, setModalMode] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState('');
  const [inviteDays, setInviteDays] = useState(7);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteExpiresAt, setInviteExpiresAt] = useState('');
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [taskBusy, setTaskBusy] = useState(false);
  const [taskNotice, setTaskNotice] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [taskResponse, userResponse] = await Promise.all([
        tasksApi.list(),
        user?.role === 'admin' ? usersApi.list() : Promise.resolve({ data: { users: [] } }),
      ]);

      setTasks(taskResponse.data.tasks || []);
      setUsers(userResponse.data.users || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.role]);

  useEffect(() => {
    if (location.state?.notice) {
      setTaskNotice(location.state.notice);
    }
  }, [location.state]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = filter === 'all' ? true : task.status === filter;
      const haystack = `${task.title} ${task.description} ${task.userId?.name || ''}`.toLowerCase();
      const matchesSearch = searchTerm.trim() ? haystack.includes(searchTerm.trim().toLowerCase()) : true;

      return matchesStatus && matchesSearch;
    });
  }, [tasks, filter, searchTerm]);

  const metrics = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const pending = tasks.filter((task) => task.status === 'pending').length;
    const highPriority = tasks.filter((task) => task.priority === 'high').length;

    return [
      { label: 'All Tasks', value: tasks.length },
      { label: 'Pending', value: pending },
      { label: 'Completed', value: completed },
      { label: 'High Priority', value: highPriority },
    ];
  }, [tasks]);

  const updateTaskInState = (updatedTask) => {
    setTasks((current) => current.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
  };

  const removeTaskFromState = (taskId) => {
    setTasks((current) => current.filter((task) => task._id !== taskId));
  };

  const handleSubmitTask = async (payload) => {
    try {
      setError('');
      setTaskNotice('');
      setTaskBusy(true);

      if (modalMode === 'edit' && selectedTask) {
        const response = await tasksApi.update(selectedTask._id, payload);
        updateTaskInState(response.data.task);
        setTaskNotice('Task updated successfully.');
      } else {
        const response = await tasksApi.create(payload);
        setTasks((current) => [response.data.task, ...current]);
        setTaskNotice('Task created successfully.');
      }

      setModalMode(null);
      setSelectedTask(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save task');
    } finally {
      setTaskBusy(false);
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    try {
      await tasksApi.remove(task._id);
      removeTaskFromState(task._id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete task');
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const response = await tasksApi.toggleStatus(task._id);
      updateTaskInState(response.data.task);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update task status');
    }
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setModalMode('create');
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setModalMode('edit');
  };

  const handleCreateInvite = async (event) => {
    event.preventDefault();

    try {
      setInviteBusy(true);
      setInviteMessage('');
      setError('');

      const response = await invitesApi.create({ expiresInDays: inviteDays });
      setInviteCode(response.data.invite.code);
      setInviteExpiresAt(new Date(response.data.invite.expiresAt).toLocaleString());
      setInviteMessage('Invite generated. Share it once, then it expires from the database.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to generate invite');
    } finally {
      setInviteBusy(false);
    }
  };

  const handleCopyInvite = async () => {
    if (!inviteCode) {
      return;
    }

    await navigator.clipboard.writeText(inviteCode);
    setInviteMessage('Invite code copied to clipboard.');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="page-center">Loading dashboard...</div>;
  }

  return (
    <div className="workspace-shell">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="workspace-main">
        <section className="workspace-card">
          <div className="page-topbar">
            <div>
                <h1 className="section-title">{title}</h1>
                <p className="section-subtitle">{subtitle}</p>
              </div>
            <div className="dashboard-actions">
              <div className="workspace-user-chip">
                <div className="avatar avatar-sm">{user?.name?.slice(0, 2).toUpperCase() || 'TM'}</div>
                <div>
                  <strong>{user?.name}</strong>
                  <span>{user?.role}</span>
                </div>
              </div>
              <button className="button button-primary" type="button" onClick={openCreateModal}>
                <Plus size={16} /> Create Task
              </button>
            </div>
          </div>

          <div className="stat-grid">
            {metrics.map((metric) => (
              <div className="stat-card" key={metric.label}>
                <span className="meta-note">{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>

          <div className="dashboard-toolbar">
            <label className="search-field">
              <Search size={16} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tasks, descriptions, or assignees"
              />
            </label>

            <div className="helper-row">
              <span className="status-legend">
                <Sparkles size={16} />
                {tasks.length} total tasks
              </span>
            </div>
          </div>

          {user?.role === 'admin' ? (
            <section className="workspace-card invite-panel">
              <div className="page-topbar">
                <div>
                  <h2 className="section-title">Create Admin Invite</h2>
                  <p className="section-subtitle">The server stores only a hash. The plain code is shown once here.</p>
                </div>
              </div>

              <form className="invite-form" onSubmit={handleCreateInvite}>
                <label>
                  Expires in days
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={inviteDays}
                    onChange={(event) => setInviteDays(Number(event.target.value))}
                  />
                </label>

                <button className="button button-primary" type="submit" disabled={inviteBusy}>
                  {inviteBusy ? 'Generating...' : 'Generate Invite'}
                </button>
              </form>

              {inviteCode ? (
                <div className="invite-result">
                  <div>
                    <span className="meta-note">Invite code</span>
                    <strong className="invite-code">{inviteCode}</strong>
                    <p className="helper-row">Expires: {inviteExpiresAt}</p>
                  </div>

                  <button className="button button-ghost" type="button" onClick={handleCopyInvite}>
                    <Copy size={16} /> Copy
                  </button>
                </div>
              ) : null}

              {inviteMessage ? <p className="helper-row">{inviteMessage}</p> : null}
            </section>
          ) : null}

          <div className="filter-row">
            <div className="filter-tabs">
              {['all', 'pending', 'completed'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`tab-pill ${filter === status ? 'tab-active' : ''}`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="helper-row">
              <span>{user?.role === 'admin' ? 'Admin can manage all tasks' : 'User only sees assigned tasks'}</span>
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}
          {taskNotice ? <p className="form-success">{taskNotice}</p> : null}

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">◎</div>
              <h3>No matching tasks</h3>
              <p>Try a different status filter or clear the search query.</p>
            </div>
          ) : (
            <div className="task-grid">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                  onToggle={handleToggleTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {modalMode ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setModalMode(null)}>
          <div className="modal-panel" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="page-topbar">
              <div>
                <h2 className="section-title">{modalMode === 'edit' ? 'Edit Task' : 'Create Task'}</h2>
                <p className="section-subtitle">Keep the task board synchronized with the current update.</p>
              </div>
              <button className="button button-ghost" type="button" onClick={() => setModalMode(null)}>
                Close
              </button>
            </div>
            <TaskForm
              initialValues={selectedTask}
              users={users}
              isAdmin={user?.role === 'admin'}
              onSubmit={handleSubmitTask}
              submitLabel={modalMode === 'edit' ? 'Update Task' : 'Create Task'}
              onCancel={() => setModalMode(null)}
              isSubmitting={taskBusy}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
