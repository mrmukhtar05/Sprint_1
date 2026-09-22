import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ImageSlider from "../components/ImageSlider";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQty,
    cartTotal,
    cartOldTotal,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const savings = cartOldTotal - cartTotal;

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-[1000px] px-5 py-20">
        <h1 className="text-5xl font-black">YOUR CART</h1>

        <div className="mt-10 border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-[var(--muted)]">
            Your cart is empty.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-block bg-[var(--gold)] px-7 py-4 font-black text-black"
          >
            START SHOPPING
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-14">
      <h1 className="text-5xl font-black">YOUR CART</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">

        {/* CART ITEMS */}
        <div className="grid gap-4 lg:col-span-2">
          {cart.map((item) => (
            <div
              key={`${item._id}-${item.size || "default"}`}
              className="flex items-center gap-4 border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <Link
                to={`/product/${item._id}`}
                className="h-24 w-24 shrink-0 overflow-hidden"
              >
                <ImageSlider
                  images={item.images || []}
                  emojiSize="text-5xl"
                  showArrows={false}
                  showDots={false}
                />
              </Link>

              <div className="flex-1">
                <p className="text-xs font-bold text-[var(--gold)]">
                  {item.category?.name || "Vintage"}
                </p>

                <Link
                  to={`/product/${item._id}`}
                  className="font-black hover:text-[var(--gold)]"
                >
                  {item.name}
                </Link>

                <p className="text-sm text-[var(--muted)]">
                  Size: {item.size || "One Size"}
                </p>

                <p className="mt-1 font-black text-[var(--gold)]">
                  ₹
                  {item.discountPrice > 0
                    ? item.discountPrice
                    : item.price}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-[var(--border)]">
                <button
                  onClick={() =>
                    updateQty(
                      item._id,
                      item.size,
                      item.qty - 1
                    )
                  }
                  className="h-9 w-9 font-black hover:bg-black/20"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="w-8 text-center font-black">
                  {item.qty}
                </span>

                <button
                  onClick={() =>
                    updateQty(
                      item._id,
                      item.size,
                      item.qty + 1
                    )
                  }
                  className="h-9 w-9 font-black hover:bg-black/20"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() =>
                  removeFromCart(item._id, item.size)
                }
                className="ml-2 text-xl text-[var(--muted)] hover:text-[var(--red)]"
                aria-label={`Remove ${item.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="h-fit border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-black">
            ORDER SUMMARY
          </h2>

          <div className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between text-[var(--muted)]">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>

            {savings > 0 && (
              <div className="flex justify-between text-[var(--gold)]">
                <span>You save</span>
                <span>₹{savings}</span>
              </div>
            )}

            <div className="flex justify-between text-[var(--muted)]">
              <span>Shipping</span>
              <span>
                {cartTotal >= 1999 ? "FREE" : "₹99"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-[var(--border)] pt-4 text-lg font-black">
            <span>Total</span>

            <span className="text-[var(--gold)]">
              ₹
              {cartTotal >= 1999
                ? cartTotal
                : cartTotal + 99}
            </span>
          </div>

          {/* CHECKOUT */}
          {isAuthenticated ? (
            <Link
              to="/checkout"
              className="mt-6 block bg-[var(--gold)] py-4 text-center font-black text-black hover:opacity-90"
            >
              PROCEED TO CHECKOUT
            </Link>
          ) : (
            <Link
              to="/login"
              className="mt-6 block bg-[var(--gold)] py-4 text-center font-black text-black hover:opacity-90"
            >
              LOGIN TO CHECKOUT
            </Link>
          )}

          <Link
            to="/shop"
            className="mt-3 block text-center text-sm text-[var(--gold)]"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}