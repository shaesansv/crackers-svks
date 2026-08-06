import React, { useState } from 'react';
interface Product {
  id: string;
  name: string;
  unit: string;
  actualPrice: number;
  discountPrice: number;
  imageType: string;
  imageUrl?: string;
}

interface FooterProps {
  showCheckout: boolean;
  quantities: Record<string, number>;
  setCurrentPage: (p: string) => void;
  products: Product[];
  settings: {
    minOrderValue?: number;
    merchantPhone?: string;
    storeAddress?: string;
  } | null;
}

export const Footer: React.FC<FooterProps> = ({
  showCheckout,
  quantities,
  setCurrentPage,
  products,
  settings
}) => {
  // Customer Details Form State
  const [state, setState] = useState('Tamil Nadu');
  const [city, setCity] = useState('Sivakasi');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Cart math calculations
  const allProducts = products;
  let mktTotal = 0; // Actual price retail
  let subTotal = 0; // Discounted price

  Object.entries(quantities).forEach(([productId, qty]) => {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      mktTotal += product.actualPrice * qty;
      subTotal += product.discountPrice * qty;
    }
  });

  const discountTotal = mktTotal - subTotal;
  const packingCharges = Math.round(subTotal * 0.03 * 100) / 100;
  
  // Calculate round off and overall amount
  const rawOverallAmount = subTotal + packingCharges;
  const overallAmount = Math.round(rawOverallAmount);
  const roundOff = Math.round((overallAmount - rawOverallAmount) * 100) / 100;

  const minOrderValue = settings?.minOrderValue ?? 3000;
  const isMinOrderMet = subTotal >= minOrderValue;
  const isFormValid = name.trim() !== '' && mobile.trim() !== '' && address.trim() !== '';

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinOrderMet) {
      alert(`Minimum order value is Rs. ${minOrderValue}. Please add more items to your cart.`);
      return;
    }
    if (!isFormValid) {
      alert('Please fill in all required fields (*) to place your order.');
      return;
    }

    let orderIdStr = '';
    try {
      const orderItems = Object.entries(quantities).map(([productId, qty]) => {
        const p = allProducts.find((product) => product.id === productId);
        return {
          product: productId,
          quantity: qty,
          price: p ? p.discountPrice : 0
        };
      });

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: mobile,
          items: orderItems,
          total: subTotal,
          packingCharge: packingCharges,
          overallTotal: overallAmount
        }),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        orderIdStr = `• *Order ID:* #${savedOrder.orderId}\n`;
      }
    } catch (err) {
      console.log('Failed to save order to local database server', err);
    }

    // Assemble WhatsApp order details
    let message = `*Sarguru TRADERS ORDER*\n`;
    message += `=========================\n`;
    if (orderIdStr) {
      message += orderIdStr;
      message += `=========================\n`;
    }
    message += `*Customer Details:*\n`;
    message += `• *Name:* ${name}\n`;
    message += `• *Mobile:* ${mobile}\n`;
    message += `• *State:* ${state}\n`;
    message += `• *City:* ${city}\n`;
    if (email) message += `• *Email:* ${email}\n`;
    message += `• *Address:* ${address}\n`;
    message += `=========================\n`;
    message += `*Ordered Items:*\n`;
    
    Object.entries(quantities).forEach(([productId, qty]) => {
      const product = allProducts.find((p) => p.id === productId);
      if (product) {
        const lineTotal = product.discountPrice * qty;
        message += `• ${product.name} - Qty: ${qty} x Rs. ${product.discountPrice} = Rs. ${lineTotal}\n`;
      }
    });

    message += `=========================\n`;
    message += `*Order Summary:*\n`;
    message += `• Mkt Total (MRP): Rs. ${mktTotal.toFixed(2)}\n`;
    message += `• Discount Total (80%): Rs. ${discountTotal.toFixed(2)}\n`;
    message += `• *Sub Total:* Rs. ${subTotal.toFixed(2)}\n`;
    message += `• Packing Charges (3%): Rs. ${packingCharges.toFixed(2)}\n`;
    message += `• Round Off: Rs. ${roundOff >= 0 ? '+' : ''}${roundOff.toFixed(2)}\n`;
    message += `• *Overall Amount:* Rs. ${overallAmount.toFixed(2)}\n`;
    message += `=========================\n`;
    message += `Please confirm my order. Thank you!`;

    // Fetch the merchant phone number from settings if saved
    const savedMerchantPhone = settings?.merchantPhone || '917868077818';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${savedMerchantPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full mt-auto">
      {/* Checkout Form Container (Only visible on home page) */}
      {showCheckout && (
        <section id="checkout-section" className="bg-white border-t border-gray-100 pt-10 pb-16 px-6 md:px-12 select-none relative z-10">
          {/* Red Title Banner */}
          <div className="flex justify-center mb-10">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-text-primary relative inline-block">
              Review Your Order
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary-blue rounded-full"></div>
            </h2>
          </div>

          {/* Form Content Grid */}
          <form onSubmit={handleCheckout} className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start justify-between font-inter">
            {/* Left side: Inputs */}
            <div className="w-full lg:w-2/3 bg-bg-light p-6 md:p-8 rounded-[24px] shadow-[var(--shadow-premium)] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <h3 className="md:col-span-2 text-lg font-poppins font-semibold text-text-primary mb-2">Shipping Details</h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">State *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="p-3 border border-border-gray rounded-[12px] text-sm bg-white text-text-primary outline-none focus:border-primary-blue focus:shadow-sm transition-all"
                  required
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="p-3 border border-border-gray rounded-[12px] text-sm bg-white text-text-primary outline-none focus:border-primary-blue focus:shadow-sm transition-all"
                  required
                >
                  <option value="Sivakasi">Sivakasi</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 border border-border-gray rounded-[12px] text-sm bg-white text-text-primary outline-none focus:border-primary-blue focus:shadow-sm transition-all w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Mobile No *</label>
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="p-3 border border-border-gray rounded-[12px] text-sm bg-white text-text-primary outline-none focus:border-primary-blue focus:shadow-sm transition-all w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 border border-border-gray rounded-[12px] text-sm bg-white text-text-primary outline-none focus:border-primary-blue focus:shadow-sm transition-all w-full"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Complete Address *</label>
                <textarea
                  placeholder="Enter your full delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="p-3 border border-border-gray rounded-[12px] text-sm bg-white text-text-primary outline-none focus:border-primary-blue focus:shadow-sm transition-all w-full h-24 resize-none"
                  required
                />
              </div>
            </div>

            {/* Right side: Calculations */}
            <div className="w-full lg:w-1/3 flex flex-col bg-white border border-gray-100 p-6 md:p-8 rounded-[24px] shadow-[var(--shadow-premium)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-gold to-primary-blue"></div>
              <h3 className="text-xl font-poppins font-bold text-text-primary mb-6">Order Summary</h3>
              
              <div className="flex flex-col gap-4 text-sm font-inter">
                <div className="flex justify-between border-b border-gray-100 pb-2 text-gray-500">
                  <span>Market Total (MRP):</span>
                  <span className="font-medium line-through">₹{mktTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-green-600">Premium Discount (80%):</span>
                  <span className="font-bold text-green-600">-₹{discountTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2 text-text-primary">
                  <span className="font-semibold">Sub Total:</span>
                  <span className="font-bold">₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2 text-gray-500">
                  <span>Packing Charges (3%):</span>
                  <span className="font-medium">₹{packingCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2 text-gray-500">
                  <span>Round Off:</span>
                  <span className="font-medium">{roundOff >= 0 ? '+' : ''}{roundOff.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 pb-2 mt-2">
                  <span className="font-poppins font-bold text-lg text-text-primary">Total Amount:</span>
                  <span className="font-poppins font-extrabold text-2xl text-secondary-gold">₹{overallAmount.toFixed(2)}</span>
                </div>
              </div>

              {!isMinOrderMet && (
                <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-danger-red text-xs font-semibold text-center">
                  Minimum Order Value: ₹3,000
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isMinOrderMet || !isFormValid}
                className={`mt-8 py-3.5 px-6 text-sm font-poppins font-bold transition-all duration-300 text-center w-full block shadow-sm ${
                  isMinOrderMet && isFormValid
                    ? 'btn-primary hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 rounded-[12px]'
                }`}
              >
                Proceed via WhatsApp
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Terms & Conditions Section (Only visible on home page) */}
      {showCheckout && (
        <section className="bg-bg-light border-t border-gray-200/50 py-16 px-6 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <h3 className="text-2xl font-poppins font-bold text-text-primary text-center mb-10">Terms & Conditions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm text-gray-600 font-inter">
              {[
                'Minimum order value is Rs. 3,000 only (after discount).',
                'All orders will be dispatched from Sivakasi warehouse.',
                '3% packing and handling charges will apply on all orders.',
                'Products will be dispatched only after full payment verification.',
                'Deliveries will be handled via third-party logistics on a To-Pay basis.',
                'WhatsApp order submission is required to process and verify stock availability.',
                'Images of items in the price list are for visual representations only.',
                'The prices quoted are valid up to Diwali season or subject to manufacturer changes.'
              ].map((term, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-6 h-6 rounded-full bg-secondary-gold/20 text-secondary-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="leading-relaxed">{term}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global Dark Navy Footer Section */}
      <footer className="bg-dark-section text-gray-300 border-t-[6px] border-secondary-gold select-none font-inter relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-secondary-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto py-16 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          
          {/* Column 1: Contact Details */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-poppins font-bold text-xl mb-2">
              Sarguru Crackers
            </h3>
            <div className="flex flex-col gap-4 text-sm text-[#CBD5E1]">
              <div className="flex items-start gap-3 hover:text-white transition-colors">
                <span className="text-secondary-gold mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>
                <span className="leading-relaxed">
                  3/1321 Paraipatti,<br />Sivakasi, Tamil Nadu
                </span>
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors">
                <span className="text-secondary-gold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </span>
                <span>+91 78680 77818</span>
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors">
                <span className="text-secondary-gold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </span>
                <span>jvikumar1100@gmail.com</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-primary-blue border border-primary-blue hover:border-secondary-gold hover:text-secondary-gold flex items-center justify-center text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-primary-blue border border-primary-blue hover:border-secondary-gold hover:text-secondary-gold flex items-center justify-center text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 4.5 12 4.5 15.5 6.07 15.5 8 13.93 11.5 12 11.5z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-poppins font-bold text-xl mb-2">
              Explore
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-[#CBD5E1]">
              {['home', 'about', 'order'].map(page => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-transparent border-0 hover:text-secondary-gold cursor-pointer font-medium p-0 flex items-center gap-2 outline-none text-left transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-gold"></span>
                    <span className="capitalize">{page.replace('-', ' ')}</span>
                  </button>
                </li>
              ))}
              <li>
                <a href="#safety" className="hover:text-secondary-gold font-medium flex items-center gap-2 no-underline transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-gold"></span> Safety Tips
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-secondary-gold font-medium flex items-center gap-2 no-underline transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-gold"></span> Contact Us
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('adminToken');
                    setCurrentPage(token ? 'admin-dashboard' : 'admin-login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-transparent border-0 hover:text-luxury-gold cursor-pointer font-medium p-0 flex items-center gap-2 outline-none text-left transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-royal-red"></span> Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Reach Us Map */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-poppins font-bold text-xl mb-2">
              Location
            </h3>
            <div className="w-full h-40 bg-white/5 rounded-[18px] overflow-hidden shadow-inner relative group border border-white/10">
              <div className="absolute inset-0 bg-secondary-gold/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.568461531776!2d77.8105!3d9.453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee4ad2a4cd9%3A0xe21ba24687b8d447!2sParaipatti%2C%20Sivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                className="w-full h-full border-none opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sarguru Crackers Location Sivakasi"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="bg-black/40 py-4 text-center border-t border-white/5 px-6">
          <p className="m-0 text-gray-500 text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} Sarguru Crackers. All Rights Reserved. <span className="hidden sm:inline">|</span> <br className="sm:hidden" />Premium Quality Fireworks from Sivakasi.
          </p>
        </div>
      </footer>
    </div>
  );
};
