import { useEffect, useState } from "react";
import api from "../api/api";
import SectionTitle from "../components/SectionTitle";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchCustomers = async (search) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/customers", {
        params: { limit: 100, search: search || undefined },
      });

      if (response.data?.success) {
        setCustomers(response.data.customers || []);
        setTotal(response.data.total || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(query), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const toggleStatus = async (customer) => {
    const nextActive = !customer.isActive;
    setCustomers((list) =>
      list.map((c) => (c._id === customer._id ? { ...c, isActive: nextActive } : c))
    );

    try {
      const response = await api.put(`/admin/customers/${customer._id}/status`, {
        isActive: nextActive,
      });
      if (!response.data?.success) throw new Error("Update failed");
    } catch (err) {
      setCustomers((list) =>
        list.map((c) => (c._id === customer._id ? { ...c, isActive: customer.isActive } : c))
      );
      alert(err.response?.data?.message || "Failed to update customer status.");
    }
  };

  return (
    <div className="admin-page">
      <SectionTitle
        eyebrow="CUSTOMERS"
        title="Customers"
        description={`${total} registered accounts in your store.`}
        action={
          <input
            className="admin-search"
            placeholder="Search name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        }
      />

      <section className="admin-panel">
        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-empty">Loading customers...</div>
        ) : !customers.length ? (
          <div className="admin-empty">No customers found.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>JOINED</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.phone || "—"}</td>
                    <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                    <td>
                      <span className={`admin-status ${c.isActive ? "" : "inactive"}`}>
                        {c.isActive ? "ACTIVE" : "DISABLED"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={c.isActive ? "admin-danger-btn" : "admin-secondary-btn"}
                        onClick={() => toggleStatus(c)}
                      >
                        {c.isActive ? "DEACTIVATE" : "ACTIVATE"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
