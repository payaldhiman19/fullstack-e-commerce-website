import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="w-full bg-[#fdf8f3] text-gray-700">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-10">
        {/* md or lg screen --visible */}
        <div className="hidden md:grid md:grid-cols-5 gap-10">
          <div>
            <h3 className="mb-5 text-sm font-semibold text-black">
              TOP CATEGORIES
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/salwar-suit-sets">Salwar Suit Sets</Link>
              <Link to="/sarees">Sarees</Link>
              <Link to="/kurta-sets">Women Kurta Sets</Link>
              <Link to="/lehengas">Lehengas</Link>
              <Link to="/dresses">Dresses</Link>
              <Link to="/mens-shirts">Men's Shirts</Link>
              <Link to="/mens-kurta">Men's Kurta</Link>
              <Link to="/juttis">Juttis</Link>
              <Link to="/jewellery">Jewellery</Link>
              <Link to="/footwear">Footwear</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-5 text-sm font-semibold text-black">
              DISCOVER
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/about">About Us</Link>
              <Link to="/stores">Stores</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/reviews">Customer Reviews</Link>
              <Link to="/media">Media</Link>
              <Link to="/business-query">Business Query</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/celeb-closet">Celeb Closet</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold text-black">
              SUPPORT
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/fraud-alert">Fraud Alert</Link>
              <Link to="/track-order">Track Order</Link>
              <Link to="/exchange">Exchange Request</Link>
              <Link to="/sitemap">Sitemap</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold text-black">
              POLICIES
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/shipping-policy">Shipping Policy</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/return-policy">
                Cancellation, Return & Exchange Policy
              </Link>
              <Link to="/terms">Terms of Services</Link>
            </div>
          </div>

          <div>
            <form className="flex items-center border-b border-gray-500 pb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-sm placeholder:text-gray-600"
              />
              <button type="submit" aria-label="Subscribe">
                <Mail size={18} />
              </button>
            </form>

            <div className="flex gap-4 mt-6 text-white">
              <a
                href="https://instagram.com"
                className="bg-[#d98a8a] p-2 rounded-full"
                aria-label="Instagram"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="https://facebook.com"
                className="bg-[#d98a8a] p-2 rounded-full"
                aria-label="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://youtube.com"
                className="bg-[#d98a8a] p-2 rounded-full"
                aria-label="YouTube"
              >
                <FaYoutube size={14} />
              </a>
              <a
                href="https://pinterest.com"
                className="bg-[#d98a8a] p-2 rounded-full"
                aria-label="Pinterest"
              >
                <FaPinterestP size={14} />
              </a>
              <a
                href="https://linkedin.com"
                className="bg-[#d98a8a] p-2 rounded-full"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* hidden on md or lg screen, visible on mobile */}
        <div className="md:hidden">
          <div className="border-b border-gray-300">
            <button
              onClick={() => toggleSection("categories")}
              className="w-full py-5 flex items-center justify-between text-sm font-semibold text-black"
            >
              <span>TOP CATEGORIES</span>
              <span className="text-xl">
                {openSection === "categories" ? "−" : "+"}
              </span>
            </button>
            {openSection === "categories" && (
              <div className="pb-5 flex flex-col gap-3 text-sm">
                <Link to="/salwar-suit-sets">Salwar Suit Sets</Link>
                <Link to="/sarees">Sarees</Link>
                <Link to="/kurta-sets">Women Kurta Sets</Link>
                <Link to="/lehengas">Lehengas</Link>
                <Link to="/dresses">Dresses</Link>
                <Link to="/mens-shirts">Men's Shirts</Link>
                <Link to="/mens-kurta">Men's Kurta</Link>
                <Link to="/juttis">Juttis</Link>
                <Link to="/jewellery">Jewellery</Link>
                <Link to="/footwear">Footwear</Link>
              </div>
            )}
          </div>

          <div className="border-b border-gray-300">
            <button
              onClick={() => toggleSection("discover")}
              className="w-full py-5 flex items-center justify-between text-sm font-semibold text-black"
            >
              <span>DISCOVER</span>
              <span className="text-xl">
                {openSection === "discover" ? "−" : "+"}
              </span>
            </button>
            {openSection === "discover" && (
              <div className="pb-5 flex flex-col gap-3 text-sm">
                <Link to="/about">About Us</Link>
                <Link to="/stores">Stores</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/reviews">Customer Reviews</Link>
                <Link to="/media">Media</Link>
                <Link to="/business-query">Business Query</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/celeb-closet">Celeb Closet</Link>
              </div>
            )}
          </div>

          <div className="border-b border-gray-300">
            <button
              onClick={() => toggleSection("support")}
              className="w-full py-5 flex items-center justify-between text-sm font-semibold text-black"
            >
              <span>SUPPORT</span>
              <span className="text-xl">
                {openSection === "support" ? "−" : "+"}
              </span>
            </button>
            {openSection === "support" && (
              <div className="pb-5 flex flex-col gap-3 text-sm">
                <Link to="/fraud-alert">Fraud Alert</Link>
                <Link to="/track-order">Track Order</Link>
                <Link to="/exchange">Exchange Request</Link>
                <Link to="/sitemap">Sitemap</Link>
                <Link to="/contact">Contact Us</Link>
              </div>
            )}
          </div>

          <div className="border-b border-gray-300">
            <button
              onClick={() => toggleSection("policies")}
              className="w-full py-5 flex items-center justify-between text-sm font-semibold text-black"
            >
              <span>POLICIES</span>
              <span className="text-xl">
                {openSection === "policies" ? "−" : "+"}
              </span>
            </button>
            {openSection === "policies" && (
              <div className="pb-5 flex flex-col gap-3 text-sm">
                <Link to="/shipping-policy">Shipping Policy</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/return-policy">
                  Cancellation, Return & Exchange Policy
                </Link>
                <Link to="/terms">Terms of Services</Link>
              </div>
            )}
          </div>

          <div className="py-5">
            <form className="flex items-center border-b border-gray-500 pb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-sm placeholder:text-gray-600"
              />
              <button type="submit" aria-label="Subscribe">
                <Mail size={18} />
              </button>
            </form>

            <div className="flex gap-4 mt-6 text-white">
              <a href="https://instagram.com" className="bg-[#d98a8a] p-2 rounded-full" aria-label="Instagram">
                <FaInstagram size={14} />
              </a>
              <a href="https://facebook.com" className="bg-[#d98a8a] p-2 rounded-full" aria-label="Facebook">
                <FaFacebookF size={14} />
              </a>
              <a href="https://youtube.com" className="bg-[#d98a8a] p-2 rounded-full" aria-label="YouTube">
                <FaYoutube size={14} />
              </a>
              <a href="https://pinterest.com" className="bg-[#d98a8a] p-2 rounded-full" aria-label="Pinterest">
                <FaPinterestP size={14} />
              </a>
              <a href="https://linkedin.com" className="bg-[#d98a8a] p-2 rounded-full" aria-label="LinkedIn">
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom banner with copyright text */}
      <div
        className="w-full bg-[#fbe4dd] bg-center bg-cover py-16 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/footer-illustration.png')" }}
      >
        <p className="text-sm text-gray-700 bg-[#fbe4dd]/70 px-3 py-1 rounded">
          © 2026 Aachho Jaipur Pvt. Ltd. All Rights Reserved.
        </p>use
      </div>
    </footer>
  );
}

export default Footer;