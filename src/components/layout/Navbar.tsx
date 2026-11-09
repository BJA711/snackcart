"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  User,
  Shield,
  Menu,
  X,
  Search,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, isHydrated } = useCart();
  const { user, profile, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/shop", label: "Shop All" },
    { href: "/categories", label: "Categories" },
    { href: "/story", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition-colors">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-brand-700 transition-colors">
                  Snack<span className="text-brand-600">Cart</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 -mt-1 font-medium">
                  Homemade Delights
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-brand-700 bg-brand-50 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Link */}
            <Link
              href="/shop"
              aria-label="Search snacks"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* Admin Dashboard shortcut if authorized */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
                Admin
              </Link>
            )}

            {/* Customer Account / Login */}
            {user ? (
              <Link
                href="/account"
                aria-label="Customer Account"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                <User className="w-4 h-4 text-stone-500" aria-hidden="true" />
                <span className="hidden sm:inline text-xs font-semibold">
                  {profile?.full_name ? profile.full_name.split(" ")[0] : "Account"}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                <User className="w-4 h-4 text-stone-500" aria-hidden="true" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              aria-label={`Shopping cart with ${isHydrated ? itemCount : 0} items`}
              className="relative inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md bg-brand-50 text-brand-900 hover:bg-brand-100 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-brand-700" aria-hidden="true" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                Cart
              </span>
              {isHydrated && itemCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-brand-600 text-white rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "text-brand-700 bg-brand-50 font-semibold"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-semibold text-brand-700 bg-stone-100"
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                Admin Dashboard
              </Link>
            )}
            {user ? (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50"
              >
                My Account and Orders
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

