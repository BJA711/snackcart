import React from "react";
import { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminInventoryClient } from "@/components/admin/AdminInventoryClient";

export const metadata: Metadata = {
  title: "Inventory & Stock Control | SnackCart Admin",
};

export default function AdminInventoryPage() {
  return (
    <div>
      <AdminHeader
        title="Kitchen Inventory Control"
        description="Monitor batch stock levels, receive low stock alerts, and adjust quantities directly."
      />
      <AdminInventoryClient />
    </div>
  );
}

