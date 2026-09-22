import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login when app starts
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/profile")
      .then((response) => {
        if (response.data?.success) {
          setUser(response.data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // REGISTER
  const register = async ({ name, email, password, phone = "" }) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
      });

      const { token, user } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  // LOGIN
  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Invalid email or password.",
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if backend logout fails, clear local session
    }

    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  // UPDATE PROFILE
  const updateProfile = async (data) => {
    try {
      const response = await api.put("/auth/profile", data);

      if (response.data?.success) {
        setUser(response.data.user);
      }

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Unable to update profile.",
      };
    }
  };

  // GET CURRENT PROFILE
  const getProfile = async () => {
    try {
      const response = await api.get("/auth/profile");

      if (response.data?.success) {
        setUser(response.data.user);
      }

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Unable to load profile.",
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",

    register,
    login,
    logout,

    updateProfile,
    getProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}