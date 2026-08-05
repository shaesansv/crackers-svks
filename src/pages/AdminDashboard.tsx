import React, { useState, useEffect } from 'react';
import { Dashboard } from './admin/dashboard';
import { Products } from './admin/products';
import { Categories } from './admin/categories';
import { Orders } from './admin/orders';
import { Customers } from './admin/customers';
import { Settings } from './admin/settings';

import type { Product, Category, Order, Customer } from '../types';
export type { Product, Category, Order, Customer };

interface AdminDashboardProps {
  setCurrentPage: (p: string) => void;
  products: Product[];
  refreshProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setCurrentPage,
  products,
  refreshProducts
}) => {
  const [token] = useState<string | null>(() => localStorage.getItem('adminToken'));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings'>('products');

  // Server state data
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Check login
  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        setCurrentPage('admin-login');
      }, 0);
    }
  }, [token, setCurrentPage]);

  // Fetch orders and customers from backend
  const fetchData = async (authToken: string) => {
    setLoadingOrders(true);
    try {
      // 1. Fetch Orders
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        setOrders(orderData);
      }

      // 2. Fetch Customers
      const customerResponse = await fetch('http://localhost:5000/api/customers', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        setCustomers(customerData);
      }
    } catch (err) {
      console.log('Error fetching admin data:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.log('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        fetchData(token);
        fetchCategories();
      }, 0);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setCurrentPage('home');
  };

  return (
    <div className="flex-grow flex min-h-screen bg-[#F8FAFC]">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-[#0B2559] text-white flex-shrink-0 flex flex-col justify-between select-none">
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-sm bg-[#E51E25]">★</div>
              <span className="font-poppins font-extrabold text-lg uppercase tracking-wider text-white">Admin Panel</span>
            </div>
            <span className="text-white/60 cursor-pointer hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </span>
          </div>

          {/* Back to store */}
          <div className="px-6 py-4 border-b border-white/5">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors bg-transparent border-none cursor-pointer outline-none"
            >
              <span>←</span> Back to Store
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-2 font-poppins font-semibold text-sm">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              ) },
              { id: 'products', label: 'Products', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              ) },
              { id: 'categories', label: 'Categories', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              ) },
              { id: 'orders', label: 'Orders', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              ) },
              { id: 'customers', label: 'Customers', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) },
              { id: 'settings', label: 'Settings', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ) }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings');
                  setError('');
                  setMessage('');
                }}
                className={`w-full py-3 px-4 rounded-[12px] flex items-center gap-3 transition-all text-left outline-none border-none cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#E51E25] text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-white/5 text-xs text-white/50 text-center font-medium">
          <p>© Sarguru Traders</p>
          <button onClick={handleLogout} className="mt-2 text-red-400 hover:text-red-300 font-bold bg-transparent border-none cursor-pointer outline-none">Sign Out</button>
        </div>
      </aside>

      {/* ================= RIGHT MAIN PANEL ================= */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 py-5 px-8 flex items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.01)] select-none">
          <div className="flex items-center gap-2 text-dark-navy">
            <h2 className="text-xl font-extrabold font-poppins capitalize">
              {activeTab === 'settings' ? 'Content Settings' : activeTab}
            </h2>
          </div>
          
          {/* Notifications display */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            {loadingOrders && (
              <span className="text-violet-600 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-600 animate-ping"></span>
                Synchronizing Database...
              </span>
            )}
            <span>Admin</span>
          </div>
        </header>

        {/* Panel Content Scroll Container */}
        <div className="flex-grow p-8 overflow-y-auto">
          
          {/* Tab notification alerts */}
          {message && (
            <div className="mb-6 p-4 rounded-[14px] bg-green-50 border border-green-100 text-green-700 text-sm font-bold text-center animate-fade-in">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-[14px] bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center animate-fade-in">
              {error}
            </div>
          )}

          {/* Render Active Tab */}
          {activeTab === 'dashboard' && (
            <Dashboard orders={orders} products={products} customers={customers} />
          )}

          {activeTab === 'products' && (
            <Products
              products={products}
              token={token}
              refreshProducts={refreshProducts}
              setMessage={setMessage}
              setError={setError}
            />
          )}

          {activeTab === 'categories' && (
            <Categories
              categories={categories}
              products={products}
              token={token}
              refreshCategories={fetchCategories}
              setMessage={setMessage}
              setError={setError}
            />
          )}

          {activeTab === 'orders' && (
            <Orders
              orders={orders}
              setOrders={setOrders}
              token={token}
              fetchData={fetchData}
              setMessage={setMessage}
            />
          )}

          {activeTab === 'customers' && (
            <Customers customers={customers} />
          )}

          {activeTab === 'settings' && (
            <Settings setMessage={setMessage} token={token} />
          )}

        </div>
      </div>

    </div>
  );
};
