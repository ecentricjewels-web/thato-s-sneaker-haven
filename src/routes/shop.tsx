import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { brands, products, type Brand } from "@/lib/products";
import { z } from "zod";

const searchSchema = z.object({
  brand: z.enum(["Nike", "Jordan", "Adidas", "Puma"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Shop — Thato's Storefront" },
      {
        name: "description",
        content:
          "Browse authenticated Nike, Jordan, Adidas and Puma sneakers with live market prices.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { brand: initial } = Route.useSearch();
  const [brand, setBrand] = useState<Brand | "All">(initial ?? "All");
  const [sort, setSort] = useState<"trending" | "price-asc" | "price-desc" | "movers">(
    "trending",
  );

  const filtered = useMemo(() => {
    let list = brand === "All" ? products : products.filter((p) => p.brand === brand);
    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.lowestAsk - b.lowestAsk);
        break;
      case "price-desc":
        list.sort((a, b) => b.lowestAsk - a.lowestAsk);
        break;
      case "movers":
        list.sort((a, b) => b.changePct - a.changePct);
        break;
    }
    return list;
  }, [brand, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-4 py-12">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            The Market
          </div>
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Shop {brand === "All" ? "all sneakers" : brand}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Browse Thato's curated stock. Filter by brand, sort by movement, and ask
            below the market to snag your grail.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex flex-wrap gap-2">
            {(["All", ...brands] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition ${
                  brand === b
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-sm border border-border bg-surface px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="trending">Trending</option>
              <option value="movers">Top movers</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-xs text-muted-foreground">
          Showing <span className="text-foreground">{filtered.length}</span> products
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
