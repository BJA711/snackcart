import React from "react";
import { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminCouponsClient } from "@/components/admin/AdminCouponsClient";

export const metadata: Metadata = {
  title: "Coupon Management | SnackCart Admin",
};

export default function AdminCouponsPage() {
  return (
    <div>
      <AdminHeader
        title="Promotional Coupons"
        description="Configure promotional codes, percentage discounts, minimum subtotal thresholds, and limits."
      />
      <AdminCouponsClient />
    </div>
  );
}
