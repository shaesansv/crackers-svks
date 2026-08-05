import React, { useState } from 'react';
import { ProductImage } from '../components/ProductImage';
import { Fireworks } from '@fireworks-js/react';
import type { Category, Product } from '../types';

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

  // Filter products and categories based on search, category, and brand state
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

  const allProducts = filteredCategories.flatMap(c => c.products);
  const totalProducts = allProducts.length;

  return (
    <div className="flex-grow flex flex-col bg-bg-light font-sans">
      {/* Hero Section with Fireworks */}
      <div 
        className="w-full h-[300px] md:h-[400px] relative overflow-hidden flex-shrink-0"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(15, 76, 129, 0.85), rgba(30, 58, 138, 0.95)), url('/banner.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
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
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/20">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4 tracking-wide shadow-black drop-shadow-md">
            Celebrate with Premium Fireworks
          </h1>
          <p className="text-gray-200 mt-4 text-sm md:text-base max-w-lg text-center px-4 drop-shadow-md">
            Sivakasi's finest crackers at wholesale prices. Light up your celebrations!
          </p>
        </div>
      </div>

      <main className="flex-grow w-full max-w-[1200px] mx-auto bg-white shadow-sm mt-6 mb-10 relative z-40 rounded-lg">
        
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

        {/* Product List */}
        <div className="flex flex-col">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="mb-6">
                {/* Category Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-3 rounded-t-[18px]">
                  <div className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold">
                    ✨
                  </div>
                  <h2 className="text-primary-blue text-[18px] font-bold uppercase tracking-wide">
                    {category.name.replace(' (80% DISCOUNT)', '')}
                  </h2>
                </div>

                {/* Category Products */}
                <div className="flex flex-col bg-white rounded-b-[18px] shadow-[var(--shadow-premium)]">
                  {category.products.map((product: Product) => {
                    const qty = quantities[product.id] || '';
                    // Randomize stock status slightly for realism, or just default to Yes
                    const isLow = product.id === 'sp3' || product.id === 'gc2';

                    return (
                      <div 
                        key={product.id} 
                        className="flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 md:px-6 py-5 md:py-4 border-b border-gray-100 hover:bg-white hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1 transition-all duration-300 gap-4 md:gap-0 bg-white"
                      >
                        {/* Product Details */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="w-[60px] h-[60px] md:w-[60px] md:h-[60px] flex-shrink-0 flex items-center justify-center bg-white border border-border-gray rounded-[18px] overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-sm">
                            <ProductImage type={product.imageType} />
                          </div>
                          <div className="flex flex-col flex-grow">
                            <span className="text-[15px] font-bold text-text-primary mb-0.5">{product.name}</span>
                            {product.name.includes('Discount') ? (
                              <span className="text-[11px] font-bold bg-danger-red text-white px-2 py-0.5 rounded-full inline-block w-max">Special Offer</span>
                            ) : (
                              <span className="text-[13px] text-text-secondary">Premium Standard</span>
                            )}
                          </div>
                        </div>

                        {/* Mobile Details Row */}
                        <div className="flex items-center justify-between w-full md:hidden text-sm text-text-secondary bg-bg-light p-2 rounded-[12px]">
                          <div className="font-medium">Unit: <span className="font-normal">{product.unit}</span></div>
                          <div className={`font-bold ${isLow ? 'text-accent-orange' : 'text-success-green'}`}>{isLow ? 'Low Stock' : 'In Stock'}</div>
                          <div className="font-bold text-secondary-gold">₹{product.discountPrice.toFixed(2)}</div>
                        </div>

                        {/* Desktop Unit / Size */}
                        <div className="hidden md:block text-[14px] text-text-secondary text-center">
                          {product.unit}
                        </div>

                        {/* Desktop In Stock */}
                        <div className={`hidden md:block text-[14px] font-bold text-center ${isLow ? 'text-accent-orange' : 'text-success-green'}`}>
                          {isLow ? 'Low' : 'Yes'}
                        </div>

                        {/* Desktop Price */}
                        <div className="hidden md:block text-[15px] font-bold text-secondary-gold text-center">
                          ₹{product.discountPrice.toFixed(2)}
                        </div>

                        {/* Actions Row (Quantity & Add Button) */}
                        <div className="flex items-center justify-between w-full md:contents mt-2 md:mt-0">
                          {/* Quantity */}
                          <div className="flex justify-center items-center w-1/2 md:w-auto pr-2 md:pr-0 border-r md:border-r-0 border-gray-200">
                            <span className="text-xs font-bold text-gray-500 mr-2 md:hidden">QTY:</span>
                            <input
                              type="number"
                              min="1"
                              value={qty}
                              onChange={(e) => handleQtyChange(product.id, e.target.value)}
                              className="w-[60px] h-[36px] border border-gray-300 rounded-[4px] text-center text-[14px] outline-none focus:border-[#B71C1C]"
                            />
                          </div>

                          {/* Action */}
                          <div className="flex justify-center items-center w-1/2 md:w-auto pl-2 md:pl-0">
                            <button
                              onClick={() => {
                                if (!qty) handleQtyChange(product.id, '1');
                              }}
                              className="w-full md:w-[70px] max-w-[120px] btn-primary flex items-center justify-center text-[13px] !h-[36px] shadow-sm"
                            >
                              ADD
                            </button>
                          </div>
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
              <button className="w-8 h-8 flex items-center justify-center text-[14px] text-white bg-[#B71C1C] rounded font-bold">1</button>
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

