import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ProductsProvider } from "./context/ProductsContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import { CategoriesProvider } from "./context/CategoriesContext";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <CategoriesProvider>
              <CartProvider>
                <WishlistProvider>
                  <OrdersProvider>
                    <Routes>
                      

                      <Route
                        path="*"
                        element={
                          <MainLayout>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/shop" element={<Shop />} />
                              <Route path="/categories" element={<Categories />} />
                              <Route path="/product/:id" element={<ProductDetails />} />
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/wishlist" element={<Wishlist />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/orders" element={<Orders />} />
                              <Route path="/contact" element={<Contact />} />
                              <Route path="/about" element={<About />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </MainLayout>
                        }
                      />
                    </Routes>
                  </OrdersProvider>
                </WishlistProvider>
              </CartProvider>
            </CategoriesProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
