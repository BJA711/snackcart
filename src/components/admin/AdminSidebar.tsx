"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ClipboardList,
  Boxes,
  Tag,
  Settings,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/inventory", label: "Inventory", icon: Boxes },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
    { href: "/admin/settings", label: "Store Settings", icon: Settings },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 min-h-screen flex flex-col shrink-0 border-r border-stone-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight">
              SnackCart Admin
            </span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">
              Store Management
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="p-3 space-y-1 flex-grow">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* View Storefront Link */}
      <div className="p-4 border-t border-stone-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-stone-400 hover:text-white p-2 rounded hover:bg-stone-800 transition-colors"
        >
          <span>View Customer Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
