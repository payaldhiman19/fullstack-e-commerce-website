import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
} from "lucide-react";


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
      items: [
        "Dresses",
        "Coord Set",
        "Top & Shirt's",
      ],
    },
    {
      title: "BOTTOM WEAR",
      items: [
        "Cotton Pants",
        "Linen Pants",
      ],
    },
    {
      title: "LOUNGEWEAR",
      items: [
        "Loungewear",
      ],
    },
    {
      title: "WINTERWEAR",
      items: [
        "Suzani Jackets",
        "Velvet Suits",
        "Shawls",
      ],
    },
  ],

  MENSWEAR: [
    {
      title: "MEN'S WEAR",
      items: [
        "Kurta Sets",
        "Shirts",
        "T-Shirts",
        "Jackets",
      ],
    },
    {
      title: "BOTTOM WEAR",
      items: [
        "Trousers",
        "Pants",
        "Denims",
      ],
    },
  ],

  KIDSWEAR: [
    {
      title: "GIRLS",
      items: [
        "Dresses",
        "Lehenga Sets",
        "Kurta Sets",
      ],
    },
    {
      title: "BOYS",
      items: [
        "Kurta Sets",
        "Shirts",
        "T-Shirts",
      ],
    },
  ],

  FOOTWEAR: [
    {
      title: "WOMEN",
      items: [
        "Juttis",
        "Heels",
        "Sandals",
      ],
    },
    {
      title: "MEN",
      items: [
        "Loafers",
        "Mojaris",
        "Sandals",
      ],
    },
  ],

  BAGS: [
    {
      title: "BAGS",
      items: [
        "Handbags",
        "Clutches",
        "Tote Bags",
        "Potlis",
      ],
    },
  ],

  JEWELLERY: [
    {
      title: "JEWELLERY",
      items: [
        "Earrings",
        "Necklaces",
        "Bracelets",
        "Rings",
      ],
    },
  ],

  LUXE: [
    {
      title: "LUXE COLLECTION",
      items: [
        "Designer Wear",
        "Premium Suits",
        "Luxury Sarees",
      ],
    },
  ],
};


function Navbar({ user, setUser, setShowAuth }) {

  const [menuOpen, setMenuOpen] = useState(false);

  // Which dropdown is currently open
  const [activeMenu, setActiveMenu] = useState(null);

  const { openCart, count } = useCart();


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
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>


          {/* Desktop search */}

          <div className="hidden items-center bg-gray-100 md:flex">

            <Search
              size={18}
              className="ml-3 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-56 bg-transparent px-3 py-2 text-sm outline-none"
            />

          </div>

        </div>


        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="justify-self-center text-xl font-medium tracking-wider sm:text-2xl"
        >
          AACHHO
        </Link>


        {/* ================= RIGHT SIDE ================= */}

        <div className="flex items-center justify-end gap-4 sm:gap-5">

          {/* Mobile search */}

          <button className="md:hidden">
            <Search size={20} />
          </button>


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
              <span
                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e0626a] text-[10px] text-white"
              >
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

        <div className="flex justify-center gap-5 py-3 text-sm tracking-[0.18em] text-gray-700 lg:gap-6">

          {navLinks.map((label) => {

            const hasDropdown = dropdownData[label];

            return (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => {
                  if (hasDropdown) {
                    setActiveMenu(label);
                  } else {
                    setActiveMenu(null);
                  }
                }}
              >

                <Link
                  to={createPath(label)}
                  className={`block pb-2 transition-colors hover:text-black ${
                    activeMenu === label
                      ? "border-b border-black"
                      : ""
                  }`}
                >
                  {label}
                </Link>

              </div>
            );

          })}

        </div>


        {/* ================= MEGA DROPDOWN ================= */}

        {activeMenu && dropdownData[activeMenu] && (

          <div
            className="absolute left-0 top-full z-50 w-full border-t bg-white shadow-sm"
            onMouseEnter={() => setActiveMenu(activeMenu)}
          >

            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-10 py-8 md:grid-cols-3 lg:grid-cols-5">

              {dropdownData[activeMenu].map((column) => (

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



      {/* ================= MOBILE NAV ================= */}

      {menuOpen && (

        <div className="border-t bg-white px-4 py-4 md:hidden">

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
                          activeMenu === label
                            ? null
                            : label
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
                        key={column.title}
                        className="mb-5"
                      >

                        <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-700">
                          {column.title}
                        </h3>

                        <div className="flex flex-col gap-2">

                          {column.items.map((item) => (

                            <Link
                              key={item}
                              to={createPath(item)}
                              onClick={() =>
                                setMenuOpen(false)
                              }
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