import React, { useState } from 'react';
import { crackerCategories } from '../data/products';
import { ProductImage } from '../components/ProductImage';
import sarguruCrackerBanner from '../assets/sarguru-cracker.png';

interface HomeProps {
  quantities: Record<string, number>;
  handleQtyChange: (productId: string, value: string) => void;
  adjustQty: (productId: string, increment: boolean) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (s: string) => void;
  cartCount: number;
  cartTotal: number;
}

export const Home: React.FC<HomeProps> = ({
  quantities,
  handleQtyChange,
  adjustQty,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  cartTotal
}) => {
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Helper to generate deterministic product codes
  const getProductCode = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const codeNum = 1100 + Math.abs(hash % 900);
    return `#NPK${codeNum}`;
  };

  // Helper to parse product name and extract count badge text
  const parseProductName = (fullName: string) => {
    const match = fullName.match(/\(([^)]+)\)/);
    const countBadgeText = match ? match[1].trim().replace(/\s+/g, '') : '10Pcs';
    
    // Clean display name by removing the parenthetical part
    const displayName = fullName.replace(/\s*\([^)]+\)/g, '').trim().toUpperCase();
    
    return { displayName, countBadgeText };
  };

  // Helper to format category names for headers (e.g. SPARKLERS, FAMILY PACK'S)
  const parseCategoryName = (fullName: string) => {
    const cleanName = fullName.replace(/\s*\([^)]+\)/g, '').trim().toUpperCase();
    if (cleanName === 'KIDS SPECIAL') return "KIDS SPECIAL'S";
    if (cleanName === 'FLOWER POTS') return "FLOWER POT'S";
    if (cleanName === 'GROUND CHAKKARS') return "GROUND CHAKKAR'S";
    if (cleanName === 'BOMBS & SOUND CRACKERS') return "BOMBS & SOUNDS";
    if (cleanName === 'SOUND GARLANDS') return "SOUND GARLAND'S";
    return cleanName;
  };

  // Filter products and categories based on search, category, and brand state
  const filteredCategories = crackerCategories
    .map((category) => {
      const matchedProducts = category.products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || selectedCategory === category.id;
        
        let matchesBrand = true;
        if (selectedBrand === 'laxmi') {
          matchesBrand = product.name.toLowerCase().includes('laxmi');
        } else if (selectedBrand === 'standard') {
          matchesBrand = !product.name.toLowerCase().includes('laxmi');
        }
        
        return matchesSearch && matchesCategory && matchesBrand;
      });

      return {
        ...category,
        products: matchedProducts
      };
    })
    .filter((category) => category.products.length > 0);

  const handleCheckoutClick = () => {
    document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-grow flex flex-col bg-gray-50/50">
      {/* Banner Image below navbar */}
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 mt-6">
        <div className="w-full rounded-[20px] overflow-hidden shadow-sm border border-gray-100 bg-white">
          <img 
            src={sarguruCrackerBanner} 
            alt="Sarguru Crackers Festive Banner" 
            className="w-full h-auto block transition-transform duration-700 hover:scale-101"
          />
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-grow px-4 md:px-8 mt-6 md:mt-8 mb-16 max-w-4xl mx-auto w-full">
        
        {/* 1. Top Filters & Search Box */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-6 flex flex-col gap-3.5">
          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Brand Dropdown */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-3 pl-4 pr-10 border border-gray-200 rounded-[14px] text-sm bg-white text-dark-navy font-semibold outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-100 cursor-pointer appearance-none"
              >
                <option value="all">All Brands</option>
                <option value="laxmi">Laxmi Brand</option>
                <option value="standard">Standard Quality</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 pl-4 pr-10 border border-gray-200 rounded-[14px] text-sm bg-white text-dark-navy font-semibold outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-100 cursor-pointer appearance-none"
              >
                <option value="all">All Categories</option>
                {crackerCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.replace(' (80% DISCOUNT)', '')}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Search Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-11 pr-4 border border-gray-200 rounded-[14px] text-sm bg-gray-50/50 focus:bg-white text-dark-navy outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-100 font-inter"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </div>

        {/* 2. Cart Total Purple Banner */}
        <div className="bg-[#7C3AED] rounded-[20px] p-5 shadow-[0_12px_30px_-5px_rgba(124,92,237,0.3)] mb-8 flex items-center justify-between text-white relative overflow-hidden">
          {/* Subtle graphic styling */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

          {/* Left section: labels and amount */}
          <div className="flex flex-col">
            <span className="text-xs text-violet-200/90 font-semibold tracking-wider uppercase font-inter">Cart Total</span>
            <span className="text-2xl md:text-3xl font-extrabold font-poppins mt-0.5">₹{cartTotal.toLocaleString()}</span>
          </div>

          {/* Right section: buttons */}
          <div className="flex items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={handleCheckoutClick}
              className="bg-white/20 hover:bg-white/30 border border-white/20 text-white font-bold text-sm rounded-[12px] px-4.5 py-2.5 flex items-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm font-poppins"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Checkout</span>
            </button>

            {/* Shopping bag icon */}
            <div 
              onClick={handleCheckoutClick}
              className="relative p-2.5 bg-white/10 hover:bg-white/20 rounded-[12px] border border-white/15 cursor-pointer transition-all duration-300 active:scale-95"
            >
              <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#EF4444] text-white font-extrabold text-[10px] w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-[#7C3AED] shadow-sm animate-scale-in">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Product Categories List */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <section key={category.id} className="mb-10 animate-fade-in">
              {/* Category Header Banner */}
              <div className="bg-[#7C3AED] text-white font-poppins font-bold text-sm md:text-base py-3 px-5 rounded-[12px] flex items-center gap-2 mb-4 shadow-sm tracking-wide">
                <span className="text-lg leading-none">•</span>
                <span>{parseCategoryName(category.name)}</span>
              </div>

              {/* Product Rows List */}
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-gray-100">
                {category.products.map((product) => {
                  const qty = quantities[product.id] || 0;
                  const rowTotal = qty * product.discountPrice;
                  const { displayName, countBadgeText } = parseProductName(product.name);

                  return (
                    <div 
                      key={product.id} 
                      className="hover:bg-violet-50/10 p-3.5 md:p-4 flex items-center justify-between gap-3 md:gap-4 transition-all duration-200"
                    >
                      {/* Left: Small Product Image Container */}
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-[12px] bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        <ProductImage type={product.imageType} />
                      </div>

                      {/* Middle-Left: Product Info Details */}
                      <div className="flex flex-col flex-grow min-w-0">
                        <h3 className="font-poppins font-bold text-dark-navy text-sm md:text-base leading-tight truncate">
                          {displayName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-400 font-semibold font-inter">
                            {getProductCode(product.id)}
                          </span>
                          <span className="bg-violet-50 text-[#7C3AED] text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-[6px] border border-violet-100/50">
                            {countBadgeText}
                          </span>
                        </div>
                      </div>

                      {/* Middle-Center: Price tags */}
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0 text-right min-w-[70px] md:min-w-[90px]">
                        <span className="text-[#EA580C] font-extrabold text-base md:text-lg font-poppins">
                          ₹{product.discountPrice.toLocaleString()}
                        </span>
                        <span className="text-gray-300 line-through text-xs font-semibold font-inter">
                          ₹{product.actualPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Middle-Right: Rounded Qty Controls */}
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[10px] p-0.5 flex-shrink-0 shadow-sm w-22 h-9 justify-between">
                        <button
                          type="button"
                          className="w-7.5 h-full flex items-center justify-center text-gray-400 hover:text-[#EF4444] font-bold text-lg select-none cursor-pointer transition-colors"
                          onClick={() => adjustQty(product.id, false)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={qty > 0 ? qty : ''}
                          onChange={(e) => handleQtyChange(product.id, e.target.value)}
                          placeholder=""
                          className="w-7 text-center font-inter font-bold text-sm text-dark-navy bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          className="w-7.5 h-full flex items-center justify-center text-[#7C3AED] hover:text-[#EF4444] font-bold text-lg select-none cursor-pointer transition-colors"
                          onClick={() => adjustQty(product.id, true)}
                        >
                          +
                        </button>
                      </div>

                      {/* Far-Right: Calculated Item Total */}
                      <div className="font-poppins font-extrabold text-sm md:text-base text-[#7C3AED] text-right min-w-[60px] md:min-w-[75px] flex-shrink-0">
                        ₹{rowTotal.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 font-inter">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <p className="text-lg font-medium">No premium products found.</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};
