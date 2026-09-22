import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET categories - public
  const fetchCategories = async () => {
    setLoading(true);

    try {
      const response = await api.get("/categories");
      const data = response.data;

      setCategories(data.categories ?? data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ADD category - admin
  const addCategory = async (categoryData) => {
    try {
      const response = await api.post(
        "/admin/categories",
        categoryData
      );

      const newCategory =
        response.data.category ?? response.data;

      setCategories((prev) => [newCategory, ...prev]);

      return newCategory;
    } catch (error) {
      console.error("Failed to add category:", error);
      throw error;
    }
  };

  // UPDATE category - admin
  const updateCategory = async (id, categoryData) => {
    try {
      const response = await api.put(
        `/admin/categories/${id}`,
        categoryData
      );

      const updatedCategory =
        response.data.category ?? response.data;

      setCategories((prev) =>
        prev.map((category) =>
          category._id === id ? updatedCategory : category
        )
      );

      return updatedCategory;
    } catch (error) {
      console.error("Failed to update category:", error);
      throw error;
    }
  };

  // DELETE category - admin
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);

      setCategories((prev) =>
        prev.filter((category) => category._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        loading,
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
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error(
      "useCategories must be used inside CategoriesProvider"
    );
  }

  return context;
}