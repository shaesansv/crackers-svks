import React from 'react';

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
  cartTotal
}) => {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* 1. Orange Top Header Bar */}
      <div className="bg-[#ff6f00] text-white text-xs py-2 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 border-b border-orange-700 font-medium">
        <div className="flex items-center gap-2">
          <span className="bg-white text-[#ff6f00] rounded-full w-5 h-5 flex items-center justify-center font-bold">📞</span>
          <span>Call Us Now: <strong>+91 78680 77818</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white text-[#ff6f00] rounded-full w-5 h-5 flex items-center justify-center font-bold">📍</span>
          <span>Location: <strong>3/1321 Paraipatti, Sivakasi</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white text-[#ff6f00] rounded-full w-5 h-5 flex items-center justify-center font-bold">📷</span>
          <span>Connect With Us: 
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white hover:underline font-bold ml-1">
              Instagram
            </a>
          </span>
        </div>
      </div>

      {/* 2. White Logo Bar (Centered circular logo) */}
      <div className="flex justify-center py-4 bg-white">
        <svg viewBox="0 0 100 100" width="85" height="85" className="block drop-shadow-sm">
          <circle cx="50" cy="50" r="46" fill="#ffd700" stroke="#d50000" strokeWidth="3" />
          <path id="curve-top" d="M 15,50 A 35,35 0 0,1 85,50" fill="none" />
          <path id="curve-bottom" d="M 85,50 A 35,35 0 0,1 15,50" fill="none" />
          
          <text className="select-none" fontSize="8.5" fontWeight="bold" fill="#0d47a1" textAnchor="middle">
            <textPath href="#curve-top" startOffset="50%">VENUS TRADERS</textPath>
          </text>
          
          <rect x="16" y="41" width="68" height="18" rx="2" fill="#d50000" />
          <text x="50" y="54" fontSize="11.5" fontWeight="900" fill="#ffffff" textAnchor="middle" letterSpacing="0.8">VENUS</text>
          
          <text className="select-none" fontSize="8.5" fontWeight="bold" fill="#0d47a1" textAnchor="middle">
            <textPath href="#curve-bottom" startOffset="50%">BRAND</textPath>
          </text>
        </svg>
      </div>

      {/* 3. Navigation Links Row */}
      <div className="flex flex-col md:flex-row items-center justify-between py-3 px-10 border-t border-b border-gray-100 md:border-gray-200 gap-2 md:gap-0 bg-white">
        <div className="font-bold text-xs md:text-sm text-gray-800 flex items-center gap-1 select-none">
          <span className="text-base text-gray-600">📞</span> +91 78680 77818
        </div>
        
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          <button 
            type="button"
            onClick={() => setCurrentPage('home')}
            className={`no-underline font-bold text-xs md:text-sm tracking-wide transition-colors duration-200 bg-transparent border-none cursor-pointer ${
              currentPage === 'home' ? 'text-orange-600' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            HOME
          </button>
          <button 
            type="button"
            onClick={() => setCurrentPage('about')}
            className={`no-underline font-bold text-xs md:text-sm tracking-wide transition-colors duration-200 bg-transparent border-none cursor-pointer ${
              currentPage === 'about' ? 'text-orange-600' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            ABOUT US
          </button>
          <button 
            type="button"
            onClick={() => setCurrentPage('home')}
            className="no-underline font-bold text-xs md:text-sm tracking-wide text-gray-500 hover:text-red-600 transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            ORDER NOW
          </button>
          <a href="#safety" className="no-underline font-bold text-xs md:text-sm tracking-wide text-gray-500 hover:text-red-600 transition-colors duration-200">SAFETY TIPS</a>
          <a href="#contact" className="no-underline font-bold text-xs md:text-sm tracking-wide text-gray-500 hover:text-red-600 transition-colors duration-200">CONTACT US</a>
        </nav>
        
        <div className="font-bold text-xs md:text-sm text-gray-800 flex items-center gap-1 select-none">
          <span className="text-base text-gray-600">📞</span> +91 78680 77818
        </div>
      </div>

      {/* 4. Gray Filter Bar (Only shown on the store home page/pricelist) */}
      {currentPage === 'home' && (
        <div className="bg-[#d8d8d8] flex flex-col md:flex-row items-center justify-between p-2 gap-2.5 md:gap-0 border-b border-gray-400">
          <div className="flex items-center justify-between w-full md:w-auto gap-2.5">
            {/* Category Dropdown */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-1.5 px-3 border border-gray-400 rounded text-xs bg-white text-gray-800 outline-none font-medium"
              >
                <option value="all">Category - Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.replace(' (80% DISCOUNT)', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Box */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-1.5 pl-3 pr-8 border border-gray-400 rounded text-xs bg-white w-[180px] outline-none"
              />
              <span className="absolute right-2.5 text-xs text-gray-500 cursor-pointer">🔍</span>
            </div>
          </div>

          {/* Center: Yellow Min Order Banner */}
          <div className="w-full md:w-auto flex justify-center">
            <div className="bg-yellow-300 px-4 py-1.5 rounded-full font-extrabold text-[11px] md:text-xs text-black flex items-center justify-center gap-2 border border-yellow-400 shadow-sm w-full md:w-auto">
              <span>MIN. ORDER VALUE FOR HOME DELIVERY RS. 3000</span>
              <span className="text-gray-500 font-light">|</span>
              <span className="text-red-600">DISCOUNT 80%</span>
            </div>
          </div>

          {/* Right: Cart Status */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 py-1.5 px-3 rounded cursor-pointer hover:bg-gray-200 transition-colors duration-200">
              <svg viewBox="0 0 24 24" width="22" height="22" className="text-gray-600" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span className="font-bold text-xs text-gray-800">
                {cartCount > 0 ? `${cartCount} Items - Rs. ${cartTotal}` : 'Cart is Empty'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
