import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ImageSlider from "../components/ImageSlider";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (product) => {
    // Make sure MongoDB ID exists
    if (!product?._id) {
      console.error("Product _id missing:", product);
      return;
    }

    // Add product to cart
    addToCart(
      product,
      1,
      product.size || "One Size"
    );

    // Show success state
    setAddedId(product._id);

    setTimeout(() => {
      setAddedId(null);
    }, 2000);
  };

  if (wishlist.length === 0) {
    return (
      <main className="mx-auto max-w-[1000px] px-5 py-20">
        <h1 className="text-5xl font-black">
          WISHLIST
        </h1>

        <div className="mt-10 border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-[var(--muted)]">
            No saved products yet.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-block bg-[var(--gold)] px-7 py-4 font-black text-black"
          >
            EXPLORE SHOP
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-14">
      <h1 className="text-5xl font-black">
        WISHLIST
      </h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="flex items-center gap-4 border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            {/* PRODUCT IMAGE */}
            <Link
              to={`/product/${product._id}`}
              className="h-24 w-24 shrink-0 overflow-hidden"
            >
              <ImageSlider
                images={product.images || []}
                emojiSize="text-5xl"
                showArrows={false}
                showDots={false}
              />
            </Link>

            {/* PRODUCT INFO */}
            <div className="flex-1">
              {/* CATEGORY */}
              <p className="text-xs font-bold text-[var(--gold)]">
                {product.category?.name || "Vintage"}
              </p>

              {/* NAME */}
              <Link
                to={`/product/${product._id}`}
                className="font-black hover:text-[var(--gold)]"
              >
                {product.name}
              </Link>

              {/* PRICE */}
              <p className="mt-1 font-black text-[var(--gold)]">
                ₹{product.price}
              </p>

              {/* BUTTONS */}
              <div className="mt-3 flex gap-3">
                {/* ADD TO CART */}
                <button
                  type="button"
                  onClick={() =>
                    handleAddToCart(product)
                  }
                  className="bg-[var(--gold)] px-4 py-2 text-xs font-black text-black transition hover:opacity-90"
                >
                  {String(addedId) === String(product._id)
                    ? "ADDED ✓"
                    : "ADD TO CART"}
                </button>

                {/* REMOVE */}
                <button
                  type="button"
                  onClick={() =>
                    removeFromWishlist(product._id)
                  }
                  className="border border-[var(--border)] px-4 py-2 text-xs font-black transition hover:border-[var(--red)] hover:text-[var(--red)]"
                >
                  REMOVE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}