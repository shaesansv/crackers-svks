import React, { useState, useEffect } from 'react';
import { ProductImage } from '../components/ProductImage';

interface Product {
  id: string;
  name: string;
  unit: string;
  actualPrice: number;
  discountPrice: number;
  imageType: 'sparkler' | 'pot' | 'chakkar' | 'bomb' | 'kids' | 'garland' | 'rocket';
  imageUrl?: string;
}

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  packingCharge: number;
  overallTotal: number;
  approved: 'Pending' | 'Approved' | 'Packed' | 'On Hold';
  holdStatus: string;
  date: string;
}

interface Customer {
  name: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

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
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings'>('products');
  
  // Server state data
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'Approved' | 'Packed' | 'On Hold' | 'Pending'>('all');

  // Dashboard Settings
  const [minOrder, setMinOrder] = useState('3000');
  const [whatsappPhone, setWhatsappPhone] = useState('917868077818');
  const [storeAddress, setStoreAddress] = useState('3/1321 Paraipatti, Sivakasi, Tamil Nadu');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check login
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setCurrentPage('admin-login');
    } else {
      setToken(adminToken);
    }

    // Load local settings if any
    const savedMin = localStorage.getItem('minOrderValue');
    if (savedMin) setMinOrder(savedMin);
    const savedPhone = localStorage.getItem('merchantPhone');
    if (savedPhone) setWhatsappPhone(savedPhone);
    const savedAddress = localStorage.getItem('storeAddress');
    if (savedAddress) setStoreAddress(savedAddress);
  }, [setCurrentPage]);

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
      } else {
        useMockOrdersFallback();
      }

      // 2. Fetch Customers
      const customerResponse = await fetch('http://localhost:5000/api/customers', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        setCustomers(customerData);
      } else {
        useMockCustomersFallback();
      }
    } catch (err) {
      console.log('Database server offline. Loading dashboard mock fallbacks.');
      useMockOrdersFallback();
      useMockCustomersFallback();
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  // Fallbacks
  const useMockOrdersFallback = () => {
    setOrders([
      {
        id: '1',
        orderId: '00023',
        customerName: 'Shaesan 7',
        customerEmail: 'shaesan7@gmail.com',
        customerPhone: '8248374733',
        items: [{ name: 'Flower pot delux', qty: 2, price: 1200 }],
        total: 2400,
        packingCharge: 72,
        overallTotal: 2472,
        approved: 'Pending',
        holdStatus: '2d Hold',
        date: '28/07/2026'
      },
      {
        id: '2',
        orderId: '00019',
        customerName: 'Shaesan 7',
        customerEmail: 'shaesan7@gmail.com',
        customerPhone: '6369203683',
        items: [
          { name: '10 cm Sparklers (10 Pcs)', qty: 4, price: 500 },
          { name: 'Flower Pots Giant (10 Pcs)', qty: 2, price: 643 }
        ],
        total: 3286,
        packingCharge: 98,
        overallTotal: 3384,
        approved: 'Approved',
        holdStatus: '2d Hold',
        date: '24/07/2026'
      },
      {
        id: '3',
        orderId: '00018',
        customerName: 'Shaesan',
        customerEmail: 'shaesan@gmail.com',
        customerPhone: '9787791449',
        items: [{ name: 'Flower pot delux', qty: 3, price: 3420 }],
        total: 10260,
        packingCharge: 307.8,
        overallTotal: 10568,
        approved: 'Approved',
        holdStatus: '',
        date: '29/07/2026'
      },
      {
        id: '4',
        orderId: '00017',
        customerName: 'Shaesan 7',
        customerEmail: 'shaesan7@gmail.com',
        customerPhone: '6543257654',
        items: [{ name: 'Ground Chakkar Small', qty: 2, price: 2086 }],
        total: 4172,
        packingCharge: 125,
        overallTotal: 4297,
        approved: 'Packed',
        holdStatus: '',
        date: '22/07/2026'
      },
      {
        id: '5',
        orderId: '00016',
        customerName: 'Shaesan 7',
        customerEmail: 'shaesan7@gmail.com',
        customerPhone: '8248374733',
        items: [{ name: 'Pencil 10"', qty: 5, price: 2198 }],
        total: 10990,
        packingCharge: 329.7,
        overallTotal: 11320,
        approved: 'On Hold',
        holdStatus: '2d Hold',
        date: '30/06/2026'
      }
    ]);
  };

  const useMockCustomersFallback = () => {
    setCustomers([
      { name: 'Shaesan', phone: '9787791449', location: 'Dindigul, Tamil Nadu', orders: 3, totalSpent: 10260, lastOrder: '29/07/2026' },
      { name: 'Shaesan 7', phone: '6543257654', location: 'Dindigul, Tamil Nadu', orders: 1, totalSpent: 4172, lastOrder: '22/07/2026' },
      { name: 'Shaesan 7', phone: '8248374733', location: 'Dindigul, Tamil Nadu', orders: 3, totalSpent: 10990, lastOrder: '30/06/2026' },
      { name: 'Shaesan 7', phone: '6369203683', location: 'Dindigul, Tamil Nadu', orders: 1, totalSpent: 3286, lastOrder: '24/07/2026' }
    ]);
  };

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
    } catch (err) {
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
    } catch (err) {
      setError('Connection error. Could not reach backend server.');
    }
  };

  // Toggle order hold/approval status
  const handleUpdateOrderStatus = async (orderId: string, approvedStatus: 'Pending' | 'Approved' | 'Packed' | 'On Hold', holdStatusText: string) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approved: approvedStatus, holdStatus: holdStatusText })
      });
      if (response.ok) {
        setMessage('Order status updated successfully!');
        fetchData(token);
      } else {
        // Toggle locally if backend database fails
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, approved: approvedStatus, holdStatus: holdStatusText } : o));
      }
    } catch (err) {
      // Local toggling
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, approved: approvedStatus, holdStatus: holdStatusText } : o));
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('minOrderValue', minOrder);
    localStorage.setItem('merchantPhone', whatsappPhone);
    localStorage.setItem('storeAddress', storeAddress);
    setMessage('Settings saved successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setCurrentPage('home');
  };

  // Filter lists
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
  const filteredOrders = orders.filter(o => {
    const matchesPhone = o.customerPhone.includes(orderSearch);
    const matchesFilter = orderFilter === 'all' || o.approved === orderFilter;
    return matchesPhone && matchesFilter;
  });
  const filteredCustomers = customers.filter(c => c.phone.includes(customerSearch) || c.name.toLowerCase().includes(customerSearch.toLowerCase()));

  // Categories (Computed summary)
  const categoriesList = [
    { code: '100', name: 'Flower Pot', productsCount: products.filter(p => p.imageType === 'pot').length || 5, imageType: 'pot' },
    { code: '110', name: 'Ground Chakkar', productsCount: products.filter(p => p.imageType === 'chakkar').length || 3, imageType: 'chakkar' },
    { code: '120', name: 'SkyShot', productsCount: products.filter(p => p.imageType === 'rocket').length || 2, imageType: 'rocket' },
    { code: '130', name: 'Kids Special', productsCount: products.filter(p => p.imageType === 'kids').length || 7, imageType: 'kids' },
    { code: '140', name: 'Sparklers', productsCount: products.filter(p => p.imageType === 'sparkler').length || 6, imageType: 'sparkler' },
    { code: '150', name: 'Garlands', productsCount: products.filter(p => p.imageType === 'garland').length || 5, imageType: 'garland' },
    { code: '160', name: 'Fancy Fountains', productsCount: 4, imageType: 'pot' },
    { code: '170', name: 'Chime Bombs', productsCount: 6, imageType: 'bomb' }
  ];

  return (
    <div className="flex-grow flex min-h-screen bg-[#F8FAFC]">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-[#0B2559] text-white flex-shrink-0 flex flex-col justify-between select-none">
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-red-650 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-sm bg-[#E51E25]">★</div>
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
                  setActiveTab(tab.id as any);
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

          {/* ================= 1. TAB: DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-8 animate-fade-in">
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: `₹${orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}`, color: 'border-l-violet-500 text-violet-600 bg-violet-50/20' },
                  { label: 'Total Orders', value: orders.length, color: 'border-l-blue-500 text-blue-600 bg-blue-50/20' },
                  { label: 'Total Catalog Products', value: products.length, color: 'border-l-orange-500 text-orange-600 bg-orange-50/20' },
                  { label: 'Unique Customers', value: customers.length, color: 'border-l-emerald-500 text-emerald-600 bg-emerald-50/20' }
                ].map((card, idx) => (
                  <div key={idx} className={`bg-white border border-gray-150 border-l-[5px] rounded-[16px] p-5 shadow-sm ${card.color.split(' ')[0]}`}>
                    <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase font-inter">{card.label}</span>
                    <h3 className="text-2xl font-extrabold font-poppins mt-2 text-dark-navy">{card.value}</h3>
                  </div>
                ))}
              </div>

              {/* Recent Orders table */}
              <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
                <h3 className="text-lg font-bold font-poppins text-dark-navy mb-4 border-b border-gray-100 pb-3">Recent Sales Activity</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Total Amount</th>
                        <th className="pb-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 text-violet-600 font-bold font-inter">#{order.orderId}</td>
                          <td className="py-3.5 text-dark-navy font-bold">{order.customerName}</td>
                          <td className="py-3.5 font-inter text-gray-400">{order.date}</td>
                          <td className="py-3.5 font-poppins font-extrabold text-[#EA580C]">₹{order.total.toLocaleString()}</td>
                          <td className="py-3.5 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              order.approved === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                              order.approved === 'Packed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              order.approved === 'On Hold' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                              'bg-gray-50 text-gray-500 border-gray-100'
                            }`}>
                              {order.approved}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. TAB: PRODUCTS ================= */}
          {activeTab === 'products' && (
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
                          onChange={(e) => setImageType(e.target.value as any)}
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
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
                                  <div className="scale-80"><ProductImage type={product.imageType} /></div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-dark-navy truncate leading-snug">{product.name.replace(/\s*\([^)]+\)/g, '')}</p>
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
                            <span className="w-4 h-4 rounded-full border border-[#E51E25] flex items-center justify-center mx-auto text-[8px] text-[#E51E25] font-bold">80%</span>
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
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-0 outline-none"
                              >
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
          )}

          {/* ================= 3. TAB: CATEGORIES ================= */}
          {activeTab === 'categories' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex justify-between items-center select-none">
                <div>
                  <h3 className="text-xl font-bold font-poppins text-dark-navy">Product Categories</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">{categoriesList.length} categories total</p>
                </div>
                <button className="bg-[#E51E25] hover:bg-[#c4151b] text-white font-bold text-sm font-poppins rounded-[14px] px-5 py-3 transition-all cursor-pointer border-0 outline-none">
                  + New Category
                </button>
              </div>

              <div className="bg-white border border-gray-150 rounded-[20px] shadow-sm overflow-hidden select-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#5B729E]/10 border-b border-gray-250 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <th className="py-4.5 px-6">Code</th>
                      <th className="py-4.5">Name</th>
                      <th className="py-4.5">Products</th>
                      <th className="py-4.5">Image Representation</th>
                      <th className="py-4.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
                    {categoriesList.map((cat) => (
                      <tr key={cat.code} className="hover:bg-gray-50/40 transition-colors">
                        <td className="py-4.5 px-6 text-gray-400 font-inter">{cat.code}</td>
                        <td className="py-4.5 text-dark-navy font-bold">{cat.name}</td>
                        <td className="py-4.5 text-gray-500 font-inter">{cat.productsCount}</td>
                        <td className="py-4.5">
                          <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center bg-gray-50">
                            <div className="scale-75"><ProductImage type={cat.imageType as any} /></div>
                          </div>
                        </td>
                        <td className="py-4.5 text-center">
                          <div className="flex items-center justify-center gap-3 text-gray-400">
                            <button className="hover:text-dark-navy bg-transparent border-0 outline-none cursor-pointer">
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button className="hover:text-red-500 bg-transparent border-0 outline-none cursor-pointer">
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 4. TAB: ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                <div>
                  <h3 className="text-xl font-bold font-poppins text-dark-navy">Orders Management</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">Showing {filteredOrders.length} orders</p>
                </div>

                {/* Filter headers */}
                <div className="flex flex-wrap gap-2 text-xs font-bold font-poppins">
                  {[
                    { id: 'all', label: 'All Orders', count: orders.length, color: 'bg-red-500 text-white' },
                    { id: 'Approved', label: 'Approved', count: orders.filter(o => o.approved === 'Approved').length, color: 'bg-green-50 text-green-700 border border-green-150' },
                    { id: 'Packed', label: 'Packed', count: orders.filter(o => o.approved === 'Packed').length, color: 'bg-blue-50 text-blue-700 border border-blue-150' },
                    { id: 'On Hold', label: 'On Hold', count: orders.filter(o => o.approved === 'On Hold').length, color: 'bg-orange-50 text-orange-700 border border-orange-150' }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => setOrderFilter(btn.id as any)}
                      className={`px-4 py-2 rounded-full cursor-pointer transition-all border-0 flex items-center gap-2 outline-none font-semibold ${
                        orderFilter === btn.id
                          ? 'bg-[#E51E25] text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>{btn.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${orderFilter === btn.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{btn.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders table container */}
              <div className="bg-white border border-gray-150 rounded-[20px] shadow-sm overflow-hidden flex flex-col select-none">
                {/* Search orders */}
                <div className="p-5 border-b border-gray-100 bg-[#0B2559]/5 flex items-center gap-3">
                  <div className="relative flex-grow max-w-sm">
                    <input
                      type="text"
                      placeholder="Filter by phone number..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-[12px] text-sm bg-white text-dark-navy outline-none focus:border-violet-500 font-inter font-semibold"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#5B729E]/10 border-b border-gray-250 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <th className="py-4.5 px-6">Order ID</th>
                        <th className="py-4.5">Customer</th>
                        <th className="py-4.5">Phone</th>
                        <th className="py-4.5 text-center">Items</th>
                        <th className="py-4.5">Total</th>
                        <th className="py-4.5 text-center">Packing</th>
                        <th className="py-4.5 text-center">Approved</th>
                        <th className="py-4.5 text-center">Hold Status</th>
                        <th className="py-4.5">Date</th>
                        <th className="py-4.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                          <td className="py-4.5 px-6 text-dark-navy font-bold font-inter">{order.orderId}</td>
                          <td className="py-4.5">
                            <div className="min-w-0">
                              <p className="font-extrabold text-dark-navy leading-snug">{order.customerName}</p>
                              <p className="text-[11px] text-gray-400 font-bold mt-0.5 truncate">{order.customerEmail || 'no-email@sarguru.com'}</p>
                            </div>
                          </td>
                          <td className="py-4.5 font-inter text-gray-500 font-semibold">{order.customerPhone}</td>
                          <td className="py-4.5 text-center font-bold font-inter text-gray-500">{order.items.reduce((acc, curr) => acc + curr.qty, 0)}</td>
                          <td className="py-4.5 font-poppins font-extrabold text-[#E51E25] text-base">₹{order.total.toLocaleString()}</td>
                          <td className="py-4.5 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.packingCharge > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'
                            }`}>{order.packingCharge > 0 ? 'Packed' : 'N/A'}</span>
                          </td>
                          <td className="py-4.5 text-center">
                            <select
                              value={order.approved}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any, order.holdStatus)}
                              className="py-1 px-2.5 border border-gray-200 rounded-[8px] text-xs bg-white font-semibold outline-none cursor-pointer focus:border-violet-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Packed">Packed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </td>
                          <td className="py-4.5 text-center">
                            {order.holdStatus ? (
                              <span className="inline-flex flex-col items-center">
                                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-100">
                                  🔥 {order.holdStatus}
                                </span>
                                <span className="text-[8px] text-gray-450 mt-0.5 font-bold">Ready to send!</span>
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="py-4.5 font-inter text-gray-400 font-semibold">{order.date}</td>
                          <td className="py-4.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  alert(`Order Details:\nName: ${order.customerName}\nPhone: ${order.customerPhone}\nItems:\n${order.items.map(i => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join('\n')}\nTotal: ₹${order.total}`);
                                }}
                                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-[8px] cursor-pointer outline-none"
                              >
                                View Details
                              </button>
                              {order.holdStatus && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, order.approved, '')}
                                  className="px-2.5 py-1.5 bg-red-50 border border-red-100 text-[#E51E25] text-xs font-bold rounded-[8px] hover:bg-red-100/50 cursor-pointer outline-none"
                                >
                                  Remove Hold
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. TAB: CUSTOMERS ================= */}
          {activeTab === 'customers' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="select-none">
                <h3 className="text-xl font-bold font-poppins text-dark-navy">Customer Catalog</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">{filteredCustomers.length} unique buyers</p>
              </div>

              <div className="bg-white border border-gray-150 rounded-[20px] shadow-sm overflow-hidden flex flex-col select-none">
                {/* Search customers */}
                <div className="p-5 border-b border-gray-100 bg-[#0B2559]/5 flex items-center gap-3">
                  <div className="relative flex-grow max-w-sm">
                    <input
                      type="text"
                      placeholder="Filter by phone number or name..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-[12px] text-sm bg-white text-dark-navy outline-none focus:border-violet-500 font-inter font-semibold"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#5B729E]/10 border-b border-gray-250 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <th className="py-4.5 px-6">Name</th>
                        <th className="py-4.5">Phone</th>
                        <th className="py-4.5">Location</th>
                        <th className="py-4.5 text-center">Orders</th>
                        <th className="py-4.5">Total Spent</th>
                        <th className="py-4.5">Last Order</th>
                        <th className="py-4.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
                      {filteredCustomers.map((cust, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                          <td className="py-4.5 px-6 text-dark-navy font-bold">{cust.name}</td>
                          <td className="py-4.5 font-inter text-gray-500 font-semibold">{cust.phone}</td>
                          <td className="py-4.5 font-semibold text-gray-400">{cust.location}</td>
                          <td className="py-4.5 text-center font-bold font-inter text-gray-500">{cust.orders}</td>
                          <td className="py-4.5 font-poppins font-extrabold text-[#E51E25] text-base">₹{cust.totalSpent.toLocaleString()}</td>
                          <td className="py-4.5 font-inter text-gray-400 font-semibold">{cust.lastOrder}</td>
                          <td className="py-4.5 text-center">
                            <button
                              onClick={() => alert(`Customer History for ${cust.name}:\nTotal Orders placed: ${cust.orders}\nAccumulated Sales: ₹${cust.totalSpent.toLocaleString()}`)}
                              className="px-4 py-1.5 bg-white border border-gray-250 text-dark-navy text-xs font-bold rounded-[8px] hover:bg-gray-50 cursor-pointer outline-none shadow-sm transition-all"
                            >
                              View History
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. TAB: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm max-w-xl animate-fade-in select-none">
              <h3 className="text-lg font-bold font-poppins text-dark-navy mb-4 border-b border-gray-100 pb-2">Store Settings</h3>
              
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 text-sm font-medium">
                {/* Min order */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Minimum Order Value (₹) *</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    required
                    className="p-3 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500"
                  />
                  <p className="text-[10px] text-gray-400">Cart validation will block orders below this discount threshold.</p>
                </div>

                {/* Whatsapp phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">WhatsApp Redirect Phone Number *</label>
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    required
                    className="p-3 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500"
                  />
                  <p className="text-[10px] text-gray-400">Merchant number (including country code) e.g., 917868077818.</p>
                </div>

                {/* Store address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Warehouse Shipping Address *</label>
                  <textarea
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    required
                    className="p-3 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500 h-20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm font-poppins rounded-[12px] py-3.5 shadow-sm transition-all border-none outline-none cursor-pointer mt-2"
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
