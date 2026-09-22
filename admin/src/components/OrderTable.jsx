const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderTable({ orders = [], onStatusChange }) {
  if (!orders.length) {
    return <div className="admin-empty">No orders have been placed yet.</div>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ORDER</th>
            <th>CUSTOMER</th>
            <th>ITEMS</th>
            <th>TOTAL</th>
            <th>DATE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td><strong>#{String(order._id).slice(-8).toUpperCase()}</strong></td>
              <td>
                <strong>{order.user?.name || "Customer"}</strong>
                <small>{order.user?.email || "—"}</small>
              </td>
              <td>
                {order.orderItems?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0}
              </td>
              <td className="gold">₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}</td>
              <td>
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}
              </td>
              <td>
                {onStatusChange ? (
                  <select
                    className="admin-input admin-status-select"
                    value={order.status || "pending"}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
                ) : (
                  <span className="admin-status">{order.status || "pending"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
