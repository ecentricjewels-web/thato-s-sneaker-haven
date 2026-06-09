import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ReviewsSection } from "@/components/storefront/ReviewsSection";
import { brands, products } from "@/lib/products";
import heroImg from "@/assets/hero-sneaker.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thato's Storefront — The Marketplace for Sneaker Lovers" },
      {
        name: "description",
        content:
          "Browse Thato's curated selection of today's hottest pairs. Nike, Jordan, Adidas, Puma and New Balance — fixed prices, nationwide shipping.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroImg}
          alt="Featured sneaker"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-4 py-24 md:grid-cols-2 md:py-36">
          <div className="flex flex-col justify-center gap-6">
            <h1 className="font-display text-5xl font-bold leading-[0.95] md:text-7xl">
              The Marketplace<br />for Sneaker Lovers<span className="text-primary">.</span>
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              Browse my curated selection of today's hottest pairs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Shop the catalogue <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-sm border border-border-strong bg-background/40 px-5 py-3 text-sm font-medium backdrop-blur transition hover:border-primary"
              >
                Meet Thato
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <Link
              key={b}
              to="/shop"
              search={{ brand: b }}
              className="group relative flex h-28 items-center justify-center border-r border-border last:border-r-0 transition hover:bg-background"
            >
              <span className="font-display text-xl font-semibold tracking-tight transition group-hover:text-primary md:text-2xl">
                {b}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured catalogue */}
      <section className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            The catalogue
          </div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Featured pairs
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <Link
            to="/shop"
            className="group relative inline-flex items-center gap-3 rounded-sm bg-primary px-10 py-5 text-base font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-[0_0_60px_-10px_var(--primary)] transition hover:shadow-[0_0_90px_-5px_var(--primary)] hover:scale-[1.02]"
          >
            <span className="absolute inset-0 -z-10 animate-pulse rounded-sm bg-primary/40 blur-xl" />
            Shop all
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <ReviewsSection />

      <Footer />
    </div>
  );
}
