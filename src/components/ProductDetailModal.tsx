import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Tag, Plus, Minus, AlertCircle, Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { Product } from "@/data/products";
import { getHighResImageUrl } from "./ProductImage";
import { toast } from "sonner";

export interface ProductDetailModalProps {
  product: Product | any | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: any, quantity: number) => void;
  initialQuantity?: number;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  initialQuantity = 1,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!product) return null;

  // Compute pricing
  const rawPrice = Number(product.price) || 0;
  const netRate = Number(product.netRate) || 0;
  const isDisplayNetRate = !!product.displayNetRate && netRate > 0;
  const hasDiscount = !!product.hasDiscount && !isDisplayNetRate;
  const discountPct = Number(product.globalDiscountPct) || 80;

  let finalPrice = rawPrice;
  if (isDisplayNetRate) {
    finalPrice = netRate;
  } else if (hasDiscount && discountPct > 0) {
    finalPrice = Math.round(rawPrice * (1 - discountPct / 100));
  } else if (product.discountPrice !== undefined) {
    finalPrice = Number(product.discountPrice);
  }

  const isOutOfStock = (product.stock !== undefined ? product.stock : 1) <= 0;
  const categoryName = typeof product.category === "object" ? product.category?.name : product.category;
  const productCode = product.code || product.sku || "N/A";
  const rawImageSrc = product.image || product.imageUrl || "https://images.unsplash.com/photo-1543621453-911e3b5e4070?auto=format&fit=crop&w=1600&q=95";
  const modalImageSrc = getHighResImageUrl(rawImageSrc, 1600, 95);
  const lightboxImageSrc = getHighResImageUrl(rawImageSrc, 2600, 100);

  const handleAdd = () => {
    if (onAddToCart && !isOutOfStock) {
      onAddToCart(product, quantity);
      toast.success(`${quantity} ${product.name} added to cart`, { duration: 2000 });
      onClose();
    }
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.4, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.4, 0.6));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl [&>button]:text-slate-500 [&>button]:hover:text-slate-900 [&>button]:bg-slate-100/90 [&>button]:hover:bg-slate-200 [&>button]:p-2 [&>button]:rounded-full [&>button]:top-4 [&>button]:right-4 z-50">
          {/* Header Banner */}
          <div className="bg-slate-50 px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300/60 flex items-center justify-center text-amber-600 font-bold text-xl shrink-0">
                ✨
              </div>
              <div>
                <DialogTitle className="text-slate-900 text-lg sm:text-xl font-black tracking-tight">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="text-slate-500 text-xs mt-0.5 font-medium flex items-center gap-2">
                  <span className="font-mono bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded text-[11px]">Code: {productCode}</span>
                  {categoryName && <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded text-[11px] font-semibold">• {categoryName}</span>}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white text-slate-900 max-h-[82vh] overflow-y-auto">
            {/* Left Column: Image Preview with Click-To-Enlarge */}
            <div className="flex flex-col items-center gap-3">
              <div 
                onClick={() => {
                  setZoomLevel(1.5);
                  setIsLightboxOpen(true);
                }}
                className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50/80 shadow-sm group cursor-zoom-in flex items-center justify-center p-4 transition-all duration-300 hover:border-amber-400"
                title="Click to view full ultra-HD enlarged image"
              >
                <img
                  src={modalImageSrc}
                  alt={product.name}
                  decoding="async"
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                  className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-slate-700 backdrop-blur-md">
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                    <span>Click for Ultra HD Zoom</span>
                  </div>
                </div>

                {/* Status Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  {isOutOfStock ? (
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-md flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  ) : isDisplayNetRate ? (
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-md">
                      ⚡ Net Rate Product
                    </span>
                  ) : hasDiscount && discountPct > 0 ? (
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold shadow-md">
                      🔥 {discountPct}% OFF
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-md">
                      ✓ In Stock
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 shadow-sm">
                  <Maximize2 className="w-3 h-3 text-amber-400" /> Full Screen
                </div>
              </div>

              {/* Quick Specs Badges */}
              <div className="flex flex-wrap gap-2 w-full justify-center">
                <Badge variant="outline" className="text-xs bg-slate-100 border-slate-200 text-slate-700 font-mono">
                  Code: {productCode}
                </Badge>
                {categoryName && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                    📁 {categoryName}
                  </Badge>
                )}
                {product.brand && (
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 font-semibold">
                    🏷️ {product.brand}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Product Info & Description */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight font-sans tracking-tight">
                    {product.name}
                  </h2>
                  {product.unit && (
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Packaging / Unit: <span className="font-bold text-slate-800">{product.unit}</span>
                    </p>
                  )}
                </div>

                {/* Price Card */}
                <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-200/80 space-y-1.5 shadow-xs">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
                    Wholesale Price
                  </div>
                  <div className="flex items-baseline flex-wrap gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    {(hasDiscount || isDisplayNetRate) && rawPrice > finalPrice && (
                      <span className="text-base line-through text-slate-400 font-semibold">
                        ₹{rawPrice.toFixed(2)}
                      </span>
                    )}
                    {hasDiscount && rawPrice > finalPrice && (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                        Save ₹{(rawPrice - finalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {isDisplayNetRate && (
                    <p className="text-xs text-blue-700 font-bold pt-0.5">
                      ⚡ Fixed Net Rate Product (Direct Wholesale Price)
                    </p>
                  )}
                </div>

                {/* Product Description Section - Prominent, Bright & High-Contrast */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span className="text-amber-600 text-base">📜</span> Product Description
                    </h3>
                    <span className="text-[11px] text-slate-500 font-semibold">Customer Overview</span>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-xs font-normal min-h-[90px]">
                    {product.description && product.description.trim() ? (
                      product.description
                    ) : (
                      <div className="space-y-2 text-slate-700">
                        <p className="font-semibold text-slate-900">
                          High-quality premium cracker product from Sivakasi. Tested for safety and vibrant fireworks performance.
                        </p>
                        <p className="text-xs text-slate-600 leading-normal">
                          Crafted using high-grade pyrotechnic formulations to ensure brilliant visual effects, loud crisp sound output, and minimal residue. Perfect for festivals, weddings, and grand family celebrations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quality & Safety Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Store Stock</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {product.storeStockPieces !== undefined ? product.storeStockPieces : (product.stock || 0)} Pcs Available
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Case Packaging</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {product.piecesPerCase || 1} Pcs / Box
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feature Badges Bar */}
                <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-around gap-2 text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1 text-emerald-700">
                    ✓ Authentic Sivakasi Made
                  </span>
                  <span className="flex items-center gap-1 text-blue-700">
                    ✓ Safety Standard Verified
                  </span>
                  <span className="flex items-center gap-1 text-amber-700">
                    ✓ Direct Factory Wholesale
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {onAddToCart && (
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  {!isOutOfStock && (
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 pl-2">Select Quantity:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg bg-white border-slate-200 text-slate-800 hover:bg-slate-100 shadow-xs"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center font-extrabold text-sm text-slate-900">{quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg bg-white border-slate-200 text-slate-800 hover:bg-slate-100 shadow-xs"
                          onClick={() => setQuantity((q) => q + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-6 text-base shadow-md hover:shadow-lg transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isOutOfStock ? "Out of Stock" : `Add to Cart • ₹${(finalPrice * quantity).toFixed(2)}`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-Screen Ultra-HD Image Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={(open) => !open && setIsLightboxOpen(false)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/95 border border-zinc-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden text-white z-[70] [&>button]:text-white [&>button]:hover:text-primary-blue [&>button]:bg-black/70 [&>button]:p-2 [&>button]:rounded-full [&>button]:top-4 [&>button]:right-4">
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-20">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-base md:text-lg text-white truncate max-w-[260px] md:max-w-md">
                {product.name}
              </h3>
              <span className="text-xs font-mono text-primary-blue bg-primary-blue/10 border border-primary-blue/30 px-2.5 py-0.5 rounded-full">
                Code: {productCode}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 mr-10">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-primary-blue font-bold min-w-[50px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-200 transition-colors ml-1"
                title="Reset Zoom (100%)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Interactive Image Stage */}
          <div 
            className="flex-1 overflow-auto flex items-center justify-center p-6 relative cursor-grab active:cursor-grabbing select-none"
            onClick={() => {
              setZoomLevel((prev) => (prev > 1.4 ? 1 : 2.2));
            }}
          >
            <img
              src={lightboxImageSrc}
              alt={product.name}
              decoding="async"
              style={{ 
                transform: `scale(${zoomLevel}) translateZ(0)`,
                imageRendering: '-webkit-optimize-contrast',
                backfaceVisibility: 'hidden'
              }}
              className="max-h-full max-w-full object-contain transition-transform duration-200 ease-out drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-xl select-none"
            />
          </div>

          {/* Lightbox Footer Bar */}
          <div className="px-6 py-3 bg-black/80 backdrop-blur-md border-t border-zinc-800 text-xs text-gray-400 flex items-center justify-between">
            <span className="text-[12px] text-gray-400 hidden sm:inline">
              💡 Tip: Click image to toggle 2x Zoom • Use controls at top to zoom up to 400%
            </span>
            <span className="text-primary-blue font-extrabold text-base ml-auto">
              ₹{finalPrice.toFixed(2)}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductDetailModal;
