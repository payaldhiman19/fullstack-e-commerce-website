import React, { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Flashsale from "./components/FlashSale";
import Footer from "./components/Footer";
import Hero from "./components/Hero";

import LoginPopup from "./components/LoginPopup";
import RegisterPopup from "./components/RegisterPopup";
import AdminAuth from "./components/AdminAuth";

import "./App.css";

function App() {
  const [authPage, setAuthPage] = useState(null);

  const currentPath = window.location.pathname;

  /*
    USER LOGIN CHECK
  */

  useEffect(() => {
    if (currentPath === "/admin") {
      return;
    }

    const isLoggedIn = localStorage.getItem("aachho_logged_in");

    if (!isLoggedIn) {
      setAuthPage("login");
    }
  }, [currentPath]);

  /*
    ADMIN PAGE
  */

  if (currentPath === "/admin") {
    return (
      <AdminAuth
        onLoginSuccess={() => {
          window.location.href = "/admin/dashboard";
        }}
      />
    );
  }

  /*
    ADMIN DASHBOARD
  */

  if (currentPath === "/admin/dashboard") {
    const isAdminLoggedIn = localStorage.getItem("admin_logged_in");

    if (isAdminLoggedIn !== "true") {
      window.location.href = "/admin";
      return null;
    }

    return <AdminDashboard />;
  }

  /*
    NORMAL WEBSITE
  */

  return (
    <>
      <Flashsale />

      <main>
        <Navbar />

        <Hero />
      </main>

      <Footer />

      {/* USER LOGIN */}

      <LoginPopup
        isOpen={authPage === "login"}
        onClose={() => {
          setAuthPage(null);
        }}
        onRegister={() => {
          setAuthPage("register");
        }}
      />

      {/* USER REGISTER */}

      <RegisterPopup
        isOpen={authPage === "register"}
        onClose={() => {
          setAuthPage(null);
        }}
        onLogin={() => {
          setAuthPage("login");
        }}
      />
    </>
  );
}

/*
  ================= ADMIN DASHBOARD =================
*/

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="border-b bg-white px-8 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">AACHHO Admin Panel</h1>

          <button
            onClick={() => {
              localStorage.removeItem("admin_logged_in");

              window.location.href = "/admin";
            }}
            className="text-sm text-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-10">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

        <p className="mt-2 text-gray-600">
          Welcome to the AACHHO administration panel.
        </p>
      </div>
    </div>
  );
}

export default App;
