import React, { useState } from 'react';
import sarguruLogo from '../assets/sarguru.png';

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
  mktTotal?: number;
  onCartOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  cartCount,
  cartTotal,
  onCartOpen
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="relative z-50 bg-bg-light/80 backdrop-blur-xl border-b border-primary-blue/30 shadow-[var(--shadow-premium)] animate-fade-in">
      {/* Supreme Court Notice Marquee */}
      <div className="w-full bg-danger-red text-white overflow-hidden py-1.5 flex items-center shadow-md relative">
        <span className="font-bold text-xs px-4 shrink-0 uppercase tracking-wider border-r border-red-300 mr-3 pr-3">📢 NOTICE</span>
        <div className="overflow-hidden flex-1">
          <div className="whitespace-nowrap text-sm font-bold" style={{ display: 'inline-block', animation: 'marquee-scroll 35s linear infinite' }}>
            As per the 2018 Supreme Court order, online sale of firecrackers is not permitted. We only accept enquiries online and provide delivery through our authorized transport.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As per the 2018 Supreme Court order, online sale of firecrackers is not permitted. We only accept enquiries online and provide delivery through our authorized transport.
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-12 bg-transparent">
        {/* Mobile Menu Button (Dark) */}
        <button 
          className="md:hidden p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 focus:outline-none transition-all shadow-md active:scale-95"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center cursor-pointer relative group flex-1 md:flex-none" onClick={() => setCurrentPage('home')}>
          <div className="absolute inset-0 bg-primary-blue rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
          <img src={sarguruLogo} alt="Sarguru Crackers Logo" className="h-16 w-16 md:h-24 md:w-24 rounded-full object-cover relative z-10 border-2 border-primary-blue/50 shadow-[0_0_15px_rgba(245,184,0,0.3)] mx-auto md:mx-0" />
        </div>
        
        {/* Desktop Links */}
        <nav className="hidden md:flex flex-wrap justify-center gap-6 md:gap-10 mt-4 md:mt-0 font-poppins text-sm">
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
          <a href="#safety" onClick={() => setCurrentPage('safety')} className="tracking-widest uppercase text-text-primary hover:text-primary-blue font-medium transition-all duration-300">Safety Tips</a>
          <a href="#contact" onClick={() => setCurrentPage('contact')} className="tracking-widest uppercase text-text-primary hover:text-primary-blue font-medium transition-all duration-300">Contact Us</a>
        </nav>

        {/* Cart (Shown on storefront pages) */}
        {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && (
          <div className="flex items-center gap-2 md:gap-4 mt-0 md:mt-0">
            <div 
              onClick={onCartOpen}
              className="flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 md:py-3 cursor-pointer shadow-md bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 md:border-none md:bg-primary-blue md:text-white rounded-xl font-poppins text-xs md:text-sm relative font-bold transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#E6A100] text-slate-950 text-[10px] font-black flex items-center justify-center shadow">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <span className="hidden md:inline">
                {cartCount > 0 ? `₹${cartTotal.toLocaleString('en-IN')}` : 'Cart'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Links Dropdown (Dark Theme) */}
      {isMobileMenuOpen && (
        <nav className="md:hidden flex flex-col items-center gap-2 p-4 bg-slate-900 text-white border-t border-slate-800 font-poppins text-sm shadow-2xl animate-fade-in">
          {['home', 'about', 'order'].map((page) => (
            <button 
              key={page}
              type="button"
              onClick={() => {
                setCurrentPage(page);
                setIsMobileMenuOpen(false);
              }}
              className={`tracking-widest uppercase w-full text-center py-3 rounded-xl transition-all duration-300 font-bold ${
                currentPage === page 
                  ? 'text-[#FDF5CB] bg-[#15803D] shadow-md border border-[#B69F4C]/40' 
                  : 'text-slate-100 bg-slate-800/90 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              {page.replace('-', ' ')}
            </button>
          ))}
          <a 
            href="#safety" 
            onClick={() => { setCurrentPage('safety'); setIsMobileMenuOpen(false); }} 
            className="tracking-widest uppercase w-full text-center py-3 rounded-xl text-slate-100 bg-slate-800/90 hover:bg-slate-800 hover:text-white font-bold border border-slate-700/60 transition-all duration-300"
          >
            Safety Tips
          </a>
          <a 
            href="#contact" 
            onClick={() => { setCurrentPage('contact'); setIsMobileMenuOpen(false); }} 
            className="tracking-widest uppercase w-full text-center py-3 rounded-xl text-slate-100 bg-slate-800/90 hover:bg-slate-800 hover:text-white font-bold border border-slate-700/60 transition-all duration-300"
          >
            Contact Us
          </a>
        </nav>
      )}
    </header>
  );
};
