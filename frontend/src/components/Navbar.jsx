import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
} from "lucide-react";

const navLinks = [
  "NEW",
  "TYOHAR SALE",
  "BESTSELLERS",
  "WOMENSWEAR",
  "MENSWEAR",
  "KIDSWEAR",
  "FOOTWEAR",
  "BAGS",
  "JEWELLERY",
  "READY TO SHIP",
  "LUXE",
];

function Navbar({ user, setUser, setShowAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // When user clicks the user icon
  const handleUserClick = () => {
    if (user) {
      // Already logged in → show account dropdown
      setShowAccount(!showAccount);
    } else {
      // Not logged in → open login/signup modal
      setShowAuth(true);
    }
  };

  // Logout
  const handleLogout = () => {
    // Remove login information from browser
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update React state
    setUser(null);

    // Close account dropdown
    setShowAccount(false);
  };

  return (
    <nav className="w-full bg-white">

      {/* TOP NAVBAR */}
      <div className="grid grid-cols-3 items-center px-4 py-4 sm:px-6">

        {/* LEFT SIDE */}
        <div className="flex items-center">

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          {/* Desktop search */}
          <input
            type="text"
            placeholder="Search..."
            className="hidden w-60 rounded-md bg-gray-100 px-3 py-2 text-sm outline-none md:block"
          />

        </div>


        {/* LOGO */}
        <Link
          to="/"
          className="justify-self-center text-xl font-medium sm:text-2xl"
        >
          AACHHO
        </Link>


        {/* RIGHT SIDE */}
        <div className="flex items-center justify-end gap-4 sm:gap-5">

          {/* Mobile search */}
          <Search
            size={20}
            className="md:hidden"
          />

          {/* Cart */}
          <Link to="/cart">
            <ShoppingCart
              size={20}
              strokeWidth={1.5}
            />
          </Link>


          {/* USER ICON + ACCOUNT DROPDOWN */}
          <div className="relative">

            <button
              onClick={handleUserClick}
            >
              <User
                size={20}
                strokeWidth={1.5}
              />
            </button>


            {/* ACCOUNT DROPDOWN */}
            {user && showAccount && (
              <div className="absolute right-0 top-8 z-50 w-56 rounded-lg border bg-white p-4 shadow-lg">

                {/* User information */}
                <div className="border-b pb-3">

                  <p className="font-semibold">
                    {user.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>

                </div>


                {/* My Account */}
                <Link
                  to="/account"
                  className="block py-3 text-sm hover:bg-gray-100"
                  onClick={() => setShowAccount(false)}
                >
                  My Account
                </Link>


                {/* My Orders */}
                <Link
                  to="/orders"
                  className="block py-3 text-sm hover:bg-gray-100"
                  onClick={() => setShowAccount(false)}
                >
                  My Orders
                </Link>


                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full border-t pt-3 text-left text-sm text-red-600"
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>


      {/* DESKTOP NAVIGATION */}
      <div className="hidden justify-center gap-6 border-t py-3 text-sm text-[#8a5a2b] md:flex">

        {navLinks.map((label) => (
          <Link
            key={label}
            to={`/${label
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {label}
          </Link>
        ))}

      </div>


      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t px-4 py-4 text-sm text-[#8a5a2b] md:hidden">

          {navLinks.map((label) => (
            <Link
              key={label}
              to={`/${label
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

        </div>
      )}

    </nav>
  );
}

export default Navbar;