import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../services/api';

const ManageUsers = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await usersApi.list();
        setUsers(response.data.users || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load team members');
      }
    };

    loadUsers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="workspace-shell">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="workspace-main">
        <section className="users-shell">
          <div className="page-topbar">
            <div>
              <h1 className="section-title">Team Members</h1>
              <p className="section-subtitle">View the users available for task assignment.</p>
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="team-list">
            {users.map((member) => (
              <div className="team-item" key={member.id}>
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.email}</span>
                </div>
                <span className={`role-pill ${member.role === 'admin' ? 'role-admin' : 'role-user'}`}>{member.role}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManageUsers;
