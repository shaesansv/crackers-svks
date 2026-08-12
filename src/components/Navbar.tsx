import React, { useState } from 'react';
import sarguruLogo from '../assets/sarguru.png';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Menu, X, ShoppingCart, Search, Phone } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (p: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (s: string) => void;
  categories: { id: string; name: string }[];
  cartCount: number;
  cartTotal: number;
  onCartOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  cartCount,
  cartTotal,
  onCartOpen
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useSiteSettings();
  const phone = settings.contact?.phone || '+91 78680 77818';

  const navLinks = [
    { key: 'home', label: 'Home', isPage: true },
    { key: 'about', label: 'About', isPage: true },
    { key: 'order', label: 'Order', isPage: true },
    { key: '#safety', label: 'Safety Tips', isPage: false },
    { key: '#contact', label: 'Contact Us', isPage: false },
  ];

  const handleNavClick = (link: { key: string; label: string; isPage: boolean }) => {
    setMenuOpen(false);
    if (link.isPage) {
      setCurrentPage(link.key);
    } else {
      if (currentPage !== 'home') {
        setCurrentPage('home');
      }
      setTimeout(() => {
        const el = document.querySelector(link.key);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-gray-800 shadow-md transition-all">
      {/* Slim Top Contact Bar */}
      <div className="bg-[#FFC107] text-[#0f172a] font-bold text-[11px] sm:text-xs py-1 px-4 sm:px-8 flex items-center justify-between font-inter">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5" />
          <span>{phone}</span>
        </div>
        <span className="hidden sm:inline text-[#0f172a]/80">Wholesale Sivakasi Crackers</span>
      </div>

      {/* Compact Main Navigation Header */}
      <div className="flex items-center justify-between py-2 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Left: Compact Logo & Brand Name */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => { setCurrentPage('home'); setMenuOpen(false); }}
        >
          <img 
            src={sarguruLogo} 
            alt="Sarguru Crackers Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-[#FFC107]/60 shadow-[0_0_10px_rgba(255,193,7,0.3)] group-hover:scale-105 transition-transform" 
          />
          <span className="font-poppins font-black text-white text-base sm:text-lg tracking-wide hidden xs:inline">
            Sarguru <span className="text-[#FFC107]">Crackers</span>
          </span>
        </div>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && (
          <div className="hidden md:flex items-center relative w-64 lg:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (currentPage !== 'home' && currentPage !== 'order') {
                  setCurrentPage('home');
                }
              }}
              className="w-full py-1.5 pl-9 pr-4 border border-[#374151] rounded-full text-xs bg-[#111827] text-white outline-none focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] font-inter"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        )}

        {/* Right Actions: Cart Icon + Menu Toggle Button */}
        <div className="flex items-center gap-3">
          
          {/* Cart Button: On Mobile, shows ONLY Cart Icon + Badge */}
          {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && (
            <button 
              type="button"
              onClick={onCartOpen}
              className="relative p-2.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0f172a] font-bold text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 text-[#0f172a]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0B0F19] shadow">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <span className="hidden sm:inline font-poppins font-semibold">
                {cartCount > 0 ? `₹${cartTotal.toLocaleString('en-IN')}` : 'Cart'}
              </span>
            </button>
          )}

          {/* Menu Button (Nav Links Toggle) */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#1f2937] hover:bg-[#374151] text-white border border-[#374151] flex items-center gap-1.5 text-xs font-semibold font-poppins transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
            <span className="hidden sm:inline">{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {/* Dropdown Menu Overlay (Shown when Menu Button is clicked, floats over content) */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-[#111827]/95 backdrop-blur-2xl border-t border-b border-[#374151] shadow-[0_20px_50px_rgba(0,0,0,0.85)] px-6 py-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input in Mobile Menu */}
            {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && (
              <div className="md:hidden relative w-full mb-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (currentPage !== 'home' && currentPage !== 'order') {
                      setCurrentPage('home');
                    }
                  }}
                  className="w-full py-2 pl-9 pr-4 border border-[#374151] rounded-xl text-xs bg-[#1f2937] text-white outline-none focus:border-[#FFC107] font-inter"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col md:flex-row gap-3 md:gap-8 font-poppins text-sm">
              {navLinks.map((link) => {
                const isActive = link.isPage && currentPage === link.key;
                return (
                  <button
                    key={link.key}
                    type="button"
                    onClick={() => handleNavClick(link)}
                    className={`text-left tracking-wider uppercase py-2 md:py-0 font-medium transition-colors border-b border-gray-800 md:border-none ${
                      isActive
                        ? 'text-[#FFC107] font-bold'
                        : 'text-gray-200 hover:text-[#FFC107]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Admin Link */}
            <div className="pt-2 md:pt-0 border-t border-gray-800 md:border-none">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setCurrentPage('admin-dashboard');
                }}
                className="text-xs text-amber-400/80 hover:text-amber-400 font-semibold tracking-wider uppercase py-1"
              >
                🔐 Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
