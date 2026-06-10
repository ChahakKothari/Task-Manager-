import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthIllustration from '../../components/AuthIllustration';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register, error, setError, user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', inviteCode: '' });
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

    if (!form.name || !form.email || !form.password) {
      setLocalError('Name, email, and password are required.');
      return;
    }

    try {
      setSubmitting(true);
      const signedUpUser = await register(form);
      navigate(signedUpUser.role === 'admin' ? '/admin/tasks' : '/my-tasks', { replace: true });
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
          <h1>Create an Account</h1>
          <p>Join us today by entering your details below.</p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="form-grid-two">
            <label>
              Full Name
              <input name="name" value={form.name} onChange={handleChange} placeholder="John" />
            </label>
            <label>
              Email Address
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
            </label>
          </div>

          <div className="form-grid-two">
            <label>
              Password
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
            </label>
            <label>
              Admin Invite Token
              <input name="inviteCode" value={form.inviteCode} onChange={handleChange} placeholder="Paste invite code if you have one" />
            </label>
          </div>

          {(localError || error) && <p className="form-error">{localError || error}</p>}

          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Sign Up'}
          </button>

          <p className="helper-row">
            Already have an account? <Link className="link-text" to="/login">Login</Link>
          </p>
        </form>
      </section>

      <aside className="auth-visual">
        <AuthIllustration />
      </aside>
    </div>
  );
};

export default Signup;
