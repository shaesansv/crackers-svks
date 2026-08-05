import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { SafetyTips } from './pages/SafetyTips';
import { ContactUs } from './pages/ContactUs';
import { Footer } from './components/Footer';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import './App.css';
import type { Product, Category } from './types';

function App() {
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
      const response = await fetch('http://localhost:5000/api/settings');
      if (response.ok) {
        const settingsData = await response.json();
        setSettings(settingsData);
      }
    } catch (err) {
      console.log('Failed to fetch settings from backend', err);
    }
  };

  const fetchProductsAndCategories = async () => {
    try {
      // 1. Fetch Categories
      const catResponse = await fetch('http://localhost:5000/api/categories');
      let categoriesData: Category[] = [];
      if (catResponse.ok) {
        categoriesData = await catResponse.json();
      }

      // 2. Fetch Products
      const prodResponse = await fetch('http://localhost:5000/api/products');
      let productsData: Product[] = [];
      if (prodResponse.ok) {
        productsData = await prodResponse.json();
        setDbProducts(productsData);
      }

      // Group products dynamically
      if (categoriesData.length > 0) {
        const grouped = categoriesData.map((cat) => {
          const matched = productsData.filter((p) => p.imageType === cat.imageType || p.imageType === cat.id);
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
    setTimeout(() => {
      fetchSettings();
      fetchProductsAndCategories();
    }, 0);
  }, []);

  // Synchronize state with history path/hash
  React.useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path === '/admin' || path === '/admin/') {
        setCurrentPage('admin-login');
      } else if (hash === '#safety') {
        setCurrentPage('safety');
      } else if (hash === '#contact') {
        setCurrentPage('contact');
      } else if (hash === '#admin' || hash === '#admin-login') {
        const token = localStorage.getItem('adminToken');
        setCurrentPage(token ? 'admin-dashboard' : 'admin-login');
      } else if (hash === '#admin-dashboard') {
        const token = localStorage.getItem('adminToken');
        setCurrentPage(token ? 'admin-dashboard' : 'admin-login');
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

  // Sync state changes back to URL path/hash
  React.useEffect(() => {
    if (currentPage === 'admin-login' || currentPage === 'admin-dashboard') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else if (currentPage === 'home') {
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

  const allProducts = categories.flatMap((cat) => cat.products);
  let totalItems = 0;
  let totalDiscountedCost = 0;

  Object.entries(quantities).forEach(([productId, qty]) => {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      totalItems += qty;
      totalDiscountedCost += product.discountPrice * qty;
    }
  });

  const isAdminPage = currentPage === 'admin-login' || currentPage === 'admin-dashboard';

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* Global Navbar */}
      {!isAdminPage && (
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
        />
      )}

      {/* Conditionally Render Pages */}
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
      ) : currentPage === 'admin-login' ? (
        <AdminLogin setCurrentPage={setCurrentPage} />
      ) : currentPage === 'admin-dashboard' ? (
        <AdminDashboard 
          setCurrentPage={setCurrentPage}
          products={dbProducts}
          refreshProducts={fetchProductsAndCategories}
        />
      ) : (
        <About />
      )}

      {/* Global Footer & Checkout Section */}
      <Footer
        showCheckout={currentPage === 'home' || currentPage === 'order'}
        quantities={quantities}
        setCurrentPage={setCurrentPage}
        products={dbProducts}
        settings={settings}
      />
    </div>
  );
}

export default App;
