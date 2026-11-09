import React from "react";
import { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | SnackCart",
};

export default function AdminOverviewPage() {
  return (
    <div>
      <AdminHeader
        title="Store Operations Overview"
        description="Monitor real-time customer orders, dispatch queue, revenue, and kitchen inventory."
      />
      <AdminOverviewClient />
    </div>
  );
}
