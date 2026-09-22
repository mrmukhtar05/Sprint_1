import { useAuth } from "../context/AuthContext";
import SectionTitle from "../components/SectionTitle";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="admin-page">
      <SectionTitle
        eyebrow="CONFIGURATION"
        title="Settings"
        description="Basic admin account and store configuration."
      />
      <section className="admin-panel">
        <div className="admin-settings-grid">
          <div className="admin-setting-card">
            <span>ADMIN ACCOUNT</span>
            <h3>{user?.name || "Admin"}</h3>
            <p>{user?.email || "—"}</p>
            <small>Role: {user?.role || "admin"}</small>
          </div>
          <div className="admin-setting-card">
            <span>STORE</span>
            <h3>Vintage Vault</h3>
            <p>Admin control panel</p>
            <small>Frontend store management</small>
          </div>
        </div>
      </section>
    </div>
  );
}
