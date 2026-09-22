import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ImageSlider from "../components/ImageSlider";

export default function ProductDetails() {
  const { id } = useParams();
  const { getProduct } = useProducts();

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Fetch product from backend
  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      setLoading(true);

      const data = await getProduct(id);

      if (mounted) {
        setProduct(data);
        setLoading(false);
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-black">
          LOADING PRODUCT...
        </p>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 text-center">
        <div>
          <h1 className="text-4xl font-black">
            Product Not Found
          </h1>

          <Link
            to="/shop"
            className="mt-6 inline-block text-[var(--gold)] hover:underline"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productId = product._id;

  const wishlisted = isWishlisted(productId);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <main className="mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">

        {/* PRODUCT IMAGE */}
        <div className="w-full">
          <div className="relative aspect-square w-full overflow-hidden border border-[var(--border)] bg-[var(--surface)] sm:aspect-[4/5] lg:aspect-[4/5] xl:max-h-[680px]">
            <ImageSlider
              images={product.images || []}
              emojiSize="text-[180px]"
              showCount
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col justify-center py-2 lg:py-8">

          {/* Category */}
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--gold)]">
            {product.category?.name || "Vintage"}
          </p>

          {/* Product Name */}
          <h1 className="mt-3 text-4xl font-black uppercase leading-tight sm:text-5xl xl:text-6xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-black text-[var(--gold)] sm:text-4xl">
              ₹{product.price}
            </p>

            {product.oldPrice && (
              <p className="text-lg text-[var(--muted)] line-through">
                ₹{product.oldPrice}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 max-w-[600px] leading-7 text-[var(--muted)]">
            {product.description ||
              "A curated vintage piece carefully selected for Vintage Vault."}
          </p>

          {/* Product Meta */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-[500px]">

            <div className="border border-[var(--border)] p-4">
              <p className="text-[10px] font-bold tracking-widest text-[var(--muted)]">
                CONDITION
              </p>

              <p className="mt-1 font-black">
                {product.condition || "Vintage"}
              </p>
            </div>

            <div className="border border-[var(--border)] p-4">
              <p className="text-[10px] font-bold tracking-widest text-[var(--muted)]">
                SIZE
              </p>

              <p className="mt-1 font-black">
                {product.size || "One Size"}
              </p>
            </div>

          </div>

          {/* Quantity */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm font-bold text-[var(--muted)]">
              QUANTITY
            </span>

            <div className="flex items-center border border-[var(--border)]">

              <button
                onClick={() =>
                  setQty((q) => Math.max(1, q - 1))
                }
                className="flex h-11 w-11 items-center justify-center text-xl font-black transition hover:bg-[var(--surface)]"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="flex h-11 w-12 items-center justify-center border-x border-[var(--border)] font-black">
                {qty}
              </span>

              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center text-xl font-black transition hover:bg-[var(--surface)]"
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>
          </div>

          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-8 w-full bg-[var(--gold)] px-6 py-4 font-black text-black transition-all duration-300 hover:opacity-90 hover:shadow-[5px_5px_0_#000]"
          >
            {added
              ? "ADDED TO CART ✓"
              : "ADD TO CART"}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`mt-3 w-full border px-6 py-4 font-black transition-all duration-300 ${
              wishlisted
                ? "border-[var(--red)] bg-[var(--red)] text-white"
                : "border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
            }`}
          >
            {wishlisted
              ? "♥ REMOVE FROM WISHLIST"
              : "♡ ADD TO WISHLIST"}
          </button>

          {/* Continue Shopping */}
          <Link
            to="/shop"
            className="mt-5 block text-center text-sm font-bold text-[var(--gold)] hover:underline"
          >
            ← CONTINUE SHOPPING
          </Link>

        </div>
      </div>
    </main>
  );
}