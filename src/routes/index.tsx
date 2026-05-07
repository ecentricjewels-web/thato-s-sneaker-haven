import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Globe2, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { brands, formatPrice, products } from "@/lib/products";
import heroImg from "@/assets/hero-sneaker.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thato's Storefront — Authenticated Sneakers" },
      {
        name: "description",
        content:
          "Shop authenticated Nike, Jordan, Adidas and Puma at fixed prices. Curated by Thato.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const trending = products.slice(0, 6);
  const featured = [...products].sort((a, b) => a.inStock - b.inStock).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Announcement strip */}
      <div className="border-b border-border bg-surface">
        <div className="ticker-mask overflow-hidden">
          <div className="flex animate-[scroll_45s_linear_infinite] gap-10 whitespace-nowrap py-2 font-mono text-xs text-muted-foreground">
            {[...Array(2)].flatMap((_, k) => [
              <span key={`a${k}`} className="inline-flex items-center gap-2"><span className="text-primary">●</span> Free worldwide shipping over $250 <span className="text-border">·</span></span>,
              <span key={`b${k}`} className="inline-flex items-center gap-2"><span className="text-primary">●</span> Every pair authenticated by Thato <span className="text-border">·</span></span>,
              <span key={`c${k}`} className="inline-flex items-center gap-2"><span className="text-primary">●</span> New drops every Friday <span className="text-border">·</span></span>,
              <span key={`d${k}`} className="inline-flex items-center gap-2"><span className="text-primary">●</span> Shipped from Johannesburg <span className="text-border">·</span></span>,
            ])}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroImg}
          alt="Featured sneaker under green spotlight"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-4 py-24 md:grid-cols-2 md:py-36">
          <div className="flex flex-col justify-center gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Thato's Drop · Week 19
            </span>
            <h1 className="font-display text-5xl font-bold leading-[0.95] md:text-7xl">
              Grails, in stock<span className="text-primary">.</span>
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              Hand-picked Nike, Jordan, Adidas and Puma at one fixed price.
              No bidding wars, no surprises — just authenticated heat shipped to your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Shop the storefront <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-sm border border-border-strong bg-background/40 px-5 py-3 text-sm font-medium backdrop-blur transition hover:border-primary"
              >
                Meet Thato
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> 100% Authenticated
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-primary" /> Worldwide shipping
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 text-primary" /> 4.97 / 5 · 2,184 reviews
              </span>
            </div>
          </div>

          {/* Featured / low stock card */}
          <div className="flex items-end md:justify-end">
            <div className="w-full max-w-md rounded-sm border border-border bg-card/80 p-5 backdrop-blur-md md:w-[420px]">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Going fast
                  </div>
                  <div className="font-display text-lg font-semibold">Low stock alert</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  Live
                </span>
              </div>
              <ul className="mt-3 divide-y divide-border">
                {featured.map((p) => (
                  <li key={p.slug} className="flex items-center gap-3 py-3">
                    <img
                      src={p.image}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      className="h-12 w-12 rounded-sm object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">{p.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {p.colorway}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{formatPrice(p.price)}</div>
                      <div className={`text-xs ${p.inStock <= 5 ? "text-destructive" : "text-muted-foreground"}`}>
                        {p.inStock} left
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {brands.map((b) => (
            <Link
              key={b}
              to="/shop"
              search={{ brand: b }}
              className="group relative flex h-32 items-center justify-center border-r border-border last:border-r-0 transition hover:bg-surface"
            >
              <span className="font-display text-2xl font-semibold tracking-tight transition group-hover:text-primary">
                {b}
              </span>
              <ArrowRight className="ml-3 h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* Trending grid */}
      <section className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              In stock now
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              This week's heat
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-primary md:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-border md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              h: "Authenticated by Thato",
              p: "Every pair is inspected against a 26-point checklist before it ships. No replicas. Ever.",
            },
            {
              icon: BadgeCheck,
              h: "One fixed price",
              p: "What you see is what you pay. No bidding, no haggling — just clear pricing.",
            },
            {
              icon: Globe2,
              h: "Shipped worldwide",
              p: "From Johannesburg to anywhere. Tracked, insured, and at your door in days.",
            },
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

      <style>{`@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
