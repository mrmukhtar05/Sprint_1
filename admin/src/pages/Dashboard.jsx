import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { STATUS_KEYS, STATUS_STYLES, statusBadge } from "../utils/orderStatus";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/admin/dashboard");
      if (!data?.success) throw new Error("Dashboard data unavailable");
      setStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statusMap = useMemo(() => {
    const map = {};
    (stats?.statusCounts || []).forEach((item) => { map[item._id] = item.count; });
    return map;
  }, [stats]);

  const totalStatusOrders = Math.max(
    1,
    (stats?.statusCounts || []).reduce((sum, item) => sum + Number(item.count || 0), 0)
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-[1500px] animate-pulse">
        <div className="h-6 w-28 rounded bg-white/10" />
        <div className="mt-3 h-10 w-72 rounded bg-white/10" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-36 rounded-xl border border-white/10 bg-[var(--admin-surface)]" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1500px] rounded-xl border border-red-500/30 bg-red-500/5 p-6">
        <p className="text-[10px] font-black tracking-[3px] text-red-400">DASHBOARD ERROR</p>
        <p className="mt-2 text-sm text-slate-300">{error}</p>
        <button onClick={loadDashboard} className="mt-5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-black text-black">Retry</button>
      </div>
    );
  }

  const {
    totalProducts = 0,
    totalOrders = 0,
    totalRevenue = 0,
    totalCustomers = 0,
    lowStockProducts = [],
    recentOrders = [],
  } = stats || {};

  const statCards = [
    ["PRODUCTS", totalProducts, "Products in store", "□"],
    ["ORDERS", totalOrders, "Orders received", "⌑"],
    ["REVENUE", money(totalRevenue), "Gross sales", "₹"],
    ["CUSTOMERS", totalCustomers, "Registered users", "♙"],
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-black tracking-[4px] text-amber-400">OVERVIEW</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Store Dashboard</h2>
          <p className="mt-2 text-sm text-slate-500">Live store data from your MongoDB-backed API.</p>
        </div>
        {/* buttom add to card  */}
        <div className="flex gap-2">
          <button
            onClick={loadDashboard}
            className="group relative overflow-hidden rounded-lg border border-white/10 p-3 text-xs font-bold text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:text-amber-400 hover:shadow-[0_6px_20px_rgba(245,158,11,0.15)] active:translate-y-0"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span className="inline-block transition-transform duration-500 group-hover:rotate-180">
                ↻
              </span>
              Refresh
            </span>

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-400/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          <Link
            to="/admin/products?new=1"
            className="group relative overflow-hidden rounded-lg bg-amber-400 p-3 text-xs font-black text-black transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_8px_25px_rgba(245,158,11,0.25)] active:translate-y-0"
          >
            <span className="relative z-10 inline-block transition-transform duration-300 group-hover:scale-105">
              + Add Product
            </span>

            <span className="absolute inset-0 -translate-x-full bg-white/30 skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-[180%]" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value, note, icon]) => (
          <article
            key={label}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-[var(--admin-surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_10px_30px_rgba(245,158,11,0.10)]"
          >
            {/* Shine */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-400/5 to-transparent skew-x-[-15deg] transition-transform duration-700 group-hover:translate-x-[180%]" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[2px] text-slate-500 transition-colors duration-300 group-hover:text-slate-400">
                  {label}
                </p>

                <p className="mt-3 text-3xl font-black text-amber-400 transition-all duration-300 group-hover:scale-105 group-hover:text-amber-300">
                  {value}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {note}
                </p>
              </div>
              <div
                className="
    relative grid h-11 w-11 place-items-center
    rounded-full
    border border-amber-400/30
    bg-gradient-to-br from-amber-400/20 via-amber-300/10 to-transparent
    text-lg text-amber-500
    shadow-[inset_0_0_12px_rgba(245,158,11,0.08)]
    transition-all duration-500
    group-hover:scale-110
    group-hover:rotate-6
    group-hover:border-amber-400
    group-hover:bg-amber-400
    group-hover:text-black
    group-hover:shadow-[0_0_22px_rgba(245,158,11,0.25)]
  "
              >
                <span className="transition-transform duration-500 group-hover:scale-110">
                  {icon}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <article className="overflow-hidden rounded-xl border border-white/10 bg-[var(--admin-surface)]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div>
              <p className="text-[10px] font-black tracking-[3px] text-amber-400">ORDERS</p>
              <h3 className="mt-1 text-xl font-bold">Recent Orders</h3>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-amber-400 hover:text-amber-300">View all →</Link>
          </div>

          {recentOrders.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b border-white/10 text-[9px] font-black tracking-widest text-slate-500">
                  <tr><th className="px-5 py-3">ORDER</th><th className="px-5 py-3">CUSTOMER</th><th className="px-5 py-3">TOTAL</th><th className="px-5 py-3">STATUS</th></tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-white/5 last:border-0">
                      <td className="px-5 py-4 font-bold">#{String(order._id).slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-4"><div className="font-semibold">{order.user?.name || "Customer"}</div><div className="mt-1 text-[10px] text-slate-500">{order.user?.email || "—"}</div></td>
                      <td className="px-5 py-4 font-black text-amber-400">{money(order.totalPrice)}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase ${statusBadge(order.status)}`}
                        >
                          {order.status || "pending"}
                        </span>
                      </td>                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-14 text-center text-sm text-slate-500">No orders have been placed yet.</div>
          )}
        </article>

        <article className="rounded-xl border border-white/10 bg-[var(--admin-surface)] p-5">
          <p className="text-[10px] font-black tracking-[3px] text-amber-400">ORDER STATUS</p>
          <h3 className="mt-1 text-xl font-bold">Store Activity</h3>
          <div className="mt-6 space-y-4">
            {STATUS_KEYS.map((status) => {
              const count = statusMap[status] || 0;
              const width = Math.round((count / totalStatusOrders) * 100);
              return (
                <div key={status}>
                  <div className="mb-2 flex justify-between text-xs"><span className="font-semibold capitalize text-slate-300">{status}</span><span className="font-black text-slate-500">{count}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className={`h-full ${STATUS_STYLES[status].bar}`} style={{ width: `${width}%` }} /></div>
                </div>
              );
            })}
          </div>

          {lowStockProducts.length > 0 && (
            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-[10px] font-black tracking-[3px] text-red-400">LOW STOCK</p>
              <div className="mt-3 space-y-2">
                {lowStockProducts.slice(0, 4).map((product) => (
                  <Link key={product._id} to="/admin/products" className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-3 text-xs no-underline hover:border-amber-400/40">
                    <span className="font-semibold text-slate-200">{product.name}</span>
                    <span className="font-black text-red-400">{product.stock} left</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
