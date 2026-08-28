import React, { useState, useEffect } from 'react';
import { ProductImage, getHighResImageUrl } from '../components/ProductImage';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Fireworks } from '@fireworks-js/react';
import type { Category, Product } from '../types';
import { toast } from 'sonner';
import { sortCategories } from '../utils/categoryUtils';
import sarguruBanner from '../assets/sarguru-banner.png';


const TESTIMONIALS = [
  { name: 'Rajesh K.', location: 'Chennai', review: 'Absolutely stunning quality! The colors of the fancy items were incredibly vibrant. Delivered safely to Chennai.', rating: 5 },
  { name: 'Priya M.', location: 'Coimbatore', review: 'Best wholesale prices I could find online. The packaging was thick and secure. Will definitely buy again next Diwali.', rating: 5 },
  { name: 'Arun S.', location: 'Bengaluru', review: 'The sparklers and flower pots were of premium quality. Less smoke and very bright. Highly recommend Sarguru Crackers.', rating: 5 },
  { name: 'Kavitha R.', location: 'Madurai', review: 'Ordered gift boxes for my factory workers. Everyone loved the quality and variety. Prompt delivery from Sivakasi!', rating: 5 },
  { name: 'Suresh Kumar', location: 'Kochi', review: 'Extremely satisfied with the customer service and fast shipping. All items burst perfectly with rich colors.', rating: 5 },
  { name: 'Divya P.', location: 'Hyderabad', review: 'Super fast delivery and 100% genuine Sivakasi crackers. Very safe for kids and great value for money.', rating: 5 }
];

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-section-bg border-t border-border-gray overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary uppercase mb-2">What Our Customers Say</h2>
          <div className="w-16 sm:w-24 h-1 bg-primary-blue mx-auto rounded-full"></div>
        </div>

        <div 
          className="relative max-w-3xl mx-auto overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated Slide Track */}
          <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {TESTIMONIALS.map((item, idx) => (
              <div key={idx} className="w-full flex-shrink-0 px-2 sm:px-4">
                <div className="bg-white border border-border-gray p-6 sm:p-8 rounded-2xl relative shadow-sm text-center flex flex-col items-center group hover:border-primary-blue transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-blue text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-serif mb-3 shadow-md">
                    "
                  </div>
                  <div className="flex gap-1 text-accent-orange text-sm mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-text-secondary text-xs sm:text-base mb-4 leading-relaxed italic max-w-lg">
                    "{item.review}"
                  </p>
                  <div className="font-extrabold text-text-primary tracking-wide uppercase text-xs sm:text-sm">
                    {item.name} <span className="text-primary-blue font-semibold text-[11px] sm:text-xs">({item.location})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nav Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-border-gray text-text-primary hover:bg-primary-blue hover:text-white transition-all flex items-center justify-center shadow-md z-20 hover:scale-110 active:scale-95"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-border-gray text-text-primary hover:bg-primary-blue hover:text-white transition-all flex items-center justify-center shadow-md z-20 hover:scale-110 active:scale-95"
          >
            ›
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentIndex === idx ? 'w-8 bg-primary-blue' : 'w-2 bg-border-gray hover:bg-primary-blue/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

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
  mktTotal?: number;
  categories: Category[];
  onCartOpen?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  quantities,
  handleQtyChange,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const sortedCategories = sortCategories(categories);

  // Filter products by search term (keep all categories visible when category is selected)
  const filteredCategories = sortedCategories
    .map((category) => {
      const matchedProducts = category.products.filter((product: Product) => {
        const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase()) || category.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });

      return {
        ...category,
        products: matchedProducts
      };
    })
    .filter((category) => category.products.length > 0);

  return (
    <div className="flex-grow flex flex-col bg-bg-light font-sans text-text-primary">

      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-bg-light">
        {/* Neat & Clean Sky Shot Fireworks Layer (Front of Screen) */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <Fireworks
            options={{
              rocketsPoint: { min: 15, max: 85 },
              hue: { min: 0, max: 360 },
              delay: { min: 30, max: 60 },
              acceleration: 1.05,
              friction: 0.96,
              gravity: 1.1,
              particles: 90,
              traceLength: 4,
              traceSpeed: 5,
              explosion: 6,
              intensity: 8,
              flickering: 30,
              lineStyle: 'round',
              brightness: { min: 80, max: 100 },
              decay: { min: 0.012, max: 0.025 },
              mouse: { click: false, move: false, max: 1 }
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div className="relative z-20 w-full flex flex-col items-center">
          {/* Full Size Sarguru Banner Image */}
          <div className="relative w-full overflow-hidden shadow-2xl">
            <img 
              src={sarguruBanner} 
              alt="Sarguru Crackers Banner" 
              className="w-full h-auto object-cover block min-w-full" 
            />
          </div>

          {/* Quick CTA Action buttons below banner */}
          <div className="py-4 sm:py-8 px-4 flex flex-wrap justify-center gap-2 sm:gap-4">
            <button 
              onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} 
              className="bg-primary-blue text-white px-5 py-2.5 sm:px-10 sm:py-4 rounded-full font-extrabold text-xs sm:text-lg shadow-md hover:bg-primary-hover transition-colors uppercase tracking-wider cursor-pointer"
            >
              SHOP NOW
            </button>
            <button 
              onClick={() => document.getElementById('categories')?.scrollIntoView({behavior: 'smooth'})} 
              className="bg-white border-2 border-primary-blue text-text-primary px-5 py-2.5 sm:px-10 sm:py-4 rounded-full font-bold text-xs sm:text-lg hover:bg-primary-blue hover:text-white transition-colors uppercase tracking-wider shadow-sm cursor-pointer"
            >
              EXPLORE COLLECTION
            </button>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section id="categories" className="w-full py-8 sm:py-16 bg-section-bg border-y border-border-gray">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary uppercase mb-2 sm:mb-4">Shop By Category</h2>
            <div className="w-16 sm:w-24 h-1 bg-primary-blue mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {sortedCategories.slice(0, 8).map(cat => {
              const catImage = cat.image || cat.imageUrl || cat.products?.[0]?.image || cat.products?.[0]?.imageUrl;
              const imageType = cat.imageType || cat.products?.[0]?.imageType;

              return (
                <div 
                  key={'cat-' + cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const el = document.getElementById(`category-${cat.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-white border border-border-gray rounded-lg sm:rounded-2xl p-2 sm:p-4 cursor-pointer group hover:border-primary-blue transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col items-center"
                >
                  <div className="w-full aspect-video bg-section-bg rounded-md sm:rounded-xl mb-1.5 sm:mb-4 overflow-hidden relative border border-border-gray/30 flex items-center justify-center">
                    <ProductImage 
                      src={catImage} 
                      type={imageType} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-center text-[11px] sm:text-base text-text-primary group-hover:text-primary-blue transition-colors relative z-20 leading-tight">
                    {cat.name.replace(' (80% DISCOUNT)', '')}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. MAIN PRODUCT LISTING */}
      <section id="shop" className="w-full py-8 sm:py-16 bg-bg-light relative">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-40">
          
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-text-primary uppercase mb-2 sm:mb-4">Discover Our Collection</h2>
            <p className="text-xs sm:text-base text-text-secondary max-w-2xl mx-auto">Explore our wide range of premium fireworks carefully crafted for your celebrations.</p>
          </div>

          {/* Top Filters & Search Box (Compact on Mobile view) */}
          <div className="sticky top-0 z-40 bg-section-bg/95 backdrop-blur-md border border-border-gray rounded-xl sm:rounded-[20px] p-2 sm:p-5 shadow-md mb-4 sm:mb-10 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div className="relative group">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => {
                    const catId = e.target.value;
                    setSelectedCategory(catId);
                    if (catId && catId !== 'all') {
                      const el = document.getElementById(`category-${catId}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }} 
                  className="w-full py-2 sm:py-3.5 pl-3 sm:pl-4 pr-8 sm:pr-10 border border-border-gray rounded-lg sm:rounded-[14px] text-xs sm:text-sm bg-white text-text-primary font-semibold outline-none transition-all duration-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue cursor-pointer appearance-none"
                >
                  <option value="all">All Categories</option>
                  {sortedCategories.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>{cat.name.replace(' (80% DISCOUNT)', '')}</option>
                  ))}
                </select>
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-primary-blue text-xs sm:text-sm">▼</div>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full py-2 sm:py-3.5 pl-9 sm:pl-12 pr-3 sm:pr-4 border border-border-gray rounded-lg sm:rounded-[14px] text-xs sm:text-sm bg-white focus:bg-white text-text-primary outline-none transition-all duration-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue font-inter" 
                />
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-blue">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="flex flex-col">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} id={`category-${category.id}`} className="mb-6 md:mb-10 scroll-mt-36">
                  <div className="sticky top-[104px] md:top-[88px] z-30 bg-[#9E0B0F] md:bg-section-bg text-white md:text-text-primary px-3 py-1.5 md:px-4 md:py-3 rounded-lg md:rounded-t-[20px] shadow-md relative overflow-hidden flex items-center mb-1.5 md:mb-0 border-b border-red-800/40 md:border-transparent">
                    <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-primary-blue"></div>
                    <span className="md:hidden text-white font-bold text-xs mr-1.5 leading-none">•</span>
                    <h2 className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-white md:text-white md:bg-primary-blue md:px-3.5 md:py-1.5 md:rounded-lg md:shadow-sm">
                      {category.name.replace(' (80% DISCOUNT)', '')}
                    </h2>
                  </div>

                  <div className="flex flex-col bg-white md:bg-section-bg rounded-xl md:rounded-b-[20px] shadow-sm md:shadow-[var(--shadow-premium)] border border-border-gray overflow-hidden">
                    {category.products.map((product: Product) => {
                      const qty = quantities[product.id] || '';
                      const isLow = product.id === 'sp3' || product.id === 'gc2';
                      const isOutOfStock = (product.stock ?? 1) <= 0;
                      const lineTotal = product.discountPrice * (Number(qty) || 0);

                      return (
                        <React.Fragment key={product.id}>
                          {/* Mobile View Row */}
                          <div className={`flex md:hidden items-center justify-between py-3 px-2 sm:px-3 border-b border-gray-100 gap-2 w-full bg-white transition-colors ${isOutOfStock ? 'opacity-60' : ''}`}>
                            <div 
                              onClick={() => setSelectedProductForModal(product)}
                              className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer group active:opacity-80"
                            >
                              {/* 1. Thumbnail Image */}
                              <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs group-hover:border-primary-blue transition-colors">
                                {product.image || product.imageUrl ? (
                                  <img 
                                    src={getHighResImageUrl(product.image || product.imageUrl, 300, 90)} 
                                    alt={product.name} 
                                    loading="lazy"
                                    decoding="async"
                                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                                    className="w-full h-full object-contain p-0.5" 
                                  />
                                ) : (
                                  <ProductImage type={product.imageType} />
                                )}
                              </div>

                              {/* 2. Title + Code + Unit Pill */}
                              <div className="flex flex-col flex-1 min-w-0 pr-1">
                                <span className="font-extrabold text-[12px] text-text-primary uppercase tracking-tight truncate leading-tight group-hover:text-primary-blue transition-colors">
                                  {product.name}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="inline-block bg-red-50 text-danger-red border border-red-200/80 text-[9px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap">
                                    {product.unit || '1 Item'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 3. Price & Strikethrough Price */}
                            <div 
                              onClick={() => setSelectedProductForModal(product)}
                              className="flex flex-col items-end shrink-0 text-right min-w-[48px] cursor-pointer"
                            >
                              <span className="text-[13px] font-extrabold text-accent-orange leading-tight">
                                ₹{product.discountPrice.toFixed(0)}
                              </span>
                              {product.price > product.discountPrice && !product.displayNetRate && (
                                <span className="text-[10px] line-through text-slate-400 font-medium leading-tight">
                                  ₹{product.price.toFixed(0)}
                                </span>
                              )}
                            </div>

                            {/* 4. Qty Pill (- 0 +) or Sold Out */}
                            <div className="shrink-0">
                              {isOutOfStock ? (
                                <span className="bg-red-50 text-danger-red border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                                  Sold Out
                                </span>
                              ) : (
                                <div className="flex items-center border border-red-200 rounded-full bg-white px-1 py-0.5 shadow-2xs text-xs font-bold">
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const current = Number(qty || 0);
                                      if (current > 0) handleQtyChange(product.id, String(current - 1));
                                    }}
                                    disabled={!qty || Number(qty) <= 0}
                                    className={`w-5 h-5 flex items-center justify-center font-bold text-sm leading-none transition-colors ${!qty || Number(qty) <= 0 ? 'text-gray-300' : 'text-danger-red active:scale-110'}`}
                                  >
                                    -
                                  </button>
                                  <span className="w-5 text-center text-xs font-extrabold text-text-primary leading-none">
                                    {qty || '0'}
                                  </span>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const current = Number(qty || 0);
                                      handleQtyChange(product.id, String(current + 1));
                                      if (current === 0) {
                                        toast.success(`${product.name} added to cart`, { duration: 2000 });
                                      }
                                    }}
                                    className="w-5 h-5 flex items-center justify-center font-bold text-sm leading-none text-danger-red active:scale-110"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* 5. Line Total */}
                            <div className="text-[13px] font-extrabold text-text-primary text-right shrink-0 min-w-[32px]">
                              ₹{lineTotal.toFixed(0)}
                            </div>
                          </div>

                          {/* Desktop View Row */}
                          <div className={`hidden md:grid md:grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 md:px-6 py-5 border-b border-border-gray transition-all duration-300 gap-4 md:gap-0 ${isOutOfStock ? 'bg-bg-light opacity-60 cursor-not-allowed' : 'hover:bg-slate-50 hover:shadow-sm'}`}>
                            {/* Details */}
                            <div 
                              onClick={() => setSelectedProductForModal(product)}
                              className="flex items-center gap-5 w-full md:w-auto cursor-pointer group"
                            >
                              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center bg-bg-light border border-border-gray rounded-2xl overflow-hidden shadow-sm group-hover:border-primary-blue transition-colors p-1">
                                {product.image || product.imageUrl ? (
                                  <img 
                                    src={getHighResImageUrl(product.image || product.imageUrl, 400, 90)} 
                                    alt={product.name} 
                                    loading="lazy"
                                    decoding="async"
                                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                                  />
                                ) : (
                                  <ProductImage type={product.imageType} />
                                )}
                                {isOutOfStock && (
                                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[1px]">
                                    <span className="text-white text-[9px] font-extrabold text-center leading-tight px-1 uppercase tracking-wider">Sold Out</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-[16px] font-bold mb-1 group-hover:text-primary-blue transition-colors ${isOutOfStock ? 'text-gray-500' : 'text-text-primary'}`}>{product.name}</span>
                                {isOutOfStock ? (
                                  <span className="text-[11px] font-bold bg-danger-red/10 text-danger-red px-2 py-0.5 rounded-md w-max border border-danger-red/20">🚫 Out of Stock</span>
                                ) : product.displayNetRate ? (
                                  <span className="text-[11px] font-bold bg-primary-blue/10 text-primary-blue px-2 py-0.5 rounded-md w-max border border-primary-blue/20">Premium Quality</span>
                                ) : product.hasDiscount && product.globalDiscountPct && product.globalDiscountPct > 0 ? (
                                  <span className="text-[11px] font-bold bg-danger-red text-white px-2 py-0.5 rounded-md w-max shadow-sm">🔥 {product.globalDiscountPct}% OFF</span>
                                ) : (
                                  <span className="text-[12px] text-text-secondary">Standard</span>
                                )}
                              </div>
                            </div>

                            {/* Desktop Columns */}
                            <div className="hidden md:block text-[14px] text-text-secondary font-medium text-center">{product.unit}</div>
                            <div className={`hidden md:block text-[14px] font-bold text-center ${isOutOfStock ? 'text-danger-red' : isLow ? 'text-accent-orange' : 'text-success-green'}`}>
                              {isOutOfStock ? 'Sold Out' : isLow ? 'Low' : 'Available'}
                            </div>
                            <div className="hidden md:flex flex-col items-center justify-center text-center">
                              {product.displayNetRate ? (
                                <span className="text-[16px] font-extrabold text-primary-blue">₹{product.discountPrice.toFixed(2)}</span>
                              ) : product.hasDiscount && product.price > product.discountPrice ? (
                                <>
                                  <span className="text-[13px] line-through text-gray-500 font-medium leading-tight">₹{product.price.toFixed(2)}</span>
                                  <span className="text-[16px] font-extrabold text-success-green leading-tight">₹{product.discountPrice.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="text-[16px] font-extrabold text-primary-blue">₹{product.discountPrice.toFixed(2)}</span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between w-full md:contents mt-2 md:mt-0">
                              <div className="flex justify-center items-center w-1/2 md:w-auto pr-3 md:pr-0 border-r md:border-r-0 border-border-gray">
                                <span className="text-xs font-bold text-gray-500 mr-2 md:hidden">QTY:</span>
                                <div className={`flex items-center border rounded-xl overflow-hidden h-10 md:h-11 ${isOutOfStock ? 'bg-bg-light border-border-gray' : 'bg-slate-50 border-border-gray focus-within:border-primary-blue focus-within:ring-1 focus-within:ring-primary-blue'}`}>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const current = Number(qty || 0);
                                      if (current > 0) handleQtyChange(product.id, String(current - 1));
                                    }}
                                    disabled={isOutOfStock || !qty || Number(qty) <= 0}
                                    className={`w-8 md:w-10 h-full flex items-center justify-center text-lg font-bold transition-colors ${isOutOfStock || !qty || Number(qty) <= 0 ? 'text-gray-400 cursor-not-allowed bg-slate-100' : 'text-text-primary hover:bg-primary-blue/20 hover:text-primary-blue active:bg-primary-blue/30'}`}
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text" inputMode="numeric" pattern="[0-9]*"
                                    value={qty || ''} disabled={isOutOfStock}
                                    placeholder="1"
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/[^0-9]/g, '');
                                      handleQtyChange(product.id, val);
                                    }}
                                    className={`w-10 md:w-12 h-full text-center text-[15px] font-bold outline-none transition-colors p-0 ${isOutOfStock ? 'bg-transparent text-gray-400 cursor-not-allowed' : 'bg-transparent text-text-primary'}`}
                                  />
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const current = Number(qty || 0);
                                      handleQtyChange(product.id, String(current + 1));
                                      if (current === 0) {
                                        toast.success(`${product.name} added to cart`, { duration: 2000 });
                                      }
                                    }}
                                    disabled={isOutOfStock}
                                    className={`w-8 md:w-10 h-full flex items-center justify-center text-lg font-bold transition-colors ${isOutOfStock ? 'text-gray-400 cursor-not-allowed bg-slate-100' : 'text-text-primary hover:bg-primary-blue/20 hover:text-primary-blue active:bg-primary-blue/30'}`}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-center items-center w-1/2 md:w-auto pl-3 md:pl-0">
                                <button
                                  onClick={() => { 
                                    if (!qty) {
                                      handleQtyChange(product.id, '1'); 
                                      toast.success(`${product.name} added to cart`, { duration: 2000 });
                                    }
                                  }}
                                  disabled={isOutOfStock}
                                  className={`w-full md:w-[90px] h-10 md:h-11 flex items-center justify-center text-[13px] font-bold rounded-xl transition-all duration-300 shadow-sm ${
                                    isOutOfStock 
                                      ? 'bg-slate-100 text-gray-400 border border-border-gray cursor-not-allowed'
                                      : qty 
                                        ? 'bg-success-green text-white shadow-md' 
                                        : 'bg-primary-blue text-white hover:bg-primary-hover hover:-translate-y-0.5'
                                  }`}
                                >
                                  {isOutOfStock ? 'Sold Out' : qty ? '✓ ADDED' : 'ADD'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-section-bg rounded-[20px] border border-border-gray text-text-secondary">
                <span className="text-4xl mb-4">🔍</span>
                <p className="text-lg font-bold">No products found.</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 6. WHY SARGURU CRACKERS */}
      <section className="w-full py-8 sm:py-12 bg-section-bg border-y border-border-gray">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary uppercase mb-2 sm:mb-3">Why Sarguru Crackers?</h2>
            <div className="w-16 sm:w-24 h-1 bg-primary-blue mx-auto rounded-full mb-3 sm:mb-4"></div>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto">Experience the difference with authentic Sivakasi fireworks.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {[
              { title: 'Premium Quality', icon: '🏆', desc: 'Vibrant colors, loud bursts, and safe fireworks.' },
              { title: 'Sivakasi Direct', icon: '🏭', desc: 'Directly from the fireworks capital of India.' },
              { title: 'Wholesale Pricing', icon: '💰', desc: 'Unbeatable prices for bulk and retail orders.' },
              { title: 'Safe Packaging', icon: '📦', desc: 'Securely packed in thick corrugated boxes.' }
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-border-gray p-4 sm:p-5 rounded-xl text-center group hover:border-primary-blue/50 hover:bg-white transition-all duration-300 hover:-translate-y-1 shadow-2xs">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-section-bg rounded-full flex items-center justify-center text-xl sm:text-2xl mb-2.5 shadow-inner group-hover:scale-105 transition-transform duration-300 border border-border-gray group-hover:border-primary-blue/30">
                  {feat.icon}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1.5">{feat.title}</h3>
                <p className="text-text-secondary text-[11px] sm:text-xs leading-normal">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SIVAKASI STORY SECTION */}
      <section className="w-full py-8 sm:py-12 bg-bg-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-blue/5 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center relative z-10">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md group aspect-[16/9] lg:aspect-[4/3] bg-white border border-border-gray flex items-center justify-center">
            <img src={sarguruBanner} alt="Sarguru Crackers Heritage" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-4 right-4 text-center z-10">
              <h4 className="text-white font-extrabold tracking-wider uppercase text-sm sm:text-base">The Heritage of Sarguru Crackers</h4>
            </div>
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 mb-2 rounded border border-border-gray bg-section-bg text-text-secondary font-bold tracking-wider text-[10px] sm:text-xs uppercase">
              Our Heritage
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary mb-3 uppercase leading-tight">Born in Sivakasi.<br/><span className="text-primary-blue">Made for Celebration.</span></h2>
            <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
              For generations, Sivakasi has been the heart of India's fireworks industry. At Sarguru Crackers, we carry forward this proud legacy by delivering joy, excitement, and top quality fireworks directly to your home.
            </p>
            <button className="flex items-center gap-2 text-primary-blue text-xs sm:text-sm font-bold hover:text-primary-hover transition-colors group">
              <span className="uppercase tracking-wider">Discover Our Story</span>
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS WITH SLIDE ANIMATION */}
      <TestimonialSlider />

      {/* 9. FINAL CTA */}
      <section className="w-full py-10 sm:py-16 relative bg-bg-light overflow-hidden flex flex-col items-center text-center px-4 border-t border-border-gray">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-blue/5 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-text-primary mb-3 uppercase tracking-tight">Ready to light up your celebration?</h2>
          <p className="text-xs sm:text-base text-text-secondary mb-6">Discover premium crackers from Sivakasi and make your celebration unforgettable.</p>
          <button 
            onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} 
            className="bg-primary-blue text-white px-6 py-3 sm:px-10 sm:py-4 rounded-full font-extrabold text-sm sm:text-lg shadow-md hover:bg-primary-hover transition-colors uppercase tracking-wider cursor-pointer"
          >
            SHOP NOW
          </button>
        </div>
      </section>

      {/* Product Detail & Full-Screen Image Lightbox Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={(prod, qtyToAdd) => {
          const currentQty = Number(quantities[prod.id] || 0);
          handleQtyChange(prod.id, String(currentQty + qtyToAdd));
        }}
        initialQuantity={selectedProductForModal ? quantities[selectedProductForModal.id] || 1 : 1}
      />

    </div>
  );
};
