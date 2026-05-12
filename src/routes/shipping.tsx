import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Package, MapPin, Clock } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Thato's Storefront" },
      { name: "description", content: "Nationwide shipping info for Thato's Storefront. Free delivery on orders over R2 800." },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="mx-auto max-w-[900px] px-4 py-16">
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Help</div>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Shipping</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Every pair is dispatched from Johannesburg with a tracked courier.
          Here's everything you need to know before your sneakers land.
        </p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
          {[
            { icon: Truck, h: "Free over R2 800", p: "Spend R2 800 or more and nationwide delivery is on the house." },
            { icon: Clock, h: "2 – 4 working days", p: "Orders placed before 12:00 SAST ship the same day." },
            { icon: MapPin, h: "Nationwide coverage", p: "We deliver to every major city and town across South Africa." },
            { icon: Package, h: "Tracked & insured", p: "Every order is fully tracked and insured against loss in transit." },
          ].map((b) => (
            <div key={b.h} className="bg-card p-6">
              <b.icon className="h-6 w-6 text-primary" />
              <div className="mt-3 font-display text-lg font-semibold">{b.h}</div>
              <p className="mt-1 text-sm text-muted-foreground">{b.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-sm border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Shipping fees</h2>
          <table className="mt-4 w-full text-sm">
            <tbody className="divide-y divide-border">
              <tr><td className="py-3 text-muted-foreground">Standard delivery</td><td className="py-3 text-right font-medium">R 99</td></tr>
              <tr><td className="py-3 text-muted-foreground">Express (1–2 days, major metros)</td><td className="py-3 text-right font-medium">R 149</td></tr>
              <tr><td className="py-3 text-muted-foreground">Orders over R2 800</td><td className="py-3 text-right font-medium text-primary">Free</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/track-order" className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Track your order
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-3 text-sm font-medium hover:border-primary">
            Got a question? Contact Thato
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
