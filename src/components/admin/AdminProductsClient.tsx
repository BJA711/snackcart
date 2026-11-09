"use client";

import React, { useState, useEffect } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Category, Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/demoData";
import { archiveProduct } from "@/app/actions/admin";
import { formatPaiseToRupees } from "@/lib/formatters";
import { ProductFormModal } from "./ProductFormModal";
import { Plus, Edit2, Archive, CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const [prodRes, catRes] = await Promise.all([
        supabase
          .from("products")
          .select("*, category:categories(*)")
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (prodRes.data && prodRes.data.length > 0) {
        setProducts(prodRes.data as Product[]);
      } else {
        setProducts(DEMO_PRODUCTS);
      }

      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data as Category[]);
      } else {
        setCategories(DEMO_CATEGORIES);
      }
    } catch {
      setProducts(DEMO_PRODUCTS);
      setCategories(DEMO_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleArchive = async (id: string, currentActive: boolean) => {
    try {
      await archiveProduct(id, !currentActive);
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Catalogue Management</h2>
          <p className="text-xs text-stone-500">
            Total {products.length} homemade snack products registered
          </p>
        </div>
        <Button size="sm" onClick={handleCreate} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add New Product
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (Paise)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <SafeImage
                          src={p.image_url || "/images/products/fallback-snack.svg"}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                          fallbackSrc="/images/products/fallback-snack.svg"
                        />
                      </div>
                      <div>
                        <strong className="font-semibold text-stone-900 block">
                          {p.name}
                        </strong>
                        <span className="text-stone-400 text-[11px]">{p.weight_or_size}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {p.category?.name || "General"}
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900">
                    {formatPaiseToRupees(p.price_in_paise)}
                    <span className="text-[10px] text-stone-400 block font-mono">
                      ({p.price_in_paise} paise)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        p.stock_quantity <= 5
                          ? "text-rose-700 font-bold"
                          : "text-stone-900"
                      }`}
                    >
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.is_featured ? (
                      <span className="px-2 py-0.5 bg-brand-50 text-brand-800 border border-brand-200 rounded text-[10px] font-bold uppercase">
                        Featured
                      </span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {p.is_active ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-bold uppercase">
                        Archived
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleArchive(p.id, p.is_active)}
                        className={`p-1.5 rounded ${
                          p.is_active
                            ? "text-stone-400 hover:text-rose-600 hover:bg-stone-100"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={p.is_active ? "Archive item" : "Activate item"}
                      >
                        <Archive className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => fetchData()}
        />
      )}
    </div>
  );
}
