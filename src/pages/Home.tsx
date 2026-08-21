import React, { useState, useEffect } from 'react';
import { ProductImage } from '../components/ProductImage';
import type { Category, Product } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import sarguruBanner from '../assets/sarguru-banner.png';

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
  cartCount,
  cartTotal,
  mktTotal = 0,
  categories,
  onCartOpen
}) => {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const youSave = Math.max(0, mktTotal - cartTotal);
  const packingCharge = Math.round(cartTotal * 0.03 * 100) / 100;
  const overallTotal = Math.round(cartTotal + packingCharge);

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

  // Generate deterministic product codes like KCS1005, KCS1006... if code isn't present
  let globalItemIndex = 1005;

  return (
    <div className="flex-grow flex flex-col bg-[#FDF5CB] text-[#061001] font-sans select-none pb-12">
      
      {/* 1. MAIN HERO BANNER IMAGE (100% Edge-to-Edge Width) */}
      <section id="chit-scheme" className="w-full bg-slate-950 p-0 m-0 border-b-2 border-[#B69F4C] shadow-md overflow-hidden">
        <div className="w-full p-0 m-0 relative group cursor-pointer" onClick={() => setPreviewImage(sarguruBanner)}>
          <img 
            src={sarguruBanner} 
            alt="Sarguru Crackers Sivakasi Banner" 
            className="w-full h-auto block object-fill min-w-full transition-transform duration-300 hover:opacity-95"
          />
          <div className="absolute bottom-2 right-4 bg-[#15803D]/90 text-[#FDF5CB] text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-[#B69F4C]">
            🔍 Click for Zoom
          </div>
        </div>
      </section>

      {/* 2. STICKY FILTERS & LIVE TOTALS BAR (#15803D Vibrant Light Green & #B69F4C Gold Accents) */}
      <div className="sticky top-0 z-50 w-full bg-[#15803D] text-[#FDF5CB] px-3 md:px-6 py-2.5 shadow-md border-y-2 border-[#B69F4C] flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        
        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[#FBECC0] hidden sm:inline">Category -</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FEF9E1] text-[#061001] text-xs font-bold py-1.5 px-3 rounded border border-[#B69F4C] outline-none cursor-pointer shadow-sm hover:bg-[#FDF5CB] transition-colors max-w-[180px] md:max-w-[220px] truncate"
          >
            <option value="all">ALL CATEGORIES</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.replace(' (80% DISCOUNT)', '').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Search Box */}
        <div className="flex items-center flex-1 max-w-[200px] md:max-w-[260px] mx-1">
          <input
            type="text"
            placeholder="Search for an item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FEF9E1] text-[#061001] placeholder-[#14532D]/60 text-xs py-1.5 px-3 rounded border border-[#B69F4C] outline-none shadow-sm focus:ring-2 focus:ring-[#B69F4C]"
          />
        </div>

        {/* Real-time Order Summary Badges */}
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          <div className="bg-[#14532D] border border-[#B69F4C]/50 px-2.5 py-1 rounded text-center">
            <span className="text-[10px] uppercase text-[#FBECC0] block leading-tight">Net Total:</span>
            <span className="font-extrabold text-sm text-[#FDF5CB]">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-[#14532D] border border-[#B69F4C]/50 px-2.5 py-1 rounded text-center hidden md:block">
            <span className="text-[10px] uppercase text-[#FBECC0] block leading-tight">You Save:</span>
            <span className="font-extrabold text-sm text-[#FDF5CB]">₹{youSave.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-[#14532D] border border-[#B69F4C]/50 px-2.5 py-1 rounded text-center">
            <span className="text-[10px] uppercase text-[#FBECC0] block leading-tight">Overall Total:</span>
            <span className="font-extrabold text-sm text-[#FBECC0]">₹{overallTotal.toLocaleString('en-IN')}</span>
          </div>

          {/* Cart Icon Button (#B69F4C Gold Primary Button) */}
          {onCartOpen && (
            <button
              onClick={onCartOpen}
              className="bg-[#B69F4C] hover:bg-[#A67428] text-[#14532D] hover:text-white font-black px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer relative"
              title="View Cart"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span className="hidden sm:inline">CART</span>
              {cartCount > 0 && (
                <span className="bg-[#15803D] text-[#FDF5CB] text-[11px] font-black rounded-full px-1.5 py-0.2 shadow">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>

      </div>

      {/* 3. MAIN PRODUCTS RATE TABLE SECTION (#FEF9E1 Cards & #15803D Headers) */}
      <section id="shop" className="w-full max-w-[1280px] mx-auto px-2 md:px-6 pt-5">
        
        {/* Table Container */}
        <div className="bg-[#FEF9E1] rounded-lg border-2 border-[#B69F4C] shadow-lg overflow-hidden">
          
          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs md:text-sm">
              
              {/* Main Table Column Headers (#14532D Dark Green Background) */}
              <thead>
                <tr className="bg-[#14532D] text-[#FDF5CB] uppercase text-[11px] md:text-xs font-bold tracking-wider divide-x divide-[#B69F4C]/40">
                  <th className="py-2.5 px-2 text-center w-14">Image</th>
                  <th className="py-2.5 px-2 text-center w-20">Code</th>
                  <th className="py-2.5 px-3 min-w-[180px]">Product Name</th>
                  <th className="py-2.5 px-2 text-center w-24">Content</th>
                  <th className="py-2.5 px-2 text-right w-24">Actual Price</th>
                  <th className="py-2.5 px-2 text-right w-24">Price</th>
                  <th className="py-2.5 px-2 text-center w-28">Quantity</th>
                  <th className="py-2.5 px-2 text-right w-28">Total</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <React.Fragment key={category.id}>
                      
                      {/* Category Section Banner Header Row (#15803D Vibrant Light Green Background) */}
                      <tr className="bg-[#15803D] text-white font-extrabold uppercase border-t-2 border-b-2 border-[#B69F4C]">
                        <td colSpan={8} className="py-2.5 px-3 text-center text-xs md:text-sm tracking-wider text-white shadow-inner">
                          {category.name.replace(' (80% DISCOUNT)', '').toUpperCase()} {category.discountText ? `(${category.discountText.toUpperCase()})` : ''}
                        </td>
                      </tr>

                      {/* Products under this Category */}
                      {category.products.map((product: Product) => {
                        const qty = quantities[product.id] || '';
                        const numericQty = typeof qty === 'number' ? qty : parseInt(qty || '0', 10);
                        const rowTotal = numericQty * product.discountPrice;
                        const productCode = (product as any).code || `KCS${globalItemIndex++}`;
                        const isOutOfStock = (product.stock ?? 1) <= 0;

                        return (
                          <tr 
                            key={product.id}
                            className={`border-b border-[#B69F4C]/30 hover:bg-[#FBECC0] transition-colors ${
                              numericQty > 0 ? 'bg-[#FBECC0] font-medium' : 'even:bg-[#FDF5CB]'
                            }`}
                          >
                            {/* Image Thumbnail Column */}
                            <td className="py-1.5 px-2 text-center border-r border-[#B69F4C]/30">
                              <div 
                                className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded border border-[#B69F4C] bg-[#FEF9E1] p-0.5 flex items-center justify-center cursor-pointer hover:opacity-80 overflow-hidden shadow-2xs"
                                onClick={() => {
                                  if (product.image || product.imageUrl) {
                                    setPreviewImage(product.image || product.imageUrl || null);
                                  }
                                }}
                              >
                                {product.image || product.imageUrl ? (
                                  <img 
                                    src={product.image || product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover rounded-xs"
                                  />
                                ) : (
                                  <ProductImage type={product.imageType} />
                                )}
                              </div>
                            </td>

                            {/* Code Column */}
                            <td className="py-1.5 px-2 text-center border-r border-[#B69F4C]/30 text-[11px] font-bold text-[#14532D] uppercase">
                              {productCode}
                            </td>

                            {/* Product Name Column */}
                            <td className="py-1.5 px-3 border-r border-[#B69F4C]/30 font-bold text-[#061001] text-xs md:text-sm">
                              <div>{product.name}</div>
                              {product.hasDiscount && product.globalDiscountPct && product.globalDiscountPct > 0 ? (
                                <span className="text-[10px] text-[#A67428] font-extrabold">({product.globalDiscountPct}% OFF)</span>
                              ) : null}
                            </td>

                            {/* Content Column */}
                            <td className="py-1.5 px-2 text-center border-r border-[#B69F4C]/30 text-[#14532D] text-xs font-medium">
                              {product.unit || '1 Box'}
                            </td>

                            {/* Actual Price MRP Column */}
                            <td className="py-1.5 px-2 text-right border-r border-[#B69F4C]/30 text-slate-500 font-medium text-xs">
                              {product.actualPrice && product.actualPrice > product.discountPrice ? (
                                <span className="line-through">₹{product.actualPrice.toFixed(0)}</span>
                              ) : (
                                <span>₹{product.price.toFixed(0)}</span>
                              )}
                            </td>

                            {/* Price (Net Rate) Column (#A67428 Price/Discount color) */}
                            <td className="py-1.5 px-2 text-right border-r border-[#B69F4C]/30 font-black text-[#A67428] text-xs md:text-sm">
                              ₹{product.discountPrice.toFixed(0)}
                            </td>

                            {/* Quantity Input Column */}
                            <td className="py-1.5 px-2 text-center border-r border-[#B69F4C]/30">
                              {isOutOfStock ? (
                                <span className="text-[10px] font-bold text-red-600 uppercase bg-red-100 py-1 px-2 rounded border border-red-300">
                                  Sold Out
                                </span>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={qty}
                                  onChange={(e) => handleQtyChange(product.id, e.target.value)}
                                  className="w-16 md:w-20 py-1 px-2 border border-[#B69F4C] rounded text-center font-bold text-[#061001] bg-[#FDF5CB] focus:outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] text-xs md:text-sm shadow-inner"
                                />
                              )}
                            </td>

                            {/* Total Amount Column */}
                            <td className="py-1.5 px-2 text-right font-extrabold text-xs md:text-sm">
                              <div className={`py-1 px-2 rounded text-right ${numericQty > 0 ? 'bg-[#15803D] text-[#FDF5CB] font-black border border-[#B69F4C]' : 'text-slate-400'}`}>
                                ₹{rowTotal.toFixed(0)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#14532D]">
                      <div className="text-3xl mb-2">🔍</div>
                      <div className="font-bold text-base">No products found matching your search.</div>
                      <div className="text-xs text-slate-500">Try changing your category filter or search term.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Product & Banner Fullscreen Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className={`${previewImage === sarguruBanner ? 'max-w-5xl' : 'max-w-md'} p-2 bg-[#FEF9E1] rounded-lg border-2 border-[#B69F4C] shadow-2xl flex items-center justify-center`}>
          {previewImage && (
            <img src={previewImage} alt="Preview" className="max-h-[85vh] w-full object-contain rounded" />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

