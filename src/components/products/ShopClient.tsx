"use client";

import React, { useState, useMemo } from "react";
import { Category, Product } from "@/types";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
}

export function ShopClient({
  initialProducts,
  categories,
  initialCategory = "",
  initialSearch = "",
}: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>("featured");

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter by category slug
    if (selectedCategory) {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients?.toLowerCase().includes(q)
      );
    }

    // Sort products
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price_in_paise - b.price_in_paise);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price_in_paise - a.price_in_paise);
    } else if (sortBy === "featured") {
      list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div>
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="mb-4 text-xs text-stone-500 font-medium">
        Showing {filteredProducts.length} of {initialProducts.length} snacks
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
}

