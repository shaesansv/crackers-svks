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
    <div className="flex-grow">
      {/* Main Table Container */}
      <main className="overflow-x-auto flex-grow">
        <table className="w-full border-collapse border border-gray-200 text-xs md:text-sm">
          <thead>
            <tr>
              <th className="w-20 text-center bg-red-600 text-white font-bold py-2.5 px-2 border border-gray-200 text-xs">Image</th>
              <th className="text-left bg-red-600 text-white font-bold py-2.5 px-4 border border-gray-200 text-xs">Product Name</th>
              <th className="w-24 text-center bg-red-600 text-white font-bold py-2.5 px-2 border border-gray-200 text-xs">Unit</th>
              <th className="w-28 text-center bg-red-600 text-white font-bold py-2.5 px-2 border border-gray-200 text-xs">Actual Price</th>
              <th className="w-24 text-center bg-red-600 text-white font-bold py-2.5 px-2 border border-gray-200 text-xs">Price</th>
              <th className="w-40 text-center bg-red-600 text-white font-bold py-2.5 px-2 border border-gray-200 text-xs">Quantity</th>
              <th className="w-32 text-center bg-red-600 text-white font-bold py-2.5 px-2 border border-gray-200 text-xs">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <span key={category.id} style={{ display: 'contents' }}>
                  {/* Category separator header row */}
                  <tr>
                    <td colSpan={7} className="bg-red-600 text-white font-extrabold text-center py-2 text-xs md:text-sm uppercase tracking-wide border border-gray-200 select-none">
                      {category.name}
                    </td>
                  </tr>
                  {/* Category products */}
                  {category.products.map((product) => {
                    const qty = quantities[product.id] || 0;
                    const rowTotal = qty * product.discountPrice;

                    return (
                      <tr key={product.id} className="border-b border-gray-200 hover:bg-sky-50/40 odd:bg-white even:bg-gray-50/20 transition-colors duration-150">
                        <td className="p-2 border border-gray-200 text-center">
                          <div className="flex justify-center items-center">
                            <ProductImage type={product.imageType} />
                          </div>
                        </td>
                        <td className="p-2 border border-gray-200 font-medium text-gray-800 pl-4">{product.name}</td>
                        <td className="p-2 border border-gray-200 text-center text-gray-600">{product.unit}</td>
                        <td className="p-2 border border-gray-200 text-center font-semibold text-red-600">
                          <span className="line-through opacity-80">
                            {product.actualPrice}
                          </span>
                        </td>
                        <td className="p-2 border border-gray-200 text-center font-bold text-gray-800 text-sm">{product.discountPrice}</td>
                        <td className="p-2 border border-gray-200 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              className="w-6 h-6 border border-gray-300 bg-gray-50 text-gray-800 font-bold rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors select-none text-sm outline-none"
                              onClick={() => adjustQty(product.id, false)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={quantities[product.id] || ''}
                              onChange={(e) => handleQtyChange(product.id, e.target.value)}
                              className="w-14 h-6 border border-gray-300 rounded text-center text-xs font-semibold outline-none focus:border-red-500"
                              placeholder="0"
                            />
                            <button
                              type="button"
                              className="w-6 h-6 border border-gray-300 bg-gray-50 text-gray-800 font-bold rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors select-none text-sm outline-none"
                              onClick={() => adjustQty(product.id, true)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-2 border border-gray-200 text-center">
                          <input
                            type="text"
                            readOnly
                            value={rowTotal > 0 ? rowTotal : ''}
                            placeholder="0"
                            className="w-20 h-6 border border-gray-300 rounded bg-gray-100 text-center text-xs font-bold text-gray-800 outline-none select-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </span>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-400 italic text-sm">
                  No products matched your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};
