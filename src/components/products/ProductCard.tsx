"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { Product } from "@/types";
import { formatPaiseToRupees } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check, AlertCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const cartItem = items.find((i) => i.product_id === product.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <article className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-stone-100 block">
        <SafeImage
          src={product.image_url || "/images/products/fallback-snack.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackSrc="/images/products/fallback-snack.svg"
        />

        {/* Stock / Featured Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white rounded">
              Featured
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-700 text-white rounded">
              Out of Stock
            </span>
          )}
          {isLowStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white rounded flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
              Only {product.stock_quantity} Left
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {product.category && (
            <span className="text-xs text-brand-700 font-medium uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <h3 className="font-semibold text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-1 mt-0.5">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {product.weight_or_size}
          </p>
        </div>

        <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-stone-900">
              {formatPaiseToRupees(product.price_in_paise)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              isOutOfStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : addedAnimation
                ? "bg-emerald-600 text-white"
                : "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                Added
              </>
            ) : currentQuantityInCart > 0 ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                In Cart ({currentQuantityInCart})
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

