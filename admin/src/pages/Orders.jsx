import { useEffect, useState } from "react";
import api from "../api/api";
import OrderTable from "../components/OrderTable";
import SectionTitle from "../components/SectionTitle";

const STATUS_FILTERS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async (status) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders", {
        params: status && status !== "all" ? { status, limit: 100 } : { limit: 100 },
      });

      if (response.data?.success) {
        setOrders(response.data.orders || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    const prev = orders;
    setOrders((list) => list.map((o) => (o._id === orderId ? { ...o, status } : o)));

    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      if (!response.data?.success) throw new Error("Update failed");
    } catch (err) {
      setOrders(prev);
      alert(err.response?.data?.message || "Failed to update order status.");
    }
  };

  const filtered = orders.filter((order) =>
    `${order._id} ${order.user?.name || ""} ${order.user?.email || ""} ${order.status || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="admin-page">
      <SectionTitle
        eyebrow="SALES"
        title="Orders"
        description={`${orders.length} orders received from customers.`}
        action={
          <input
            className="admin-search admin-orders-search"
            placeholder="Search order or customer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        }
      />

      <div className="admin-filter-row">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            className={`admin-filter-chip ${statusFilter === s ? "active" : ""}`}
            onClick={() => setStatusFilter(s)}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <section className="admin-panel">
        {error && <div className="admin-error">{error}</div>}
        {loading ? (
          <div className="admin-empty">Loading orders...</div>
        ) : (
          <OrderTable orders={filtered} onStatusChange={handleStatusChange} />
        )}
      </section>
    </div>
  );
}
