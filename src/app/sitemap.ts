import { MetadataRoute } from "next";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/demoData";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/story",
    "/contact",
    "/cod-policy",
    "/shipping-policy",
    "/refund-policy",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const categoryRoutes = DEMO_CATEGORIES.map((cat) => ({
    url: `${siteUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes = DEMO_PRODUCTS.map((prod) => ({
    url: `${siteUrl}/products/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

