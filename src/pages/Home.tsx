import React from 'react';
import { crackerCategories } from '../data/products';
import { ProductImage } from '../components/ProductImage';

interface HomeProps {
  quantities: Record<string, number>;
  handleQtyChange: (productId: string, value: string) => void;
  adjustQty: (productId: string, increment: boolean) => void;
  searchTerm: string;
  selectedCategory: string;
}

export const Home: React.FC<HomeProps> = ({
  quantities,
  handleQtyChange,
  adjustQty,
  searchTerm,
  selectedCategory
}) => {
  // Filter products and categories based on search & filter state
  const filteredCategories = crackerCategories
    .map((category) => {
      const matchedProducts = category.products.filter((product) => {
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

  // WhatsApp order submission and details are managed by the unified Footer component

  return (
    <div className="flex-grow flex flex-col">
      {/* Main Table Container */}
      <main className="flex-grow px-6 md:px-12 mt-8 md:mt-12 mb-16 max-w-7xl mx-auto w-full">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <section key={category.id} className="mb-16">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-poppins font-bold text-2xl md:text-3xl text-dark-navy">
                  {category.name}
                </h2>
                <div className="flex-grow h-px bg-gradient-to-r from-luxury-gold/50 to-transparent"></div>
                <span className="text-royal-red font-semibold text-sm bg-royal-red/10 px-3 py-1 rounded-full whitespace-nowrap">
                  80% DISCOUNT
                </span>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {category.products.map((product, index) => {
                  const qty = quantities[product.id] || 0;
                  const rowTotal = qty * product.discountPrice;
                  
                  return (
                    <div 
                      key={product.id} 
                      className="bg-white rounded-[18px] shadow-[var(--shadow-premium)] hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1.5 transition-all duration-400 p-6 flex flex-col relative group animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Product Image */}
                      <div className="flex justify-center items-center h-32 mb-4">
                        <div className="transform group-hover:scale-110 transition-transform duration-500">
                          <ProductImage type={product.imageType} />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-col flex-grow text-center">
                        <h3 className="font-poppins font-bold text-dark-navy text-lg mb-1 leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 font-inter text-sm mb-4">
                          {product.unit}
                        </p>
                        
                        <div className="mt-auto">
                          <div className="flex items-end justify-center gap-2 mb-5">
                            <span className="text-gray-400 line-through text-sm font-medium">
                              ₹{product.actualPrice}
                            </span>
                            <span className="text-royal-red font-bold text-2xl font-poppins">
                              ₹{product.discountPrice}
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="bg-off-white p-3 rounded-2xl border border-gray-100 flex flex-col gap-3">
                            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                              <button
                                type="button"
                                className="w-10 h-10 flex items-center justify-center text-dark-navy hover:bg-gray-50 hover:text-royal-red transition-colors font-bold text-lg"
                                onClick={() => adjustQty(product.id, false)}
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={quantities[product.id] || ''}
                                onChange={(e) => handleQtyChange(product.id, e.target.value)}
                                className="w-12 h-10 text-center font-inter font-semibold text-dark-navy outline-none bg-transparent"
                                placeholder="0"
                              />
                              <button
                                type="button"
                                className="w-10 h-10 flex items-center justify-center text-dark-navy hover:bg-gray-50 hover:text-royal-red transition-colors font-bold text-lg"
                                onClick={() => adjustQty(product.id, true)}
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Total Line */}
                            <div className="flex justify-between items-center px-1">
                              <span className="text-xs text-gray-500 font-medium">Item Total:</span>
                              <span className="font-bold text-sm text-dark-navy">
                                ₹{rowTotal > 0 ? rowTotal : '0'}
                              </span>
                            </div>
                          </div>
                        </div>
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
