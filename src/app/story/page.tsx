import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, UtensilsCrossed, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Homemade Kitchen Story | SnackCart",
  description:
    "Learn about SnackCart's origin: traditional regional recipes, pure cow ghee, cold-pressed oils, and small-batch roasting.",
};

export default function StoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          The Kitchen Story
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Restoring the Integrity of Indian Homemade Snacks
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          SnackCart began with a simple realization: supermarket snack aisles are filled with factory products made with refined palm oil blends, synthetic preservatives, and artificial seasoning packets.
        </p>
      </div>

      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
        <Image
          src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=85"
          alt="Traditional homemade snacks preparation"
          fill
          className="object-cover"
        />
      </div>

      <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 space-y-4 leading-relaxed">
        <h2 className="text-lg font-bold text-stone-900">Cooking the Way Homes Do</h2>
        <p>
          In traditional Indian households, savory snacks (namkeen) and sweets (mithai) were never industrial commodities. They were prepared during festivals or weekly tea preparations using fresh flours, whole spices roasted on iron tavas, and pure cow ghee.
        </p>
        <p>
          SnackCart partners with trained home cooks and traditional culinary artisans in regional culinary clusters across India. Each batch is made in small pans rather than massive chemical conveyor fryers. We use cold-pressed peanut and sunflower oils, whole stone-ground flours, and pure desi cow ghee.
        </p>

        <h2 className="text-lg font-bold text-stone-900 mt-6">Our Core Kitchen Commitments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-6">
          <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <strong className="text-xs font-bold text-stone-900 block">No Palm Oil Blends</strong>
            <p className="text-xs text-stone-500">
              Only authentic cold-pressed oils and pure cow milk ghee are used in our kitchens.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <strong className="text-xs font-bold text-stone-900 block">Zero Synthetic Preservatives</strong>
            <p className="text-xs text-stone-500">
              We rely on natural spices, airtight multi-layer barrier packaging, and rapid dispatch.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <strong className="text-xs font-bold text-stone-900 block">Small Batch Roasting</strong>
            <p className="text-xs text-stone-500">
              Items like our Peri-Peri Makhana and Methi Khakhra are slow-roasted in measured quantities.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <strong className="text-xs font-bold text-stone-900 block">Direct Cash on Delivery</strong>
            <p className="text-xs text-stone-500">
              Zero payment anxiety for customers. Inspect the sealed package and pay cash at your doorstep.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-stone-900">Taste the Freshness Today</h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto">
          Explore our range of traditional sev, crispy khakhras, and pure ghee ladoos.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-xs font-bold shadow-sm"
        >
          Explore the Kitchen Catalogue
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

