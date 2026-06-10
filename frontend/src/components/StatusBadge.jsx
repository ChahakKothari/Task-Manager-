const statusStyles = {
  pending: 'status status-pending',
  completed: 'status status-completed',
};

const StatusBadge = ({ status }) => {
  return <span className={statusStyles[status] || 'status'}>{status}</span>;
};

export default StatusBadge;
