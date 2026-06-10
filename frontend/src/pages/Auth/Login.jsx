import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthIllustration from '../../components/AuthIllustration';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, error, setError, user } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/tasks' : '/my-tasks'} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setLocalError('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setLocalError('Email and password are required.');
      return;
    }

    try {
      setSubmitting(true);
      const signedInUser = await login(form);
      navigate(signedInUser.role === 'admin' ? '/admin/tasks' : '/my-tasks', { replace: true });
    } catch (requestError) {
      setLocalError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">Task Manager</div>

        <div className="auth-copy">
          <h1>Welcome Back</h1>
          <p>Please enter your details to log in.</p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="form-grid-single">
            <label>
              Email Address
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
              />
            </label>
          </div>

          {(localError || error) && <p className="form-error">{localError || error}</p>}

          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>

          <p className="helper-row">
            Don’t have an account? <Link className="link-text" to="/signup">Sign Up</Link>
          </p>
        </form>
      </section>

      <aside className="auth-visual">
        <AuthIllustration />
      </aside>
    </div>
  );
};

export default Login;
