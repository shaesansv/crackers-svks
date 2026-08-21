import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Tag, Plus, Minus, AlertCircle } from "lucide-react";
import type { Product } from "@/data/products";
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
  const imageSrc = product.image || product.imageUrl || "https://images.unsplash.com/photo-1543621453-911e3b5e4070?auto=format&fit=crop&w=600&q=80";

  const handleAdd = () => {
    if (onAddToCart && !isOutOfStock) {
      onAddToCart(product, quantity);
      toast.success(`${quantity} ${product.name} added to cart`, { duration: 2000 });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-2xl p-0 overflow-hidden border-2 border-[#B69F4C] shadow-2xl rounded-3xl [&>button]:text-[#FDF5CB] [&>button]:hover:text-white [&>button]:top-4 [&>button]:right-4"
        style={{ background: '#FDF5CB' }}
      >
        {/* Banner Header */}
        <div className="bg-[#15803D] px-6 py-4 flex items-center justify-between text-[#FDF5CB] border-b-2 border-[#B69F4C]">
          <div>
            <DialogTitle className="text-[#FDF5CB] text-lg font-bold font-poppins flex items-center gap-2">
              {product.name}
            </DialogTitle>
            <DialogDescription className="text-[#FBECC0] text-xs mt-0.5">
              {product.unit ? `Pack Unit: ${product.unit}` : ''} {categoryName ? `• ${categoryName}` : ""}
            </DialogDescription>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto font-inter">
          {/* Left Column: Image & Badges */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-full aspect-square sm:aspect-[3/4] max-h-[320px] rounded-2xl overflow-hidden border-2 border-[#B69F4C] bg-[#FEF9E1] shadow-md group">
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
                  <span className="px-3 py-1 rounded-full bg-[#15803D] text-white text-xs font-bold shadow-md">
                    ⚡ Net Rate
                  </span>
                ) : hasDiscount && discountPct > 0 ? (
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md">
                    🔥 {discountPct}% OFF
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#15803D] text-white text-xs font-bold shadow-md">
                    ✓ In Stock
                  </span>
                )}
              </div>
            </div>

            {/* Quick Specs Pill Badges */}
            <div className="flex flex-wrap gap-2 w-full justify-center">
              {categoryName && (
                <Badge variant="outline" className="text-xs bg-[#FEF9E1] text-[#14532D] border-[#B69F4C] font-semibold">
                  📁 {categoryName}
                </Badge>
              )}
              {product.unit && (
                <Badge variant="outline" className="text-xs bg-[#FEF9E1] text-[#14532D] border-[#B69F4C] font-semibold">
                  📦 {product.unit}
                </Badge>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Product Info */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-[#061001] font-poppins leading-tight">
                  {product.name}
                </h2>
                {product.unit && (
                  <p className="text-xs text-[#14532D] font-semibold mt-1">
                    Packaging: <span className="text-[#061001] font-bold">{product.unit}</span>
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-[#FEF9E1] p-4 rounded-2xl border-2 border-[#B69F4C] shadow-sm space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#14532D]">
                  Offer Price
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#A67428]">
                    ₹{finalPrice.toFixed(0)}
                  </span>
                  {(hasDiscount || isDisplayNetRate) && rawPrice > finalPrice && (
                    <span className="text-sm line-through text-slate-400 font-medium">
                      ₹{rawPrice.toFixed(0)}
                    </span>
                  )}
                  {hasDiscount && rawPrice > finalPrice && (
                    <span className="text-xs font-bold text-[#15803D] bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Save ₹{(rawPrice - finalPrice).toFixed(0)}
                    </span>
                  )}
                </div>
                {isDisplayNetRate && (
                  <p className="text-xs text-amber-800 font-semibold pt-0.5">
                    * Fixed Net Rate product
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#14532D]">
                  Product Description
                </h4>
                <p className="text-xs text-[#061001] leading-relaxed bg-[#FEF9E1] p-3 rounded-xl border border-[#B69F4C] font-semibold">
                  {product.description || "High-quality premium Sivakasi cracker product. Tested for safety and vibrant fireworks performance."}
                </p>
              </div>

              {/* Stock Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#FEF9E1] p-2.5 rounded-xl border border-[#B69F4C] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#15803D]" />
                  <div>
                    <span className="text-[#14532D] block text-[10px] font-bold uppercase">Status</span>
                    <span className="font-extrabold text-[#061001]">
                      {isOutOfStock ? 'Sold Out' : 'In Stock'}
                    </span>
                  </div>
                </div>
                <div className="bg-[#FEF9E1] p-2.5 rounded-xl border border-[#B69F4C] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#A67428]" />
                  <div>
                    <span className="text-[#14532D] block text-[10px] font-bold uppercase">Quality</span>
                    <span className="font-extrabold text-[#061001]">
                      100% Sivakasi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            {onAddToCart && (
              <div className="pt-2 border-t border-[#B69F4C]/40 space-y-3">
                {!isOutOfStock && (
                  <div className="flex items-center justify-between bg-[#FEF9E1] p-2 rounded-xl border border-[#B69F4C]">
                    <span className="text-xs font-bold text-[#14532D] pl-2">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-lg bg-[#15803D] text-[#FDF5CB] hover:bg-red-600 hover:text-white border-0 font-bold"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center font-extrabold text-sm text-[#061001]">{quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-lg bg-[#15803D] text-[#FDF5CB] hover:bg-[#B69F4C] hover:text-[#14532D] border-0 font-bold"
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
                  className={`w-full h-12 rounded-2xl font-black text-sm font-poppins flex items-center justify-center gap-2 shadow-md transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                      : 'bg-[#B69F4C] hover:bg-[#A67428] text-[#14532D] hover:text-white active:scale-95 cursor-pointer'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? "Out of Stock" : `Add to Cart • ₹${(finalPrice * quantity).toFixed(0)}`}
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
