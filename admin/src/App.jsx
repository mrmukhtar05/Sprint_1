import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProductsProvider } from "./context/ProductsContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { AuthProvider } from "./context/AuthContext";

import Admin from "./Admin";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CategoriesProvider>
          <ProductsProvider>
            <Routes>
              {/* Admin Login */}
              <Route path="/login" element={<Login />} />

              {/* Admin Dashboard */}
              <Route path="/admin/*" element={<Admin />} />

              {/* Default */}
              <Route
                path="*"
                element={<Navigate to="/admin" replace />}
              />
            </Routes>
          </ProductsProvider>
        </CategoriesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}