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
  mktTotal?: number;
  onCartOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
}) => {
  const { settings } = useSiteSettings();
  const phone = settings.contact?.phone || '80728 88549';

  const scrollToSection = (sectionId: string) => {
    if (currentPage !== 'home' && currentPage !== 'order') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full relative shadow-sm select-none font-sans">
      {/* 1. Supreme Court / Announcement Marquee Top Bar (#15803D Vibrant Light Green) */}
      <div className="w-full bg-[#15803D] text-[#FDF5CB] py-1.5 px-4 flex items-center justify-between text-xs border-b border-[#B69F4C]/40">
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-[marquee-scroll_35s_linear_infinite] text-[#FBECC0] font-semibold">
            🔥 தீபாவளியை இன்னும் சிறப்பா கொண்டாட தயாராகுங்கள்! SARGURU CRACKERS SHOP - SIVAKASI! 🎆 Direct Wholesale Rate Products 🎆 Online order enquiries accepted! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔥 தீபாவளியை இன்னும் சிறப்பா கொண்டாட தயாராகுங்கள்! SARGURU CRACKERS SHOP - SIVAKASI!
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Clean White Background & #15803D Light Green Brand Text) */}
      <div className="bg-white text-slate-900 border-b border-[#B69F4C]/30 px-4 md:px-8 py-2.5 flex items-center justify-between shadow-sm">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img 
            src={sarguruLogo} 
            alt="Sarguru Crackers Logo" 
            className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover border-2 border-[#15803D] shadow-md group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg md:text-xl text-[#15803D] tracking-tight uppercase leading-tight font-poppins">
              SARGURU CRACKERS
            </span>
            <span className="text-[11px] font-bold text-[#B69F4C] tracking-widest uppercase">
              Sivakasi Direct Wholesale
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-bold text-xs uppercase tracking-wider text-slate-700">
          <button 
            onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`hover:text-[#15803D] transition-colors py-1 ${currentPage === 'home' ? 'text-[#15803D] font-extrabold border-b-2 border-[#15803D]' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('chit-scheme')}
            className="hover:text-[#15803D] transition-colors py-1"
          >
            Chit Scheme
          </button>
          <button 
            onClick={() => scrollToSection('shop')}
            className={`hover:text-[#15803D] transition-colors py-1 ${currentPage === 'order' ? 'text-[#15803D] font-extrabold border-b-2 border-[#15803D]' : ''}`}
          >
            Products
          </button>
          <button 
            onClick={() => scrollToSection('about-section')}
            className="hover:text-[#15803D] transition-colors py-1"
          >
            About Us
          </button>
          <a 
            href="#safety" 
            className="hover:text-[#15803D] transition-colors py-1"
          >
            Safety Tips
          </a>
          <a 
            href="#contact" 
            className="hover:text-[#15803D] transition-colors py-1"
          >
            Contact Us
          </a>
        </nav>

        {/* Right WhatsApp & Call Header Action */}
        <div className="flex items-center gap-3">
          <a 
            href={`https://wa.me/91${phone.replace(/[^0-9]/g, '')}`}
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-[#15803D] text-white font-extrabold text-xs px-4 py-2 rounded-full hover:bg-[#166534] transition-all shadow-md active:scale-95"
          >
            <span>💬 WhatsApp Order:</span>
            <span className="font-extrabold">{phone}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

