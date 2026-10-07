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
import ManageProducts from "./components/ManageProducts";
import ProductForm from "./components/ProductForm";
import MobileBottomNav from "./components/MobileBottomNav";
import { WishlistProvider } from "./context/WishlistContext";
import Wishlist from "./pages/Wishlist";
import BulkImport from "./components/BulkImport";
import SearchPage from "./pages/SearchPage";


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
      <MobileBottomNav />
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
      <WishlistProvider>

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
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shipping-policy" element={<Policies />} />
          <Route path="/privacy-policy" element={<Policies />} />
          <Route path="/return-policy" element={<Policies />} />
          <Route path="/terms" element={<Policies />} />
          <Route path="/account" element={<Placeholder title="My Account" />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/add-product" element={<ProductForm />} />
          <Route path="/admin/edit-product/:slug" element={<ProductForm />} />
          <Route path="/orders" element={<Placeholder title="My Orders" />} />
          <Route path="/track-orders" element={<Placeholder title="Track Orders" />} />
          <Route path="/exchange" element={<Placeholder title="Exchange Request" />} />
          <Route path="/tickets" element={<Placeholder title="Tickets" />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Every nav link: /new, /womenswear, /tyohar-sale, /ready-to-ship ... */}
          <Route path="/:category" element={<CategoryPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/bulk-import" element={<BulkImport />} />
      </Routes>

      {/* Cart drawer (opens from the navbar cart icon) */}
      <CartDrawer />

      {/* Login / Signup Modal */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} setUser={setUser} />
      )}
    </WishlistProvider>
  );
}

export default App;