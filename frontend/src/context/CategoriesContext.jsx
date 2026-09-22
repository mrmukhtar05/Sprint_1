import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      if (response.data?.success) {
        setCategories(response.data.categories || []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load categories."
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ----------------- ADMIN -----------------

  const addCategory = async (category) => {
    try {
      const response = await api.post("/admin/categories", category);

      if (response.data?.success) {
        const newCategory = response.data.category;
        setCategories((prev) =>
          [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name))
        );
        return newCategory;
      }

      return null;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to add category.";
      throw new Error(message);
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const response = await api.put(`/admin/categories/${id}`, updates);

      if (response.data?.success) {
        const updated = response.data.category;
        setCategories((prev) =>
          prev.map((cat) => (String(cat._id) === String(id) ? updated : cat))
        );
        return updated;
      }

      return null;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update category.";
      throw new Error(message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await api.delete(`/admin/categories/${id}`);

      if (response.data?.success) {
        setCategories((prev) =>
          prev.filter((cat) => String(cat._id) !== String(id))
        );
        return true;
      }

      return false;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete category.";
      throw new Error(message);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);

  if (!ctx) {
    throw new Error(
      "useCategories must be used inside CategoriesProvider"
    );
  }

  return ctx;
}
