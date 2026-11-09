import React from "react";
import { Metadata } from "next";
import { AccountDashboardClient } from "@/components/account/AccountDashboardClient";

export const metadata: Metadata = {
  title: "My Account | SnackCart",
  description: "View your order history, delivery addresses, and profile details on SnackCart.",
};

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <AccountDashboardClient />
    </div>
  );
}

