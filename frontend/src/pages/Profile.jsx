import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { orders, fetchMyOrders } = useOrders();
  const navigate = useNavigate();

  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadOrders = async () => {
      try {
        setLoadingOrders(true);
        await fetchMyOrders();
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-[900px] px-5 py-20 text-center">
        <h1 className="text-5xl font-black">MY PROFILE</h1>

        <p className="mt-8 text-[var(--muted)]">
          Login to view your profile.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block bg-[var(--gold)] px-7 py-4 font-black text-black"
        >
          LOGIN
        </Link>
      </main>
    );
  }

  const orderCount = orders?.length || 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="mx-auto max-w-[900px] px-5 py-20">

      {/* Heading */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
          Vintage Vault
        </p>

        <h1 className="mt-2 text-5xl font-black">
          MY PROFILE
        </h1>
      </div>

      {/* Profile Card */}
      <div className="mt-8 border border-[var(--border)] bg-[var(--surface)] p-8">

        {/* Avatar */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gold)] text-3xl font-black text-black">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>

        {/* User Details */}
        <div className="mt-6 grid gap-5">

          {/* Name */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Full Name
            </p>

            <p className="mt-1 text-lg font-black">
              {user?.name || "User"}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Email
            </p>

            <p className="mt-1 text-lg font-black">
              {user?.email || "-"}
            </p>
          </div>

          {/* Orders */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Total Orders
            </p>

            <p className="mt-1 text-lg font-black">
              {loadingOrders ? "Loading..." : orderCount}
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            to="/orders"
            className="bg-[var(--gold)] px-6 py-3 text-sm font-black text-black transition hover:opacity-90"
          >
            VIEW ORDERS →
          </Link>

          <button
            onClick={handleLogout}
            className="border border-[var(--red)] px-6 py-3 text-sm font-black text-[var(--red)] transition hover:bg-[var(--red)] hover:text-white"
          >
            LOGOUT
          </button>

        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Orders
          </p>

          <p className="mt-2 text-3xl font-black">
            {loadingOrders ? "..." : orderCount}
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Total orders placed
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Account
          </p>

          <p className="mt-2 text-3xl font-black">
            ACTIVE
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Your account is currently active
          </p>
        </div>

      </div>

    </main>
  );
}