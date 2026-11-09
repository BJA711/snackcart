import React from "react";
import { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { ShopClient } from "@/components/products/ShopClient";

export const metadata: Metadata = {
  title: "Shop Homemade Indian Snacks | SnackCart",
  description:
    "Browse our complete catalogue of freshly prepared homemade namkeen, roasted khakhra, artisanal ladoos, and spiced dry snacks. Cash on Delivery across India.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Handmade Snacks Catalogue
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          Crafted in small batches with wholesome ingredients, authentic spices, and zero chemical preservatives. Pay on delivery at your doorstep.
        </p>
      </div>

      <ShopClient
        initialProducts={products}
        categories={categories}
        initialCategory={resolvedParams.category || ""}
        initialSearch={resolvedParams.search || ""}
      />
    </div>
  );
}
