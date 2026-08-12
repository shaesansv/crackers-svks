import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, FolderTree, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar"; 
import AdminNavbar from "@/components/layout/AdminNavbar"; 
import { getCategories, getProducts, API_BASE_URL } from "@/lib/api";
import type { Category } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", image: "" });
    setDialogOpen(true);
  };

  const loadCategoriesWithCounts = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ]);

      const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];
      const safeProducts = Array.isArray(productsData) ? productsData : [];

      // Count products per category
      const productCountByCategory = safeProducts.reduce((acc: Record<string, number>, product: any) => {
        const categoryId = (product.category && typeof product.category === 'object') 
          ? (product.category._id || product.category.id) 
          : product.category;
          
        if (categoryId) {
          acc[categoryId] = (acc[categoryId] || 0) + 1;
        }
        return acc;
      }, {});

      // Map categories with calculated product counts
      const categoriesWithCounts = safeCategories.map((c: any) => ({
        id: c._id || c.id || c.slug,
        name: c.name,
        categoryCode: c.categoryCode || 'N/A',
        productCount: productCountByCategory[c._id || c.id || c.slug] || 0,
        image: c.image || ''
      }));

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
    setDialogOpen(true);
  };

  const openDelete = (cat: Category) => {
    setDeleting(cat);
    setDeleteOpen(true);
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
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Category Image (Max 5MB, optional)</Label>
                  <div
                    className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#4FC0D0] rounded-xl p-4 cursor-pointer hover:bg-cyan-50/50 transition-colors group"
                    onClick={() => document.getElementById('category-image-input')?.click()}
                  >
                    <input
                      id="category-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    {imageFile ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-semibold text-gray-700 truncate max-w-[180px]">{imageFile.name}</span>
                          <span className="text-xs text-gray-400">{(imageFile.size / 1024).toFixed(1)} KB</span>
                          <span className="text-xs text-[#164B60] font-medium mt-0.5">✓ Image selected</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImageFile(null); }}
                          className="ml-auto text-red-400 hover:text-red-600 text-lg font-bold transition-colors"
                          title="Remove image"
                        >✕</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 py-2">
                        <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🖼️</div>
                        <span className="text-sm font-semibold text-[#164B60]">Click to upload image</span>
                        <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</span>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>Are you sure you want to delete "{deleting?.name}"? This action cannot be undone.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="flex items-center gap-2">
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </>
  );
};

export default AdminCategories;
