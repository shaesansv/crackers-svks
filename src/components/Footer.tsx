import React, { useState } from 'react';
import { crackerCategories } from '../data/products';

interface FooterProps {
  showCheckout: boolean;
  quantities: Record<string, number>;
  setCurrentPage: (p: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  showCheckout,
  quantities,
  setCurrentPage
}) => {
  // Customer Details Form State
  const [state, setState] = useState('Tamil Nadu');
  const [city, setCity] = useState('Sivakasi');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Cart math calculations
  const allProducts = crackerCategories.flatMap((cat) => cat.products);
  let totalItems = 0;
  let mktTotal = 0; // Actual price retail
  let subTotal = 0; // Discounted price

  Object.entries(quantities).forEach(([productId, qty]) => {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      totalItems += qty;
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

  const isMinOrderMet = subTotal >= 3000;
  const isFormValid = name.trim() !== '' && mobile.trim() !== '' && address.trim() !== '';

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinOrderMet) {
      alert('Minimum order value is Rs. 3000. Please add more items to your cart.');
      return;
    }
    if (!isFormValid) {
      alert('Please fill in all required fields (*) to place your order.');
      return;
    }

    // Assemble WhatsApp order details
    let message = `*VENUS TRADERS ORDER*\n`;
    message += `=========================\n`;
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

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '917868077818'; // Merchant phone number from new banner
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full mt-auto">
      {/* Checkout Form Container (Only visible on home page) */}
      {showCheckout && (
        <section className="bg-white border-t border-gray-200 pt-6 pb-12 px-4 md:px-10 select-none">
          {/* Red Title Banner */}
          <div className="flex justify-center mb-8">
            <button 
              type="button"
              className="bg-red-600 text-white font-extrabold text-xs md:text-sm px-10 py-2 rounded-md shadow border-none select-none tracking-wider pointer-events-none"
            >
              PLEASE CHECK YOUR ORDER
            </button>
          </div>

          {/* Form Content Grid */}
          <form onSubmit={handleCheckout} className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start justify-between">
            {/* Left side: Inputs */}
            <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">State *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs bg-white text-gray-800 outline-none font-medium"
                  required
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs bg-white text-gray-800 outline-none font-medium"
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

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Name *</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs bg-white w-full outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Mobile No *</label>
                <input
                  type="text"
                  placeholder="Mobile No"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs bg-white w-full outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs bg-white w-full outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Address *</label>
                <textarea
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs bg-white w-full h-20 outline-none resize-none"
                  required
                />
              </div>
            </div>

            {/* Right side: Calculations */}
            <div className="w-full md:w-1/3 flex flex-col gap-2 bg-gray-50 border border-gray-200 p-4 rounded-md shadow-sm">
              <div className="flex justify-between border-b border-gray-200 pb-1.5 text-xs text-gray-700">
                <span>Mkt Total:</span>
                <span className="font-semibold">Rs. {mktTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5 text-xs text-gray-700">
                <span>Discount Total:</span>
                <span className="font-semibold text-green-600">-Rs. {discountTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5 text-xs text-gray-800">
                <span>Sub Total:</span>
                <span className="font-bold">Rs. {subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5 text-xs text-red-600">
                <span>Min Order Amount:</span>
                <span className="font-bold">3000.00</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5 text-xs text-gray-700">
                <span>Packing Charges(3%):</span>
                <span className="font-semibold">Rs. {packingCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5 text-xs text-gray-600">
                <span>Round Off:</span>
                <span className="font-semibold">{roundOff >= 0 ? '+' : ''}{roundOff.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2 text-sm text-gray-900 font-extrabold">
                <span>Overall Amount:</span>
                <span className="text-red-600 text-base">Rs. {overallAmount.toFixed(2)}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isMinOrderMet || !isFormValid}
                className={`mt-2 py-2 px-6 rounded text-xs font-bold border-none transition duration-200 text-center w-full block cursor-pointer ${
                  isMinOrderMet && isFormValid
                    ? 'bg-[#25d366] text-white hover:bg-[#128c7e]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Terms & Conditions Section (Only visible on home page) */}
      {showCheckout && (
        <section className="bg-white border-t border-gray-100 py-10 px-6">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl font-black text-gray-800 text-center m-0">Terms & Conditions</h3>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-3 mb-6"></div>
            
            <ul className="flex flex-col gap-3 text-xs md:text-sm text-gray-600 list-none p-0 m-0">
              {[
                'Minimum order value is Rs. 3,000 only (after discount).',
                'All orders will be dispatched from Sivakasi warehouse.',
                '3% packing and handling charges will apply on all orders.',
                'Products will be dispatched only after full payment verification.',
                'Deliveries will be handled via third-party logistics on a To-Pay basis.',
                'WhatsApp order submission is required to process and verify stock availability.',
                'Images of items in the price list are for visual representations only.',
                'Online orders are available for Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Maharashtra, etc.',
                'The prices quoted are valid up to Diwali season or subject to manufacturer changes.'
              ].map((term, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Global Dark Blue Footer Section */}
      <footer className="bg-[#0f172a] text-gray-300 border-t-4 border-[#ff6f00] select-none">
        {/* Main Footer Info Grid */}
        <div className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1: Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-base md:text-lg border-b border-gray-700 pb-2 m-0">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3 text-xs md:text-sm">
              <div className="flex items-start gap-2.5">
                <span className="text-orange-500">📍</span>
                <span>
                  <strong>Venus Crackers</strong><br />
                  3/1321 Paraipatti, Sivakasi
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-orange-500">📞</span>
                <span>+91 78680 77818</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-orange-500">✉️</span>
                <span>jvikumar1100@gmail.com</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3.5 mt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white text-xs font-bold transition duration-200 no-underline"
                title="Instagram"
              >
                IG
              </a>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white text-xs font-bold transition duration-200 no-underline"
                title="Google Maps"
              >
                MAP
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-base md:text-lg border-b border-gray-700 pb-2 m-0">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs md:text-sm list-none p-0 m-0">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-transparent border-0 text-gray-300 hover:text-orange-500 cursor-pointer font-medium p-0 flex items-center gap-1 outline-none text-left"
                >
                  <span className="text-orange-500 font-bold">&gt;</span> Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-transparent border-0 text-gray-300 hover:text-orange-500 cursor-pointer font-medium p-0 flex items-center gap-1 outline-none text-left"
                >
                  <span className="text-orange-500 font-bold">&gt;</span> About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-transparent border-0 text-gray-300 hover:text-orange-500 cursor-pointer font-medium p-0 flex items-center gap-1 outline-none text-left"
                >
                  <span className="text-orange-500 font-bold">&gt;</span> Pricelist
                </button>
              </li>
              <li>
                <a 
                  href="#safety" 
                  className="text-gray-300 hover:text-orange-500 cursor-pointer font-medium flex items-center gap-1 no-underline"
                >
                  <span className="text-orange-500 font-bold">&gt;</span> Safety Tips
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-300 hover:text-orange-500 cursor-pointer font-medium flex items-center gap-1 no-underline"
                >
                  <span className="text-orange-500 font-bold">&gt;</span> Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Reach Us Map */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-base md:text-lg border-b border-gray-700 pb-2 m-0">
              Reach Us
            </h3>
            <div className="w-full h-40 bg-gray-800 rounded-md overflow-hidden border border-gray-700 shadow-inner">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.568461531776!2d77.8105!3d9.453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee4ad2a4cd9%3A0xe21ba24687b8d447!2sParaipatti%2C%20Sivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                className="w-full h-full border-none opacity-85 hover:opacity-100 transition-opacity" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Venus Crackers Location Sivakasi"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Banner Row */}
        <div className="bg-[#002d1d] py-3 text-center border-t border-gray-800 select-none px-4">
          <p className="m-0 text-white font-bold text-[10px] md:text-xs tracking-wider uppercase">
            Crackers available 365 days. Shop Sivakasi crackers online at 80% discount from top 3 brands
          </p>
        </div>
      </footer>
    </div>
  );
};
