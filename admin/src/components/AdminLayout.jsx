import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./admin.css";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "▦", end: true },
  { to: "/admin/products", label: "Products", icon: "□" },
  { to: "/admin/categories", label: "Categories", icon: "▤" },
  { to: "/admin/orders", label: "Orders", icon: "⌑" },
  { to: "/admin/payments", label: "Payments", icon: "₹" },
  { to: "/admin/customers", label: "Customers", icon: "♙" },
  { to: "/admin/messages", label: "Messages", icon: "✉" },
  { to: "/admin/home", label: "Home Page", icon: "⌂" },
  { to: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const storeUrl = import.meta.env.VITE_STORE_URL || "http://localhost:5173";

  const current =
    location.pathname === "/admin"
      ? "Dashboard"
      : location.pathname.includes("/categories")
        ? "Categories"
        : location.pathname.includes("/products")
          ? "Products"
          : location.pathname.includes("/orders")
            ? "Orders"
            : location.pathname.includes("/payments")
              ? "Payments"
              : location.pathname.includes("/customers")
              ? "Customers"
              : location.pathname.includes("/messages")
                ? "Messages"
                : location.pathname.includes("/home")
                  ? "Home Page"
                  : "Settings";

  return (
    <div className="admin-app !flex !min-h-screen !bg-[#080a0d] !text-slate-100">
      <button
        aria-label="Close admin sidebar"
        className={`fixed inset-0 z-40 border-0 bg-black/70 backdrop-blur-sm transition lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`admin-sidebar !fixed !left-0 !top-0 !z-50 !h-screen !w-64 !border-r !border-white/10 !bg-[#0d1014] !p-0 transition-transform duration-200 lg:!translate-x-0 ${sidebarOpen ? "!translate-x-0" : "!-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <p className="text-[10px] font-black tracking-[4px] text-amber-400">VINTAGE VAULT</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">ADMIN</h2>
            <p className="mt-1 text-[9px] font-bold tracking-[3px] text-slate-500">CONTROL PANEL</p>
          </div>
          <button
            className="rounded-md border border-white/10 px-2 py-1 text-xl text-slate-400 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >×</button>
        </div>

        <div className="mx-4 mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-[9px] font-black tracking-[2px] text-slate-500">CONTROL CENTER</p>
          <p className="mt-1 text-sm font-bold">Store Management</p>
        </div>

        <nav className="px-4 py-6">
          <p className="mb-3 px-2 text-[9px] font-black tracking-[3px] text-slate-500">MAIN MENU</p>
          <div className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-bold no-underline transition ${
                    isActive
                      ? "border-amber-400 bg-amber-400 text-black shadow-[0_8px_25px_rgba(227,170,32,.15)]"
                      : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[.03] hover:text-white"
                  }`
                }
              >
                <span className="grid h-6 w-6 place-items-center text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-white/10 p-4">
          <a
            href={storeUrl}
            className="block rounded-lg border border-white/10 px-3 py-3 text-sm font-bold text-amber-400 no-underline transition hover:bg-white/[.03]"
          >
            ← View Store
          </a>
          <button
            onClick={logout}
            className="w-full rounded-lg border border-white/10 px-3 py-3 text-left text-sm font-bold text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <section className="admin-main !ml-0 !min-w-0 !w-full lg:!ml-64 lg:!w-[calc(100%-16rem)]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#080a0d]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[.02] text-lg lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
            >
              ☰
            </button>
            <div>
              <p className="text-[9px] font-black tracking-[3px] text-amber-400">ADMIN PANEL</p>
              <h1 className="mt-1 text-lg font-black">{current}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-500">{user?.email || "Admin account"}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400 font-black text-black">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-red-500/50 hover:text-red-400 md:block"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content !p-4 sm:!p-6 lg:!p-8">{children}</main>
      </section>
    </div>
  );
}
