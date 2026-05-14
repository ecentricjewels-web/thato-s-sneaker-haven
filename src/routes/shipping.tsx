import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Package, MapPin, Clock } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Thato's Storefront" },
      { name: "description", content: "Nationwide PAXI shipping. Free delivery on orders over R2 800." },
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
          Every order is shipped with <span className="font-semibold text-foreground">PAXI</span> —
          a trusted nationwide courier with thousands of pickup points across South Africa.
          Here's everything you need to know before your sneakers land.
        </p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
          {[
            { icon: Truck, h: "Shipped via PAXI", p: "Pick up at your nearest PAXI point or have it delivered to your door." },
            { icon: Clock, h: "Free over R2 800", p: "Spend R2 800 or more and standard PAXI delivery is on the house." },
            { icon: MapPin, h: "Nationwide coverage", p: "We deliver to every major city and town across South Africa." },
            { icon: Package, h: "Fully tracked", p: "You'll receive a tracking number the moment your pair is dispatched." },
          ].map((b) => (
            <div key={b.h} className="bg-card p-6">
              <b.icon className="h-6 w-6 text-primary" />
              <div className="mt-3 font-display text-lg font-semibold">{b.h}</div>
              <p className="mt-1 text-sm text-muted-foreground">{b.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-sm border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">PAXI shipping rates</h2>

          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Store to Store</div>
            <table className="mt-2 w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr><td className="py-3 text-muted-foreground">7 – 9 business days</td><td className="py-3 text-right font-medium">R 99</td></tr>
                <tr><td className="py-3 text-muted-foreground">3 – 5 business days</td><td className="py-3 text-right font-medium">R 119</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Store to Home</div>
            <table className="mt-2 w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr><td className="py-3 text-muted-foreground">3 – 5 business days</td><td className="py-3 text-right font-medium">R 139</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Orders over R2 800</span>
              <span className="font-medium text-primary">Free standard shipping</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/track-order" className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Track your order
          </Link>
          <a
            href="https://wa.me/27780148476"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-3 text-sm font-medium hover:border-primary"
          >
            Got a question? Chat on WhatsApp
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
