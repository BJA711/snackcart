import { Category, Product } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "./demoData";

export { DEMO_CATEGORIES, DEMO_PRODUCTS };

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // Fallback to demo data
    }
  }
  return DEMO_CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getProducts(options?: {
  categorySlug?: string;
  searchQuery?: string;
  sortBy?: "price_asc" | "price_desc" | "newest";
  featuredOnly?: boolean;
}): Promise<Product[]> {
  let products = DEMO_PRODUCTS;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("is_active", true);

      if (options?.featuredOnly) {
        query = query.eq("is_featured", true);
      }

      if (options?.sortBy === "price_asc") {
        query = query.order("price_in_paise", { ascending: true });
      } else if (options?.sortBy === "price_desc") {
        query = query.order("price_in_paise", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        products = data as Product[];
      }
    } catch {
      // Fallback to demo
    }
  }

  // Filter in memory for category and search
  let result = products;

  if (options?.categorySlug) {
    result = result.filter(
      (p) => p.category?.slug === options.categorySlug
    );
  }

  if (options?.featuredOnly && !isSupabaseConfigured()) {
    result = result.filter((p) => p.is_featured);
  }

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients?.toLowerCase().includes(q)
    );
  }

  if (!isSupabaseConfigured() && options?.sortBy) {
    if (options.sortBy === "price_asc") {
      result = [...result].sort((a, b) => a.price_in_paise - b.price_in_paise);
    } else if (options.sortBy === "price_desc") {
      result = [...result].sort((a, b) => b.price_in_paise - a.price_in_paise);
    }
  }

  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch {
      // Fallback
    }
  }
  return DEMO_PRODUCTS.find((p) => p.slug === slug) || null;
}
