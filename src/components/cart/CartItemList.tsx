"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPaiseToRupees } from "@/lib/formatters";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export function CartItemList() {
  const { items, updateQuantity, removeFromCart, clearCart, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-stone-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-stone-200 p-8 space-y-4">
        <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto text-brand-600">
          <ShoppingBag className="w-7 h-7" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-stone-900">Your Snack Cart is Empty</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Explore our freshly prepared homemade sweets, crunchy khakhras, and traditional savory namkeen.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md bg-brand-600 text-white hover:bg-brand-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100 overflow-hidden">
      <div className="p-4 bg-stone-50 flex justify-between items-center text-xs font-semibold text-stone-600">
        <span>Shopping Items ({items.length})</span>
        <button
          onClick={clearCart}
          type="button"
          className="text-stone-500 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="divide-y divide-stone-100">
        {items.map(({ product_id, product, quantity }) => (
          <div key={product_id} className="p-4 sm:p-6 flex gap-4 items-center">
            {/* Thumbnail */}
            <div className="relative w-20 h-20 bg-stone-100 rounded-md overflow-hidden shrink-0 border border-stone-200">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-6 h-6" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="flex-grow min-w-0">
              <h4 className="font-semibold text-sm text-stone-900 truncate">
                <Link
                  href={`/products/${product.slug}`}
                  className="hover:text-brand-700 transition-colors"
                >
                  {product.name}
                </Link>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">{product.weight_or_size}</p>
              <div className="text-xs font-bold text-stone-900 mt-1">
                {formatPaiseToRupees(product.price_in_paise)} each
              </div>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                <button
                  type="button"
                  onClick={() => updateQuantity(product_id, quantity - 1)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-l transition-colors"
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <span className="w-8 text-center text-xs font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product_id, quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-r transition-colors disabled:opacity-40"
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Total for this row */}
              <div className="text-right w-20 hidden sm:block">
                <span className="text-sm font-bold text-stone-900">
                  {formatPaiseToRupees(product.price_in_paise * quantity)}
                </span>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFromCart(product_id)}
                className="p-2 text-stone-400 hover:text-rose-600 rounded-md transition-colors"
                aria-label={`Remove ${product.name} from cart`}
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
