import React, { useState } from 'react';
import type { Product, Category } from '../AdminDashboard';
import { ProductImage } from '../../components/ProductImage';

interface CategoriesProps {
  categories: Category[];
  products: Product[];
  token: string | null;
  refreshCategories: () => void;
  setMessage: (m: string) => void;
  setError: (e: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  products,
  token,
  refreshCategories,
  setMessage,
  setError
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUid, setEditingUid] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName('');
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditingUid(null);
    setShowForm(false);
  };

  const handleEditClick = (cat: Category) => {
    setName(cat.name);
    setImageFile(null);
    setImagePreview(cat.imageUrl || null);
    setIsEditing(true);
    setEditingUid(cat.uid || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = isEditing
        ? `http://localhost:5000/api/categories/${editingUid}`
        : 'http://localhost:5000/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type; browser handles boundary automatically
        },
        body: formData
      });

      if (response.ok) {
        setMessage(isEditing ? 'Category updated successfully!' : 'Category created successfully!');
        resetForm();
        refreshCategories();
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to save category.');
      }
    } catch {
      setError('Connection error. Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (cat: Category) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${cat.uid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('Category deleted successfully!');
        refreshCategories();
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to delete category.');
      }
    } catch {
      setError('Connection error. Failed to delete category.');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center select-none">
        <div>
          <h3 className="text-xl font-bold font-poppins text-dark-navy">Categories</h3>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">{categories.length} categories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-[#E51E25] hover:bg-[#c4151b] text-white font-bold text-sm font-poppins rounded-[14px] px-5 py-3 transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5"
        >
          <span>+ New Category</span>
        </button>
      </div>

      {/* Category Add/Edit Form Modal */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm max-w-xl animate-fade-in select-none">
          <h4 className="text-lg font-bold font-poppins text-dark-navy mb-4 border-b border-gray-100 pb-2">
            {isEditing ? 'Edit Category' : 'Create New Category'}
          </h4>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm font-medium">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category Name *</label>
              <input
                type="text"
                placeholder="e.g. Flower Pot"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-3 border border-gray-200 rounded-[12px] bg-gray-50/30 text-dark-navy outline-none focus:border-violet-500"
              />
            </div>

            {/* Drag & Drop Image Area */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category Image Representation</label>
              <div className="flex items-center gap-4">
                <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[18px] p-6 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-all group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-violet-500 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2.5 2.5 0 013.536 0L17 18m-2-2l2.586-2.586a2.5 2.5 0 013.536 0L21 14m-9-4h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-bold text-gray-500">Upload Category Image</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG up to 5MB</span>
                </label>

                {imagePreview && (
                  <div className="w-24 h-24 rounded-[18px] overflow-hidden border border-gray-200 shadow-sm relative group flex-shrink-0 bg-white">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none outline-none cursor-pointer text-white text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm font-poppins rounded-[12px] px-6 py-3 shadow-sm transition-all border-none outline-none cursor-pointer"
              >
                {submitting ? 'Saving...' : 'Save Category'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm font-poppins rounded-[12px] px-6 py-3 transition-all border-none outline-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category List Table matches user screenshot */}
      <div className="bg-white border border-gray-150 rounded-[20px] shadow-sm overflow-hidden select-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#5B729E]/10 border-b border-gray-250 text-xs font-bold text-gray-500 uppercase tracking-wide">
              <th className="py-4.5 px-6">Code</th>
              <th className="py-4.5">Name</th>
              <th className="py-4.5">Products</th>
              <th className="py-4.5">Image</th>
              <th className="py-4.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
            {categories.map((cat) => {
              const productsCount = products.filter((p) => p.imageType === cat.imageType || p.imageType === cat.id).length;
              return (
                <tr key={cat.uid || cat.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 px-6">
                    <span className="border border-gray-200 rounded-[8px] px-3.5 py-1 text-xs font-bold text-gray-400 font-inter bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                      {cat.code}
                    </span>
                  </td>
                  <td className="py-4 text-dark-navy font-bold font-poppins text-[15px]">{cat.name}</td>
                  <td className="py-4 text-gray-500 font-inter font-semibold">{productsCount}</td>
                  <td className="py-4">
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center bg-gray-50">
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="scale-75">
                          <ProductImage type={cat.imageType as 'sparkler' | 'pot' | 'chakkar' | 'bomb' | 'kids' | 'garland' | 'rocket'} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-dark-navy cursor-pointer transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat)}
                        className="w-9 h-9 rounded-full bg-red-500 shadow-sm flex items-center justify-center text-white hover:bg-red-600 cursor-pointer transition-all border-none"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
