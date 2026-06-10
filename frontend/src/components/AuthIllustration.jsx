const team = [
  { name: 'Adam Cole', email: 'adam@timetoprogram.com', avatar: 'AC' },
  { name: 'Luke Ryan', email: 'luke@timetoprogram.com', avatar: 'LR' },
];

const AuthIllustration = () => {
  return (
    <div className="auth-illustration">
      <div className="auth-hero-copy">
        <span className="hero-eyebrow">Modern task workspace</span>
        <h2>Plan work, assign owners, and track delivery with clarity.</h2>
        <p>
          A calmer workflow with premium visuals, strong hierarchy, and a responsive layout that stays stable on every screen.
        </p>
      </div>

      <div className="visual-stack">
        <div className="floating-card task-card-mini task-card-top">
          <div className="badge-row">
            <span className="pill pill-soft">Pending</span>
            <span className="pill pill-warm">Medium Priority</span>
          </div>
          <h3>Social Media Campaign</h3>
          <p>
            Build a polished campaign plan with clear milestones, approvals, and a realistic delivery timeline.
          </p>
          <div className="mini-progress">
            <div className="mini-progress-bar" />
          </div>
        </div>

        <div className="team-strip">
          {team.map((member) => (
            <div className="person-chip" key={member.email}>
              <div className="avatar avatar-sm">{member.avatar}</div>
              <div>
                <strong>{member.name}</strong>
                <span>{member.email}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="floating-card task-card-mini task-card-bottom">
          <div className="badge-row">
            <span className="pill pill-soft">Pending</span>
            <span className="pill pill-warm">Medium Priority</span>
          </div>
          <h3>Social Media Campaign</h3>
          <p>
            Keep the same visual rhythm across the workstream to preserve focus and fast task scanning.
          </p>
          <div className="mini-progress">
            <div className="mini-progress-bar mini-progress-wide" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthIllustration;
