import { useState ,useEffect} from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
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
import MyOrders from "./pages/MyOrders";
import TrackOrder from "./pages/TrackOrder";
import ManageOrders from "./components/ManageOrders";
import WishlistToast from "./components/WishlistToast"
import CustomerReviews from "./pages/CustomerReviews";
import AdminLayout from "./components/AdminLayout";

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
     const { pathname, search } = useLocation();

useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}, [pathname, search]);
  return (
      <WishlistProvider user={user}>

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
           <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<TrackOrder />} />
          <Route path="/exchange" element={<Placeholder title="Exchange Request" />} />
          <Route path="/tickets" element={<Placeholder title="Tickets" />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/reviews" element={<CustomerReviews />} />
          <Route
  path="/new"
  element={<Navigate to="/category/new" replace />}
/>

<Route
  path="/tyohar-sale"
  element={<Navigate to="/category/tyohar-sale" replace />}
/>

<Route
  path="/bestsellers"
  element={<Navigate to="/category/bestsellers" replace />}
/>

<Route
  path="/womenswear"
  element={<Navigate to="/category/womenswear" replace />}
/>

<Route
  path="/menswear"
  element={<Navigate to="/category/menswear" replace />}
/>

<Route
  path="/kidswear"
  element={<Navigate to="/category/kidswear" replace />}
/>

<Route
  path="/footwear"
  element={<Navigate to="/category/footwear" replace />}
/>

<Route
  path="/bags"
  element={<Navigate to="/category/bags" replace />}
/>

<Route
  path="/jewellery"
  element={<Navigate to="/category/jewellery" replace />}
/>

<Route
  path="/ready-to-ship"
  element={<Navigate to="/category/ready-to-ship" replace />}
/>

<Route
  path="/luxe"
  element={<Navigate to="/category/luxe" replace />}
/>


          {/* Every nav link: /new, /womenswear, /tyohar-sale, /ready-to-ship ... */}
        <Route path="/category/:category" element={<CategoryPage />} />        
        </Route>

         {/* <Route path="/admin/add-product" element={<ProductForm />} /> */}
         <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
         <Route element={<AdminLayout />}>
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<ProductForm />}/>
        <Route path="/admin/bulk-import" element={<BulkImport />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/edit-product/:slug" element={<ProductForm />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
</Route>
      </Routes>

      <CartDrawer />
<WishlistToast setShowAuth={setShowAuth} />      {/* Login / Signup Modal */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} setUser={setUser} />
      )}
    </WishlistProvider>
  );
}

export default App;