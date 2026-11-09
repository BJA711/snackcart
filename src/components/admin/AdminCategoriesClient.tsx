"use client";

import React, { useState, useEffect } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Category } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { DEMO_CATEGORIES } from "@/lib/demoData";
import { CategoryFormModal } from "./CategoryFormModal";
import { Plus, Edit2, Layers, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setCategories(data as Category[]);
      } else {
        setCategories(DEMO_CATEGORIES);
      }
    } catch {
      setCategories(DEMO_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Snack Categories</h2>
          <p className="text-xs text-stone-500">
            Organize products into customer-facing collections
          </p>
        </div>
        <Button size="sm" onClick={handleCreate} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-lg border border-stone-200 p-5 shadow-sm flex items-start gap-4"
          >
            <div className="relative w-16 h-16 rounded-md bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
              <SafeImage
                src={cat.image_url || "/images/categories/traditional-namkeen.svg"}
                alt={cat.name}
                fill
                sizes="64px"
                className="object-cover"
                fallbackSrc="/images/categories/traditional-namkeen.svg"
              />
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-stone-900">{cat.name}</h3>
                <button
                  type="button"
                  onClick={() => handleEdit(cat)}
                  className="p-1 text-stone-500 hover:text-stone-900 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
              <span className="text-[11px] font-mono text-stone-400 block mt-0.5">
                slug: {cat.slug}
              </span>
              <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                {cat.description || "No description provided."}
              </p>
              <div className="mt-2 text-[10px] text-stone-400">
                Display Order: {cat.display_order}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CategoryFormModal
          category={selectedCategory}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => fetchData()}
        />
      )}
    </div>
  );
}
