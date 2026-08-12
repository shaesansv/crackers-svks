import React from 'react';
import sarguruLogo from '../assets/sarguru.png';
import { useSiteSettings } from '../context/SiteSettingsContext';

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
  selectedCategory,
  setSelectedCategory,
  categories,
  cartCount,
  cartTotal,
  onCartOpen
}) => {
  const { settings } = useSiteSettings();
  const phone = settings.contact?.phone || '+91 78680 77818';
  const address = settings.contact?.address || 'Sivakasi, Tamil Nadu';
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] animate-fade-in">
      {/* 1. Top Minimal Contact Bar */}
      <div className="bg-[#FFC107] text-[#0f172a] font-bold text-xs py-2 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between font-inter tracking-wide shadow-md">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 hover:text-[#0B0F19]/80 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            {phone}
          </span>
          <span className="hidden md:flex items-center gap-2 hover:text-[#0B0F19]/80 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {address}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-[#0f172a]/80">Premium Festival Collection</span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between py-4 px-6 md:px-12 bg-transparent">
        {/* Logo */}
        <div className="flex items-center justify-center cursor-pointer relative group" onClick={() => setCurrentPage('home')}>
          <div className="absolute inset-0 bg-[#FFC107] rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
          <img src={sarguruLogo} alt="Sarguru Crackers Logo" className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover relative z-10 border-2 border-[#FFC107]/50 shadow-[0_0_15px_rgba(255,193,7,0.3)]" />
        </div>
        
        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 mt-4 md:mt-0 font-poppins text-sm">
          {['home', 'about', 'order'].map((page) => (
            <button 
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`tracking-widest uppercase transition-all duration-300 ${
                currentPage === page 
                  ? 'text-primary-blue font-bold' 
                  : 'text-text-primary hover:text-primary-blue font-medium'
              }`}
            >
              {page.replace('-', ' ')}
            </button>
          ))}
          <a href="#safety" className="tracking-widest uppercase text-text-primary hover:text-primary-blue font-medium transition-all duration-300">Safety Tips</a>
          <a href="#contact" className="tracking-widest uppercase text-text-primary hover:text-primary-blue font-medium transition-all duration-300">Contact Us</a>
        </nav>

        {/* Search & Cart (Shown on storefront pages) */}
        {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && (
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search premium products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (currentPage !== 'home' && currentPage !== 'order') {
                    setCurrentPage('home');
                  }
                }}
                className="py-2 pl-4 pr-10 border border-[#374151] rounded-[12px] text-sm bg-[#111827] focus:bg-[#1f2937] text-white w-[220px] outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(255,193,7,0.2)] focus:border-[#FFC107] font-inter"
              />
              <svg className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 group-focus-within:text-primary-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            
            <div 
              onClick={onCartOpen}
              className="flex items-center justify-center gap-2 px-5 cursor-pointer shadow-[var(--shadow-premium)] btn-primary font-poppins text-sm relative"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-orange text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <span>
                {cartCount > 0 ? `₹${cartTotal.toLocaleString('en-IN')}` : 'Cart'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Category Filter Bar (Shown on storefront pages) */}
      {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && (
        <div className="bg-[#0B0F19]/80 border-t border-gray-800 flex flex-col md:flex-row items-center justify-center p-3 gap-4 font-inter text-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 w-full max-w-md mx-auto justify-center">
            <span className="text-gray-500 hidden md:inline">Filter by:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (currentPage !== 'home' && currentPage !== 'order') {
                  setCurrentPage('home');
                }
              }}
              className="py-2 px-4 border border-[#374151] rounded-[12px] bg-[#111827] text-white outline-none font-medium cursor-pointer hover:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] transition-colors w-full md:w-auto shadow-sm"
            >
              <option value="all">All Premium Collections</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name.replace(' (80% DISCOUNT)', '')}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
