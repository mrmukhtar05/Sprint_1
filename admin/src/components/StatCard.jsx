export default function StatCard({ label, value, note, icon }) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-head">
        <span>{label}</span>
        <b>{icon}</b>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}
