import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { brands, products } from "@/lib/products";
import heroImg from "@/assets/hero-sneaker.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thato's Storefront — Sneakers from Nike, Jordan, Adidas, Puma & New Balance" },
      {
        name: "description",
        content:
          "Shop curated sneakers in South Africa. Nike, Jordan, Adidas, Puma and New Balance — fixed prices, fast shipping from Johannesburg.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const newest = products.filter((p) => p.isNew).slice(0, 4);
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
            <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-primary">
              Thato's Storefront
            </span>
            <h1 className="font-display text-5xl font-bold leading-[0.95] md:text-7xl">
              Step into your<br />next pair<span className="text-primary">.</span>
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              A tightly-curated catalogue of Nike, Jordan, Adidas, Puma and
              New Balance sneakers — hand-picked by Thato and shipped fast
              from Johannesburg.
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

      {/* New in */}
      {newest.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-primary">
                Just landed
              </div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                New in this week
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-primary md:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {newest.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Featured catalogue */}
      <section className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              The catalogue
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Featured pairs
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-primary md:inline-flex"
          >
            Shop all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Service */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-border md:grid-cols-3">
          {[
            { icon: Truck, h: "Fast shipping", p: "Tracked nationwide delivery in 2–4 working days. Free over R2 500." },
            { icon: ShieldCheck, h: "100% authentic", p: "Every pair is sourced and inspected by Thato before it ships." },
            { icon: RefreshCw, h: "Easy returns", p: "Unworn pairs can be returned within 7 days for a full refund." },
          ].map((f) => (
            <div key={f.h} className="bg-background p-8">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">{f.h}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
