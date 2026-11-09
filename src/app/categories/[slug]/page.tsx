import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getProducts } from "@/lib/data";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ArrowLeft, ChevronRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | SnackCart" };
  }

  return {
    title: `${category.name} | SnackCart Homemade Snacks`,
    description: category.description || `Browse homemade ${category.name} snacks at SnackCart.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
        <Link href="/categories" className="hover:text-stone-900">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
        <span className="font-semibold text-stone-900">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-6 sm:p-8 space-y-2">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 mb-2"
        >
          <ArrowLeft className="w-3 h-3" aria-hidden="true" />
          Back to all categories
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Products in this category */}
      <div>
        <div className="mb-4 text-xs text-stone-500 font-medium">
          Showing {products.length} snacks in {category.name}
        </div>
        <ProductGrid
          products={products}
          emptyMessage={`No snacks currently available in ${category.name}. Check back soon!`}
        />
      </div>
    </div>
  );
}
