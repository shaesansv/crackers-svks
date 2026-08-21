import React, { useEffect } from 'react';
import type { Product } from '../types';

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
  settings: { minOrderValue?: number } | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onQtyChange,
  onRemove,
  onCheckout,
  settings,
}) => {
  const minOrder = settings?.minOrderValue ?? 3000;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const subtotal = cartItems.reduce((sum, { product, qty }) => sum + product.discountPrice * qty, 0);
  const packingCharge = Math.round(subtotal * 0.03);
  const total = subtotal + packingCharge;
  const totalItems = cartItems.reduce((sum, { qty }) => sum + qty, 0);
  const isMinMet = subtotal >= minOrder;
  const remaining = Math.max(0, minOrder - subtotal);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
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
            <div className="w-9 h-9 rounded-full bg-[#B69F4C] flex items-center justify-center text-[#14532D]">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-[#FDF5CB] font-bold text-[16px] font-poppins">Your Cart</h2>
              <p className="text-[#FBECC0] text-[12px]">{totalItems} item{totalItems !== 1 ? 's' : ''} added</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#B69F4C]/20 hover:bg-[#B69F4C]/40 text-[#FDF5CB] flex items-center justify-center transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Min order progress */}
        {!isMinMet && (
          <div className="px-5 py-3 bg-[#FEF9E1] border-b border-[#B69F4C]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#A67428]">
                Add ₹{remaining.toLocaleString('en-IN')} more to place order
              </span>
              <span className="text-xs font-bold text-[#14532D]">Min: ₹{minOrder.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full h-2 bg-[#FBECC0] rounded-full overflow-hidden border border-[#B69F4C]/40">
              <div
                className="h-full rounded-full bg-[#B69F4C] transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / minOrder) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {isMinMet && (
          <div className="px-5 py-2.5 bg-[#FEF9E1] border-b border-[#B69F4C] flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="text-xs font-extrabold text-[#15803D]">Minimum order met! Ready to checkout</span>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="w-20 h-20 rounded-full bg-[#FEF9E1] border-2 border-[#B69F4C] flex items-center justify-center text-[#14532D]">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <div className="text-center">
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
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#FDF5CB] border border-[#B69F4C] flex items-center justify-center flex-shrink-0 text-xl overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>🎆</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#061001] leading-tight truncate">{product.name}</p>
                  <p className="text-[11px] text-[#14532D] mt-0.5">{product.unit}</p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
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

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-[14px] font-black text-[#A67428]">₹{(product.discountPrice * qty).toLocaleString('en-IN')}</p>
                      {product.actualPrice > product.discountPrice && (
                        <p className="text-[10px] text-slate-400 line-through">₹{(product.actualPrice * qty).toLocaleString('en-IN')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove */}
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

        {/* Footer / Totals */}
        {cartItems.length > 0 && (
          <div className="border-t-2 border-[#B69F4C] px-5 py-4 space-y-3 bg-[#FEF9E1]">
            {/* Breakdown */}
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

            {/* Checkout Button (#B69F4C Primary Gold Button) */}
            <button
              onClick={() => {
                if (isMinMet) {
                  onCheckout();
                  onClose();
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
      </aside>
    </>
  );
};
