import React from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No snacks found in this selection.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-stone-300 rounded-lg p-8">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-3">
          <ShoppingBag className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-stone-800">{emptyMessage}</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search keywords or browsing our other homemade snack categories.
        </p>
        <div className="mt-4">
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md bg-brand-600 text-white hover:bg-brand-700"
          >
            View All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

