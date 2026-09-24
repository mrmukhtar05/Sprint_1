import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174/admin";

  const links = [
    ["HOME", "/"],
    ["SHOP", "/shop"],
    ["CATEGORIES", "/categories"],
    ["ABOUT", "/about"],
    ["CONTACT", "/contact"],
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const value = search.trim();
    if (!value) return;
    setSearchOpen(false);
    setOpen(false);
    navigate(`/shop?keyword=${encodeURIComponent(value)}`);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>



      <div className="marquee-wrap hidden overflow-hidden border-b border-[var(--border)] bg-[var(--bg)] px-6 py-2 text-xs md:block">
        <style>{`
    @keyframes marquee-move {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }

    .animate-marquee {
      animation: marquee-move 10s linear infinite;
    }

    .marquee-wrap:hover .animate-marquee {
      animation-play-state: paused;
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-marquee {
        animation: none;
      }
    }
  `}</style>

        <div className="animate-marquee flex items-center justify-between text-[var(--text)]">

          {/* First content */}
          <div className="flex shrink-0 items-center gap-6 pr-20">
            <span className="whitespace-nowrap font-black text-[var(--text)]">
              🚚 FREE SHIPPING ABOVE ₹1999
            </span>

            <div className="flex gap-6 whitespace-nowrap text-[var(--muted)]">
              <span>Track Order</span>
              <span>Help</span>
              <span>Wishlist</span>
            </div>
          </div>

          {/* Exact duplicate */}
          <div className="flex shrink-0 items-center gap-6 pr-20">
            <span className="whitespace-nowrap font-black text-[var(--text)]">
              🚚 FREE SHIPPING ABOVE ₹1999
            </span>

            <div className="flex gap-6 whitespace-nowrap text-[var(--muted)]">
              <span>Track Order</span>
              <span>Help</span>
              <span>Wishlist</span>
            </div>
          </div>

        </div>
      </div>


      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b-2 border-[var(--gold)] bg-[var(--blue)]">
        <div className="mx-auto flex h-[78px] w-full items-center justify-between px-4 sm:px-6 lg:px-10">

          {/* Logo */}
          <Link to="/">
            <img
              src={logo}
              alt="Vintage Vault"
              className="h-[68px] w-[120px] object-contain sm:h-[78px] sm:w-[140px]"
            />
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(([name, path]) => {
              const active = isActive(path);

              return (
                <Link
                  key={name}
                  to={path}
                  className={`relative text-sm font-black tracking-wider transition-colors duration-300 ${active
                    ? "text-[var(--gold)]"
                    : "text-[var(--cream)] hover:text-[var(--gold)]"
                    }`}
                >
                  {name}

                  {/* Active underline */}
                  {active && (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[var(--gold)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ================= DESKTOP ACTIONS ================= */}
          <div className="hidden items-center gap-5  lg:flex">
            <button type="button" onClick={toggleTheme} aria-label="Toggle day and night mode" className="border border-[var(--gold)] px-3 py-2 text-sm font-black text-[var(--cream)] hover:bg-[var(--gold)] hover:text-black">{mode === "dark" ? "☀ DAY" : "☾ NIGHT"}</button>
            {/* Search */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className={`flex   items-center justify-center !p-0 !font-normal text-6xl leading-none transition-colors ${searchOpen
                ? "text-[var(--gold)]"
                : "text-[var(--cream)] hover:text-[var(--gold)]"
                }`}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <span className="block leading-none text-3xl pb-0.5">⌕</span>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative text-2xl  transition-colors ${isActive("/wishlist")
                ? "text-[var(--gold)]"
                : "hover:text-[var(--gold)]"
                }`}
            >
              ♡

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold)] text-[10px] text-black">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative text-2xl transition-colors ${isActive("/cart")
                ? "text-[var(--gold)]"
                : "hover:text-[var(--gold)]"
                }`}
            >
              🛒

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold)] text-[10px] text-black">
                {cartCount}
              </span>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <a
                    href={adminUrl}
                    className="border border-[var(--red)] px-4 py-2 text-xs font-bold text-[var(--red)] transition hover:bg-[var(--red)] hover:text-white"
                  >
                    DASHBOARD
                  </a>
                )}

                <Link
                  to="/profile"
                  className={`text-xs font-bold transition ${isActive("/profile")
                    ? "text-[var(--gold)]"
                    : "text-[var(--cream)] hover:text-[var(--gold)]"
                    }`}
                >
                  HI, {user.name.split(" ")[0].toUpperCase()}
                </Link>

                <button
                  onClick={handleLogout}
                  className="border border-[var(--gold)] px-4 py-2 text-xs font-bold transition hover:bg-[var(--gold)] hover:text-black"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`border px-4 py-2 text-xs font-bold transition ${isActive("/login")
                  ? "bg-[var(--gold)] text-black"
                  : "border-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
                  }`}
              >
                LOGIN
              </Link>
            )}
          </div>

          {searchOpen && (
            <div className="absolute left-0 right-0 top-full z-50 border-t border-[var(--gold)] bg-[var(--blue)] px-4 py-4 shadow-xl lg:px-10">
              <form
                onSubmit={submitSearch}
                className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-sm border-2 border-[var(--gold)] bg-black/30"
              >
                <input
                  autoFocus
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search vintage grails..."
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[var(--cream)] outline-none placeholder:text-white/40"
                  aria-label="Search products"
                />

                <button
                  type="submit"
                  className="bg-[var(--gold)] px-5 font-black text-black transition hover:opacity-90"
                >
                  SEARCH
                </button>
              </form>
            </div>
          )}

          {/* ================= MOBILE BUTTON ================= */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center border border-[var(--gold)] text-xl transition hover:bg-[var(--gold)] hover:text-black lg:hidden"
          >
            {open ? "×" : "☰"}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {open && (
          <div className="border-t border-[var(--gold)] bg-[var(--blue)] px-5 py-4 lg:hidden">
            {links.map(([name, path]) => {
              const active = isActive(path);

              return (
                <Link
                  key={name}
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-white/10 py-2 text-sm font-black tracking-widest transition-colors ${active
                    ? "text-[var(--gold)]"
                    : "text-[var(--cream)] hover:text-[var(--gold)]"
                    }`}
                >
                  {name}
                </Link>
              );
            })}

            {/* Mobile Actions */}
            <div className="flex flex-wrap items-center gap-6 pt-5">
              <button type="button" onClick={toggleTheme} className="border border-[var(--gold)] px-3 py-2 text-xs font-black text-[var(--cream)]">{mode === "dark" ? "☀ DAY" : "☾ NIGHT"}</button>
              {/* Search */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className={`text-3xl transition-colors ${searchOpen ? "text-[var(--gold)]" : "text-[var(--cream)]"
                  }`}
                aria-label="Search"
                aria-expanded={searchOpen}
              >
                ⌕
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                onClick={() => setOpen(false)}
                className={`relative text-xl ${isActive("/wishlist") ? "text-[var(--gold)]" : ""
                  }`}
              >
                ♡

                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] text-[9px] text-black">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className={`relative text-xl ${isActive("/cart") ? "text-[var(--gold)]" : ""
                  }`}
              >
                🛒

                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] text-[9px] text-black">
                  {cartCount}
                </span>
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <a
                      href={adminUrl}
                      onClick={() => setOpen(false)}
                      className="text-xs font-black text-[var(--red)] hover:text-[var(--gold)]"
                    >
                      DASHBOARD
                    </a>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className={`text-xs font-black ${isActive("/profile")
                      ? "text-[var(--gold)]"
                      : "text-[var(--cream)]"
                      }`}
                  >
                    PROFILE
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-xs font-black text-[var(--gold)]"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={`text-xs font-black ${isActive("/login")
                    ? "text-[var(--gold)]"
                    : "text-[var(--cream)]"
                    }`}
                >
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}