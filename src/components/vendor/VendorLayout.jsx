import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, LogOut, Store, Menu, X, Wallet, UserCircle, Layers } from "lucide-react";
import logo from '../../assets/logo.jpeg';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const NAV = [
  { href: "/vendor", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/vendor/orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/vendor/products", label: "Products", icon: <Package className="w-4 h-4" /> },
  { href: "/vendor/categories", label: "Categories", icon: <Layers className="w-4 h-4" /> },
  { href: "/vendor/wallet", label: "Virtual Wallet", icon: <Wallet className="w-4 h-4" /> },
  { href: "/vendor/profile", label: "Profile", icon: <UserCircle className="w-4 h-4" /> },
];

export function VendorLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [vendor, setVendor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("vendor_token");
    if (!token) {
      navigate("/vendor-login");
      return;
    }

    fetch(`${BACKEND_URL}/vendorAuth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.vendor) { navigate("/vendor-login"); return; }
        setVendor(d.vendor);
      })
      .catch(() => navigate("/vendor-login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("vendor_token");
    navigate("/vendor-login");
  };

  if (!vendor) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#fe6603]/20 border-t-[#fe6603] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#fe6603]/10 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Indbasket Vendor" className="h-8 object-contain mix-blend-multiply" />
          <span className="font-bold text-lg"><span className="text-[#fe6603]">Ind</span><span className="text-[#036e26]">basket</span> <span className="text-sm font-normal text-gray-500">Vendor</span></span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#fe6603]">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-[#fe6603]/10 flex flex-col fixed h-full z-50 transition-transform ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-5 border-b border-[#fe6603]/10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Indbasket Vendor" className="h-10 object-contain mix-blend-multiply" />
            <div>
              <p className="font-bold text-xl tracking-tight leading-none"><span className="text-[#fe6603]">Ind</span><span className="text-[#036e26]">basket</span></p>
              <div className="flex items-center gap-1 mt-1">
                <Store className="w-3 h-3 text-[#fe6603]" />
                <p className="text-[#fe6603] text-[10px] font-sans font-semibold">Vendor Portal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-[#fe6603]/10">
          <p className="font-sans font-semibold text-[#fe6603] text-sm truncate">{vendor.name}</p>
          <p className="text-[#fe6603]/60 text-[10px] font-sans truncate">{vendor.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-colors ${
                pathname === item.href ? "bg-[#fe6603]/10 text-[#fe6603]" : "text-[#fe6603]/60 hover:text-[#fe6603] hover:bg-[#FDFBF7]"
              }`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#fe6603]/10">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 sm:p-6 pt-16 md:pt-6 min-w-0">
        {children}
      </main>
    </div>
  );
}
