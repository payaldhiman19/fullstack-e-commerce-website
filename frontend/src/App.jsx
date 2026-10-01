import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import Navbar from "./components/Navbar";
import Flashsale from "./components/FlashSale";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./components/AdminDashboard";
import AddProduct from "./components/AddProduct";
import "./App.css";

function App() {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Routes>

        <Route
          path="/"
          element={
            <>
              <Flashsale />

              <main>
                <Navbar
                  user={user}
                  setUser={setUser}
                  setShowAuth={setShowAuth}
                />

                <Hero />
              </main>

              <Footer />
            </>
          }
        />

        <Route
          path="/admin/login"
          element={
            <AdminLogin setUser={setUser} />
          }
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/add-product"
          element={<AddProduct />}
        />

      </Routes>

      {/* Login / Signup Modal */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          setUser={setUser}
        />
      )}

    </>
  );
}

export default App;