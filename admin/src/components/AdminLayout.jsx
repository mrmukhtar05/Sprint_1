import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  const [theme, setTheme] = useState(() => localStorage.getItem("admin-theme") || "dark");
  const { user, logout } = useAuth();
  const location = useLocation();
  const storeUrl = import.meta.env.VITE_STORE_URL || "http://localhost:5173";

  useEffect(() => {
    document.documentElement.setAttribute("data-admin-theme", theme);
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

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
    <div className="admin-app !flex !min-h-screen !bg-[var(--admin-bg)] !text-[var(--admin-text)]">
      <button
        aria-label="Close admin sidebar"
        className={`fixed inset-0 z-40 border-0 bg-black/70 backdrop-blur-sm transition lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`admin-sidebar !fixed !left-0 !top-0 !z-50 !h-screen !w-64 !border-r !border-[var(--admin-border)] !bg-[var(--admin-sidebar)] !p-0 transition-transform duration-200 lg:!translate-x-0 ${sidebarOpen ? "!translate-x-0" : "!-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-6">
          <div>
            <p className="text-[10px] font-black tracking-[4px] text-amber-400">VINTAGE VAULT</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">ADMIN</h2>
            <p className="mt-1 text-[9px] font-bold tracking-[3px] text-[var(--admin-muted)]">CONTROL PANEL</p>
          </div>
          <button
            className="rounded-md border border-[var(--admin-border)] px-2 py-1 text-xl text-[var(--admin-muted)] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >×</button>
        </div>

        <div className="mx-4 mt-5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-overlay)] p-4">
          <p className="text-[9px] font-black tracking-[2px] text-[var(--admin-muted)]">CONTROL CENTER</p>
          <p className="mt-1 text-sm font-bold">Store Management</p>
        </div>

        <nav className="px-4 py-6">
          <p className="mb-3 px-2 text-[9px] font-black tracking-[3px] text-[var(--admin-muted)]">MAIN MENU</p>
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
                      : "border-transparent text-[var(--admin-muted)] hover:border-[var(--admin-border)] hover:bg-[var(--admin-overlay)] hover:text-[var(--admin-text)]"
                  }`
                }
              >
                <span className="grid h-6 w-6 place-items-center text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-[var(--admin-border)] p-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full rounded-lg border border-[var(--admin-border)] px-3 py-3 text-left text-sm font-bold text-[var(--admin-gold)] transition hover:bg-[var(--admin-overlay)]"
          >
            {theme === "dark" ? "☀ Day Mode" : "☾ Dark Mode"}
          </button>
          <a
            href={storeUrl}
            className="block rounded-lg border border-[var(--admin-border)] px-3 py-3 text-sm font-bold text-[var(--admin-gold)] no-underline transition hover:bg-[var(--admin-overlay)]"
          >
            ← View Store
          </a>
          <button
            onClick={logout}
            className="w-full rounded-lg border border-[var(--admin-border)] px-3 py-3 text-left text-sm font-bold text-[var(--admin-muted)] transition hover:border-red-500/50 hover:text-red-400"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <section className="admin-main !ml-0 !min-w-0 !w-full lg:!ml-64 lg:!w-[calc(100%-16rem)]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-bg)]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-overlay)] text-lg lg:hidden"
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
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-[var(--admin-border)] px-3 py-2 text-xs font-bold text-[var(--admin-muted)] transition hover:border-[var(--admin-gold)] hover:text-[var(--admin-gold)]"
              title="Toggle admin theme"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-[var(--admin-muted)]">{user?.email || "Admin account"}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400 font-black text-black">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="hidden rounded-lg border border-[var(--admin-border)] px-3 py-2 text-xs font-bold text-[var(--admin-muted)] transition hover:border-red-500/50 hover:text-red-400 md:block"
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
