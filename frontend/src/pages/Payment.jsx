import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { cart, cartTotal, clearCart } = useCart();
  const { placeOrder, verifyRazorpay } = useOrders();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shippingAddress = location.state?.shippingAddress;

  const shipping = cartTotal > 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/checkout", { replace: true });
    }
  }, [shippingAddress, navigate]);

  if (!shippingAddress) return null;

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // =========================
      // CASH ON DELIVERY
      // =========================
      if (paymentMethod === "COD") {
        const result = await placeOrder({
          items: cart,
          shippingAddress,
          paymentMethod: "COD",
        });

        await clearCart();

        navigate(`/orders/${result.order._id}`, {
          state: { justPlaced: true },
        });

        return;
      }

      // =========================
      // RAZORPAY
      // UPI / NET BANKING / CARD
      // =========================
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error(
          "Razorpay could not be loaded. Please try again."
        );
      }

      const result = await placeOrder({
        items: cart,
        shippingAddress,
        paymentMethod: "RAZORPAY",
      });

      const razorpayOrder = result.order;

      const razorpayOrderId =
        razorpayOrder.razorpayOrderId ||
        razorpayOrder.razorpayOrder?.id;

      if (!razorpayOrderId) {
        throw new Error(
          "Razorpay order ID was not created."
        );
      }

      const options = {
        key:
          import.meta.env.VITE_RAZORPAY_KEY_ID ||
          result.razorpay?.keyId,

        amount:
          result.razorpay?.amount ||
          Math.round(total * 100),

        currency:
          result.razorpay?.currency || "INR",

        name: "Vintage Vault",

        description: "Vintage Vault Order",

        order_id: razorpayOrderId,

        prefill: {
          name:
            shippingAddress.name ||
            shippingAddress.fullName ||
            "",

          email:
            shippingAddress.email || "",

          contact:
            shippingAddress.phone || "",
        },

        theme: {
          color: "#e9a91a",
        },

        handler: async (response) => {
          try {
            if (!verifyRazorpay) {
              throw new Error(
                "Razorpay verification function is not available."
              );
            }

            await verifyRazorpay({
              orderId: razorpayOrder._id,

              razorpayOrderId:
                response.razorpay_order_id,

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpaySignature:
                response.razorpay_signature,
            });

            await clearCart();

            navigate(`/orders/${razorpayOrder._id}`, {
              state: { justPlaced: true },
            });
          } catch (err) {
            setError(
              err.response?.data?.message ||
                err.message ||
                "Payment verification failed."
            );

            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong."
      );

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--black)] px-4 py-12 text-[var(--cream)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-black tracking-[0.3em] text-[var(--gold)]">
            VINTAGE VAULT
          </p>

          <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Payment
          </h1>

          <div className="mt-4 h-[2px] w-16 bg-[var(--gold)]" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* PAYMENT METHODS */}
          <section className="border border-[var(--border)] bg-[var(--blue)] p-5 sm:p-7">

            <div className="mb-7">
              <h2 className="text-xl font-black uppercase">
                Select Payment Method
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Choose how you want to pay for your order.
              </p>
            </div>

            <div className="space-y-4">

              {/* UPI */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("UPI");
                  setError("");
                }}
                className={`w-full border p-5 text-left transition ${
                  paymentMethod === "UPI"
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--gold)] text-xl">
                    ₹
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black uppercase">
                      UPI
                    </h3>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Google Pay, PhonePe, Paytm and other UPI apps
                    </p>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-full border ${
                      paymentMethod === "UPI"
                        ? "border-[var(--gold)] bg-[var(--gold)]"
                        : "border-[var(--muted)]"
                    }`}
                  />
                </div>
              </button>

              {/* CASH ON DELIVERY */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("COD");
                  setError("");
                }}
                className={`w-full border p-5 text-left transition ${
                  paymentMethod === "COD"
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--gold)] text-xl">
                    $
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black uppercase">
                      Cash on Delivery
                    </h3>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Pay when your order is delivered
                    </p>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-full border ${
                      paymentMethod === "COD"
                        ? "border-[var(--gold)] bg-[var(--gold)]"
                        : "border-[var(--muted)]"
                    }`}
                  />
                </div>
              </button>

              {/* NET BANKING */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("NET_BANKING");
                  setError("");
                }}
                className={`w-full border p-5 text-left transition ${
                  paymentMethod === "NET_BANKING"
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--gold)] text-xl">
                    🏦
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black uppercase">
                      Net Banking
                    </h3>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Pay securely using your bank account
                    </p>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-full border ${
                      paymentMethod === "NET_BANKING"
                        ? "border-[var(--gold)] bg-[var(--gold)]"
                        : "border-[var(--muted)]"
                    }`}
                  />
                </div>
              </button>

            </div>

            {error && (
              <div className="mt-6 border border-red-500 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="mt-8 w-full bg-[var(--gold)] px-6 py-4 text-sm font-black uppercase tracking-widest text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "PROCESSING..."
                : paymentMethod === "COD"
                  ? "PLACE ORDER"
                  : "PAY NOW"}
            </button>

            <Link
              to="/checkout"
              className="mt-4 block text-center text-xs font-black uppercase tracking-widest text-[var(--muted)] transition hover:text-[var(--gold)]"
            >
              ← Back to Checkout
            </Link>

          </section>

          {/* ORDER SUMMARY */}
          <aside className="h-fit border border-[var(--border)] bg-[var(--blue)] p-5 sm:p-7">

            <h2 className="mb-6 text-xl font-black uppercase">
              Order Summary
            </h2>

            <div className="space-y-4">

              {cart.map((item) => (
                <div
                  key={`${item._id}-${item.size || ""}`}
                  className="flex gap-4 border-b border-[var(--border)] pb-4"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden bg-black">
                    {item.images?.[0] && (
                      <img
                        src={
                          typeof item.images[0] === "string"
                            ? item.images[0]
                            : item.images[0]?.url
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Qty: {item.qty}
                    </p>
                  </div>

                  <p className="text-sm font-black">
                    ₹
                    {(
                      Number(
                        item.discountPrice > 0
                          ? item.discountPrice
                          : item.price || 0
                      ) *
                      Number(item.qty || 1)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}

            </div>

            <div className="mt-6 space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-[var(--muted)]">
                  Subtotal
                </span>

                <span className="font-bold">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--muted)]">
                  Shipping
                </span>

                <span className="font-bold">
                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping.toLocaleString("en-IN")}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--muted)]">
                  Tax
                </span>

                <span className="font-bold">
                  ₹{tax.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="my-4 border-t border-[var(--border)]" />

              <div className="flex justify-between text-lg">
                <span className="font-black uppercase">
                  Total
                </span>

                <span className="font-black text-[var(--gold)]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

            </div>

            {/* DELIVERY ADDRESS */}
            <div className="mt-8 border-t border-[var(--border)] pt-6">

              <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--gold)]">
                Delivering To
              </h3>

              <p className="text-sm font-bold">
                {shippingAddress.fullName ||
                  shippingAddress.name}
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {shippingAddress.line1 ||
                  shippingAddress.address}
              </p>

              <p className="text-sm text-[var(--muted)]">
                {shippingAddress.city},{" "}
                {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                {shippingAddress.phone}
              </p>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}