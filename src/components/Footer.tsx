import React, { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
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
  const { settings: siteSettings } = useSiteSettings();

  // Dynamic values from admin content page
  const siteName = siteSettings.siteName || 'Sarguru Crackers';
  const phone = siteSettings.contact?.phone || '+91 78680 77818';
  const storeAddress = siteSettings.contact?.address || '3/1321 Paraipatti, Sivakasi, Tamil Nadu';
  const storeEmail = siteSettings.contact?.email || 'info@sargurucrackers.com';
  const instagramUrl = siteSettings.socialLinks?.instagram || 'https://instagram.com';
  const facebookUrl = siteSettings.socialLinks?.facebook || '';
  // Customer Details Form State
  const [state, setState] = useState('Tamil Nadu');
  const [city, setCity] = useState('Sivakasi');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
          customerEmail: email || `${mobile}@noemail.com`,
          customerPhone: mobile,
          deliveryAddress: address,
          state: state,
          district: city,
          items: orderItems,
          total: subTotal,
          packingCharge: packingCharges,
          overallTotal: overallAmount
        }),
      });

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        alert('There was a problem placing your order. Please try again.');
      }
    } catch (err) {
      console.log('Failed to save order to local database server', err);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="w-full mt-auto bg-[#FDF5CB]">
      {/* Checkout Form Container (Only visible on home page) */}
      {showCheckout && (
        <section id="checkout-section" className="bg-[#FDF5CB] border-t-2 border-[#B69F4C] pt-10 pb-16 px-6 md:px-12 select-none relative z-10">
          {/* Section Title */}
          <div className="flex justify-center mb-10">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-[#15803D] relative inline-block">
              Review Your Order
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#B69F4C] rounded-full"></div>
            </h2>
          </div>

          {/* Form Content Grid */}
          <form onSubmit={handleCheckout} className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start justify-between font-inter">
            {/* Left side: Inputs */}
            <div className="w-full lg:w-2/3 bg-[#FEF9E1] p-6 md:p-8 rounded-[24px] shadow-lg border-2 border-[#B69F4C] grid grid-cols-1 md:grid-cols-2 gap-6">
              <h3 className="md:col-span-2 text-lg font-poppins font-bold text-[#14532D] mb-2">Shipping Details</h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#14532D] tracking-widest uppercase">State *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="p-3 border border-[#B69F4C] rounded-[12px] text-sm bg-[#FDF5CB] text-[#061001] outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] shadow-sm transition-all font-semibold"
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
                <label className="text-xs font-bold text-[#14532D] tracking-widest uppercase">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="p-3 border border-[#B69F4C] rounded-[12px] text-sm bg-[#FDF5CB] text-[#061001] outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] shadow-sm transition-all font-semibold"
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
                <label className="text-xs font-bold text-[#14532D] tracking-widest uppercase">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 border border-[#B69F4C] rounded-[12px] text-sm bg-[#FDF5CB] text-[#061001] outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] shadow-sm transition-all w-full font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#14532D] tracking-widest uppercase">Mobile No *</label>
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="p-3 border border-[#B69F4C] rounded-[12px] text-sm bg-[#FDF5CB] text-[#061001] outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] shadow-sm transition-all w-full font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-[#14532D] tracking-widest uppercase">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 border border-[#B69F4C] rounded-[12px] text-sm bg-[#FDF5CB] text-[#061001] outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] shadow-sm transition-all w-full font-semibold"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-[#14532D] tracking-widest uppercase">Complete Address *</label>
                <textarea
                  placeholder="Enter your full delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="p-3 border border-[#B69F4C] rounded-[12px] text-sm bg-[#FDF5CB] text-[#061001] outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] shadow-sm transition-all w-full h-24 resize-none font-semibold"
                  required
                />
              </div>
            </div>

            {/* Right side: Calculations */}
            <div className="w-full lg:w-1/3 flex flex-col bg-[#FEF9E1] border-2 border-[#B69F4C] p-6 md:p-8 rounded-[24px] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#B69F4C]"></div>
              <h3 className="text-xl font-poppins font-bold text-[#15803D] mb-6">Order Summary</h3>
              
              <div className="flex flex-col gap-4 text-sm font-inter">
                <div className="flex justify-between border-b border-[#B69F4C]/30 pb-2 text-[#14532D]">
                  <span>Market Total (MRP):</span>
                  <span className="font-medium line-through">₹{mktTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-[#B69F4C]/30 pb-2">
                  <span className="font-medium text-[#15803D]">Discount Savings:</span>
                  <span className="font-bold text-[#15803D]">-₹{discountTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-[#B69F4C]/30 pb-2 text-[#061001]">
                  <span className="font-semibold">Sub Total:</span>
                  <span className="font-bold">₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-[#B69F4C]/30 pb-2 text-[#14532D]">
                  <span>Packing Charges (3%):</span>
                  <span className="font-medium">₹{packingCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-[#B69F4C]/30 pb-2 text-[#14532D]">
                  <span>Round Off:</span>
                  <span className="font-medium">{roundOff >= 0 ? '+' : ''}{roundOff.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 pb-2 mt-2">
                  <span className="font-poppins font-bold text-lg text-[#15803D]">Total Amount:</span>
                  <span className="font-poppins font-black text-2xl text-[#A67428]">₹{overallAmount.toFixed(2)}</span>
                </div>
              </div>

              {!isMinOrderMet && (
                <div className="mt-4 p-3 bg-red-100 rounded-xl border border-red-300 text-red-700 text-xs font-bold text-center">
                  Minimum Order Value: ₹3,000
                </div>
              )}

              {/* Submit Button (#B69F4C Primary Gold Button) */}
              <button
                type="submit"
                disabled={!isMinOrderMet || !isFormValid}
                className={`mt-8 py-3.5 px-6 text-sm font-poppins font-extrabold transition-all duration-300 text-center w-full block shadow-md ${
                  isMinOrderMet && isFormValid
                    ? 'bg-[#B69F4C] hover:bg-[#A67428] text-[#14532D] hover:text-white rounded-[12px] cursor-pointer active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 rounded-[12px]'
                }`}
              >
                Place Order / Enquiry
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Terms & Conditions Section (Only visible on home page) */}
      {showCheckout && (
        <section className="bg-[#FEF9E1] border-t-2 border-[#B69F4C] py-16 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h3 className="text-2xl font-poppins font-bold text-[#15803D] text-center mb-10">Terms & Conditions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm text-[#061001] font-inter">
              {(siteSettings.termsAndConditions && siteSettings.termsAndConditions.length > 0
                ? siteSettings.termsAndConditions
                : [
                    'Minimum order value is Rs. 3,000 only (after discount).',
                    'All orders will be dispatched from Sivakasi warehouse.',
                    '3% packing and handling charges will apply on all orders.',
                    'Products will be dispatched only after full payment verification.',
                    'Deliveries will be handled via third-party logistics on a To-Pay basis.',
                    'Order submission is required to process and verify stock availability.',
                    'Images of items in the price list are for visual representations only.',
                    'The prices quoted are valid up to Diwali season or subject to manufacturer changes.'
                  ]
              ).map((term, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#FDF5CB] p-4 rounded-2xl shadow-sm border border-[#B69F4C] hover:border-[#15803D] transition-all duration-300">
                  <div className="w-6 h-6 rounded-full bg-[#15803D] text-[#FDF5CB] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <span className="leading-relaxed font-semibold">{term}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global Vibrant Light Green Footer Section (#15803D) */}
      <footer className="bg-[#15803D] text-[#FDF5CB] border-t-4 border-[#B69F4C] select-none font-inter relative overflow-hidden">
        <div className="max-w-6xl mx-auto py-16 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          
          {/* Column 1: Contact Details */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[#FDF5CB] font-poppins font-bold text-xl mb-2">
              {siteName}
            </h3>
            <div className="flex flex-col gap-4 text-sm text-[#FBECC0]">
              <div className="flex items-start gap-3 hover:text-white transition-colors">
                <span className="text-[#B69F4C] mt-1">📍</span>
                <span className="leading-relaxed">
                  {storeAddress.split(',').slice(0, 2).join(',')}<br />{storeAddress.split(',').slice(2).join(',').trim()}
                </span>
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors">
                <span className="text-[#B69F4C]">📞</span>
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors">
                <span className="text-[#B69F4C]">✉️</span>
                <span>{storeEmail}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[#FDF5CB] font-poppins font-bold text-xl mb-2">
              Explore
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-[#FBECC0]">
              {['home', 'about', 'order'].map(page => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-transparent border-0 hover:text-[#B69F4C] cursor-pointer font-medium p-0 flex items-center gap-2 outline-none text-left transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B69F4C]"></span>
                    <span className="capitalize">{page.replace('-', ' ')}</span>
                  </button>
                </li>
              ))}
              <li>
                <a href="#safety" className="hover:text-[#B69F4C] font-medium flex items-center gap-2 no-underline transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B69F4C]"></span> Safety Tips
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#B69F4C] font-medium flex items-center gap-2 no-underline transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B69F4C]"></span> Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Reach Us Map */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[#FDF5CB] font-poppins font-bold text-xl mb-2">
              Location
            </h3>
            <div className="w-full h-40 bg-white/5 rounded-[18px] overflow-hidden shadow-inner relative group border border-[#B69F4C]/40">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.568461531776!2d77.8105!3d9.453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee4ad2a4cd9%3A0xe21ba24687b8d447!2sParaipatti%2C%20Sivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sarguru Crackers Location Sivakasi"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="bg-[#14532D] py-4 text-center border-t border-[#B69F4C]/30 px-6 text-[#FBECC0]">
          <p className="m-0 text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved. | Premium Quality Fireworks from Sivakasi.
          </p>
        </div>
      </footer>

      <Dialog open={showSuccessModal} onOpenChange={(open) => {
        if (!open) {
          setShowSuccessModal(false);
          window.location.reload();
        }
      }}>
        <DialogContent className="sm:max-w-md text-center border-0 shadow-2xl p-8 rounded-3xl" style={{ background: '#FFFDF8' }}>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-poppins font-bold text-center text-gray-900 mb-2">Order Placed Successfully!</DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-base leading-relaxed">
              Thank you for choosing <strong>{siteName}</strong>! Your order/enquiry has been recorded. Our team will contact you shortly to confirm stock availability and payment details.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload();
              }}
              className="w-full bg-[#1F2A44] hover:bg-[#1F2A44]/90 text-white font-semibold py-6 rounded-xl"
            >
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
