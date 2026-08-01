import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { SafetyTips } from './pages/SafetyTips';
import { ContactUs } from './pages/ContactUs';
import { Footer } from './components/Footer';
import { crackerCategories } from './data/products';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#safety') {
        setCurrentPage('safety');
      } else if (window.location.hash === '#contact') {
        setCurrentPage('contact');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Handle quantity changes globally so they persist between page switches
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

  // Adjust quantities globally
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

  // Compute cart calculations globally for the Navbar display
  const allProducts = crackerCategories.flatMap((cat) => cat.products);
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
          selectedCategory={selectedCategory}
        />
      ) : currentPage === 'safety' ? (
        <SafetyTips />
      ) : currentPage === 'contact' ? (
        <ContactUs />
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
