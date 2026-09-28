import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";

const navLinks = [
  "NEW", "TYOHAR SALE", "BESTSELLERS", "WOMENSWEAR", "MENSWEAR",
  "KIDSWEAR", "FOOTWEAR", "BAGS", "JEWELLERY", "READY TO SHIP", "LUXE",
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white">
      {/* Top row */}
      <div className="grid grid-cols-3 items-center px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <input
            type="text"
            placeholder="Search..."
            className="hidden md:block bg-gray-100 rounded-md px-3 py-2 text-sm outline-none w-60"
          />
        </div>

        {/* Center: logo */}
        <Link to="/" className="justify-self-center text-xl sm:text-2xl font-medium">
          AACHHO
        </Link>

        <div className="flex items-center justify-end gap-4 sm:gap-5">
          <Search size={20} className="md:hidden" />
          <Link to="/cart">
            <ShoppingCart size={20} strokeWidth={1.5} />
          </Link>
          <Link to="/account">
            <User size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Bottom row: visible from md up  hidden on mobile */}
      <div className="hidden md:flex justify-center gap-6 py-3 border-t text-sm text-[#8a5a2b]">
        {navLinks.map((label) => (
          <Link key={label} to={`/${label.toLowerCase().replace(/\s+/g, "-")}`}>
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile dropdown menu — shows when hamburger is clicked */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 py-4 border-t text-sm text-[#8a5a2b]">
          {navLinks.map((label) => (
            <Link
              key={label}
              to={`/${label.toLowerCase().replace(/\s+/g, "-")}`}
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