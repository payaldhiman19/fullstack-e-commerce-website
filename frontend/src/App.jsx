import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import Navbar from "./components/Navbar";
import Flashsale from "./components/FlashSale";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./components/AdminDashboard";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import CartDrawer from "./components/CartDrawer";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import "./App.css";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Policies from "./pages/Policies";

// Temporary page for routes you haven't built yet
const Placeholder = ({ title }) => (
  <div className="py-32 text-center text-gray-500">
    {title} page coming soon
  </div>
);

// Shared layout: every page inside gets Flashsale + Navbar + Footer
function Layout({ user, setUser, setShowAuth }) {
  return (
    <>
      <Flashsale />
      <Navbar user={user} setUser={setUser} setShowAuth={setShowAuth} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Routes>
        {/* Customer pages (with navbar + footer) */}
        <Route
          element={
            <Layout user={user} setUser={setUser} setShowAuth={setShowAuth} />
          }
        >
          <Route
            path="/"
            element={
              <>
                <Hero />
                <ProductList />
              </>
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shipping-policy" element={<Policies />} />
          <Route path="/privacy-policy" element={<Policies />} />
          <Route path="/return-policy" element={<Policies />} />
          <Route path="/terms" element={<Policies />} />
          <Route path="/account" element={<Placeholder title="My Account" />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/orders" element={<Placeholder title="My Orders" />} />

          {/* Every nav link: /new, /womenswear, /tyohar-sale, /ready-to-ship ... */}
          <Route path="/:category" element={<CategoryPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
      </Routes>

      {/* Cart drawer (opens from the navbar cart icon) */}
      <CartDrawer />

      {/* Login / Signup Modal */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} setUser={setUser} />
      )}
    </>
  );
}

export default App;