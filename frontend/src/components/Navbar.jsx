import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import { ShoppingCart, Menu, X, Search } from "lucide-react";

// Main navbar links
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

// Dropdown data
const dropdownData = {
  WOMENSWEAR: [
    {
      title: "ETHNIC WEAR",
      items: [
        "Suit Sets",
        "Kurta Sets",
        "Coord Set",
        "Sharara Sets",
        "Lehenga Sets",
        "Sarees",
        "Blouse",
      ],
    },
    {
      title: "WESTERN WEAR",
      items: ["Dresses", "Coord Set", "Top & Shirt's"],
    },
    {
      title: "BOTTOM WEAR",
      items: ["Cotton Pants", "Linen Pants"],
    },
    {
      title: "LOUNGEWEAR",
      items: ["Loungewear"],
    },
    {
      title: "WINTERWEAR",
      items: ["Suzani Jackets", "Velvet Suits", "Shawls"],
    },
  ],

  MENSWEAR: [
    {
      items: ["Kurta Sets", "Shirts"],
    },
  ],

  KIDSWEAR: [
    {
      items: ["Ethnic Wear", "Western Wear"],
    },
  ],

  FOOTWEAR: [
    {
      items: ["Juttis", "Heels", "Sandals", "Loafers"],
    },
  ],

  BAGS: [
    {
      title: "BAGS",
      items: ["Handbags", "Clutches", "Tote Bags", "Potlis"],
    },
  ],

  JEWELLERY: [
    {
      title: "JEWELLERY",
      items: ["Earrings", "Necklaces", "Bracelets", "Rings"],
    },
  ],
};

function Navbar({ user, setUser, setShowAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Which dropdown is currently open
  const [activeMenu, setActiveMenu] = useState(null);

  const { openCart, count } = useCart();

  // ---------- SEARCH ----------
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  // Convert text into URL
  const createPath = (text) => {
    return `/${text.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <nav
      className="relative w-full bg-white"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* ================= TOP NAVBAR ================= */}

      <div className="grid grid-cols-3 items-center px-4 py-4 sm:px-6">
        {/* LEFT SIDE */}
        <div className="flex items-center">
          {/* Mobile menu */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden items-center bg-gray-100 md:flex"
          >
            <Search size={18} className="ml-3 text-gray-500" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-56 bg-transparent px-3 py-2 text-sm outline-none"
            />
          </form>
        </div>

        {/* LOGO */}
        <Link
          to="/"
          className="justify-self-center text-xl font-medium tracking-wider sm:text-2xl"
        >
          Rivana
        </Link>

        {/* ================= RIGHT SIDE ================= */}

        <div className="flex items-center justify-end gap-4 sm:gap-5">
          {/* Mobile search */}
          <Link
            to="/search"
            className="md:hidden"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative"
            aria-label="Open cart"
          >
            <ShoppingCart
              size={20}
              strokeWidth={1.5}
            />

            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e0626a] text-[10px] text-white">
                {count}
              </span>
            )}
          </button>

          {/* Account */}
          <AccountMenu
            user={user}
            setUser={setUser}
            setShowAuth={setShowAuth}
          />
        </div>
      </div>

      {/* ================= DESKTOP NAV ================= */}

      <div className="hidden border-t md:block">
        <div className="relative flex justify-center gap-5 py-3 text-sm tracking-[0.18em] text-gray-700 lg:gap-6">
          {navLinks.map((label) => {
            const hasDropdown = dropdownData[label];

            return (
              <div
                key={label}
                className="relative h-full"
                onMouseEnter={() => {
                  if (hasDropdown) {
                    setActiveMenu(label);
                  } else {
                    setActiveMenu(null);
                  }
                }}
              >
                {/* ================= NAV ITEM ================= */}

                <Link
                  to={createPath(label)}
                  className="relative block pb-2 transition-colors hover:text-black"
                >
                  {label}

                  {/* BLACK HOVER LINE */}
                  {activeMenu === label && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />
                  )}
                </Link>

                {/* ================= SMALL DROPDOWN ================= */}

                {activeMenu === label &&
                  hasDropdown &&
                  label !== "WOMENSWEAR" && (
                    <div
                      className="absolute left-0 top-full z-50 w-40 border-t bg-white shadow-sm"
                      onMouseEnter={() => setActiveMenu(label)}
                    >
                      <div className="py-2">
                        {dropdownData[label].map((column) => (
                          <div key={column.title || label}>
                            {column.items.map((item) => (
                              <Link
                                key={item}
                                to={createPath(item)}
                                className="block px-3 py-2 text-sm tracking-normal text-gray-600 transition hover:bg-gray-50 hover:text-black"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}

          {/* ================= WOMENSWEAR MEGA MENU ================= */}

          {activeMenu === "WOMENSWEAR" && (
            <div
              className="absolute left-0 top-full z-50 w-full border-t bg-white shadow-sm"
              onMouseEnter={() => setActiveMenu("WOMENSWEAR")}
            >
              <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-10 py-8 md:grid-cols-3 lg:grid-cols-5">
                {dropdownData.WOMENSWEAR.map((column) => (
                  <div key={column.title}>
                    {/* Column heading */}
                    <h3 className="mb-5 text-sm font-semibold tracking-[0.18em] text-gray-700">
                      {column.title}
                    </h3>

                    {/* Column links */}
                    <div className="flex flex-col gap-3">
                      {column.items.map((item) => (
                        <Link
                          key={item}
                          to={createPath(item)}
                          className="text-sm tracking-wide text-gray-600 transition hover:text-black"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          {/* Search box inside mobile menu */}
          <form
            onSubmit={handleSearch}
            className="mb-3 flex items-center bg-gray-100"
          >
            <Search
              size={18}
              className="ml-3 text-gray-500"
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent px-3 py-2 text-sm outline-none"
            />
          </form>

          {navLinks.map((label) => {
            const hasDropdown = dropdownData[label];

            return (
              <div key={label}>
                <div className="flex items-center justify-between py-3">
                  <Link
                    to={createPath(label)}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm tracking-wider text-gray-700"
                  >
                    {label}
                  </Link>

                  {hasDropdown && (
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === label ? null : label
                        )
                      }
                      className="px-2"
                    >
                      {activeMenu === label ? "−" : "+"}
                    </button>
                  )}
                </div>

                {/* Mobile dropdown */}
                {activeMenu === label && hasDropdown && (
                  <div className="mb-2 ml-4 border-l pl-4">
                    {dropdownData[label].map((column) => (
                      <div
                        key={column.title || label}
                        className="mb-5"
                      >
                        {column.title && (
                          <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-700">
                            {column.title}
                          </h3>
                        )}

                        <div className="flex flex-col gap-2">
                          {column.items.map((item) => (
                            <Link
                              key={item}
                              to={createPath(item)}
                              onClick={() => setMenuOpen(false)}
                              className="text-sm text-gray-600"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}

export default Navbar;