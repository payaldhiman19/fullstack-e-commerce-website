// import { useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { LayoutDashboard, Package, Plus, Upload, ClipboardList, LogOut, Menu, X } from "lucide-react";
// import { Images } from "lucide-react";
// import { adminLogout } from "../adminAuth";

// const links = [
//   { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { to: "/admin/products", label: "Manage Products", icon: Package },
//   { to: "/admin/add-product", label: "Add Product", icon: Plus },
//   { to: "/admin/bulk-import", label: "Bulk Import", icon: Upload },
//   { to: "/admin/orders", label: "Manage Orders", icon: ClipboardList },
//   { to: "/admin/media", label: "Media Library",icon: Images,
// },
// ];


// export default function AdminLayout() {
//   const [open, setOpen] = useState(false); 
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     adminLogout();
//     navigate("/admin/login", { replace: true });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 md:flex">
//       {/* dark overlay, mobile only */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 z-40 bg-black/40 md:hidden"
//         />
//       )}
//       <aside
//   className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
//     open ? "translate-x-0" : "-translate-x-full"
//   }`}
// >
//         <div className="flex items-center justify-between border-b px-5 py-5">
//           <h1 className="text-xl font-bold">Admin Panel</h1>
//           <button onClick={() => setOpen(false)} className="md:hidden" aria-label="Close menu">
//             <X size={20} />
//           </button>
//         </div>

//         <nav className="flex-1 space-y-1 p-3">
//           {links.map(({ to, label, icon: Icon }) => (
//             <NavLink
//               key={to}
//               to={to}
//              onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
//                   isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
//                 }`
//               }
//             >
//               <Icon size={18} />
//               {label}
//             </NavLink>
//           ))}
//         </nav>

//         <button
//           onClick={handleLogout}
//           className="m-3 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </aside>

//       {/* page content */}
//       <div className="min-w-0 flex-1">
//         <div className="flex items-center gap-3 bg-white px-4 py-3 shadow-sm md:hidden">
//           <button onClick={() => setOpen(true)} aria-label="Open menu">
//             <Menu size={22} />
//           </button>
//           <span className="font-semibold">Admin Panel</span>
//         </div>

//         <Outlet />
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Plus,
  Upload,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Images,
  PanelLeft,
} from "lucide-react";

import { adminLogout } from "../adminAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Manage Products", icon: Package },
  { to: "/admin/add-product", label: "Add Product", icon: Plus },
  { to: "/admin/bulk-import", label: "Bulk Import", icon: Upload },
  { to: "/admin/orders", label: "Manage Orders", icon: ClipboardList },
  { to: "/admin/media", label: "Media Library", icon: Images },
];

function SidebarContent({ onNavigate, onLogout }) {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <PanelLeft size={20} />
        </div>

        <div>
          <h1 className="font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">
            Store management
          </p>
        </div>
      </div>

      <Separator />

      <div className="px-4 pb-2 pt-5">
        <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin/dashboard"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <Separator />

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/40 md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background md:block">
        <SidebarContent
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <SidebarContent
            onNavigate={() => setOpen(false)}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </Button>

          <div className="flex-1">
            <p className="text-sm font-medium">Store Administration</p>
            <p className="text-xs text-muted-foreground">
              Manage your ecommerce store
            </p>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
