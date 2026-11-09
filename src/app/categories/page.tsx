import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Snack Categories | SnackCart",
  description:
    "Explore homemade snacks by category: Traditional Namkeen, Khakhra & Crisps, Artisanal Pure Ghee Sweets, and Roasted Healthy Snacks.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Snack Categories
        </h1>
        <p className="text-sm text-stone-600">
          From crisp morning tea khakhras to celebratory pure ghee sweets, find traditional regional favorites prepared in small kitchen batches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <article
            key={cat.id}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-brand-400 hover:shadow-lg transition-all flex flex-col sm:flex-row"
          >
            <div className="relative sm:w-2/5 aspect-[4/3] sm:aspect-auto bg-stone-100 overflow-hidden shrink-0">
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <UtensilsCrossed className="w-12 h-12" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-xl font-bold text-stone-900 group-hover:text-brand-700 transition-colors">
                  {cat.name}
                </h2>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 group-hover:translate-x-1 transition-transform"
                >
                  Browse {cat.name} Items
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
