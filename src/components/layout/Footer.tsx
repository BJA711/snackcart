import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Truck, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Brand value highlights */}
      <div className="border-b border-stone-800 py-10 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-brand-900/50 border border-brand-700/50 flex items-center justify-center text-brand-400 shrink-0">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Authentic Homemade Recipes</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Prepared in small artisanal batches with cold-pressed oils and pure ingredients.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-brand-900/50 border border-brand-700/50 flex items-center justify-center text-brand-400 shrink-0">
              <Truck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Cash on Delivery Across India</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Pay safely at your doorstep upon receiving your fresh snack package.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-brand-900/50 border border-brand-700/50 flex items-center justify-center text-brand-400 shrink-0">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Freshness Guarantee</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Sealed airtight pouches to preserve aroma, crispness, and traditional taste.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Snack<span className="text-brand-500">Cart</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              SnackCart brings time-honored Indian savory snacks, crisp flatbreads, and festive sweets directly from home kitchens to your table.
            </p>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
                <span>Indiranagar, Bengaluru, Karnataka 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
                <a href="mailto:support@snackcart.local" className="hover:text-white transition-colors">
                  support@snackcart.local
                </a>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore Snacks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="hover:text-brand-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/traditional-namkeen" className="hover:text-brand-400 transition-colors">
                  Traditional Namkeen & Sev
                </Link>
              </li>
              <li>
                <Link href="/categories/khakhra-and-crisps" className="hover:text-brand-400 transition-colors">
                  Crispy Khakhra & Chakli
                </Link>
              </li>
              <li>
                <Link href="/categories/artisanal-sweets" className="hover:text-brand-400 transition-colors">
                  Handmade Pure Ghee Ladoos
                </Link>
              </li>
              <li>
                <Link href="/categories/roasted-nuts-and-seeds" className="hover:text-brand-400 transition-colors">
                  Roasted Healthy Snacks & Makhana
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/account" className="hover:text-brand-400 transition-colors">
                  My Orders & Status
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-brand-400 transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/cod-policy" className="hover:text-brand-400 transition-colors">
                  Cash on Delivery Guide
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-400 transition-colors">
                  Damaged Package & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Local Kitchen Dispatch Schedule */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Kitchen Schedule
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Orders placed before 2:00 PM IST are freshly packed and dispatched the following morning via speed courier.
            </p>
            <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700/60 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-700 text-stone-300">
                <span>Dispatch Days</span>
                <span className="font-semibold text-white">Monday - Saturday</span>
              </div>
              <div className="flex justify-between py-1 text-stone-300">
                <span>Standard Transit</span>
                <span className="font-semibold text-white">2 to 4 Business Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {currentYear} SnackCart Homemade Delights. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-stone-400">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-stone-400">
              Terms
            </Link>
            <Link href="/setup-guide" className="hover:text-stone-400">
              Developer Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

