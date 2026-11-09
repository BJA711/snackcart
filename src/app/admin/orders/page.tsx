import React from "react";
import { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export const metadata: Metadata = {
  title: "Orders Management | SnackCart Admin",
};

export default function AdminOrdersPage() {
  return (
    <div>
      <AdminHeader
        title="Order Fulfillment"
        description="View customer addresses, update preparation status, and log COD collections."
      />
      <AdminOrdersClient />
    </div>
  );
}
