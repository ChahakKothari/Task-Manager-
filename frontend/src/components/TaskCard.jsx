import { CalendarDays, Pencil, Trash2, RotateCcw, Paperclip } from 'lucide-react';
import StatusBadge from './StatusBadge';

const formatDate = (value) => {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const assignee = task.userId?.name || 'Unassigned';

  return (
    <article className="task-card">
      <div className="task-card-topline">
        <div className="task-card-badges">
          <StatusBadge status={task.status} />
          <span className={`priority-pill priority-${task.priority || 'medium'}`}>
            {task.priority || 'medium'} priority
          </span>
        </div>
        <div className="task-card-actions">
          <button type="button" className="icon-button" onClick={() => onEdit(task)} aria-label="Edit task">
            <Pencil size={16} />
          </button>
          <button type="button" className="icon-button" onClick={() => onToggle(task)} aria-label="Toggle task status">
            <RotateCcw size={16} />
          </button>
          <button type="button" className="icon-button danger" onClick={() => onDelete(task)} aria-label="Delete task">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3>{task.title}</h3>
      <p className="task-description">{task.description}</p>

      <div className="task-meta-grid">
        <div>
          <span className="task-meta-label">
            <CalendarDays size={14} /> Start/Due Date
          </span>
          <strong>{formatDate(task.dueDate)}</strong>
        </div>
        <div>
          <span className="task-meta-label">
            <Paperclip size={14} /> Assignee
          </span>
          <strong>{assignee}</strong>
        </div>
      </div>

      <div className="task-footer">
        <span className="task-note">Created {formatDate(task.createdAt)}</span>
        <span className="task-note">Updated {formatDate(task.updatedAt)}</span>
      </div>
    </article>
  );
};

export default TaskCard;
