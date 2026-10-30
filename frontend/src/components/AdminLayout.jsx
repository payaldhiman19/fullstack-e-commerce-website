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

//function SidebarContent({ onNavigate, onLogout }) {
  function SidebarContent({ onNavigate, onLogout, collapsed, onToggle }) {
  
  return (
    <div className="flex h-full flex-col bg-background">
        <div className="flex h-16 items-center gap-3 px-5">
  <button
    onClick={onToggle}
    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
  >
    <PanelLeft size={20} />
  </button>

  {!collapsed && (
    <div>
      <h1 className="font-semibold tracking-tight">Admin Panel</h1>
      <p className="text-xs text-muted-foreground">
        Store management
      </p>
    </div>
  )}
</div>
      <Separator />
  {!collapsed&&(
      <div className="px-4 pb-2 pt-5">
        <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
      </div>
  )}

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
            <Icon size={20} />
{!collapsed && <span>{label}</span>}          
</NavLink>
        ))}
      </nav>

      <Separator />

      <div className="p-3">
        <Button
          variant="ghost"
          className={`w-full text-muted-foreground hover:text-destructive ${
  collapsed ? "justify-center" : "justify-start gap-3"}`}
          onClick={onLogout}
        >
          <LogOut size={20} />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/40 md:flex">
      <aside
  className={`sticky top-0 hidden h-screen shrink-0 border-r bg-background transition-all duration-300 md:block ${
    collapsed ? "w-20" : "w-64"
  }`}
>
  <SidebarContent
    collapsed={collapsed}
    onToggle={() => setCollapsed(!collapsed)}
    onNavigate={() => {}}
    onLogout={handleLogout}
  />
</aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          
          <SidebarContent
          collapsed={false}
          onToggle={()=>{}}
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
