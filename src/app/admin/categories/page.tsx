import React from "react";
import { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export const metadata: Metadata = {
  title: "Categories Management | SnackCart Admin",
};

export default function AdminCategoriesPage() {
  return (
    <div>
      <AdminHeader
        title="Category Management"
        description="Configure snack categories, banner descriptions, and catalogue groupings."
      />
      <AdminCategoriesClient />
    </div>
  );
}
