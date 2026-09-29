import { useEffect, useState } from "react";
import api from "../api/api";
import OrderTable from "../components/OrderTable";
import SectionTitle from "../components/SectionTitle";
import { STATUS_STYLES, ALL_FILTER_STYLE } from "../utils/orderStatus";

const STATUS_FILTERS = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // LOAD ALL ORDERS ONCE
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders", {
        params: {
          limit: 100,
        },
      });

      if (response.data?.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // CHANGE ORDER STATUS
  const handleStatusChange = async (orderId, status) => {
    const prev = orders;

    // Optimistic update
    setOrders((list) =>
      list.map((order) =>
        order._id === orderId
          ? { ...order, status }
          : order
      )
    );

    try {
      const response = await api.put(
        `/admin/orders/${orderId}/status`,
        {
          status,
        }
      );

      if (!response.data?.success) {
        throw new Error("Update failed");
      }
    } catch (err) {
      // Restore previous state
      setOrders(prev);

      alert(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };

  // SEARCH + STATUS FILTER
  const filtered = orders.filter((order) => {
    const orderStatus = (
      order.status || "pending"
    ).toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      orderStatus === statusFilter;

    const searchText = `
      ${order._id || ""}
      ${order.user?.name || ""}
      ${order.user?.email || ""}
      ${order.status || ""}
    `.toLowerCase();

    const matchesQuery = searchText.includes(
      query.toLowerCase()
    );

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="admin-page">
      {/* HEADER */}
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

      {/* STATUS FILTERS */}
      <div className="admin-filter-row flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((status) => {
          const style = status === "all" ? ALL_FILTER_STYLE : STATUS_STYLES[status];
          const isActive = statusFilter === status;

          // COUNT FROM FULL ORDERS ARRAY
          const count =
            status === "all"
              ? orders.length
              : orders.filter(
                  (order) =>
                    (
                      order.status || "pending"
                    ).toLowerCase() === status
                ).length;

          return (
            <div
              key={status}
              className="relative inline-flex items-center"
            >
              {/* STATUS BUTTON */}
              <button
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`
                  group relative overflow-visible
                  inline-flex items-center justify-center gap-2
                  rounded-full border
                  px-4 py-2
                  text-[10px] font-black tracking-[0.08em]
                  whitespace-nowrap
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? style.active
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {/* ICON */}
                <span
                  className={`
                    relative z-10
                    transition-all duration-300
                    ${
                      isActive
                        ? "scale-110"
                        : "group-hover:scale-125"
                    }
                  `}
                >
                  {style.icon}
                </span>

                {/* STATUS TEXT */}
                <span className="relative z-10">
                  {status.toUpperCase()}
                </span>

                {/* HOVER SHINE */}
                <span
                  className="
                    pointer-events-none
                    absolute inset-0
                    -translate-x-full
                    skew-x-[-20deg]
                    bg-white/10
                    transition-transform duration-700
                    group-hover:translate-x-[160%]
                  "
                />

                {/* COUNT BADGE
                    ALL = NO BADGE
                    0 = NO BADGE
                */}
                {status !== "all" && count !== 0 && (
                  <span
                    className="
                      pointer-events-none
                      absolute
                      -top-2
                      -right-2
                      z-10
                      rounded-full
                      bg-[var(--admin-gold)]
                      px-2
                      py-1.5
                      text-center
                      text-[8px]
                      font-black
                      leading-none
                      text-black
                      shadow-[0_0_12px_rgba(227,170,32,0.35)]
                    "
                  >
                    {count}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ORDERS TABLE */}
      <section className="admin-panel">
        {/* ERROR */}
        {error && (
          <div className="admin-error animate-[cardSlideUp_300ms_ease-out]">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="admin-empty">
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-amber-400" />

              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Loading orders...
              </span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          /* EMPTY */
          <div className="admin-empty">
            <div className="py-14 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-500">
                {query ? "⌕" : "∅"}
              </div>

              <p className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">
                {query
                  ? "No matching orders"
                  : `No ${
                      statusFilter !== "all"
                        ? statusFilter
                        : ""
                    } orders found`}
              </p>

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-4 text-xs font-black text-amber-400 transition-colors hover:text-amber-300"
                >
                  CLEAR SEARCH
                </button>
              )}
            </div>
          </div>
        ) : (
          /* TABLE */
          <div className="animate-[cardSlideUp_500ms_cubic-bezier(0.22,1,0.36,1)]">
            <OrderTable
              orders={filtered}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </section>
    </div>
  );
}