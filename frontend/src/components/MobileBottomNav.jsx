import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, Tag, Heart } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", Icon: Home, end: true },
  { to: "/womenswear", label: "Category", Icon: LayoutGrid },
  { to: "/tyohar-sale", label: "Sale", Icon: Tag },
  { to: "/wishlist", label: "Wishlist", Icon: Heart },
];

const MobileBottomNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
    {tabs.map(({ to, label, Icon, end }) => (
      <NavLink
        key={label}
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex flex-1 flex-col items-center gap-1 py-2 text-xs uppercase ${
            isActive ? "text-[#e0626a]" : "text-gray-600"
          }`
        }
      >
        <Icon size={22} />
        {label}
      </NavLink>
    ))}
  </nav>
);

export default MobileBottomNav;