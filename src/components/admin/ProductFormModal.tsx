"use client";

import React, { useState } from "react";
import { Category, Product } from "@/types";
import { saveProduct } from "@/app/actions/admin";
import { paiseToRupees } from "@/lib/formatters";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { X, AlertCircle } from "lucide-react";

interface ProductFormModalProps {
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved,
}: ProductFormModalProps) {
  const [name, setName] = useState(product?.name || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [description, setDescription] = useState(product?.description || "");
  const [priceRupees, setPriceRupees] = useState<number>(
    product ? paiseToRupees(product.price_in_paise) : 100
  );
  const [weightOrSize, setWeightOrSize] = useState(
    product?.weight_or_size || "250g"
  );
  const [ingredients, setIngredients] = useState(product?.ingredients || "");
  const [allergenInfo, setAllergenInfo] = useState(product?.allergen_info || "");
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(
    product?.shelf_life_days || 45
  );
  const [stockQuantity, setStockQuantity] = useState<number>(
    product?.stock_quantity ?? 25
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    product?.is_featured ?? false
  );
  const [isActive, setIsActive] = useState<boolean>(
    product?.is_active ?? true
  );
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await saveProduct({
        id: product?.id,
        name: name.trim(),
        category_id: categoryId || null,
        description: description.trim(),
        price_rupees: Number(priceRupees),
        weight_or_size: weightOrSize.trim(),
        ingredients: ingredients.trim() || null,
        allergen_info: allergenInfo.trim() || null,
        shelf_life_days: Number(shelfLifeDays),
        stock_quantity: Number(stockQuantity),
        is_featured: isFeatured,
        is_active: isActive,
        image_url: imageUrl.trim() || null,
      });

      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-2xl w-full my-8 overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-stone-900">
            {product ? "Edit Snack Item" : "Create New Snack Product"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-stone-400 hover:text-stone-700 rounded"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Crispy Methi Khakhra"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price in Rupees (₹)"
              type="number"
              step="0.5"
              required
              value={priceRupees}
              onChange={(e) => setPriceRupees(parseFloat(e.target.value) || 0)}
              helperText="Saved as integer paise in database"
            />

            <Input
              label="Weight or Pack Size"
              required
              value={weightOrSize}
              onChange={(e) => setWeightOrSize(e.target.value)}
              placeholder="e.g. 250g (8 pieces)"
            />

            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              required
              value={stockQuantity}
              onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)}
            />

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Product Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Describe aroma, taste, preparation, and pair suggestions..."
                className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <Input
              label="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or Supabase storage URL"
            />

            <Input
              label="Shelf Life (Days)"
              type="number"
              value={shelfLifeDays}
              onChange={(e) => setShelfLifeDays(parseInt(e.target.value, 10) || 0)}
            />

            <div className="sm:col-span-2">
              <Input
                label="Ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. Whole wheat, pure ghee, cardamom, raw cane sugar"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Allergen Notice"
                value={allergenInfo}
                onChange={(e) => setAllergenInfo(e.target.value)}
                placeholder="e.g. Contains wheat gluten, cow milk ghee, tree nuts"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                Showcase on Homepage (Featured Snack)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                Available in Store (Active)
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading}>
              {product ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
