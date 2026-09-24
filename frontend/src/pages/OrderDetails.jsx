import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

const labels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { getOrder, cancelOrder } = useOrders();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    getOrder(id)
      .then(setOrder)
      .catch((e) =>
        setError(
          e.response?.data?.message || "Unable to load order"
        )
      )
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const cancel = async () => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      setCancelling(true);
      setOrder(await cancelOrder(id));
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  /* ================= LOGIN ================= */

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-[var(--bg)] px-5 py-20">
        <div className="mx-auto max-w-[600px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[var(--gold)] text-2xl">
            🔒
          </div>

          <h1 className="mt-6 text-3xl font-black">
            LOGIN REQUIRED
          </h1>

          <p className="mt-3 text-sm text-[var(--muted)]">
            Please login to view your order details.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-flex items-center justify-center border border-[var(--gold)] bg-[var(--gold)] px-8 py-3 text-sm font-black text-black transition-all duration-300 hover:bg-transparent hover:text-[var(--gold)]"
          >
            LOGIN
          </Link>
        </div>
      </main>
    );
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[var(--bg)] px-5 py-20">
        <div className="mx-auto max-w-[1000px]">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-[var(--surface)]" />
            <div className="mt-3 h-4 w-40 bg-[var(--surface)]" />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="h-64 bg-[var(--surface)] lg:col-span-2" />
              <div className="h-64 bg-[var(--surface)]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ================= ERROR ================= */

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-[var(--bg)] px-5 py-20">
        <div className="mx-auto max-w-[700px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h1 className="text-3xl font-black">
            ORDER NOT FOUND
          </h1>

          <p className="mt-4 text-[var(--red)]">
            {error || "Order not found"}
          </p>

          <Link
            to="/orders"
            className="mt-7 inline-flex items-center gap-2 border border-[var(--gold)] px-7 py-3 text-sm font-black text-[var(--gold)] transition-all duration-300 hover:bg-[var(--gold)] hover:text-black"
          >
            ← BACK TO ORDERS
          </Link>
        </div>
      </main>
    );
  }

  const status = labels[order.status] || order.status;

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-10 sm:px-5 sm:py-14">
      <div className="mx-auto max-w-[1100px]">

        {/* ================= HEADER ================= */}

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs font-black tracking-[0.3em] text-[var(--gold)]">
                ORDER DETAILS
              </p>

              <h1 className="mt-3 break-all text-2xl font-black sm:text-3xl">
                #{order._id}
              </h1>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="border border-[var(--gold)] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
                {status}
              </span>
            </div>

          </div>

        </div>

        {/* ================= SUCCESS ================= */}

        {location.state?.justPlaced && (
          <div className="mt-5 border border-[var(--gold)] bg-[var(--surface)] p-4 text-sm font-bold text-[var(--gold)]">
            ✓ Order placed successfully
          </div>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-5 border border-[var(--red)] bg-[var(--surface)] p-4 text-sm text-[var(--red)]">
            {error}
          </div>
        )}

        {/* ================= MAIN GRID ================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* ================= ITEMS ================= */}

          <section className="border border-[var(--border)] bg-[var(--surface)] p-6 lg:col-span-2 sm:p-7">

            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <h2 className="text-lg font-black">
                ORDER ITEMS
              </h2>

              <span className="text-xs font-bold text-[var(--muted)]">
                {order.orderItems.length} ITEM
                {order.orderItems.length !== 1 ? "S" : ""}
              </span>
            </div>

            <div className="mt-5 grid gap-4">

              {order.orderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-black">
                      {item.name}
                    </p>

                    <p className="mt-2 text-xs text-[var(--muted)]">
                      Qty {item.quantity}
                      {item.size && ` · ${item.size}`}
                      {item.color && ` · ${item.color}`}
                    </p>
                  </div>

                  <p className="text-lg font-black text-[var(--gold)]">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}

            </div>
          </section>

          {/* ================= RIGHT SIDE ================= */}

          <div className="grid gap-6">

            {/* PAYMENT */}

            <section className="border border-[var(--border)] bg-[var(--surface)] p-6">

              <h2 className="text-lg font-black">
                PAYMENT
              </h2>

              <div className="mt-5 grid gap-3 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">
                    Method
                  </span>

                  <span className="text-right font-bold">
                    {order.paymentMethod === "RAZORPAY"
                      ? "Razorpay / Online"
                      : "Cash on Delivery"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">
                    Status
                  </span>

                  <span
                    className={
                      order.isPaid
                        ? "font-black text-green-500"
                        : "font-black text-[var(--red)]"
                    }
                  >
                    {order.isPaid ? "PAID" : "UNPAID"}
                  </span>
                </div>

                {order.razorpayPaymentId && (
                  <div className="border-t border-[var(--border)] pt-3">
                    <p className="text-xs text-[var(--muted)]">
                      Razorpay Payment ID
                    </p>

                    <p className="mt-1 break-all text-xs font-bold">
                      {order.razorpayPaymentId}
                    </p>
                  </div>
                )}

              </div>
            </section>

            {/* DELIVERY */}

            <section className="border border-[var(--border)] bg-[var(--surface)] p-6">

              <h2 className="text-lg font-black">
                DELIVERY
              </h2>

              <div className="mt-5">

                <p className="font-black">
                  {order.shippingAddress.fullName}
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {order.shippingAddress.line1},{" "}
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}
                </p>

                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <p className="text-sm">
                    <span className="text-[var(--muted)]">
                      Delivery Status:
                    </span>{" "}
                    <b>{status}</b>
                  </p>

                  {order.deliveredAt && (
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      Delivered:{" "}
                      {new Date(
                        order.deliveredAt
                      ).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

              </div>
            </section>

          </div>
        </div>

        {/* ================= TOTAL ================= */}

        <section className="mt-6 border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7">

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            <div className="w-full max-w-md">

              <div className="flex justify-between py-1 text-sm">
                <span className="text-[var(--muted)]">
                  Items
                </span>
                <span>₹{order.itemsPrice}</span>
              </div>

              <div className="flex justify-between py-1 text-sm">
                <span className="text-[var(--muted)]">
                  Shipping
                </span>
                <span>
                  {order.shippingPrice
                    ? `₹${order.shippingPrice}`
                    : "FREE"}
                </span>
              </div>

              <div className="flex justify-between py-1 text-sm">
                <span className="text-[var(--muted)]">
                  Tax
                </span>
                <span>₹{order.taxPrice}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="font-black">
                  TOTAL
                </span>

                <span className="text-2xl font-black text-[var(--gold)]">
                  ₹{order.totalPrice}
                </span>
              </div>

            </div>

            {/* ================= ACTION BUTTONS ================= */}

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

              {/* BACK BUTTON */}

              <Link
                to="/orders"
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 border border-[var(--border)] bg-transparent px-7 py-3 text-sm font-black transition-all duration-300 hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
              >
                <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>

                BACK TO ORDERS
              </Link>

              {/* CANCEL BUTTON */}

              {["pending", "processing"].includes(order.status) && (
                <button
                  type="button"
                  onClick={cancel}
                  disabled={cancelling}
                  className="group inline-flex min-h-[48px] items-center justify-center gap-2 border border-[var(--red)] bg-transparent px-7 py-3 text-sm font-black text-[var(--red)] transition-all duration-300 hover:bg-[var(--red)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {cancelling ? "⏳" : "×"}
                  </span>

                  {cancelling
                    ? "CANCELLING..."
                    : "CANCEL ORDER"}
                </button>
              )}

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}