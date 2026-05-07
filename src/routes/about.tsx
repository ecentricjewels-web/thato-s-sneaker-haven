import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Thato — Storefront" },
      {
        name: "description",
        content:
          "Meet Thato — sneakerhead turned authenticator running one of the most-trusted storefronts in the game.",
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
              <span className="text-primary">I find heat.</span>
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              For the last 8 years I've been hunting, sourcing and authenticating
              sneakers from Joburg to Tokyo. This storefront is the result —
              a tightly-curated marketplace where every Nike, Jordan, Adidas and
              Puma is verified by hand before it ships.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-4 py-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" /> Based in Johannesburg, ZA
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px rounded-sm border border-border bg-border">
            {[
              { k: "12,400+", v: "Pairs sold" },
              { k: "4.97★", v: "Buyer rating" },
              { k: "26-pt", v: "Authentication" },
              { k: "60+", v: "Countries shipped" },
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
          How the storefront works
        </h2>
        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {[
            { n: "01", h: "You ask or bid", p: "Browse the live market. Buy at the lowest ask, or place a bid below it." },
            { n: "02", h: "Thato authenticates", p: "I personally inspect every pair against a 26-point checklist before approval." },
            { n: "03", h: "We ship globally", p: "Tracked, insured and packaged with care. From JHB to your door in days." },
          ].map((s) => (
            <div key={s.n} className="bg-background p-8">
              <div className="font-mono text-sm text-primary">{s.n}</div>
              <div className="mt-3 font-display text-xl font-semibold">{s.h}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-4 py-16">
          <div className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-primary" /> Buyer reviews
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { n: "Lerato M.", t: "Got my Jordan 4s in 4 days, packaged like a museum piece. Real ones only." },
              { n: "Kyle D.", t: "Asked below market and Thato's seller hit it the same day. Smooth." },
              { n: "Aisha K.", t: "First time buying overseas — tracking, comms, condition all 10/10." },
            ].map((r) => (
              <div key={r.n} className="rounded-sm border border-border bg-card p-6">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-foreground/90">"{r.t}"</p>
                <div className="mt-4 text-xs text-muted-foreground">— {r.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">
          Ready to cop?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Step into the market and see what Thato's holding this week.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Enter the storefront
        </Link>
      </section>

      <Footer />
    </div>
  );
}
