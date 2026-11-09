"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPaiseToRupees } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Truck,
  ShieldCheck,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const cartItem = items.find((i) => i.product_id === product.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const maxAvailable = product.stock_quantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Product Image Gallery / Display */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative aspect-square rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shadow-sm">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <ShoppingBag className="w-16 h-16" aria-hidden="true" />
            </div>
          )}

          {product.is_featured && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-brand-600 text-white rounded">
              Featured Snack
            </span>
          )}
        </div>
      </div>

      {/* Product Information & Purchase Panel */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-xs font-bold text-brand-700 uppercase tracking-wider hover:underline"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            {product.name}
          </h1>
          <p className="text-xs font-semibold text-stone-500 mt-1">
            Pack Size: {product.weight_or_size}
          </p>
        </div>

        {/* Pricing & Stock status */}
        <div className="flex items-baseline gap-4 border-y border-stone-200 py-3">
          <span className="text-3xl font-extrabold text-stone-900">
            {formatPaiseToRupees(product.price_in_paise)}
          </span>
          <span className="text-xs text-stone-500">
            (inclusive of all taxes, COD available)
          </span>

          <div className="ml-auto">
            {isOutOfStock ? (
              <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded flex items-center gap-1">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                Only {product.stock_quantity} Left
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded">
                In Stock ({product.stock_quantity} packs)
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            About this Snack
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Quantity Selector and Add-to-Cart */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-stone-300 rounded-md bg-stone-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-l transition-colors disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="w-12 text-center text-sm font-bold text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                disabled={quantity >= maxAvailable || isOutOfStock}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-r transition-colors disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              type="button"
              className={`flex-grow py-3 px-6 rounded-md text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                  : addedAnimation
                  ? "bg-emerald-600 text-white"
                  : "bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Added {quantity} to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  Add to Cart ({formatPaiseToRupees(product.price_in_paise * quantity)})
                </>
              )}
            </button>
          </div>

          {currentQuantityInCart > 0 && (
            <p className="text-xs text-stone-500">
              You currently have <strong>{currentQuantityInCart}</strong> of this item in your{" "}
              <Link href="/cart" className="text-brand-700 font-semibold underline">
                shopping cart
              </Link>.
            </p>
          )}
        </div>

        {/* Nutritional & Shelf-life Specifications */}
        <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 space-y-3 text-xs">
          {product.ingredients && (
            <div>
              <span className="font-bold text-stone-800 block">Ingredients:</span>
              <span className="text-stone-600">{product.ingredients}</span>
            </div>
          )}

          {product.allergen_info && (
            <div>
              <span className="font-bold text-stone-800 block">Allergen Notice:</span>
              <span className="text-stone-600">{product.allergen_info}</span>
            </div>
          )}

          {product.shelf_life_days && (
            <div>
              <span className="font-bold text-stone-800 block">Shelf Life:</span>
              <span className="text-stone-600">
                {product.shelf_life_days} days from dispatch date when kept in an airtight container away from direct sunlight.
              </span>
            </div>
          )}
        </div>

        {/* Delivery & Reassurance Notice */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-stone-600">
          <div className="flex items-center gap-2 p-2.5 bg-white border border-stone-200 rounded">
            <Truck className="w-4 h-4 text-brand-600 shrink-0" aria-hidden="true" />
            <span>Cash on Delivery across India</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white border border-stone-200 rounded">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>Freshness sealed guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
