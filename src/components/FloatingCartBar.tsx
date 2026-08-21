import React from 'react';

interface FloatingCartBarProps {
  cartCount: number;
  cartTotal: number;
  mktTotal?: number;
  onCartOpen: () => void;
  onCheckout: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  cartCount,
  cartTotal,
  mktTotal,
  onCartOpen,
  onCheckout
}) => {
  if (cartCount <= 0) return null;

  const savings = mktTotal && mktTotal > cartTotal ? mktTotal - cartTotal : 0;

  return (
    <aside 
      aria-label="Fixed Cart Summary"
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-[990] w-[92%] sm:w-full max-w-2xl bg-slate-900/95 text-white py-2 px-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-[#E6A100]/40 backdrop-blur-md transition-all duration-300 animate-slide-up flex items-center justify-between gap-2 sm:gap-3"
    >
      {/* Left: Cart Icon & Price Info */}
      <div 
        onClick={onCartOpen}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-1 min-w-0"
      >
        <div className="relative flex-shrink-0 w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#E6A100]/20 border border-[#E6A100]/40 flex items-center justify-center text-sm sm:text-xl group-hover:scale-105 transition-transform">
          🛒
          <span className="absolute -top-1.5 -right-1.5 bg-[#E6A100] text-slate-950 font-black text-[9px] sm:text-[11px] h-4 min-w-[16px] sm:h-5 sm:min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-md">
            {cartCount}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-xl font-bold sm:font-extrabold text-white tracking-tight">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          {savings > 0 ? (
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 truncate">
              Save ₹{savings.toLocaleString('en-IN')}
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              Tap to view
            </span>
          )}
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onCartOpen}
          className="hidden sm:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
        >
          View Cart
        </button>

        <button
          type="button"
          onClick={onCheckout}
          className="bg-[#E6A100] hover:bg-[#D48800] text-slate-950 font-extrabold text-[11px] sm:text-sm px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-1 sm:gap-1.5 uppercase tracking-wide"
        >
          <span>Checkout</span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </aside>
  );
};
