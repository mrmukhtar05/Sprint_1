import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/products", {
        params: { page: 1, limit: 20, ...params },
      });
      const data = response.data;
      setProducts(data.products || []);
      setMeta({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0,
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load products.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data) => {
    const response = await api.post("/admin/products", data);
    const product = response.data.product;
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = async (id, data) => {
    const response = await api.put(`/admin/products/${id}`, data);
    const product = response.data.product;
    setProducts((prev) =>
      prev.map((item) => String(item._id) === String(id) ? product : item)
    );
    return product;
  };

  const deleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`);
    setProducts((prev) => prev.filter((item) => String(item._id) !== String(id)));
  };

  useEffect(() => {
    fetchProducts().catch(() => {});
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, meta, fetchProducts, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
}
