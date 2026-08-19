import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Tag, Plus, Minus, AlertCircle } from "lucide-react";
import type { Product } from "@/data/products";

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

  if (!product) return null;

  // Compute pricing
  const rawPrice = Number(product.price) || 0;
  const netRate = Number(product.netRate) || 0;
  const isDisplayNetRate = !!product.displayNetRate && netRate > 0;
  const hasDiscount = !!product.hasDiscount && !isDisplayNetRate;
  const discountPct = Number(product.globalDiscountPct) || 80; // default 80% discount if active

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
  const imageSrc = product.image || product.imageUrl || "https://images.unsplash.com/photo-1543621453-911e3b5e4070?auto=format&fit=crop&w=600&q=80";

  const handleAdd = () => {
    if (onAddToCart && !isOutOfStock) {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl rounded-2xl [&>button]:text-white [&>button]:hover:text-cyan-200 [&>button]:top-5 [&>button]:right-5">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#164B60] via-[#1F6E8C] to-[#0B2447] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300 font-bold">
            </div>
            <div>
              <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                {product.name}
              </DialogTitle>
              <DialogDescription className="text-cyan-100 text-xs mt-0.5 font-mono">
                Code: {productCode} {categoryName ? `• ${categoryName}` : ""}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Image & Badges */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-full aspect-[3/4] max-h-[380px] rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 shadow-md group">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Status Badges Overlay */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {isOutOfStock ? (
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                  </span>
                ) : isDisplayNetRate ? (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md">
                    ⚡ Net Rate
                  </span>
                ) : hasDiscount && discountPct > 0 ? (
                  <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                    🔥 {discountPct}% OFF
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md">
                    ✓ In Stock
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-md">
                1200 × 1600 px
              </div>
            </div>

            {/* Quick Specs Pill Badges */}
            <div className="flex flex-wrap gap-2 w-full justify-center">
              <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-zinc-800 font-mono">
                Code: {productCode}
              </Badge>
              {categoryName && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  📁 {categoryName}
                </Badge>
              )}
              {product.brand && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  🏷️ {product.brand}
                </Badge>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Product Info */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {product.name}
                </h2>
                {product.unit && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Pack/Unit: <span className="font-semibold text-gray-700 dark:text-gray-300">{product.unit}</span>
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-zinc-800 dark:to-zinc-800/80 p-4 rounded-xl border border-cyan-100 dark:border-zinc-700 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price Details
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#164B60] dark:text-cyan-400">
                    ₹{finalPrice.toFixed(2)}
                  </span>
                  {(hasDiscount || isDisplayNetRate) && rawPrice > finalPrice && (
                    <span className="text-sm line-through text-gray-400 font-medium">
                      ₹{rawPrice.toFixed(2)}
                    </span>
                  )}
                  {hasDiscount && rawPrice > finalPrice && (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      Save ₹{(rawPrice - finalPrice).toFixed(2)}
                    </span>
                  )}
                </div>
                {isDisplayNetRate && (
                  <p className="text-xs text-amber-700 font-medium pt-0.5">
                    * Fixed Net Rate product (No extra discounts apply)
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Description
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-gray-100 dark:border-zinc-800 min-h-[60px]">
                  {product.description || "High-quality premium cracker product. Tested for safety and vibrant fireworks performance."}
                </p>
              </div>

              {/* Stock / Inventory Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 dark:bg-zinc-800 p-2.5 rounded-lg border border-gray-100 dark:border-zinc-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-600" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Shop Stock</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {product.storeStockPieces !== undefined ? product.storeStockPieces : (product.stock || 0)} Pcs
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 p-2.5 rounded-lg border border-gray-100 dark:border-zinc-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Case Packaging</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {product.piecesPerCase || 1} Pcs/Case
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            {onAddToCart && (
              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                {!isOutOfStock && (
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 p-2 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pl-2">Select Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-lg"
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
                  className="w-full bg-[#A2FF86] hover:bg-[#8be371] text-[#164B60] font-bold py-6 text-base shadow-lg hover:shadow-xl transition-all rounded-xl flex items-center justify-center gap-2"
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
  );
};

export default ProductDetailModal;
