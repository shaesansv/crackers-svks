import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { SafetyTips } from './pages/SafetyTips';
import { ContactUs } from './pages/ContactUs';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import './App.css';
import type { Product, Category } from './types';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from 'sonner';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminContent from './pages/admin/AdminContent';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('adminToken');
  
  if (!isAuthenticated && !token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<{
    minOrderValue?: number;
    merchantPhone?: string;
    storeAddress?: string;
  } | null>(null);
  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/public/info');
      if (response.ok) {
        const settingsData = await response.json();
        setSettings({
          minOrderValue: settingsData.minimumPurchaseAmount,
          merchantPhone: settingsData.contact?.phone,
          storeAddress: settingsData.contact?.address,
        });
        return settingsData.discountPercent ?? 0;
      }
    } catch (err) {
      console.log('Failed to fetch settings from backend', err);
    }
    return 0;
  };

  const fetchProductsAndCategories = async () => {
    try {
      // Fetch settings FIRST so we have global discount % before mapping products
      const discPct = await fetchSettings();

      const catResponse = await fetch('http://localhost:5000/api/categories?limit=1000');
      let categoriesData: Category[] = [];
      if (catResponse.ok) {
        const catsJson = await catResponse.json();
        const rawCats = Array.isArray(catsJson) ? catsJson : [];
        categoriesData = rawCats.map((c: any) => ({
          ...c,
          id: c._id || c.id || c.slug,
        }));
      }

      const prodResponse = await fetch('http://localhost:5000/api/products?limit=1000');
      let productsData: Product[] = [];
      if (prodResponse.ok) {
        const resJson = await prodResponse.json();
        const rawProducts = Array.isArray(resJson) ? resJson : (resJson && Array.isArray(resJson.products) ? resJson.products : []);
        productsData = rawProducts.map((p: any) => {
          const retailPrice = Number(p.price) || 0;
          const pNetRate = Number(p.netRate) || 0;

          // Pricing Mode Rule:
          // Either "Display Net-Rate on Shop" OR "Has Discount" must be active.
          // Display Net-Rate is valid ONLY if displayNetRate flag is true AND netRate > 0.
          const pDisplayNetRate = !!p.displayNetRate && pNetRate > 0;
          const pHasDiscount = !pDisplayNetRate; // If not Display Net-Rate, then Has Discount is active!

          let discountPrice: number;
          let appliedGlobalDiscount = false;

          if (pDisplayNetRate) {
            // Mode: Display Net-Rate on Shop -> NO discount calculation, display netRate directly
            discountPrice = pNetRate;
          } else {
            // Mode: Has Discount -> Calculate discount using Content page discountPercent
            if (discPct > 0 && retailPrice > 0) {
              discountPrice = Math.round(retailPrice * (1 - discPct / 100) * 100) / 100;
              appliedGlobalDiscount = true;
            } else {
              discountPrice = retailPrice;
            }
          }

          return {
            ...p,
            id: p._id || p.id,
            price: retailPrice,
            actualPrice: retailPrice,
            discountPrice,
            netRate: pNetRate,
            hasDiscount: pHasDiscount,
            displayNetRate: pDisplayNetRate,
            appliedGlobalDiscount,
            globalDiscountPct: pHasDiscount ? discPct : 0,
            unit: p.unit || 'box',
            stock: p.storeStockPieces ?? p.stock ?? 0,
            imageType: p.imageType || (p.category && typeof p.category === 'object' ? p.category.icon : 'sparkler')
          };
        });
        setDbProducts(productsData);
      }

      if (categoriesData.length > 0) {
        const grouped = categoriesData.map((cat) => {
          const catId = cat.id;
          const matched = productsData.filter((p) => {
            const pCatId = (p.category && typeof p.category === 'object') ? (p.category._id || p.category.id) : p.category;
            return pCatId === catId;
          });
          return {
            ...cat,
            products: matched
          };
        });
        setCategories(grouped.filter(cat => cat.products.length > 0));
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.log('Backend connection failed', err);
    }
  };

  React.useEffect(() => {
    fetchProductsAndCategories();

    // Refresh storefront data (incl. discount %) whenever the user returns to this tab/window
    // (e.g. after editing products or content settings in the admin panel)
    const handleFocus = () => {
      fetchProductsAndCategories();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  React.useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/admin')) {
        return;
      }
      
      if (hash === '#safety') {
        setCurrentPage('safety');
      } else if (hash === '#contact') {
        setCurrentPage('contact');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  React.useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) {
      return;
    }
    if (currentPage === 'home') {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    } else if (currentPage === 'safety') {
      if (window.location.hash !== '#safety') {
        window.history.pushState(null, '', '/#safety');
      }
    } else if (currentPage === 'contact') {
      if (window.location.hash !== '#contact') {
        window.history.pushState(null, '', '/#contact');
      }
    }
  }, [currentPage]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleQtyChange = (productId: string, value: string) => {
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty <= 0) {
      setQuantities((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } else {
      setQuantities((prev) => ({
        ...prev,
        [productId]: qty
      }));
    }
  };

  const adjustQty = (productId: string, increment: boolean) => {
    const current = quantities[productId] || 0;
    const next = increment ? current + 1 : current - 1;
    if (next <= 0) {
      setQuantities((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } else {
      setQuantities((prev) => ({
        ...prev,
        [productId]: next
      }));
    }
  };

  const removeFromCart = (productId: string) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const allProducts = categories.flatMap((cat) => cat.products);
  let totalItems = 0;
  let totalDiscountedCost = 0;

  const cartItems = Object.entries(quantities)
    .map(([productId, qty]) => {
      const product = allProducts.find((p) => p.id === productId);
      return product ? { product, qty } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  cartItems.forEach(({ product, qty }) => {
    totalItems += qty;
    totalDiscountedCost += product.discountPrice * qty;
  });

  Object.entries(quantities).forEach(([productId, qty]) => {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      totalItems += qty;
      totalDiscountedCost += product.discountPrice * qty;
    }
  });

  // Deduplicate totals (cartItems already computed above)
  totalItems = cartItems.reduce((s, { qty }) => s + qty, 0);
  totalDiscountedCost = cartItems.reduce((s, { product, qty }) => s + product.discountPrice * qty, 0);

  return (
    <Routes>
      {/* Admin Panel Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute>
          <AdminProducts />
        </ProtectedRoute>
      } />
      <Route path="/admin/categories" element={
        <ProtectedRoute>
          <AdminCategories />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute>
          <AdminOrders />
        </ProtectedRoute>
      } />
      <Route path="/admin/customers" element={
        <ProtectedRoute>
          <AdminCustomers />
        </ProtectedRoute>
      } />
      <Route path="/admin/inventory" element={
        <ProtectedRoute>
          <AdminInventory />
        </ProtectedRoute>
      } />
      <Route path="/admin/content" element={
        <ProtectedRoute>
          <AdminContent />
        </ProtectedRoute>
      } />


      {/* Main Storefront Route */}
      <Route path="/*" element={
        <div className="w-full bg-white flex flex-col min-h-screen">
          <Navbar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            cartCount={totalItems}
            cartTotal={totalDiscountedCost}
            onCartOpen={() => setIsCartOpen(true)}
          />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onQtyChange={adjustQty}
            onRemove={removeFromCart}
            onCheckout={() => {
              setCurrentPage('home');
              setTimeout(() => {
                document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            settings={settings}
          />

          {(currentPage === 'home' || currentPage === 'order') ? (
            <Home
              quantities={quantities}
              handleQtyChange={handleQtyChange}
              adjustQty={adjustQty}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              cartCount={totalItems}
              cartTotal={totalDiscountedCost}
              categories={categories}
            />
          ) : currentPage === 'safety' ? (
            <SafetyTips />
          ) : currentPage === 'contact' ? (
            <ContactUs />
          ) : (
            <About />
          )}

          <Footer
            showCheckout={currentPage === 'home' || currentPage === 'order'}
            quantities={quantities}
            setCurrentPage={setCurrentPage}
            products={dbProducts}
            settings={settings}
          />
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <SettingsProvider>
        <AuthProvider>
          <AppContent />
          <Toaster richColors position="top-right" closeButton />
        </AuthProvider>
      </SettingsProvider>
    </SiteSettingsProvider>
  );
}

export default App;
