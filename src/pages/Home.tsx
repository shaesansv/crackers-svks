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
      <main className="overflow-x-auto flex-grow px-2 md:px-0 mt-4 md:mt-6 mb-8">
        <table className="w-full border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-[#f00] text-white">
              <th className="w-[10%] md:w-20 text-center font-bold py-2 md:py-3 px-1 md:px-2 border border-[#f00]">Image</th>
              <th className="text-left font-bold py-2 md:py-3 px-2 md:px-4 border border-[#f00]">Product Name</th>
              <th className="w-[12%] md:w-24 text-center font-bold py-2 md:py-3 px-1 md:px-2 border border-[#f00] hidden sm:table-cell">Content</th>
              <th className="w-[15%] md:w-28 text-center font-bold py-2 md:py-3 px-1 md:px-2 border border-[#f00]">Actual Price</th>
              <th className="w-[12%] md:w-24 text-center font-bold py-2 md:py-3 px-1 md:px-2 border border-[#f00]">Price</th>
              <th className="w-[18%] md:w-32 text-center font-bold py-2 md:py-3 px-1 md:px-2 border border-[#f00]">Quantity</th>
              <th className="w-[15%] md:w-28 text-center font-bold py-2 md:py-3 px-1 md:px-2 border border-[#f00]">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <React.Fragment key={category.id}>
                  {/* Category separator header row */}
                  <tr>
                    <td colSpan={7} className="bg-[#f00] text-white font-bold text-center py-2.5 text-sm md:text-base border border-[#f00]">
                      {category.name} (80% Discount)
                    </td>
                  </tr>
                  {/* Category products */}
                  {category.products.map((product) => {
                    const qty = quantities[product.id] || 0;
                    const rowTotal = qty * product.discountPrice;

                    return (
                      <tr key={product.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors duration-150 bg-white">
                        <td className="p-1 md:p-2 border-r border-l border-gray-300 text-center align-middle">
                          <div className="flex justify-center items-center">
                            <ProductImage type={product.imageType} />
                          </div>
                        </td>
                        <td className="p-1 md:p-2 border-r border-gray-300 font-medium text-gray-900 pl-2 md:pl-4 align-middle text-[13px] md:text-sm">{product.name}</td>
                        <td className="p-1 md:p-2 border-r border-gray-300 text-center text-gray-700 align-middle hidden sm:table-cell text-[13px] md:text-sm">{product.unit}</td>
                        <td className="p-1 md:p-2 border-r border-gray-300 text-center font-normal text-gray-800 align-middle">
                          <span className="line-through text-gray-500 text-[13px] md:text-sm">
                            {product.actualPrice}
                          </span>
                        </td>
                        <td className="p-1 md:p-2 border-r border-gray-300 text-center font-bold text-gray-900 align-middle text-[13px] md:text-sm">{product.discountPrice}</td>
                        <td className="p-1 md:p-2 border-r border-gray-300 text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              className="w-6 h-6 md:w-7 md:h-7 border border-gray-300 bg-gray-100 hover:bg-gray-200 font-bold rounded-sm flex items-center justify-center cursor-pointer text-gray-700 transition-colors"
                              onClick={() => adjustQty(product.id, false)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={quantities[product.id] || ''}
                              onChange={(e) => handleQtyChange(product.id, e.target.value)}
                              className="w-10 h-6 md:w-12 md:h-7 border border-gray-300 rounded-sm text-center text-[13px] md:text-sm font-semibold outline-none focus:border-red-500 m-0 p-0"
                              placeholder=""
                            />
                            <button
                              type="button"
                              className="w-6 h-6 md:w-7 md:h-7 border border-gray-300 bg-gray-100 hover:bg-gray-200 font-bold rounded-sm flex items-center justify-center cursor-pointer text-gray-700 transition-colors"
                              onClick={() => adjustQty(product.id, true)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-1 md:p-2 border-r border-gray-300 text-center align-middle">
                          <input
                            type="text"
                            readOnly
                            value={rowTotal > 0 ? rowTotal : ''}
                            placeholder=""
                            className="w-14 h-7 md:w-20 md:h-8 border-none bg-transparent text-center text-[13px] md:text-sm font-bold text-gray-900 outline-none select-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-400 italic text-sm border-b border-l border-r border-gray-300">
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
