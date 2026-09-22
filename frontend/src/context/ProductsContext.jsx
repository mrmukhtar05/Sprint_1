import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products", {
        params,
      });

      if (response.data?.success) {
        setProducts(response.data.products || []);
      } else {
        setProducts([]);
      }

      return response.data;
    } catch (err) {
      console.error("Fetch products error:", err);

      const message =
        err.response?.data?.message ||
        "Failed to load products.";

      setError(message);
      setProducts([]);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get one product by MongoDB ID OR slug
  const getProduct = async (idOrSlug) => {
    try {
      const response = await api.get(
        `/products/${idOrSlug}`
      );

      if (response.data?.success) {
        return response.data.product;
      }

      return null;
    } catch (err) {
      console.error("Get product error:", err);
      return null;
    }
  };

  const addProduct = async (product) => {
    try {
      const response = await api.post(
        "/admin/products",
        product
      );

      if (response.data?.success) {
        const newProduct = response.data.product;

        setProducts((prev) => [
          newProduct,
          ...prev,
        ]);

        return newProduct;
      }

      return null;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to add product.";

      throw new Error(message);
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const response = await api.put(
        `/admin/products/${id}`,
        updates
      );

      if (response.data?.success) {
        const updatedProduct = response.data.product;

        setProducts((prev) =>
          prev.map((product) =>
            String(product._id) === String(id)
              ? updatedProduct
              : product
          )
        );

        return updatedProduct;
      }

      return null;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to update product.";

      throw new Error(message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await api.delete(
        `/admin/products/${id}`
      );

      if (response.data?.success) {
        setProducts((prev) =>
          prev.filter(
            (product) =>
              String(product._id) !== String(id)
          )
        );

        return true;
      }

      return false;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to delete product.";

      throw new Error(message);
    }
  };

  const value = {
    products,
    loading,
    error,

    fetchProducts,
    getProduct,

    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);

  if (!ctx) {
    throw new Error(
      "useProducts must be used inside ProductsProvider"
    );
  }

  return ctx;
}