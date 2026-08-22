import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, FolderTree, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar"; 
import AdminNavbar from "@/components/layout/AdminNavbar"; 
import { getCategories, getProducts, API_BASE_URL } from "@/lib/api";
import type { Category } from "@/data/products";
import { processAndResizeImage, CATEGORY_IMAGE_DIMENSIONS, type ProcessedImageResult } from "@/lib/imageUtils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const AdminCategories = () => {
  const { token } = useAuth();
  const [cats, setCats] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", image: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageMeta, setImageMeta] = useState<ProcessedImageResult | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", image: "" });
    setImageFile(null);
    setImageMeta(null);
    setDialogOpen(true);
  };

  const loadCategoriesWithCounts = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ]);

      const safeCategories = Array.isArray(categoriesData)
        ? categoriesData
        : (categoriesData && Array.isArray((categoriesData as any).categories) ? (categoriesData as any).categories : []);

      const safeProducts = Array.isArray(productsData)
        ? productsData
        : (productsData && Array.isArray((productsData as any).products) ? (productsData as any).products : []);

      // Count products per category with robust multi-key matching
      const productCountByCategory: Record<string, number> = {};

      safeProducts.forEach((product: any) => {
        if (!product.category) return;

        const catObj = typeof product.category === 'object' ? product.category : null;
        const catStr = typeof product.category === 'string' ? product.category : String(product.category);

        const productCatKeys = [
          catObj?._id,
          catObj?.id,
          catObj?.slug,
          catObj?.name?.toLowerCase(),
          catStr,
          catStr?.toLowerCase()
        ].filter(Boolean);

        const matchedCat = safeCategories.find((c: any) => {
          const categoryKeys = [
            c._id,
            c.id,
            c.slug,
            c.name?.toLowerCase()
          ].filter(Boolean);

          return productCatKeys.some((pKey) => categoryKeys.includes(pKey));
        });

        if (matchedCat) {
          const key = matchedCat._id || matchedCat.id || matchedCat.slug;
          productCountByCategory[key] = (productCountByCategory[key] || 0) + 1;
        }
      });

      // Map categories with calculated product counts
      const categoriesWithCounts = safeCategories.map((c: any) => {
        const catKey = c._id || c.id || c.slug;
        return {
          id: catKey,
          name: c.name,
          categoryCode: c.categoryCode || 'N/A',
          productCount: productCountByCategory[catKey] || 0,
          image: c.image || ''
        };
      });

      setCats(categoriesWithCounts);
    } catch (err) {
      console.error('Failed to load categories and products:', err);
      setCats([]);
    }
  };

  useEffect(() => {
    loadCategoriesWithCounts();
  }, []);

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, image: cat.image || "" });
    setImageFile(null);
    setImageMeta(null);
    setDialogOpen(true);
  };

  const openDelete = (cat: Category) => {
    setDeleting(cat);
    setDeleteOpen(true);
  };

  const handleCategoryFileChange = async (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setImageMeta(null);
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image must be less than 5MB');
      return;
    }
    try {
      setIsProcessingImage(true);
      const result = await processAndResizeImage(
        file,
        CATEGORY_IMAGE_DIMENSIONS.width,
        CATEGORY_IMAGE_DIMENSIONS.height
      );
      setImageFile(result.file);
      setImageMeta(result);
      toast.success(`Category image adjusted to ${CATEGORY_IMAGE_DIMENSIONS.label}`);
    } catch (err) {
      console.error('Image processing error:', err);
      setImageFile(file);
      setImageMeta(null);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const fd = new FormData();
    fd.append('name', form.name);
    if (imageFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        toast.error('Image must be less than 5MB');
        return;
      }
      fd.append('image', imageFile);
    }

    setIsSaving(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (editing) {
        console.log('Updating category:', editing.id);
        const res = await fetch(`${API_BASE_URL}/api/categories/${editing.id}`, {
          method: 'PUT',
          body: fd,
          headers,
          credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
          const errorMsg = data.error?.message || data.error || 'Update failed';
          console.error('Update failed:', res.status, errorMsg);
          throw new Error(errorMsg);
        }

        const updated = {
          id: data.category._id || data.category.id || data.category.slug,
          name: data.category.name,
          productCount: cats.find(c => c.id === (data.category._id || data.category.id || data.category.slug))?.productCount || 0,
          image: data.category.image || '',
        };
        setCats((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
        toast.success('Category updated');

        // Refresh data from server to ensure consistency
        setTimeout(() => {
          loadCategoriesWithCounts();
        }, 500);
      } else {
        console.log('Creating new category');
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
          method: 'POST',
          body: fd,
          headers,
          credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
          const errorMsg = data.error?.message || data.error || 'Create failed';
          console.error('Create failed:', res.status, errorMsg);
          throw new Error(errorMsg);
        }

        const created = {
          id: data.category._id || data.category.id || data.category.slug,
          name: data.category.name,
          categoryCode: data.category.categoryCode || 'N/A',
          productCount: 0,
          image: data.category.image || '',
        };
        setCats((prev) => [...prev, created]);
        toast.success('Category created');

        // Refresh data from server to ensure consistency
        setTimeout(() => {
          loadCategoriesWithCounts();
        }, 500);
      }
      setDialogOpen(false);
      setForm({ name: '', image: '' });
      setImageFile(null);
    } catch (err) {
      console.error('Save error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Save failed';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    setIsDeleting(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('Deleting category:', deleting.id);
      const res = await fetch(`${API_BASE_URL}/api/categories/${deleting.id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        // Handle specific business rule error
        const errorMsg = data.error?.message || data.error || 'Delete failed';
        if (res.status === 400 && errorMsg.includes('products')) {
          throw new Error('Cannot delete: This category contains products. Please delete or move them first.');
        }
        throw new Error(errorMsg);
      }

      setCats((prev) => prev.filter((c) => c.id !== deleting.id));
      toast.success(`"${deleting.name}" deleted successfully`);
      setDeleteOpen(false);
      setDeleting(null);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                <FolderTree className="h-6 w-6 text-primary" /> Categories
              </h1>
              <p className="text-sm text-muted-foreground">{cats.length} categories</p>
            </div>
            <Button onClick={openCreate} className="gap-2 bg-[#A2FF86] hover:bg-[#8be371] text-[#164B60] font-bold shadow-md hover:shadow-lg transition-all duration-200">
              <Plus className="h-4 w-4" /> New Category
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cats.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-mono text-xs bg-white text-black border px-2 rounded w-min mt-2 inline-block ml-3">{cat.categoryCode}</TableCell>
                    <TableCell className="font-semibold">{cat.name}</TableCell>
                    <TableCell>{cat.productCount}</TableCell>
                    <TableCell>
                      <img src={cat.image} alt={cat.name} className="w-16 h-10 rounded object-cover" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDelete(cat)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Create / Edit Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="p-0 overflow-hidden bg-white max-w-md">
              {/* Green Header Banner */}
              <div className="bg-[#164B60] px-6 py-4">
                <DialogHeader>
                  <DialogTitle className="text-white font-bold text-lg">
                    {editing ? "Edit Category" : "New Category"}
                  </DialogTitle>
                  <DialogDescription className="text-cyan-100 text-sm mt-0.5">
                    {editing ? "Update the category details below." : "Fill in the details to add a new category."}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* White Form Body */}
              <div className="space-y-5 p-6 bg-white text-gray-800">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Category Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Fancy Lights"
                    className="border-gray-300 focus:border-[#4FC0D0] focus:ring-[#4FC0D0]"
                  />
                </div>

                {/* Styled Image Upload */}
                <div className="space-y-2">
                  {/* Dimension Notice Mentioned ON TOP of Upload Button */}
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-700 font-semibold">Category Image (Max 5MB, optional)</Label>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Proper Dimension: {CATEGORY_IMAGE_DIMENSIONS.label}
                    </span>
                  </div>

                  <div className="bg-emerald-50/90 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-900 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📐</span>
                      <div>
                        <p className="font-bold text-[#164B60]">Recommended Dimension: {CATEGORY_IMAGE_DIMENSIONS.label}</p>
                        <p className="text-[11px] text-emerald-700">Aspect Ratio: {CATEGORY_IMAGE_DIMENSIONS.aspectRatio} &bull; Auto-resized on upload</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-700 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {CATEGORY_IMAGE_DIMENSIONS.width}x{CATEGORY_IMAGE_DIMENSIONS.height}
                    </span>
                  </div>

                  <div
                    className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#4FC0D0] rounded-xl p-4 cursor-pointer hover:bg-cyan-50/50 transition-colors group relative"
                    onClick={() => document.getElementById('category-image-input')?.click()}
                  >
                    <input
                      id="category-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleCategoryFileChange(file);
                      }}
                    />
                    {isProcessingImage ? (
                      <div className="flex items-center gap-2 py-4 text-xs font-medium text-cyan-700">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing & adjusting image to {CATEGORY_IMAGE_DIMENSIONS.label}...
                      </div>
                    ) : imageFile ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={imageMeta?.previewUrl || URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-semibold text-gray-700 truncate max-w-[180px]">{imageFile.name}</span>
                          <span className="text-xs text-gray-400">{(imageFile.size / 1024).toFixed(1)} KB</span>
                          {imageMeta ? (
                            <span className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                              ✓ Dimensions set: {imageMeta.width} × {imageMeta.height} px
                              <span className="text-[10px] text-gray-400 font-normal">
                                ({imageMeta.originalWidth}×{imageMeta.originalHeight})
                              </span>
                            </span>
                          ) : (
                            <span className="text-xs text-[#164B60] font-medium mt-0.5">✓ Image selected</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImageMeta(null);
                          }}
                          className="ml-auto text-red-400 hover:text-red-600 text-lg font-bold transition-colors"
                          title="Remove image"
                        >✕</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 py-2">
                        <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🖼️</div>
                        <span className="text-sm font-semibold text-[#164B60]">Click to upload category image</span>
                        <span className="text-xs text-gray-500 font-medium">
                          Dimension: <strong>{CATEGORY_IMAGE_DIMENSIONS.label}</strong> (PNG, JPG, WEBP)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={() => setDialogOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-[#A2FF86] hover:bg-[#8be371] text-[#164B60] font-bold shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={handleSave}
                    disabled={isSaving || !form.name.trim()}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {editing ? "Saving..." : "Creating..."}
                      </>
                    ) : (
                      editing ? "Save Changes" : "Create Category"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <Dialog open={deleteOpen} onOpenChange={(open) => { if (!isDeleting) setDeleteOpen(open); }}>
            <DialogContent className="p-0 overflow-hidden bg-white max-w-md border border-gray-200 shadow-2xl rounded-xl">
              {/* Red Header Banner */}
              <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  ⚠️
                </div>
                <DialogHeader className="text-left">
                  <DialogTitle className="text-white font-bold text-lg">Delete Category</DialogTitle>
                  <DialogDescription className="text-red-100 text-xs mt-0.5">
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* White Body Content */}
              <div className="p-6 bg-white space-y-4 text-gray-800">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Are you sure you want to delete <strong className="text-gray-900 font-semibold">"{deleting?.name}"</strong>?
                </p>

                {/* Info Note */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                  <span className="text-base leading-none">💡</span>
                  <span>Categories containing products cannot be deleted until products are reassigned or removed first.</span>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Category"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </>
  );
};

export default AdminCategories;
