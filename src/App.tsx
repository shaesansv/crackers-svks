import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { SafetyTips } from './pages/SafetyTips';
import { ContactUs } from './pages/ContactUs';
import { Footer } from './components/Footer';
import { crackerCategories } from './data/products';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import './App.css';

interface Product {
  id: string;
  name: string;
  unit: string;
  actualPrice: number;
  discountPrice: number;
  imageType: 'sparkler' | 'pot' | 'chakkar' | 'bomb' | 'kids' | 'garland' | 'rocket';
  imageUrl?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [categories, setCategories] = useState<any[]>(crackerCategories);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const productsData = await response.json();
        setDbProducts(productsData);
        
        if (productsData && productsData.length > 0) {
          const grouped = crackerCategories.map((staticCat) => {
            const catId = staticCat.id;
            const matched = productsData.filter((product: any) => {
              if (product.id.startsWith('sp') || product.imageType === 'sparkler') return catId === 'sparklers';
              if (product.id.startsWith('fp') || product.imageType === 'pot') return catId === 'flowerpots';
              if (product.id.startsWith('gc') || product.imageType === 'chakkar') return catId === 'chakkars';
              if (product.id.startsWith('bm') || product.imageType === 'bomb') return catId === 'bombs';
              if (product.id.startsWith('kd') || product.imageType === 'kids') return catId === 'kids';
              if (product.id.startsWith('gl') || product.imageType === 'garland') return catId === 'garlands';
              return false;
            });
            
            return {
              ...staticCat,
              products: matched
            };
          });
          setCategories(grouped.filter(cat => cat.products.length > 0));
        } else {
          setCategories(crackerCategories);
        }
      } else {
        setCategories(crackerCategories);
      }
    } catch (err) {
      console.log('Backend connection failed, using static fallback products.', err);
      setCategories(crackerCategories);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#safety') {
        setCurrentPage('safety');
      } else if (window.location.hash === '#contact') {
        setCurrentPage('contact');
      } else if (window.location.hash === '#admin' || window.location.hash === '#admin-login') {
        setCurrentPage('admin-login');
      } else if (window.location.hash === '#admin-dashboard') {
        const token = localStorage.getItem('adminToken');
        setCurrentPage(token ? 'admin-dashboard' : 'admin-login');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={crackerCategories}
        cartCount={totalItems}
        cartTotal={totalDiscountedCost}
      />

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
          refreshProducts={fetchProducts}
        />
      ) : (
        <About />
      )}

      {/* Global Footer & Checkout Section */}
      <Footer
        showCheckout={currentPage === 'home' || currentPage === 'order'}
        quantities={quantities}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default App;
