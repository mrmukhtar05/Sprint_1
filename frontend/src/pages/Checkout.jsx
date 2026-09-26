import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "",
    country: "India",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal > 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.05 * 100) / 100;
  const total = cartTotal + shipping + tax;

  useEffect(() => {
    if (user) {
      setForm((p) => ({
        ...p,
        name: p.name || user.name || "",
        email: p.email || user.email || "",
        phone: p.phone || user.phone || "",
      }));
    }
  }, [user]);

  const change = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const address = {
    fullName: form.name.trim(),
    phone: form.phone.replace(/\D/g, ""),
    line1: form.address.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    postalCode: form.postalCode.trim(),
    country: form.country.trim(),
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cart.length) {
      return setError("Your cart is empty.");
    }

    if (
      cart.some(
        (i) =>
          Number(i.stock ?? 1) <= 0 ||
          Number(i.qty) > Number(i.stock)
      )
    ) {
      return setError(
        "One or more products are out of stock or exceed available stock."
      );
    }

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      return setError("Please fill in all fields.");
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return setError("Please enter a valid email.");
    }

    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      return setError("Please enter a valid 10-digit phone number.");
    }

    try {
      setLoading(true);

      navigate("/payment", {
        state: {
          shippingAddress: address,
          cartTotal,
          shipping,
          tax,
          total,
        },
      });
    } catch (err) {
      setError(err.message || "Failed to continue to payment.");
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <main className="mx-auto max-w-[1000px] px-5 py-20 text-center">
        <h1 className="text-5xl font-black">CHECKOUT</h1>

        <p className="mt-8 text-[var(--muted)]">
          Your cart is empty.
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-block bg-[var(--gold)] px-7 py-4 font-black text-black"
        >
          START SHOPPING
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-14">
      <h1 className="text-5xl font-black">CHECKOUT</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <form
          onSubmit={submit}
          className="grid gap-4 lg:col-span-2"
        >
          {error && (
            <p className="border border-[var(--red)] bg-[var(--red)]/10 px-4 py-3 text-sm text-[var(--red)]">
              {error}
            </p>
          )}

          {[
            "name",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "postalCode",
          ].map((n) =>
            n === "address" ? (
              <textarea
                key={n}
                name={n}
                value={form[n]}
                onChange={change}
                rows="4"
                className="border border-[var(--border)] bg-[var(--surface)] p-4"
                placeholder="Delivery Address"
              />
            ) : (
              <input
                key={n}
                name={n}
                type={n === "email" ? "email" : "text"}
                value={form[n]}
                onChange={change}
                className="border border-[var(--border)] bg-[var(--surface)] p-4"
                placeholder={n
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (x) => x.toUpperCase())}
              />
            )
          )}

          <button
            type="submit"
            disabled={
              loading ||
              cart.some(
                (i) =>
                  Number(i.stock ?? 1) <= 0
              )
            }
            className="bg-[var(--gold)] p-4 font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "CONTINUING..."
              : `CONTINUE TO PAYMENT — ₹${total}`}
          </button>
        </form>

        <div className="h-fit border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-black">
            ORDER SUMMARY
          </h2>

          <div className="mt-5 grid gap-3">
            {cart.map((i) => (
              <div
                key={`${i._id}-${i.size}`}
                className="flex justify-between text-sm"
              >
                <span>
                  {i.name} × {i.qty}
                </span>

                <span>
                  ₹
                  {Number(
                    i.discountPrice > 0
                      ? i.discountPrice
                      : i.price || 0
                  ) * i.qty}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>
                {shipping ? `₹${shipping}` : "FREE"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax}</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3 text-lg font-black">
            <span>Total</span>

            <span className="text-[var(--gold)]">
              ₹{total}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}