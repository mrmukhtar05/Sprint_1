import { Link } from "react-router-dom";
import { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ImageSlider from "./ImageSlider";

export default function ProductCard({ product, onWishlist }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  const [added, setAdded] = useState(false);

  const productId = product._id;

  const wishlisted = isWishlisted(productId);

  // STOCK CHECK
  const isOutOfStock = Number(product?.stock ?? 0) <= 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product);
    onWishlist?.(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent adding unavailable products
    if (isOutOfStock) return;

    addToCart(product, 1, product.size);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div
      className="
        group
        w-full
        overflow-hidden
        rounded-sm
        bg-[#eee6d5]
        text-black
        shadow-lg
        transition-all
        duration-500
        hover:-translate-y-3
        hover:shadow-[8px_8px_0_#e9a91a]
      "
    >
      <Link
        to={`/product/${productId}`}
        className="block"
      >
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <ImageSlider
            images={product.images || []}
            emojiSize="
              text-[min(28vw,130px)]
              drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]
              transition-all
              duration-700
              ease-out
              group-hover:scale-125
              group-hover:-rotate-3
            "
          />

          {/* SHINE */}
          <div
            className="
              pointer-events-none
              absolute
              -left-[100%]
              top-0
              z-10
              h-full
              w-[60%]
              rotate-12
              bg-white/10
              transition-all
              duration-700
              group-hover:left-[120%]
            "
          />

          {/* WISHLIST */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              wishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            className={`
              absolute
              right-4
              top-4
              z-20
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              text-2xl
              transition-all
              duration-300
              hover:scale-110
              ${
                wishlisted
                  ? "bg-[var(--red)] text-white"
                  : "bg-black/50 text-white hover:bg-[var(--red)]"
              }
            `}
          >
            {wishlisted ? "♥" : "♡"}
          </button>

          {/* QUICK VIEW */}
          <div
            className="
              pointer-events-none
              absolute
              bottom-5
              left-1/2
              z-20
              -translate-x-1/2
              translate-y-12
              whitespace-nowrap
              bg-[var(--gold)]
              px-6
              py-3
              text-sm
              font-black
              text-black
              opacity-0
              transition-all
              duration-500
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            QUICK VIEW
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="p-5 sm:p-6">

          {/* CATEGORY */}
          <p
            className="
              text-[11px]
              font-black
              uppercase
              tracking-[0.15em]
              text-gray-500
            "
          >
            {product.category?.name || "Vintage"}
          </p>

          {/* NAME */}
          <h3
            className="
              mt-2
              truncate
              text-lg
              font-black
              transition-colors
              duration-300
              group-hover:text-[#c88b0b]
              sm:text-xl
            "
          >
            {product.name}
          </h3>

          {/* PRICE */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-base font-black text-[#d08c0b] sm:text-lg">
              ₹
              {product.discountPrice > 0
                ? product.discountPrice
                : product.price}
            </span>

            {product.discountPrice > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* ADD TO CART / OUT OF STOCK */}
          {isOutOfStock ? (
            <div
              className="
                mt-4
                w-full
                border
                border-[var(--red)]
                px-4
                py-3
                text-center
                text-xs
                font-black
                text-[var(--red)]
              "
            >
              OUT OF STOCK
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="
                mt-4
                w-full
                bg-[var(--gold)]
                px-4
                py-3
                text-xs
                font-black
                text-black
                transition
                hover:opacity-90
              "
            >
              {added ? "ADDED TO CART ✓" : "ADD TO CART"}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}