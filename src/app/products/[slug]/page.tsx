import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/data";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { ChevronRight, ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | SnackCart" };
  }

  return {
    title: `${product.name} | SnackCart Homemade Snacks`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
        <Link href="/shop" className="hover:text-stone-900">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-stone-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
        <span className="font-semibold text-stone-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} />
    </div>
  );
}

