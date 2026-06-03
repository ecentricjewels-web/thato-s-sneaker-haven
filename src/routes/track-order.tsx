import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Package, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track your order — Thato's Storefront" },
      { name: "description", content: "Enter your order reference to see the latest status of your sneaker delivery." },
    ],
  }),
  component: TrackOrderPage,
});

const ORDER_STAGES = [
  "Order Received",
  "Processing",
  "Ready for Dispatch",
  "Out for Delivery",
  "Delivered",
] as const;

type OrderStatus =
  | "Order Received"
  | "Processing"
  | "Ready for Dispatch"
  | "Out for Delivery"
  | "Delivered"
  | "On Hold"
  | "Cancelled";

type TrackedOrder = {
  reference: string;
  status: OrderStatus;
  shipping_label: string;
  items: Array<{ name: string; size: string; qty: number; price: number }>;
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  updated_at: string;
};

const STATUS_NOTES: Record<OrderStatus, string> = {
  "Order Received": "We've received your order. Thato will start preparing your pair shortly.",
  "Processing": "Your sneakers are currently being prepared. We'll notify you once they're ready for dispatch.",
  "Ready for Dispatch": "Packed and quality-checked. Just waiting for the courier to collect.",
  "Out for Delivery": "Your sneakers are with the courier and on their way to you today.",
  "Delivered": "Delivered — enjoy your new pair! Tag @thatos.storefront when you lace them up.",
  "On Hold": "There's a small delay on this order. Thato will be in touch shortly with an update.",
  "Cancelled": "This order has been cancelled. Reach out via the contact page if this looks wrong.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function TrackOrderPage() {
  const [input, setInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const onTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const ref = input.trim().replace(/^#/, "");
    if (!ref) return;
    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase.rpc("get_order_by_reference", { _reference: ref });
    setLoading(false);
    if (error) { setOrder(null); return; }
    const row = Array.isArray(data) ? data[0] : data;
    setOrder(row ? (row as TrackedOrder) : null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="mx-auto max-w-[900px] px-4 py-16">
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Help</div>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
          <Search className="mr-2 inline h-8 w-8 text-primary" />
          Track your order
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Enter the order reference from your confirmation message to see live updates from Thato.
        </p>

        <form onSubmit={onTrack} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter order reference"
            className="flex-1 rounded-sm border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary"
          />
          <button disabled={loading} className="rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Searching…" : "Track order"}
          </button>
        </form>

        {searched && !loading && !order && (
          <div className="mt-8 flex items-start gap-3 rounded-sm border border-destructive/40 bg-destructive/10 p-5 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <div className="font-semibold text-destructive">No order found</div>
              <p className="mt-1 text-muted-foreground">
                Double-check the reference and try again. If you're still stuck,
                reach out via the contact page and Thato will look it up.
              </p>
            </div>
          </div>
        )}

        {order && <OrderResult order={order} />}
      </section>
      <Footer />
    </div>
  );
}

function OrderResult({ order }: { order: TrackedOrder }) {
  const isOnHold = order.status === "On Hold";
  const isCancelled = order.status === "Cancelled";
  const currentIndex = ORDER_STAGES.indexOf(order.status as typeof ORDER_STAGES[number]);
  const itemSummary = order.items?.[0]
    ? `${order.items[0].name}${order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}`
    : "—";
  const sizeSummary = order.items?.[0] ? `UK ${order.items[0].size}` : "—";

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-sm border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Reference</div>
            <div className="mt-1 font-display text-2xl font-bold">#{order.reference}</div>
            <div className="mt-1 text-xs text-muted-foreground">Last updated: {formatDate(order.updated_at)}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Current status</div>
            <div className="mt-1 inline-flex items-center gap-2 rounded-sm bg-primary/15 px-3 py-1.5 font-display text-lg font-semibold text-primary">
              {order.status === "Delivered" && <CheckCircle2 className="h-5 w-5" />}
              {order.status}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-foreground/90">{STATUS_NOTES[order.status]}</p>
      </div>

      {!isCancelled && (
        <div className="rounded-sm border border-border bg-card p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Progress</div>
          <div className="mt-5">
            <div className="relative h-1.5 w-full rounded-full bg-border">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
                style={{
                  width: isOnHold ? "10%" : `${Math.max(0, currentIndex) / (ORDER_STAGES.length - 1) * 100}%`,
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {ORDER_STAGES.map((stage, i) => {
                const reached = !isOnHold && i <= currentIndex;
                return (
                  <div key={stage} className="flex flex-col items-center text-center">
                    <span className={`grid h-7 w-7 place-items-center rounded-full border text-[11px] font-semibold ${
                      reached ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
                    }`}>{i + 1}</span>
                    <span className={`mt-2 text-[10px] uppercase tracking-[0.12em] ${reached ? "text-foreground" : "text-muted-foreground"}`}>{stage}</span>
                  </div>
                );
              })}
            </div>
            {isOnHold && (
              <div className="mt-5 flex items-center gap-2 rounded-sm border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
                <AlertCircle className="h-4 w-4" /> Order is currently on hold.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rounded-sm border border-border bg-card p-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Order details</div>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Package className="h-3.5 w-3.5" /> Item</dt>
            <dd className="mt-1 font-medium">{itemSummary}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Size</dt>
            <dd className="mt-1 font-medium">{sizeSummary}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Order date</dt>
            <dd className="mt-1 font-medium">{formatDate(order.created_at)}</dd>
          </div>
          <div className="sm:col-span-3">
            <dt className="text-xs text-muted-foreground">Shipping</dt>
            <dd className="mt-1 font-medium">{order.shipping_label}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
