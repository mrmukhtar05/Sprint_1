import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";
const WishlistContext = createContext(null);
const loadLocal = () => { try { const x = JSON.parse(localStorage.getItem("vv_wishlist") || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } };
export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(loadLocal);
  useEffect(() => {
    if (!isAuthenticated) { setWishlist(loadLocal()); return; }
    api.get("/wishlist").then(r => setWishlist(r.data?.wishlist?.products || [])).catch(e => console.error("Wishlist load error", e));
  }, [isAuthenticated]);
  useEffect(() => { if (!isAuthenticated) localStorage.setItem("vv_wishlist", JSON.stringify(wishlist)); }, [wishlist, isAuthenticated]);
  const isWishlisted = (id) => wishlist.some(p => String(p._id) === String(id));
  const toggleWishlist = async (product) => {
    if (!product?._id) return;
    if (!isAuthenticated) { setWishlist(p => isWishlisted(product._id) ? p.filter(x => String(x._id) !== String(product._id)) : [...p, product]); return; }
    try {
      const r = isWishlisted(product._id) ? await api.delete(`/wishlist/${product._id}`) : await api.post("/wishlist", { productId: product._id });
      setWishlist(r.data?.wishlist?.products || []);
    } catch (e) { console.error(e); throw e; }
  };
  const removeFromWishlist = async (id) => {
    if (!isAuthenticated) { setWishlist(p => p.filter(x => String(x._id) !== String(id))); return; }
    const r = await api.delete(`/wishlist/${id}`); setWishlist(r.data?.wishlist?.products || []);
  };
  return <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, removeFromWishlist, wishlistCount: wishlist.length }}>{children}</WishlistContext.Provider>;
}
export function useWishlist() { const ctx = useContext(WishlistContext); if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider"); return ctx; }
