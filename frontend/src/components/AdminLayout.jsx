import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Plus, Upload, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { adminLogout } from "../adminAuth";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Manage Products", icon: Package },
  { to: "/admin/add-product", label: "Add Product", icon: Plus },
  { to: "/admin/bulk-import", label: "Bulk Import", icon: Upload },
  { to: "/admin/orders", label: "Manage Orders", icon: ClipboardList },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false); 
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* dark overlay, mobile only */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}
      <aside
  className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
    open ? "translate-x-0" : "-translate-x-full"
  }`}
>
        <div className="flex items-center justify-between border-b px-5 py-5">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={() => setOpen(false)} className="md:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
             onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="m-3 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* page content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 bg-white px-4 py-3 shadow-sm md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-semibold">Admin Panel</span>
        </div>

        <Outlet />
      </div>
    </div>
  );
}