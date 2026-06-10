import { LayoutGrid, ListChecks, PlusSquare, Users, LogOut, ClipboardList, UserCircle2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getMediaUrl } from '../services/api';

const Sidebar = ({ user, onLogout }) => {
  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { to: '/my-tasks', label: 'Manage Tasks', icon: ListChecks },
    { to: '/tasks/new', label: 'Create Task', icon: PlusSquare },
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
  ];

  if (user?.role === 'admin') {
    items.push({ to: '/admin/users', label: 'Team Members', icon: Users });
  }

  return (
    <aside className="sidebar">
      <div>
        <div className="brand-shell">
          <div className="brand-mark">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="brand-title">Task Manager</p>
            <span className="brand-subtitle">{user?.role === 'admin' ? 'Admin Workspace' : 'Personal Workspace'}</span>
          </div>
        </div>

        <div className="profile-card">
          {user?.avatarUrl ? (
            <img className="avatar avatar-lg avatar-image" src={getMediaUrl(user.avatarUrl)} alt={user?.name || 'User avatar'} />
          ) : (
            <div className="avatar avatar-lg">{user?.name?.slice(0, 2).toUpperCase() || 'TM'}</div>
          )}
          <span className={`role-pill ${user?.role === 'admin' ? 'role-admin' : 'role-user'}`}>
            {user?.role || 'user'}
          </span>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>

        <nav className="nav-stack">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button className="logout-button" type="button" onClick={onLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
