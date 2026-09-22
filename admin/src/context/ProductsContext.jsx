import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET products - public route
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await api.get("/products");
      const data = response.data;

      setProducts(data.products ?? data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ADD product - admin route
  const addProduct = async (productData) => {
    try {
      const response = await api.post(
        "/admin/products",
        productData
      );

      const newProduct =
        response.data.product ?? response.data;

      setProducts((prev) => [newProduct, ...prev]);

      return newProduct;
    } catch (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
  };

  // UPDATE product - admin route
  const updateProduct = async (id, productData) => {
    try {
      const response = await api.put(
        `/admin/products/${id}`,
        productData
      );

      const updatedProduct =
        response.data.product ?? response.data;

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? updatedProduct : product
        )
      );

      return updatedProduct;
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  };

  // DELETE product - admin route
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductsProvider"
    );
  }

  return context;
}