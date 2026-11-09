"use client";

import React from "react";
import { Category } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search and Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by snack name or ingredients (e.g. methi, sev, ghee)..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-stone-500" aria-hidden="true" />
          <label htmlFor="sort-select" className="text-xs font-medium text-stone-600">
            Sort:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs rounded-md border border-stone-300 px-3 py-2 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={() => onSelectCategory("")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selectedCategory === ""
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          All Snacks
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === cat.slug
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

