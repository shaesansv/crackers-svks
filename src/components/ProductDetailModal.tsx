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
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white dark:bg-[#0D1628] border border-border-gray shadow-2xl rounded-2xl [&>button]:text-white [&>button]:hover:text-primary-blue [&>button]:top-5 [&>button]:right-5 z-50">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#070D1A] via-[#111C30] to-[#0D1628] px-6 py-4 flex items-center justify-between text-white border-b border-border-gray">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-blue/15 flex items-center justify-center text-primary-blue font-bold text-lg">
                ✨
              </div>
              <div>
                <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-xs mt-0.5 font-mono">
                  Code: {productCode} {categoryName ? `• ${categoryName}` : ""}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#070D1A] text-white max-h-[80vh] overflow-y-auto">
            {/* Left Column: Image Preview with Click-To-Enlarge */}
            <div className="flex flex-col items-center gap-3">
              <div 
                onClick={() => {
                  setZoomLevel(1.5);
                  setIsLightboxOpen(true);
                }}
                className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden border border-border-gray bg-gradient-to-b from-[#111C30] to-[#0D1628] shadow-xl group cursor-zoom-in flex items-center justify-center p-4 transition-all duration-300 hover:border-primary-blue/60"
                title="Click to view full ultra-HD enlarged image"
              >
                <img
                  src={modalImageSrc}
                  alt={product.name}
                  decoding="async"
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                  className="max-h-full max-w-full object-contain rounded-lg drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-black/85 text-primary-blue text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-primary-blue/40 backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                    <span>Click for Ultra HD Zoom</span>
                  </div>
                </div>

                {/* Status Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  {isOutOfStock ? (
                    <span className="px-3 py-1 rounded-full bg-danger-red text-white text-xs font-bold shadow-md flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  ) : isDisplayNetRate ? (
                    <span className="px-3 py-1 rounded-full bg-primary-blue text-[#070D1A] text-xs font-extrabold shadow-md">
                      ⚡ Net Rate
                    </span>
                  ) : hasDiscount && discountPct > 0 ? (
                    <span className="px-3 py-1 rounded-full bg-danger-red text-white text-xs font-bold shadow-md">
                      🔥 {discountPct}% OFF
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-success-green text-white text-xs font-bold shadow-md">
                      ✓ In Stock
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-gray-300 text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-primary-blue" /> Full Screen
                </div>
              </div>

              {/* Quick Specs Badges */}
              <div className="flex flex-wrap gap-2 w-full justify-center">
                <Badge variant="outline" className="text-xs bg-[#111C30] border-border-gray text-gray-300 font-mono">
                  Code: {productCode}
                </Badge>
                {categoryName && (
                  <Badge variant="outline" className="text-xs bg-[#111C30] text-primary-blue border-primary-blue/30">
                    📁 {categoryName}
                  </Badge>
                )}
                {product.brand && (
                  <Badge variant="outline" className="text-xs bg-[#111C30] text-purple-400 border-purple-500/30">
                    🏷️ {product.brand}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Product Info */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-white leading-tight font-sans">
                    {product.name}
                  </h2>
                  {product.unit && (
                    <p className="text-xs text-gray-400 mt-1">
                      Packaging / Unit: <span className="font-semibold text-gray-200">{product.unit}</span>
                    </p>
                  )}
                </div>

                {/* Price Card */}
                <div className="bg-[#111C30] p-4 rounded-2xl border border-border-gray space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Price Details
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-primary-blue">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    {(hasDiscount || isDisplayNetRate) && rawPrice > finalPrice && (
                      <span className="text-base line-through text-gray-500 font-medium">
                        ₹{rawPrice.toFixed(2)}
                      </span>
                    )}
                    {hasDiscount && rawPrice > finalPrice && (
                      <span className="text-xs font-bold text-success-green bg-success-green/10 border border-success-green/30 px-2.5 py-1 rounded-full">
                        Save ₹{(rawPrice - finalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {isDisplayNetRate && (
                    <p className="text-xs text-primary-blue font-medium pt-0.5">
                      * Fixed Net Rate product (Direct Wholesale Price)
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Description
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed bg-[#111C30]/50 p-3.5 rounded-xl border border-border-gray min-h-[60px]">
                    {product.description || "High-quality premium cracker product from Sivakasi. Tested for safety and vibrant fireworks performance."}
                  </p>
                </div>

                {/* Stock Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#111C30] p-2.5 rounded-xl border border-border-gray flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary-blue" />
                    <div>
                      <span className="text-gray-400 block text-[10px]">Shop Stock</span>
                      <span className="font-bold text-white">
                        {product.storeStockPieces !== undefined ? product.storeStockPieces : (product.stock || 0)} Pcs
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#111C30] p-2.5 rounded-xl border border-border-gray flex items-center gap-2">
                    <Tag className="w-4 h-4 text-accent-orange" />
                    <div>
                      <span className="text-gray-400 block text-[10px]">Case Packaging</span>
                      <span className="font-bold text-white">
                        {product.piecesPerCase || 1} Pcs/Case
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {onAddToCart && (
                <div className="pt-2 border-t border-border-gray space-y-3">
                  {!isOutOfStock && (
                    <div className="flex items-center justify-between bg-[#111C30] p-2.5 rounded-xl border border-border-gray">
                      <span className="text-xs font-bold text-gray-300 pl-2">Select Quantity:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg bg-[#070D1A] border-border-gray text-white hover:bg-primary-blue/20"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg bg-[#070D1A] border-border-gray text-white hover:bg-primary-blue/20"
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
                    className="w-full bg-primary-blue hover:bg-primary-hover text-[#070D1A] font-extrabold py-6 text-base shadow-lg hover:shadow-xl transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer"
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
