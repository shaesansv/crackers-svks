import React, { useState } from 'react';
import type { Product } from '../AdminDashboard';
import { ProductImage } from '../../components/ProductImage';

interface ProductsProps {
  products: Product[];
  token: string | null;
  refreshProducts: () => void;
  setMessage: (m: string) => void;
  setError: (e: string) => void;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  token,
  refreshProducts,
  setMessage,
  setError
}) => {
  // Form State for Add / Edit Product
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('Pkt');
  const [actualPrice, setActualPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [imageType, setImageType] = useState<'sparkler' | 'pot' | 'chakkar' | 'bomb' | 'kids' | 'garland' | 'rocket'>('sparkler');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Search states
  const [productSearch, setProductSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Helper to generate deterministic SKU codes (matching frontend codes)
  const getProductCode = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const codeNum = 1100 + Math.abs(hash % 900);
    return `10${codeNum % 100}`;
  };

  // Clean form values
  const resetForm = () => {
    setName('');
    setUnit('Pkt');
    setActualPrice('');
    setDiscountPrice('');
    setImageType('sparkler');
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Create or Update Product
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('unit', unit);
      formData.append('actualPrice', actualPrice);
      formData.append('discountPrice', discountPrice);
      formData.append('imageType', imageType);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = isEditing
        ? `http://localhost:5000/api/products/${editingId}`
        : 'http://localhost:5000/api/products';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
        resetForm();
        refreshProducts();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch {
      setError('Connection error. Could not reach backend server.');
    } finally {
      setSubmitting(false);
    }
  };

  // Populate form for editing
  const handleEditClick = (product: Product) => {
    setIsEditing(true);
    setShowAddForm(true);
    setEditingId(product.id);
    setName(product.name);
    setUnit(product.unit);
    setActualPrice(product.actualPrice.toString());
    setDiscountPrice(product.discountPrice.toString());
    setImageType(product.imageType);
    setImagePreview(product.imageUrl || null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMessage('Product deleted successfully!');
        refreshProducts();
      } else {
        const data = await response.json();
        setError(data.message || 'Deletion failed');
      }
    } catch {
      setError('Connection error. Could not reach backend server.');
    }
  };

  // Filter list
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <div>
          <h3 className="text-xl font-bold font-poppins text-dark-navy">Products Catalog</h3>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">{products.length} products total</p>
        </div>

        <button
          onClick={() => {
            setIsEditing(false);
            setShowAddForm(!showAddForm);
            if (showAddForm) resetForm();
          }}
          className="bg-[#E51E25] hover:bg-[#c4151b] hover:shadow-md text-white font-bold text-sm font-poppins rounded-[14px] px-5 py-3 flex items-center gap-2 transition-all cursor-pointer border-0 outline-none"
        >
          <span>{showAddForm ? '✕ Close Panel' : '+ Add Product'}</span>
        </button>
      </div>

      {/* Add Product Collapsible Panel */}
      {showAddForm && (
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm transition-all duration-300 animate-slide-up">
          <h4 className="text-lg font-bold font-poppins text-dark-navy mb-4 pb-2 border-b border-gray-100">
            {isEditing ? 'Edit Product File' : 'Register New Cracker Product'}
          </h4>
          <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-medium">
            {/* Fields */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Flower pot delux"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="p-3.5 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category Icon *</label>
                <select
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value as 'sparkler' | 'pot' | 'chakkar' | 'bomb' | 'kids' | 'garland' | 'rocket')}
                  className="p-3.5 border border-gray-200 rounded-[12px] bg-white text-dark-navy outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="sparkler">Sparkler</option>
                  <option value="pot">Flower Pot</option>
                  <option value="chakkar">Chakkar</option>
                  <option value="bomb">Bomb</option>
                  <option value="kids">Kids Special</option>
                  <option value="garland">Garland</option>
                  <option value="rocket">Rocket</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">MRP Value (₹) *</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={actualPrice}
                  onChange={(e) => setActualPrice(e.target.value)}
                  required
                  min="0"
                  className="p-3.5 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sale Price (₹) *</label>
                <input
                  type="number"
                  placeholder="200"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  required
                  min="0"
                  className="p-3.5 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Packaging Unit *</label>
                <input
                  type="text"
                  placeholder="e.g. 10 Pcs, Box, Pkt"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  className="p-3.5 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-1 flex flex-col gap-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Image File</label>
              <div className="border-2 border-dashed border-gray-200 hover:border-violet-400 rounded-[14px] p-4 flex flex-col items-center justify-center text-center bg-gray-50/30 cursor-pointer min-h-[140px] relative transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!isEditing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-contain rounded-lg bg-white border border-gray-100" />
                ) : (
                  <div className="text-gray-400">
                    <span className="text-2xl font-bold">+</span>
                    <p className="text-xs mt-1 font-semibold">Upload Photo</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3.5 mt-auto">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-grow py-3 rounded-[12px] text-white font-bold text-sm font-poppins transition-all shadow-sm border-0 outline-none cursor-pointer ${
                    submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
                  }`}
                >
                  {submitting ? 'Saving...' : isEditing ? 'Update File' : 'Register Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-dark-navy font-bold rounded-[12px] cursor-pointer transition-all text-sm outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Products Table Catalog */}
      <div className="bg-white border border-gray-150 rounded-[20px] shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col select-none">
        {/* Internal Search Bar */}
        <div className="p-5 border-b border-gray-100 bg-[#0B2559]/5 flex items-center gap-3">
          <div className="relative flex-grow max-w-lg">
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-[12px] text-sm bg-white text-dark-navy outline-none focus:border-violet-500 font-inter font-semibold"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#5B729E]/10 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <th className="py-4.5 px-6">SKU</th>
                <th className="py-4.5">Product</th>
                <th className="py-4.5">Category</th>
                <th className="py-4.5">Price</th>
                <th className="py-4.5">Net Rate</th>
                <th className="py-4.5 text-center">Discount</th>
                <th className="py-4.5 text-center">Stock</th>
                <th className="py-4.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/40 transition-colors">
                  {/* SKU */}
                  <td className="py-4.5 px-6 text-gray-400 font-semibold font-inter">
                    {getProductCode(product.id)}
                  </td>
                  {/* Product Image & Info */}
                  <td className="py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border border-gray-100 rounded-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="scale-80">
                            <ProductImage type={product.imageType} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-dark-navy truncate leading-snug">
                          {product.name.replace(/\s*\([^)]+\)/g, '')}
                        </p>
                        <p className="text-[11px] text-gray-400 font-bold mt-0.5 capitalize">{product.unit || '10 Pcs'}</p>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="py-4.5 font-semibold text-gray-400 capitalize">
                    {product.imageType === 'pot' ? 'Flower Pot' :
                     product.imageType === 'chakkar' ? 'Ground Chakkar' :
                     product.imageType === 'bomb' ? 'Sound Bomb' :
                     product.imageType === 'kids' ? 'Kids Special' :
                     product.imageType === 'garland' ? 'Garlands' :
                     product.imageType === 'rocket' ? 'SkyShot' : 'Sparkler'}
                  </td>
                  {/* Price */}
                  <td className="py-4.5 font-poppins font-extrabold text-[#E51E25] text-base">
                    ₹{product.discountPrice}
                  </td>
                  {/* Net Rate */}
                  <td className="py-4.5 font-poppins font-bold text-blue-650 text-sm text-[#0B2559]/80">
                    ₹{product.actualPrice}
                  </td>
                  {/* Discount */}
                  <td className="py-4.5 text-center">
                    <span className="w-4 h-4 rounded-full border border-[#E51E25] flex items-center justify-center mx-auto text-[8px] text-[#E51E25] font-bold">
                      80%
                    </span>
                  </td>
                  {/* Stock */}
                  <td className="py-4.5 text-center font-bold text-gray-500 font-inter">
                    {100 - (product.id.charCodeAt(0) % 50)}
                  </td>
                  {/* Actions */}
                  <td className="py-4.5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-gray-400 hover:text-dark-navy cursor-pointer bg-transparent border-0 outline-none"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-0 outline-none"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
