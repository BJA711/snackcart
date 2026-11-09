"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { DEMO_PRODUCTS } from "@/lib/demoData";
import { updateStock } from "@/app/actions/admin";
import { formatPaiseToRupees } from "@/lib/formatters";
import { Boxes, Plus, Minus, Check, AlertCircle } from "lucide-react";

export function AdminInventoryClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .order("stock_quantity", { ascending: true });

      if (!error && data && data.length > 0) {
        setProducts(data as Product[]);
      } else {
        setProducts(DEMO_PRODUCTS);
      }
    } catch {
      setProducts(DEMO_PRODUCTS);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = async (productId: string, newStock: number) => {
    if (newStock < 0) return;
    setUpdatingId(productId);
    setError(null);

    try {
      await updateStock(productId, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock_quantity: newStock } : p))
      );
      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update stock");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Inventory & Stock Tracking</h2>
          <p className="text-xs text-stone-500">
            Real-time kitchen inventory counts with atomic database decrement during checkout
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Snack Item</th>
                <th className="py-3 px-4">Pack Size</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Threshold Status</th>
                <th className="py-3 px-4 text-right">Quick Restock / Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {products.map((p) => {
                const isUpdating = updatingId === p.id;
                const isSuccess = successId === p.id;
                const isLow = p.stock_quantity <= 10;
                const isOut = p.stock_quantity <= 0;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {p.weight_or_size}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-base font-bold font-mono text-stone-900">
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold uppercase text-[10px]">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold uppercase text-[10px]">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold uppercase text-[10px]">
                          Adequate Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, p.stock_quantity - 1)}
                          disabled={p.stock_quantity <= 0 || isUpdating}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-bold disabled:opacity-40"
                          title="Decrement 1"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, p.stock_quantity + 1)}
                          disabled={isUpdating}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-bold"
                          title="Add 1"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, p.stock_quantity + 5)}
                          disabled={isUpdating}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-bold"
                          title="Add 5"
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, p.stock_quantity + 20)}
                          disabled={isUpdating}
                          className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded font-bold text-xs"
                          title="Restock fresh batch +20"
                        >
                          +20
                        </button>

                        {isSuccess && (
                          <span className="text-emerald-600 ml-1">
                            <Check className="w-4 h-4 inline" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
