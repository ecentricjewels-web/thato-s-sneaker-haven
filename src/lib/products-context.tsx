import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts, type Product, type Brand } from "./products";

type Ctx = {
  allProducts: Product[];
  staticProducts: Product[];
  dbProducts: Product[];
  isLoading: boolean;
  getBySlug: (slug: string) => Product | undefined;
};

const ProductsContext = createContext<Ctx | null>(null);

const VALID_BRANDS: Brand[] = ["Nike", "Jordan", "Adidas", "Puma", "New Balance"];
const VALID_CATEGORIES = ["Lifestyle", "Basketball", "Running"] as const;

function rowToProduct(row: {
  slug: string;
  name: string;
  brand: string;
  colorway: string;
  category: string;
  price: number;
  image: string;
  sizes: string[];
  is_new: boolean;
  in_stock: boolean;
}): Product {
  return {
    slug: row.slug,
    name: row.name,
    brand: (VALID_BRANDS.includes(row.brand as Brand) ? row.brand : "Nike") as Brand,
    colorway: row.colorway,
    category: (VALID_CATEGORIES.includes(row.category as (typeof VALID_CATEGORIES)[number])
      ? row.category
      : "Lifestyle") as Product["category"],
    price: row.price,
    image: row.image,
    sizes: row.sizes ?? [],
    isNew: row.is_new,
    inStock: row.in_stock,
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("slug, name, brand, colorway, category, price, image, sizes, is_new, in_stock")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToProduct);
    },
    staleTime: 60_000,
  });

  const value = useMemo<Ctx>(() => {
    // DB products take precedence by slug
    const map = new Map<string, Product>();
    for (const p of staticProducts) map.set(p.slug, p);
    for (const p of dbProducts) map.set(p.slug, p);
    const all = Array.from(map.values());
    return {
      allProducts: all,
      staticProducts,
      dbProducts,
      isLoading,
      getBySlug: (slug: string) => map.get(slug),
    };
  }, [dbProducts, isLoading]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
