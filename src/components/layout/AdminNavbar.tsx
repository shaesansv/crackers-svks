import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Content", href: "/admin/content" },
];

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <nav className="lg:hidden sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-xl">🎆</span>
          <span className="font-display font-bold text-black hidden sm:inline">Admin Panel</span>
          <span className="font-display font-bold text-black sm:hidden">Admin</span>
        </Link>

        {/* Mobile Navbar Button - Black */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2.5 bg-black text-white hover:bg-gray-900 rounded-lg transition-colors shadow-sm focus:outline-none flex items-center justify-center"
          aria-label="Toggle Navigation Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white p-4 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block px-3.5 py-2.5 rounded-lg text-sm font-bold transition-colors",
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-800 hover:bg-gray-100 hover:text-black"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-100 transition-colors"
          >
            ← Back to Store
          </Link>

          <Button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            variant="default"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white border-none font-bold"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
