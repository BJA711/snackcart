import React from "react";
import { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export const metadata: Metadata = {
  title: "Products Management | SnackCart Admin",
};

export default function AdminProductsPage() {
  return (
    <div>
      <AdminHeader
        title="Products & Catalogue"
        description="Add, edit, pricing, and availability management for all snack products."
      />
      <AdminProductsClient />
    </div>
  );
}

