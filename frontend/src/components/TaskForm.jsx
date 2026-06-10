import { useEffect, useState } from 'react';

const defaultValues = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  userId: '',
};

const TaskForm = ({ initialValues, users = [], isAdmin = false, onSubmit, submitLabel, onCancel, isSubmitting = false }) => {
  const [values, setValues] = useState(defaultValues);
  const [error, setError] = useState('');

  useEffect(() => {
    setValues({
      ...defaultValues,
      ...initialValues,
      dueDate: initialValues?.dueDate ? String(initialValues.dueDate).slice(0, 10) : '',
      userId: initialValues?.userId?._id || initialValues?.userId || '',
    });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.title.trim() || !values.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setError('');
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate,
      userId: values.userId,
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-grid-single">
        <label>
          Task Title
          <input name="title" value={values.title} onChange={handleChange} placeholder="Create App UI" />
        </label>
      </div>

      <label>
        Description
        <textarea
          name="description"
          rows="5"
          value={values.description}
          onChange={handleChange}
          placeholder="Describe the task, target, and expected output"
        />
      </label>

      <div className="form-grid-two">
        <label className="field-stack">
          Status
          <select name="status" value={values.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label className="field-stack">
          Priority
          <select name="priority" value={values.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div className="form-grid-two">
        <label className="field-stack">
          Due Date
          <input type="date" name="dueDate" value={values.dueDate} onChange={handleChange} />
        </label>

        {isAdmin ? (
          <label className="field-stack assignee-field">
            Assign To
            <select name="userId" value={values.userId} onChange={handleChange}>
              <option value="">Select a team member</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="form-placeholder" />
        )}
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="button button-ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button type="submit" className="button button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel || 'Save Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
