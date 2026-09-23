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
      const r = await api.get("/categories");
      const list = r.data?.categories || [];
      setCategories(list);
      return list;
    } catch (e) {
      const message = e.response?.data?.message || "Failed to load categories.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data) => {
    const response = await api.post("/admin/categories", data);
    const category = response.data.category;
    setCategories((prev) => [category, ...prev]);
    return category;
  };

  const updateCategory = async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    const category = response.data.category;
    setCategories((prev) =>
      prev.map((item) => String(item._id) === String(id) ? category : item)
    );
    return category;
  };

  const deleteCategory = async (id) => {
    await api.delete(`/admin/categories/${id}`);
    setCategories((prev) => prev.filter((item) => String(item._id) !== String(id)));
  };

  useEffect(() => {
    fetchCategories().catch(() => {});
  }, []);

  return (
    <CategoriesContext.Provider
      value={{ categories, loading, error, fetchCategories, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be used inside CategoriesProvider");
  return ctx;
}
