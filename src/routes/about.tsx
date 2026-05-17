import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Thato's Storefront" },
      {
        name: "description",
        content:
          "Meet Thato — sneakerhead running a curated storefront of Nike, Jordan, Adidas, Puma and New Balance sneakers from Johannesburg.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 md:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary">
              The Storefront
            </div>
            <h1 className="mt-3 font-display text-5xl font-bold leading-tight md:text-6xl">
              Hi, I'm Thato.<br />
              <span className="text-primary">I sell sneakers.</span>
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              I run a small, hand-picked storefront stocking the sneakers I'd
              wear myself — Nike, Jordan, Adidas, Puma and New Balance. No
              bidding, no reseller games. Fixed prices, in stock, ready to ship.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-4 py-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" /> Based in Johannesburg, ZA
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px rounded-sm border border-border bg-border">
            {[
              { k: "20+", v: "Pairs in catalogue" },
              { k: "5", v: "Trusted brands" },
              { k: "2–4", v: "Day delivery" },
            ].map((s) => (
              <div key={s.v} className="bg-card p-8">
                <div className="font-display text-3xl font-bold text-primary">{s.k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20">
        <h2 className="mb-10 font-display text-3xl font-bold md:text-4xl">
          How shopping works
        </h2>
        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {[
            { n: "01", h: "Browse the catalogue", p: "Filter by brand, pick a colourway, see one clear price in rands.", icon: ShieldCheck },
            { n: "02", h: "Add to bag & checkout", p: "Choose your size, add to bag and pay securely. No bidding, no waiting.", icon: Truck },
            { n: "03", h: "Shipped from JHB", p: "Tracked nationwide delivery. Free over R2 800.", icon: RefreshCw },
          ].map((s) => (
            <div key={s.n} className="bg-background p-8">
              <div className="font-mono text-sm text-primary">{s.n}</div>
              <div className="mt-3 font-display text-xl font-semibold">{s.h}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">
          Ready to shop?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Step into the catalogue and see what Thato's holding this week.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Shop the catalogue
        </Link>
      </section>

      <Footer />
    </div>
  );
}
