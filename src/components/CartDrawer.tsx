import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { INDIAN_STATES_AND_DISTRICTS } from '../data/indianStatesAndDistricts';
import { loadCustomerDetails, saveCustomerDetails } from '../utils/cookieSessionUtils';
import { downloadOrderReceiptPDF, printOrderReceipt } from '../lib/pdf-generator';
import { ProductImage } from './ProductImage';
import { API_BASE_URL } from '../lib/api';

interface CartItem {
  product: Product;
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onQtyChange: (productId: string, increment: boolean) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  settings: { minOrderValue?: number; minPurchaseOutsideTN?: number; minimumPurchaseAmount?: number; minOrderValueOutside?: number } | null;
}

const ALL_STATES = Object.keys(INDIAN_STATES_AND_DISTRICTS);

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onQtyChange,
  onRemove,
  settings,
}) => {
  const tnMinOrder = settings?.minOrderValue ?? settings?.minimumPurchaseAmount ?? 3000;
  const outsideTNMinOrder = settings?.minPurchaseOutsideTN ?? settings?.minOrderValueOutside ?? 5000;

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Load saved customer details from Cookie / Session Storage
  const savedDetails = loadCustomerDetails();

  // Customer Details Form State
  const [state, setState] = useState(savedDetails?.state || 'Tamil Nadu');
  const [city, setCity] = useState(savedDetails?.city || 'Sivakasi');
  const [name, setName] = useState(savedDetails?.name || '');
  const [mobile, setMobile] = useState(savedDetails?.mobile || '');
  const [email, setEmail] = useState(savedDetails?.email || '');
  const [address, setAddress] = useState(savedDetails?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Sync customer details entry section to Cookies & Session Storage whenever updated
  useEffect(() => {
    if (name || mobile || email || address || state || city) {
      saveCustomerDetails({ name, mobile, email, address, state, city });
    }
  }, [name, mobile, email, address, state, city]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStep('cart');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const activeMinOrder = state === 'Tamil Nadu' ? tnMinOrder : outsideTNMinOrder;
  const subtotal = cartItems.reduce((sum, { product, qty }) => sum + product.discountPrice * qty, 0);
  const packingCharge = Math.round(subtotal * 0.03);
  const total = subtotal + packingCharge;
  const totalItems = cartItems.reduce((sum, { qty }) => sum + qty, 0);
  const isMinMet = subtotal >= activeMinOrder;
  const remaining = Math.max(0, activeMinOrder - subtotal);
  const isFormValid = name.trim() !== '' && mobile.trim() !== '' && address.trim() !== '' && isMinMet;

  const handleStateChange = (newState: string) => {
    setState(newState);
    const districts = INDIAN_STATES_AND_DISTRICTS[newState] || [];
    setCity(districts[0] || '');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinMet) {
      alert(`Minimum order value for ${state} is ₹${activeMinOrder.toLocaleString('en-IN')}. Please add ₹${remaining.toLocaleString('en-IN')} more to proceed.`);
      return;
    }
    if (!name.trim() || !mobile.trim() || !address.trim()) {
      alert('Please fill in all required fields (*)');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map(({ product, qty }) => ({
        product: product._id || product.id,
        quantity: qty,
        price: product.discountPrice
      }));

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email.trim() || `${mobile}@noemail.com`,
          customerPhone: mobile,
          deliveryAddress: address,
          state: state,
          district: city,
          items: orderItems,
          total: subtotal,
          packingCharge: packingCharge,
          overallTotal: total
        })
      });

      if (response.ok) {
        const data = await response.json();
        const fullOrder = {
          ...data,
          orderNumber: data?.orderNumber || data?._id || `ORD-${Date.now()}`,
          customerName: name,
          customerEmail: email,
          customerPhone: mobile,
          deliveryAddress: `${address}, ${city}, ${state}`,
          state,
          district: city,
          items: cartItems.map(({ product, qty }) => ({
            productName: product.name,
            quantity: qty,
            price: product.discountPrice,
            originalPrice: product.actualPrice || product.price,
            hasDiscount: product.hasDiscount,
            netRate: product.netRate,
            displayNetRate: product.displayNetRate,
            unit: product.unit || 'Box'
          })),
          subtotal,
          packingCharge,
          total
        };
        setPlacedOrder(fullOrder);
        setStep('success');
        // Clear items from cart
        cartItems.forEach(({ product }) => onRemove(product.id));
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || 'There was a problem placing your order. Please try again.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          onClose();
          setStep('cart');
        }}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[999] h-full w-full max-w-[420px] flex flex-col shadow-2xl border-l-2 border-[#B69F4C] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: '#FDF5CB' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b-2 border-[#B69F4C]"
          style={{ background: '#15803D' }}
        >
          <div className="flex items-center gap-3">
            {step === 'checkout' ? (
              <button 
                onClick={() => setStep('cart')}
                className="w-8 h-8 rounded-full bg-[#B69F4C]/20 hover:bg-[#B69F4C]/40 text-[#FDF5CB] flex items-center justify-center font-bold text-sm"
              >
                ←
              </button>
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#B69F4C] flex items-center justify-center text-[#14532D]">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
            )}
            <div>
              <h2 className="text-[#FDF5CB] font-bold text-[16px] font-poppins">
                {step === 'cart' ? 'Your Cart' : step === 'checkout' ? 'Customer Details' : 'Order Placed!'}
              </h2>
              <p className="text-[#FBECC0] text-[12px]">
                {step === 'cart' ? `${totalItems} item${totalItems !== 1 ? 's' : ''} added` : step === 'checkout' ? 'Complete your details' : 'Thank you for choosing us'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              setStep('cart');
            }}
            className="w-9 h-9 rounded-full bg-[#B69F4C]/20 hover:bg-[#B69F4C]/40 text-[#FDF5CB] flex items-center justify-center transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* STEP 1: CART ITEMS */}
        {step === 'cart' && (
          <>
            {/* Min order progress */}
            {!isMinMet && (
              <div className="px-5 py-3 bg-[#FEF9E1] border-b border-[#B69F4C]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#A67428]">
                    Add ₹{remaining.toLocaleString('en-IN')} more for {state}
                  </span>
                  <span className="text-xs font-bold text-[#14532D]">Min: ₹{activeMinOrder.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 bg-[#FBECC0] rounded-full overflow-hidden border border-[#B69F4C]/40">
                  <div
                    className="h-full rounded-full bg-[#B69F4C] transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / activeMinOrder) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {isMinMet && (
              <div className="px-5 py-2.5 bg-[#FEF9E1] border-b border-[#B69F4C] flex items-center gap-2">
                <span className="text-emerald-700 text-sm">✓</span>
                <span className="text-xs font-bold text-[#14532D]">Minimum order value requirement met!</span>
              </div>
            )}

            {/* Item list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-[#FEF9E1] border border-[#B69F4C] flex items-center justify-center text-3xl mb-3">
                    🛒
                  </div>
                  <div>
                    <p className="font-bold text-[#15803D]">Your cart is empty</p>
                    <p className="text-[#14532D] text-sm mt-1">Add crackers to get started</p>
                  </div>
                </div>
              ) : (
                cartItems.map(({ product, qty }) => (
                  <div
                    key={product.id}
                    className="bg-[#FEF9E1] rounded-2xl p-3.5 shadow-sm border border-[#B69F4C] flex gap-3 items-start animate-fade-in"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white border border-[#B69F4C] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                      <ProductImage 
                        src={product.imageUrl || product.image} 
                        type={product.imageType} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#061001] leading-tight truncate">{product.name}</p>
                      <p className="text-[11px] text-[#14532D] mt-0.5">{product.unit}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 bg-[#FDF5CB] rounded-xl px-1.5 py-0.5 border border-[#B69F4C]">
                          <button
                            onClick={() => onQtyChange(product.id, false)}
                            className="w-6 h-6 rounded-lg bg-[#15803D] text-[#FDF5CB] font-black text-sm flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                          >
                            −
                          </button>
                          <span className="text-[13px] font-extrabold text-[#061001] w-5 text-center">{qty}</span>
                          <button
                            onClick={() => onQtyChange(product.id, true)}
                            className="w-6 h-6 rounded-lg bg-[#15803D] text-[#FDF5CB] font-black text-sm flex items-center justify-center hover:bg-[#B69F4C] hover:text-[#14532D] transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-[14px] font-black text-[#A67428]">₹{(product.discountPrice * qty).toLocaleString('en-IN')}</p>
                          {product.actualPrice > product.discountPrice && (
                            <p className="text-[10px] text-slate-400 line-through">₹{(product.actualPrice * qty).toLocaleString('en-IN')}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemove(product.id)}
                      className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FDF5CB] hover:bg-red-500 hover:text-white border border-[#B69F4C] flex items-center justify-center transition-colors mt-0.5 text-[#14532D]"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Totals & Proceed Button */}
            {cartItems.length > 0 && (
              <div className="border-t-2 border-[#B69F4C] px-5 py-4 space-y-3 bg-[#FEF9E1]">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[13px] text-[#14532D]">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-[#061001]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#14532D]">
                    <span>Packing charge (3%)</span>
                    <span className="font-bold text-[#061001]">₹{packingCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-dashed border-[#B69F4C] pt-2 flex justify-between font-extrabold text-[15px]">
                    <span className="text-[#15803D]">Total</span>
                    <span className="text-[#A67428]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isMinMet) {
                      setStep('checkout');
                    }
                  }}
                  disabled={!isMinMet}
                  className={`w-full h-12 rounded-2xl font-black text-[14px] font-poppins flex items-center justify-center gap-2 transition-all duration-300 ${
                    isMinMet
                      ? 'bg-[#B69F4C] hover:bg-[#A67428] text-[#14532D] hover:text-white shadow-md active:scale-95 cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                  {isMinMet ? 'Proceed to Checkout' : `Need ₹${remaining.toLocaleString('en-IN')} more`}
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT / CUSTOMER DETAILS FORM */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="bg-[#FEF9E1] p-4 rounded-2xl border border-[#B69F4C] space-y-3">
                <h3 className="text-xs font-extrabold text-[#14532D] uppercase tracking-wider">Shipping Details</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider block mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full p-2.5 border border-[#B69F4C] rounded-xl text-xs bg-[#FDF5CB] font-semibold text-[#061001] outline-none focus:border-[#15803D]"
                      required
                    >
                      {ALL_STATES.map((stateName) => (
                        <option key={stateName} value={stateName}>
                          {stateName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider block mb-1">District / City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 border border-[#B69F4C] rounded-xl text-xs bg-[#FDF5CB] font-semibold text-[#061001] outline-none focus:border-[#15803D]"
                      required
                    >
                      {(INDIAN_STATES_AND_DISTRICTS[state] || []).map((districtName) => (
                        <option key={districtName} value={districtName}>
                          {districtName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-[#B69F4C] rounded-xl text-xs bg-[#FDF5CB] font-semibold text-[#061001] outline-none focus:border-[#15803D]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider block mb-1">Mobile No *</label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-2.5 border border-[#B69F4C] rounded-xl text-xs bg-[#FDF5CB] font-semibold text-[#061001] outline-none focus:border-[#15803D]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-[#B69F4C] rounded-xl text-xs bg-[#FDF5CB] font-semibold text-[#061001] outline-none focus:border-[#15803D]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider block mb-1">Complete Delivery Address *</label>
                  <textarea
                    placeholder="House/Door No, Street name, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 border border-[#B69F4C] rounded-xl text-xs bg-[#FDF5CB] font-semibold text-[#061001] outline-none focus:border-[#15803D] h-20 resize-none"
                    required
                  />
                </div>
              </div>

              {/* State Min Order Info & Warning */}
              {!isMinMet && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-amber-800 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <span>⚠️ Minimum Order Notice ({state}):</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Minimum order requirement for <strong>{state}</strong> is <strong>₹{activeMinOrder.toLocaleString('en-IN')}</strong>. Please add <strong>₹{remaining.toLocaleString('en-IN')}</strong> more items to complete checkout.
                  </p>
                </div>
              )}

              {/* Summary Box */}
              <div className="bg-[#FEF9E1] p-3 rounded-2xl border border-[#B69F4C] space-y-1.5 text-xs text-[#14532D]">
                <div className="flex justify-between">
                  <span>State Delivery Zone:</span>
                  <span className="font-bold">{state === 'Tamil Nadu' ? 'Tamil Nadu (Min ₹' + tnMinOrder.toLocaleString('en-IN') + ')' : 'Outside Tamil Nadu (Min ₹' + outsideTNMinOrder.toLocaleString('en-IN') + ')'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packing Charge (3%):</span>
                  <span className="font-bold">₹{packingCharge.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#15803D] border-t border-dashed border-[#B69F4C] pt-1.5">
                  <span>Total Payable:</span>
                  <span className="text-[#A67428]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t-2 border-[#B69F4C] bg-[#FEF9E1] space-y-2">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full h-12 rounded-2xl font-black text-[14px] font-poppins flex items-center justify-center gap-2 transition-all duration-300 ${
                  isFormValid && !isSubmitting
                    ? 'bg-[#B69F4C] hover:bg-[#A67428] text-[#14532D] hover:text-white shadow-md active:scale-95 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                }`}
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <span>Place Order / Enquiry (₹{total.toLocaleString('en-IN')})</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-full text-center text-xs font-bold text-[#14532D] py-1.5 hover:underline"
              >
                Back to Cart
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 text-3xl shadow-inner">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 font-poppins">Order Placed Successfully!</h3>
              {placedOrder?.orderNumber && (
                <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                  Order #{placedOrder.orderNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
              Thank you, <strong>{name}</strong>! Your order/enquiry for delivery to <strong>{city}, {state}</strong> has been recorded. Our team will contact you at <strong>{mobile}</strong> shortly to confirm availability and dispatch details.
            </p>

            {/* PDF Bill Action Buttons */}
            {placedOrder && (
              <div className="w-full space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => downloadOrderReceiptPDF(placedOrder)}
                  className="w-full h-11 bg-[#900000] hover:bg-red-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  📄 Download PDF Estimate / Bill
                </button>
                <button
                  type="button"
                  onClick={() => printOrderReceipt(placedOrder)}
                  className="w-full h-10 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  🖨️ Print Receipt
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                setStep('cart');
              }}
              className="mt-2 w-full h-11 bg-[#15803D] hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
