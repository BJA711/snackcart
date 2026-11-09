import React from "react";
import { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export const metadata: Metadata = {
  title: "Store Settings | SnackCart Admin",
};

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminHeader
        title="Store Configuration"
        description="Delivery fees, threshold settings, support disclosures, and backend diagnostics."
      />
      <AdminSettingsClient />
    </div>
  );
}

