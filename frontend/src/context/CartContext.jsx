import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const STORAGE_KEY = "vv_cart";

// --------------------------------------------------
// Load guest cart from localStorage
// --------------------------------------------------
const loadLocal = () => {
  try {
    const x = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(x) ? x : [];
  } catch {
    return [];
  }
};

// --------------------------------------------------
// Convert backend cart format to frontend cart format
// --------------------------------------------------
const normalize = (cart) => {
  return (cart?.items || [])
    .filter((i) => i?.product)
    .map((i) => ({
      ...i.product,
      _id: i.product?._id || i.product,
      size: i.size || "One Size",
      qty: Number(i.qty || 1),
    }));
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState(loadLocal);
  const [ready, setReady] = useState(false);

  // --------------------------------------------------
  // Validate guest cart against backend products
  // --------------------------------------------------
  const validateLocalCart = async () => {
    try {
      const response = await api.get("/products?limit=1000");

      const backendProducts =
        response.data?.products || [];

      const validProductIds = new Set(
        backendProducts.map((product) =>
          String(product._id)
        )
      );

      setCart((currentCart) => {
        const validCart = currentCart.filter((item) =>
          validProductIds.has(String(item._id))
        );

        return validCart;
      });
    } catch (error) {
      // Backend unavailable hone par cart ko empty nahi karenge
      console.error(
        "Guest cart validation error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Load cart when authentication changes
  // --------------------------------------------------
  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      // ----------------------------------------------
      // Guest user
      // ----------------------------------------------
      if (!isAuthenticated) {
        if (active) {
          const localCart = loadLocal();

          setCart(localCart);
          setReady(true);
        }

        // Backend products ke against validate
        await validateLocalCart();

        return;
      }

      // ----------------------------------------------
      // Logged-in user
      // ----------------------------------------------
      try {
        const response = await api.get("/cart");

        if (active) {
          setCart(normalize(response.data.cart));
        }
      } catch (error) {
        console.error(
          "Cart load error:",
          error
        );
      } finally {
        if (active) {
          setReady(true);
        }
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  // --------------------------------------------------
  // Save guest cart to localStorage
  // --------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
      );
    }
  }, [cart, isAuthenticated]);

  // --------------------------------------------------
  // Sync logged-in cart with backend
  // --------------------------------------------------
  const sync = async (
    request,
    fallback = cart
  ) => {
    if (!isAuthenticated) {
      return fallback;
    }

    const response = await request();

    const next = normalize(
      response.data.cart
    );

    setCart(next);

    return next;
  };

  // --------------------------------------------------
  // Add product
  // --------------------------------------------------
  const addToCart = async (
    product,
    qty = 1,
    size = product?.size || "One Size"
  ) => {
    if (!product?._id) {
      return;
    }

    // ----------------------------------------------
    // Guest
    // ----------------------------------------------
    if (!isAuthenticated) {
      setCart((prev) => {
        const found = prev.find(
          (item) =>
            String(item._id) ===
              String(product._id) &&
            (item.size || "One Size") === size
        );

        if (found) {
          return prev.map((item) =>
            String(item._id) ===
              String(product._id) &&
            (item.size || "One Size") === size
              ? {
                  ...item,
                  qty:
                    Number(item.qty || 0) +
                    Number(qty || 0),
                }
              : item
          );
        }

        return [
          ...prev,
          {
            ...product,
            size,
            qty: Number(qty || 1),
          },
        ];
      });

      return;
    }

    // ----------------------------------------------
    // Logged-in user
    // ----------------------------------------------
    try {
      await sync(() =>
        api.post("/cart", {
          productId: product._id,
          qty,
          size,
        })
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // Remove product
  // --------------------------------------------------
  const removeFromCart = async (
    id,
    size = "One Size"
  ) => {
    // Guest
    if (!isAuthenticated) {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(
              String(item._id) === String(id) &&
              (item.size || "One Size") === size
            )
        )
      );

      return;
    }

    // Logged-in
    await sync(() =>
      api.delete(`/cart/${id}`, {
        data: {
          size,
        },
      })
    );
  };

  // --------------------------------------------------
  // Update quantity
  // --------------------------------------------------
  const updateQty = async (
    id,
    size = "One Size",
    qty
  ) => {
    if (qty < 1) {
      return removeFromCart(id, size);
    }

    // Guest
    if (!isAuthenticated) {
      setCart((prev) =>
        prev.map((item) =>
          String(item._id) === String(id) &&
          (item.size || "One Size") === size
            ? {
                ...item,
                qty: Number(qty),
              }
            : item
        )
      );

      return;
    }

    // Logged-in
    await sync(() =>
      api.put(`/cart/${id}`, {
        qty,
        size,
      })
    );
  };

  // --------------------------------------------------
  // Clear cart
  // --------------------------------------------------
  const clearCart = async () => {
    // Guest
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    // Logged-in
    try {
      await api.delete("/cart");
    } finally {
      setCart([]);
    }
  };

  // --------------------------------------------------
  // Cart calculations
  // --------------------------------------------------
  const cartCount = cart.reduce(
    (sum, item) =>
      sum + Number(item.qty || 0),
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => {
      const price =
        Number(item.discountPrice) > 0
          ? Number(item.discountPrice)
          : Number(item.price || 0);

      return (
        sum +
        price * Number(item.qty || 0)
      );
    },
    0
  );

  const cartOldTotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.qty || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        ready,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
        cartOldTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return ctx;
}