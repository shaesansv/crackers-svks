import React, { useState, useEffect } from 'react';
import { ProductImage, getHighResImageUrl } from '../components/ProductImage';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Fireworks } from '@fireworks-js/react';
import type { Category, Product } from '../types';
import { toast } from 'sonner';

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
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 5, minutes: 30, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) { seconds--; }
        else {
          seconds = 59;
          if (minutes > 0) { minutes--; }
          else {
            minutes = 59;
            if (hours > 0) { hours--; }
            else { hours = 23; if (days > 0) days--; }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products
  const filteredCategories = categories
    .map((category) => {
      const matchedProducts = category.products.filter((product: Product) => {
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

  // Get special offers (items with largest discount or just top 4)
  const specialOffers = categories.flatMap(c => c.products).filter(p => p.hasDiscount && p.globalDiscountPct && p.globalDiscountPct > 50).slice(0, 4);

  return (
    <div className="flex-grow flex flex-col bg-bg-light font-sans text-text-primary overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-bg-light">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-50"
             style={{
               backgroundImage: `radial-gradient(circle at center, rgba(245,184,0,0.15) 0%, rgba(7,13,26,1) 70%)`
             }}></div>
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Fireworks
            options={{
              rocketsPoint: { min: 0, max: 100 },
              hue: { min: 10, max: 50 },
              delay: { min: 40, max: 80 },
              acceleration: 1.05,
              friction: 0.96,
              gravity: 1.2,
              particles: 120,
              traceLength: 4,
              traceSpeed: 5,
              explosion: 6,
              intensity: 15,
              flickering: 40,
              lineStyle: 'round',
              brightness: { min: 60, max: 90 },
              decay: { min: 0.01, max: 0.02 },
              mouse: { click: false, move: false, max: 1 }
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {/* Particle/Rocket simulation (CSS) */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary-blue rounded-full shadow-[0_0_20px_#F5B800] animate-[ping_4s_ease-in-out_infinite] z-10 opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent-orange rounded-full shadow-[0_0_20px_#FF8A00] animate-[ping_5s_ease-in-out_infinite] z-10 opacity-30"></div>

        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-[-50px]">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary-blue/30 bg-primary-blue/10 backdrop-blur-md text-primary-blue font-bold tracking-widest text-xs animate-fade-in uppercase">
            🌟 Premium Sivakasi Fireworks
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-blue via-white to-accent-orange drop-shadow-lg mb-6 animate-slide-up tracking-tight uppercase" style={{ animationDelay: '0.1s' }}>
            Light Up Your<br/>Celebration
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover the finest crackers sourced directly from Sivakasi. Unbeatable quality, wholesale pricing, and memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} className="btn-premium bg-primary-blue text-bg-light px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(245,184,0,0.4)] transition-all transform hover:-translate-y-1">
              SHOP NOW
            </button>
            <button onClick={() => document.getElementById('categories')?.scrollIntoView({behavior: 'smooth'})} className="bg-transparent border-2 border-primary-blue/50 text-text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-blue/10 transition-all transform hover:-translate-y-1">
              EXPLORE COLLECTION
            </button>
          </div>
        </div>
      </section>


      {/* 3. FESTIVAL SPECIAL OFFERS */}
      {specialOffers.length > 0 && (
        <section className="w-full py-16 bg-bg-light">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-extrabold text-white uppercase flex items-center gap-3">
                <span className="text-accent-orange">🔥</span> Special Offers
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialOffers.map(product => {
                const qty = quantities[product.id] || '';
                return (
                  <div key={'offer-'+product.id} className="bg-section-bg rounded-[20px] p-5 border border-border-gray hover:border-primary-blue/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[var(--shadow-premium-hover)] flex flex-col justify-between">
                    <div>
                      <div 
                        onClick={() => setSelectedProductForModal(product)}
                        className="relative w-full aspect-square bg-dark-section rounded-xl overflow-hidden mb-4 border border-border-gray/50 cursor-pointer group/img"
                        title="Click to view enlarged image & product details"
                      >
                        {product.image || product.imageUrl ? (
                          <img 
                            src={getHighResImageUrl(product.image || product.imageUrl, 800, 90)} 
                            alt={product.name} 
                            loading="lazy"
                            decoding="async"
                            style={{ imageRendering: '-webkit-optimize-contrast' }}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center transform group-hover/img:scale-110 transition-transform duration-500"><ProductImage type={product.imageType} /></div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <div className="bg-black/80 text-primary-blue text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg border border-primary-blue/30 backdrop-blur-sm">
                            <span>🔍 Enlarge</span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-danger-red text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {product.globalDiscountPct}% OFF
                        </div>
                      </div>
                      <h3 
                        onClick={() => setSelectedProductForModal(product)}
                        className="font-bold text-lg mb-1 truncate text-white hover:text-primary-blue transition-colors cursor-pointer"
                        title="Click to view product details"
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-gray-400 line-through text-sm">₹{product.price.toFixed(2)}</span>
                        <span className="text-success-green font-extrabold text-lg">₹{product.discountPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (!qty) {
                          handleQtyChange(product.id, '1');
                          toast.success(`${product.name} added to cart`, { duration: 2000 });
                        }
                      }}
                      className="w-full py-3 bg-dark-section border border-primary-blue text-primary-blue rounded-xl font-bold hover:bg-primary-blue hover:text-bg-light transition-all active:scale-95"
                    >
                      {qty ? '✓ ADDED' : 'ADD TO CART'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. SHOP BY CATEGORY */}
      <section id="categories" className="w-full py-16 bg-section-bg border-y border-border-gray">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase mb-4">Shop By Category</h2>
            <div className="w-24 h-1 bg-primary-blue mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0,8).map(cat => (
              <div 
                key={'cat-'+cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'});
                }}
                className="bg-dark-section border border-border-gray rounded-2xl p-4 cursor-pointer group hover:border-primary-blue transition-all duration-300 hover:shadow-[0_10px_30px_rgba(245,184,0,0.1)] hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-bg-light/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-full aspect-video bg-section-bg rounded-xl mb-4 overflow-hidden relative">
                  {/* Using generic icon/image for category */}
                  <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-125 transition-transform duration-500 opacity-50 group-hover:opacity-100">
                    🎇
                  </div>
                </div>
                <h3 className="font-bold text-center text-sm md:text-base text-white group-hover:text-primary-blue transition-colors relative z-20">
                  {cat.name.replace(' (80% DISCOUNT)', '')}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MAIN PRODUCT LISTING */}
      <section id="shop" className="w-full py-16 bg-bg-light relative">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-40">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase mb-4">Discover Our Collection</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Explore our wide range of premium fireworks carefully crafted for your celebrations.</p>
          </div>

          {/* Top Filters & Search Box */}
          <div className="bg-section-bg border border-border-gray rounded-[20px] p-5 shadow-[var(--shadow-premium)] mb-10 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full py-3.5 pl-4 pr-10 border border-border-gray rounded-[14px] text-sm bg-dark-section text-white font-semibold outline-none transition-all duration-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue cursor-pointer appearance-none">
                  <option value="all">All Brands</option>
                  <option value="laxmi">Laxmi Brand</option>
                  <option value="standard">Standard Quality</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-primary-blue">▼</div>
              </div>
              <div className="relative group">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full py-3.5 pl-4 pr-10 border border-border-gray rounded-[14px] text-sm bg-dark-section text-white font-semibold outline-none transition-all duration-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue cursor-pointer appearance-none">
                  <option value="all">All Categories</option>
                  {categories.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>{cat.name.replace(' (80% DISCOUNT)', '')}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-primary-blue">▼</div>
              </div>
            </div>
            <div className="relative group">
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-4 pl-12 pr-4 border border-border-gray rounded-[14px] text-sm bg-dark-section focus:bg-section-bg text-white outline-none transition-all duration-300 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue font-inter" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-blue">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="flex flex-col">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} className="mb-10">
                  <div className="bg-section-bg px-6 py-5 border-b border-border-gray flex items-center gap-4 rounded-t-[20px] shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-blue"></div>
                    <div className="w-10 h-10 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold text-xl">✨</div>
                    <h2 className="text-primary-blue text-xl font-extrabold uppercase tracking-widest">{category.name.replace(' (80% DISCOUNT)', '')}</h2>
                  </div>

                  <div className="flex flex-col bg-section-bg rounded-b-[20px] shadow-[var(--shadow-premium)] border border-t-0 border-border-gray overflow-hidden">
                    {category.products.map((product: Product) => {
                      const qty = quantities[product.id] || '';
                      const isLow = product.id === 'sp3' || product.id === 'gc2';
                      const isOutOfStock = (product.stock ?? 1) <= 0;

                      return (
                        <div key={product.id} className={`flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 md:px-6 py-5 border-b border-border-gray transition-all duration-300 gap-4 md:gap-0 ${isOutOfStock ? 'bg-bg-light opacity-60 cursor-not-allowed' : 'hover:bg-dark-section hover:shadow-lg'}`}>
                          {/* Details */}
                          <div className="flex items-center gap-5 w-full md:w-auto">
                            <div 
                              onClick={() => setSelectedProductForModal(product)}
                              className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center bg-bg-light border border-border-gray rounded-2xl overflow-hidden shadow-sm hover:border-primary-blue hover:shadow-[0_0_15px_rgba(245,184,0,0.2)] transition-all cursor-pointer group/thumb"
                              title="Click to view enlarged image & product details"
                            >
                              {product.image || product.imageUrl ? (
                                <img 
                                  src={getHighResImageUrl(product.image || product.imageUrl, 400, 90)} 
                                  alt={product.name} 
                                  loading="lazy"
                                  decoding="async"
                                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300" 
                                />
                              ) : (
                                <ProductImage type={product.imageType} />
                              )}

                              {/* Hover Zoom icon */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-white text-xs bg-black/70 px-1.5 py-0.5 rounded-full">🔍</span>
                              </div>

                              {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[1px]">
                                  <span className="text-white text-[9px] font-extrabold text-center leading-tight px-1 uppercase tracking-wider">Sold Out</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span 
                                onClick={() => setSelectedProductForModal(product)}
                                className={`text-[16px] font-bold mb-1 cursor-pointer transition-colors ${isOutOfStock ? 'text-gray-500' : 'text-white hover:text-primary-blue'}`}
                                title="Click to view product details"
                              >
                                {product.name}
                              </span>
                              {isOutOfStock ? (
                                <span className="text-[11px] font-bold bg-danger-red/20 text-danger-red px-2 py-0.5 rounded-md w-max border border-danger-red/30">🚫 Out of Stock</span>
                              ) : product.displayNetRate ? (
                                <span className="text-[11px] font-bold bg-primary-blue/20 text-primary-blue px-2 py-0.5 rounded-md w-max border border-primary-blue/30">Premium Quality</span>
                              ) : product.hasDiscount && product.globalDiscountPct && product.globalDiscountPct > 0 ? (
                                <span className="text-[11px] font-bold bg-danger-red text-white px-2 py-0.5 rounded-md w-max shadow-sm">🔥 {product.globalDiscountPct}% OFF</span>
                              ) : (
                                <span className="text-[12px] text-text-secondary">Standard</span>
                              )}
                            </div>
                          </div>

                          {/* Mobile specifics hidden here */}
                          <div className="flex items-center justify-between w-full md:hidden text-sm text-text-secondary bg-dark-section p-3 rounded-xl border border-border-gray">
                            <div className="font-medium">Size: <span className="text-white">{product.unit}</span></div>
                            <div className={`font-bold ${isOutOfStock ? 'text-danger-red' : isLow ? 'text-accent-orange' : 'text-success-green'}`}>
                              {isOutOfStock ? 'Sold Out' : isLow ? 'Low Stock' : 'Available'}
                            </div>
                            <div className="flex flex-col items-end">
                              {product.displayNetRate ? (
                                <span className="text-[16px] font-extrabold text-primary-blue">₹{product.discountPrice.toFixed(2)}</span>
                              ) : product.hasDiscount && product.price > product.discountPrice ? (
                                <>
                                  <span className="text-[12px] line-through text-gray-500 font-medium">₹{product.price.toFixed(2)}</span>
                                  <span className="text-[16px] font-extrabold text-success-green">₹{product.discountPrice.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="font-extrabold text-primary-blue">₹{product.discountPrice.toFixed(2)}</span>
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
                              <div className={`flex items-center border rounded-xl overflow-hidden h-10 md:h-11 ${isOutOfStock ? 'bg-bg-light border-border-gray' : 'bg-dark-section border-border-gray focus-within:border-primary-blue focus-within:ring-1 focus-within:ring-primary-blue'}`}>
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const current = Number(qty || 0);
                                    if (current > 0) handleQtyChange(product.id, String(current - 1));
                                  }}
                                  disabled={isOutOfStock || !qty || Number(qty) <= 0}
                                  className={`w-8 md:w-10 h-full flex items-center justify-center text-lg font-bold transition-colors ${isOutOfStock || !qty || Number(qty) <= 0 ? 'text-gray-600 cursor-not-allowed bg-black/20' : 'text-white hover:bg-primary-blue/20 hover:text-primary-blue active:bg-primary-blue/30'}`}
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
                                  className={`w-10 md:w-12 h-full text-center text-[15px] font-bold outline-none transition-colors p-0 ${isOutOfStock ? 'bg-transparent text-gray-500 cursor-not-allowed' : 'bg-transparent text-white'}`}
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
                                  className={`w-8 md:w-10 h-full flex items-center justify-center text-lg font-bold transition-colors ${isOutOfStock ? 'text-gray-600 cursor-not-allowed bg-black/20' : 'text-white hover:bg-primary-blue/20 hover:text-primary-blue active:bg-primary-blue/30'}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-center items-center w-1/2 md:w-auto pl-3 md:pl-0">
                              {isOutOfStock ? (
                                <div className="w-full md:w-[90px] h-10 md:h-11 flex items-center justify-center text-[12px] font-bold text-gray-500 bg-bg-light border border-border-gray rounded-xl cursor-not-allowed select-none">
                                  N/A
                                </div>
                              ) : (
                                <button
                                  onClick={() => { 
                                    if (!qty) {
                                      handleQtyChange(product.id, '1'); 
                                      toast.success(`${product.name} added to cart`, { duration: 2000 });
                                    }
                                  }}
                                  className={`w-full md:w-[90px] h-10 md:h-11 flex items-center justify-center text-[13px] font-bold rounded-xl transition-all duration-300 shadow-sm ${qty ? 'bg-success-green text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-primary-blue text-bg-light hover:bg-primary-hover hover:shadow-[0_0_15px_rgba(245,184,0,0.3)] hover:-translate-y-0.5'}`}
                                >
                                  {qty ? '✓ ADDED' : 'ADD'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
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

      {/* FESTIVAL COUNTDOWN */}
      <section className="w-full bg-section-bg border-y border-border-gray py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/particles.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-8 uppercase tracking-widest">Festival Sale Ends In</h2>
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-dark-section border border-primary-blue/30 rounded-2xl flex items-center justify-center shadow-[var(--shadow-premium)] mb-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary-blue/5 group-hover:bg-primary-blue/10 transition-colors"></div>
                  <span className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(245,184,0,0.5)]">
                    {value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs md:text-sm text-text-secondary uppercase font-bold tracking-wider">{unit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY SARGURU CRACKERS */}
      <section className="w-full py-20 bg-section-bg border-y border-border-gray">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase mb-4">Why Sarguru Crackers?</h2>
            <div className="w-24 h-1 bg-primary-blue mx-auto rounded-full mb-6"></div>
            <p className="text-text-secondary max-w-2xl mx-auto">Experience the difference with authentic Sivakasi fireworks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Premium Quality', icon: '🏆', desc: 'Carefully selected fireworks ensuring vibrant colors, loud bursts, and safe celebrations.' },
              { title: 'Sivakasi Direct', icon: '🏭', desc: 'Sourced directly from the fireworks capital of India, ensuring authenticity and freshness.' },
              { title: 'Wholesale Pricing', icon: '💰', desc: 'Unbeatable prices for bulk and retail orders. Celebrate grandly without breaking the bank.' },
              { title: 'Safe Packaging', icon: '📦', desc: 'Securely packed in thick corrugated boxes to ensure safe transit to your doorstep.' }
            ].map((feat, i) => (
              <div key={i} className="bg-dark-section border border-border-gray p-8 rounded-2xl text-center group hover:border-primary-blue/50 hover:bg-bg-light transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-premium)]">
                <div className="w-20 h-20 mx-auto bg-section-bg rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 border border-border-gray group-hover:border-primary-blue/30">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SIVAKASI STORY SECTION */}
      <section className="w-full py-24 bg-bg-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-premium)] group aspect-[4/3] bg-dark-section border border-border-gray flex items-center justify-center">
            {/* Placeholder for Sivakasi Story Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D1628] to-[#111C30]"></div>
            <div className="text-center relative z-10 p-6 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
              <span className="text-6xl block mb-4">🏭</span>
              <h4 className="text-primary-blue font-bold tracking-widest uppercase">The Heritage of Sivakasi</h4>
            </div>
            <div className="absolute inset-0 border-2 border-primary-blue/0 group-hover:border-primary-blue/20 rounded-3xl transition-colors duration-500"></div>
          </div>
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-md border border-border-gray bg-section-bg text-text-secondary font-bold tracking-wider text-xs uppercase">
              Our Heritage
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 uppercase leading-tight">Born in Sivakasi.<br/><span className="text-primary-blue">Made for Celebration.</span></h2>
            <p className="text-text-secondary text-lg mb-6 leading-relaxed">
              For generations, Sivakasi has been the heart of India's fireworks industry. At Sarguru Crackers, we carry forward this proud legacy by bringing you the most dazzling, safe, and premium quality crackers.
            </p>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Every sparkler, every rocket, and every fountain is a testament to the craftsmanship and dedication of our artisans. We don't just sell fireworks; we deliver joy, excitement, and unforgettable memories.
            </p>
            <button className="flex items-center gap-2 text-primary-blue font-bold hover:text-white transition-colors group">
              <span className="uppercase tracking-wider">Discover Our Story</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="w-full py-20 bg-section-bg border-t border-border-gray overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase mb-4">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-primary-blue mx-auto rounded-full mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Rajesh K.', review: 'Absolutely stunning quality! The colors of the fancy items were incredibly vibrant. Delivered safely to Chennai.' },
              { name: 'Priya M.', review: 'Best wholesale prices I could find online. The packaging was thick and secure. Will definitely buy again next Diwali.' },
              { name: 'Arun S.', review: 'The sparklers and flower pots were of premium quality. Less smoke and very bright. Highly recommend Sarguru Crackers.' }
            ].map((t, i) => (
              <div key={i} className="bg-dark-section border border-border-gray p-8 rounded-2xl relative mt-8 hover:-translate-y-1 transition-transform duration-300 hover:border-primary-blue/50">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-bg-light text-2xl shadow-lg border-4 border-section-bg font-serif">
                  "
                </div>
                <div className="flex gap-1 text-primary-blue mb-4 pt-2">
                  {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                </div>
                <p className="text-text-secondary text-sm md:text-base mb-6 leading-relaxed italic">"{t.review}"</p>
                <div className="font-bold text-white tracking-wide uppercase text-sm">- {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="w-full py-24 relative bg-bg-light overflow-hidden flex flex-col items-center text-center px-4 border-t border-border-gray">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-blue/5 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-tight">Ready to light up your celebration?</h2>
          <p className="text-xl text-text-secondary mb-10">Discover premium crackers from Sivakasi and make your celebration unforgettable.</p>
          <button onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} className="btn-premium bg-primary-blue text-bg-light px-10 py-5 rounded-full font-extrabold text-xl shadow-[0_0_40px_rgba(245,184,0,0.4)] hover:shadow-[0_0_60px_rgba(245,184,0,0.6)] transition-all transform hover:-translate-y-2 uppercase tracking-wider">
            SHOP NOW
          </button>
        </div>
      </section>

      {/* Product Detail & Image Lightbox Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={(product, qty) => {
          handleQtyChange(product.id, String(qty));
        }}
        initialQuantity={selectedProductForModal ? quantities[selectedProductForModal.id] || 1 : 1}
      />

    </div>
  );
};
