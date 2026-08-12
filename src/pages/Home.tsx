import React from 'react';
import { ProductImage } from '../components/ProductImage';
import { ImageSlider } from '../components/ImageSlider';
import { Fireworks } from '@fireworks-js/react';
import type { Category, Product } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';
import sar1 from '../assets/sar-1.png';
import sar4 from '../assets/sar-4.jpg';

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
  categories: Category[];
}

export const Home: React.FC<HomeProps> = ({
  quantities,
  handleQtyChange,
  adjustQty,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  const { settings } = useSiteSettings();
  const marqueeText = settings.news || '';
  const heroTitle = settings.siteName ? `Welcome to ${settings.siteName}` : 'Celebrate with Premium Fireworks';
  const heroDesc = settings.siteDescription || "Sivakasi's finest crackers at wholesale prices. Light up your celebrations!";

  // Filter products and categories based on search and category state
  const filteredCategories = categories
    .map((category) => {
      const matchedProducts = category.products.filter((product: Product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || selectedCategory === category.id;
        
        return matchesSearch && matchesCategory;
      });

      return {
        ...category,
        products: matchedProducts
      };
    })
    .filter((category) => category.products.length > 0);

  const allProducts = filteredCategories.flatMap(c => c.products);
  const totalProducts = allProducts.length;

  return (
    <div className="flex-grow flex flex-col bg-bg-light font-sans">

      {/* Marquee News Banner — only shown when admin has set news text */}
      {marqueeText && (
        <div className="w-full bg-amber-500 text-white overflow-hidden py-2 px-0 flex items-center" style={{ minHeight: '36px' }}>
          <span className="font-bold text-xs px-4 shrink-0 uppercase tracking-wider border-r border-amber-300 mr-3 pr-3">📢 NEWS</span>
          <div className="overflow-hidden flex-1">
            <div
              className="whitespace-nowrap text-sm font-medium"
              style={{
                display: 'inline-block',
                animation: 'marquee-scroll 30s linear infinite',
              }}
            >
              {marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{marqueeText}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Image Slider & Fireworks */}
      <div className="w-full h-[280px] sm:h-[380px] md:h-[460px] relative overflow-hidden flex-shrink-0">
        <ImageSlider 
          images={[sar1, sar4]} 
          heightClass="h-full w-full rounded-none" 
        />
        <Fireworks
          options={{
            rocketsPoint: { min: 10, max: 90 },
            hue: { min: 40, max: 60 },
            delay: { min: 30, max: 60 },
            acceleration: 1.02,
            friction: 0.95,
            gravity: 1,
            particles: 90,
            traceLength: 3,
            traceSpeed: 2,
            explosion: 5,
            intensity: 20,
            flickering: 50,
            lineStyle: 'round',
            brightness: { min: 50, max: 80 },
            decay: { min: 0.015, max: 0.03 },
            mouse: { click: false, move: false, max: 1 }
          }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-[1px]">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4 tracking-wide shadow-black drop-shadow-md">
            {heroTitle}
          </h1>
          <p className="text-gray-200 mt-4 text-sm md:text-base max-w-lg text-center px-4 drop-shadow-md">
            {heroDesc}
          </p>
        </div>
      </div>

      <main className="flex-grow w-full max-w-[1200px] mx-auto bg-transparent mt-6 mb-10 relative z-40 rounded-lg">
        
        {/* 1. Top Filters & Search Box */}
        <div className="bg-[#111827] border border-[#374151] rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.3)] mb-6 flex flex-col sm:flex-row gap-3.5">
          {/* Category Dropdown */}
          <div className="relative w-full sm:w-1/3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3 pl-4 pr-10 border border-[#374151] rounded-[14px] text-sm bg-[#1f2937] text-white font-semibold outline-none transition-all duration-300 focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] cursor-pointer appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name.replace(' (80% DISCOUNT)', '')}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-2/3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-11 pr-4 border border-[#374151] rounded-[14px] text-sm bg-[#1f2937] focus:bg-[#374151] text-white outline-none transition-all duration-300 focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] font-inter"
            />
            <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        {/* Product List */}
        <div className="flex flex-col">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="mb-6">
                {/* Category Header */}
                <div className="bg-[#111827] px-6 py-4 border-b border-[#374151] flex items-center gap-3 rounded-t-[18px]">
                  <div className="w-8 h-8 rounded-full bg-[#FFC107]/10 flex items-center justify-center text-[#FFC107] font-bold">
                    ✨
                  </div>
                  <h2 className="text-[#FFC107] text-[18px] font-bold uppercase tracking-wide">
                    {category.name.replace(' (80% DISCOUNT)', '')}
                  </h2>
                </div>

                {/* Category Products */}
                <div className="flex flex-col bg-[#111827] rounded-b-[18px] shadow-[var(--shadow-premium)]">
                  {category.products.map((product: Product) => {
                    const qty = quantities[product.id] || '';
                    const isLow = product.id === 'sp3' || product.id === 'gc2';
                    const isOutOfStock = (product.stock ?? 1) <= 0;

                    return (
                      <div 
                        key={product.id} 
                        className={`flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr_1fr_2fr] items-center px-4 md:px-6 py-5 md:py-4 border-b border-[#374151] transition-all duration-300 gap-4 md:gap-0 ${
                          isOutOfStock
                            ? 'bg-[#0B0F19] opacity-75 cursor-not-allowed'
                            : 'bg-[#111827] hover:bg-[#1f2937] hover:shadow-[var(--shadow-premium-hover)]'
                        }`}
                      >
                        {/* Product Details */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="relative w-[60px] h-[60px] md:w-[60px] md:h-[60px] flex-shrink-0 flex items-center justify-center bg-[#1f2937] border border-[#374151] rounded-[18px] overflow-hidden shadow-sm">
                            {product.image || product.imageUrl ? (
                              <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ProductImage type={product.imageType} />
                            )}
                            {isOutOfStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-[18px]">
                                <span className="text-white text-[8px] font-bold text-center leading-tight px-1">OUT OF{"\n"}STOCK</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col flex-grow">
                            <span className={`text-[15px] font-bold mb-0.5 ${isOutOfStock ? 'text-gray-400' : 'text-text-primary'}`}>{product.name}</span>
                            {isOutOfStock ? (
                              <span className="text-[11px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full inline-block w-max">
                                🚫 Out of Stock
                              </span>
                            ) : product.displayNetRate ? (
                              <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full inline-block w-max">
                                Net Rate
                              </span>
                            ) : product.hasDiscount && product.globalDiscountPct && product.globalDiscountPct > 0 ? (
                              <span className="text-[11px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full inline-block w-max">
                                🔥 {product.globalDiscountPct}% OFF
                              </span>
                            ) : (
                              <span className="text-[13px] text-text-secondary">Premium Standard</span>
                            )}
                          </div>
                        </div>

                        {/* Mobile Details Row */}
                        <div className="flex items-center justify-between w-full md:hidden text-sm text-text-secondary bg-bg-light p-2.5 rounded-[12px]">
                          <div className="font-medium">Unit: <span className="font-normal">{product.unit}</span></div>
                          <div className={`font-bold ${
                            isOutOfStock ? 'text-red-500' : isLow ? 'text-accent-orange' : 'text-success-green'
                          }`}>
                            {isOutOfStock ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                          </div>
                          {/* Mobile Price */}
                          <div className="flex flex-col items-end">
                            {product.displayNetRate ? (
                              <span className="text-[14px] font-bold text-amber-600">₹{product.discountPrice.toFixed(2)}</span>
                            ) : product.hasDiscount && product.globalDiscountPct && product.globalDiscountPct > 0 && product.price > product.discountPrice ? (
                              <>
                                <span className="text-[11px] line-through text-gray-400 font-medium">₹{product.price.toFixed(2)}</span>
                                <span className="text-[14px] font-bold text-green-600">₹{product.discountPrice.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="font-bold text-secondary-gold">₹{product.discountPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>

                        {/* Desktop Unit / Size */}
                        <div className="hidden md:block text-[14px] text-text-secondary text-center">
                          {product.unit}
                        </div>

                        {/* Desktop Stock Status */}
                        <div className={`hidden md:block text-[14px] font-bold text-center ${
                          isOutOfStock ? 'text-red-500' : isLow ? 'text-accent-orange' : 'text-success-green'
                        }`}>
                          {isOutOfStock ? 'No' : isLow ? 'Low' : 'Yes'}
                        </div>

                        {/* Desktop Price */}
                        <div className="hidden md:flex flex-col items-center justify-center text-center">
                          {product.displayNetRate ? (
                            <span className="text-[15px] font-bold text-amber-600">₹{product.discountPrice.toFixed(2)}</span>
                          ) : product.hasDiscount && product.globalDiscountPct && product.globalDiscountPct > 0 && product.price > product.discountPrice ? (
                            <>
                              <span className="text-[12px] line-through text-gray-400 font-medium leading-tight">₹{product.price.toFixed(2)}</span>
                              <span className="text-[15px] font-bold text-green-600 leading-tight">₹{product.discountPrice.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-[15px] font-bold text-secondary-gold">₹{product.discountPrice.toFixed(2)}</span>
                          )}
                        </div>

                        {/* Actions Row (Touch-Friendly Quantity & Stepper Controls) */}
                        <div className="flex items-center justify-center w-full md:w-auto mt-1 md:mt-0">
                          {isOutOfStock ? (
                            <div className="w-full md:w-[120px] h-[38px] flex items-center justify-center text-[12px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl cursor-not-allowed select-none">
                              🚫 Out of Stock
                            </div>
                          ) : qty && Number(qty) > 0 ? (
                            /* Stepper Control when item is added */
                            <div className="flex items-center justify-between w-full md:w-[130px] bg-[#1f2937] border border-[#FFC107]/60 rounded-xl overflow-hidden shadow-sm">
                              <button
                                type="button"
                                onClick={() => adjustQty(product.id, false)}
                                className="w-10 h-10 flex items-center justify-center text-[#FFC107] font-extrabold hover:bg-[#374151] active:bg-[#4b5563] active:scale-95 transition-all text-lg cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={qty}
                                onChange={(e) => handleQtyChange(product.id, e.target.value)}
                                className="w-12 h-10 bg-transparent text-center font-extrabold text-white text-sm outline-none border-none p-0"
                              />
                              <button
                                type="button"
                                onClick={() => adjustQty(product.id, true)}
                                className="w-10 h-10 flex items-center justify-center text-[#FFC107] font-extrabold hover:bg-[#374151] active:bg-[#4b5563] active:scale-95 transition-all text-lg cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            /* Initial ADD Button */
                            <button
                              type="button"
                              onClick={() => adjustQty(product.id, true)}
                              className="w-full md:w-[120px] h-[38px] bg-[#FFC107] hover:bg-[#ffcd38] text-[#0f172a] font-poppins font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                            >
                              <span>+</span> ADD
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg font-medium">No products found.</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {filteredCategories.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
            <div className="text-[14px] text-gray-500 font-medium">
              Showing 1 - {totalProducts} of {totalProducts} products
            </div>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-[14px] text-gray-500 border border-transparent hover:bg-gray-100 rounded">Prev</button>
              <button className="w-8 h-8 flex items-center justify-center text-[14px] text-white bg-primary-blue rounded font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center text-[14px] text-gray-600 hover:bg-gray-100 rounded border border-gray-200">2</button>
              <button className="w-8 h-8 flex items-center justify-center text-[14px] text-gray-600 hover:bg-gray-100 rounded border border-gray-200">3</button>
              <button className="px-3 py-1.5 text-[14px] text-gray-700 font-medium border border-transparent hover:bg-gray-100 rounded">Next</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

