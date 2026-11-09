"use client";

import React, { useState, useEffect } from "react";
import { Coupon } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { formatPaiseToRupees } from "@/lib/formatters";
import { toggleCouponActive } from "@/app/actions/admin";
import { CouponFormModal } from "./CouponFormModal";
import { Tag, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminCouponsClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCoupons(data as Coupon[]);
      } else {
        // Fallback demonstration coupons
        setCoupons([
          {
            id: "c-demo-1",
            code: "WELCOME50",
            discount_type: "fixed",
            discount_value: 5000,
            min_order_amount_paise: 30000,
            max_discount_paise: null,
            usage_limit: 500,
            used_count: 14,
            is_active: true,
            valid_from: new Date().toISOString(),
            valid_until: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "c-demo-2",
            code: "SNACK10",
            discount_type: "percentage",
            discount_value: 10,
            min_order_amount_paise: 40000,
            max_discount_paise: 10000,
            usage_limit: 1000,
            used_count: 28,
            is_active: true,
            valid_from: new Date().toISOString(),
            valid_until: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleCouponActive(id, !current);
      fetchCoupons();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  const handleCreate = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Promotional Coupons</h2>
          <p className="text-xs text-stone-500">
            Create discount codes with minimum order criteria and usage caps
          </p>
        </div>
        <Button size="sm" onClick={handleCreate} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Create Coupon
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Order Subtotal</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {c.discount_type === "fixed"
                      ? `${formatPaiseToRupees(c.discount_value)} flat discount`
                      : `${c.discount_value}% off (cap: ${
                          c.max_discount_paise
                            ? formatPaiseToRupees(c.max_discount_paise)
                            : "none"
                        })`}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {formatPaiseToRupees(c.min_order_amount_paise)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-stone-900">{c.used_count}</span>
                    {c.usage_limit && (
                      <span className="text-stone-400"> / {c.usage_limit}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {c.is_active ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-bold uppercase">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggle(c.id, c.is_active)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded ${
                        c.is_active
                          ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                      }`}
                    >
                      {c.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CouponFormModal
          coupon={selectedCoupon}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => fetchCoupons()}
        />
      )}
    </div>
  );
}
