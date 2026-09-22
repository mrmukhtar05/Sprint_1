export default function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="admin-section-title">
      <div>
        {eyebrow && <span className="admin-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
