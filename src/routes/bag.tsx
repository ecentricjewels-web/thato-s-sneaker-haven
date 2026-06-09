import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Store, Home as HomeIcon, Check, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useStore } from "@/lib/store";
import { formatPrice, getProduct, products } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Your bag — Thato's Storefront" },
      { name: "description", content: "Review your bag and check out securely." },
    ],
  }),
  component: BagPage,
});

type ShippingId = "free" | "paxi-7-9" | "paxi-3-5" | "paxi-home" | "message-thato";

type ShippingOption = {
  id: ShippingId;
  label: string;
  sub: string;
  price: number;
  icon: React.ElementType;
  needsPep: boolean;
  needsAddress: boolean;
};

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "paxi-7-9", label: "PAXI · Store to Store", sub: "7 – 9 business days", price: 99, icon: Store, needsPep: true, needsAddress: false },
  { id: "paxi-3-5", label: "PAXI · Store to Store (Express)", sub: "3 – 5 business days", price: 119, icon: Store, needsPep: true, needsAddress: false },
  { id: "paxi-home", label: "PAXI · Store to Home", sub: "3 – 5 business days", price: 139, icon: HomeIcon, needsPep: false, needsAddress: true },
  { id: "message-thato", label: "Message Thato to organize shipping", sub: "We'll agree on a custom method on WhatsApp", price: 0, icon: MessageCircle, needsPep: false, needsAddress: false },
];

const FREE_SHIPPING_THRESHOLD = 2800;

function BagPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useStore();
  const [shippingId, setShippingId] = useState<ShippingId | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [pepStore, setPepStore] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [placed, setPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const items = cart
    .map((c) => {
      const product = getProduct(c.slug);
      return product ? { ...c, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0);
  const qualifiesForFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const effectiveShippingId: ShippingId | null = qualifiesForFree ? "free" : shippingId;
  const selectedOption = SHIPPING_OPTIONS.find((o) => o.id === effectiveShippingId);
  const shipping = qualifiesForFree || effectiveShippingId === "message-thato" ? 0 : selectedOption?.price ?? 0;
  const total = subtotal + shipping;

  const inBagSlugs = new Set(items.map((i) => i.product.slug));
  const upsell = products.filter((p) => !inBagSlugs.has(p.slug)).slice(0, 4);

  const canCheckout = (() => {
    if (items.length === 0) return false;
    if (qualifiesForFree) return !!firstName.trim() && !!lastName.trim() && !!phone.trim();
    if (!selectedOption) return false;
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) return false;
    if (selectedOption.needsPep && !pepStore.trim()) return false;
    if (selectedOption.needsAddress && !address.trim()) return false;
    return true;
  })();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCheckout || !selectedOption) return;
    setSubmitting(true);

    const reference = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).replace(/-/g, "").slice(0, 8).toUpperCase();

    const payload = {
      reference,
      customer_first_name: firstName.trim(),
      customer_last_name: lastName.trim(),
      customer_phone: phone.trim(),
      shipping_method: selectedOption.id,
      shipping_label: qualifiesForFree ? "Free nationwide shipping" : selectedOption.label,
      pep_store: selectedOption.needsPep ? pepStore.trim() : null,
      delivery_address: selectedOption.needsAddress ? address.trim() : null,
      items: items.map((i) => ({
        slug: i.product.slug,
        name: i.product.name,
        colorway: i.product.colorway,
        size: i.size,
        qty: i.qty,
        price: i.product.price,
      })),
      subtotal,
      shipping_cost: shipping,
      total,
      notes: notes.trim() || null,
    };

    const { error } = await supabase.from("orders").insert(payload);
    setSubmitting(false);
    if (error) {
      const raw = (error.message || "").toLowerCase();
      let friendly = "Something went wrong placing your order. Please try again.";
      if (raw.includes("row-level security") || raw.includes("permission")) {
        friendly = "We couldn't submit your order right now. Please refresh the page and try again — if it keeps happening, message Thato on WhatsApp.";
      } else if (raw.includes("subtotal mismatch") || raw.includes("total mismatch")) {
        friendly = "Your bag total looks out of date. Please refresh the page and try again.";
      } else if (raw.includes("missing price")) {
        friendly = "One of the items in your bag is unavailable. Please remove it and try again.";
      } else if (raw.includes("invalid item") || raw.includes("must contain at least one item")) {
        friendly = "Your bag is empty or contains an invalid item. Please review and try again.";
      } else if (raw.includes("invalid shipping")) {
        friendly = "Please pick a valid shipping option and try again.";
      } else if (raw.includes("network") || raw.includes("failed to fetch")) {
        friendly = "Connection issue. Check your internet and try again.";
      }
      toast.error(friendly);
      return;
    }

    setOrderRef(reference);
    setPlaced(true);
    clearCart();
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    const isMessageThato = effectiveShippingId === "message-thato";
    const waLink = `https://wa.me/27780148476?text=${encodeURIComponent(`Hi Thato, I just placed order ${orderRef}. I'd like to organize shipping.`)}`;
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-[700px] px-4 py-20 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold md:text-5xl">Order placed</h1>
          {orderRef && <p className="mt-2 text-sm text-muted-foreground">Reference · <span className="font-mono text-foreground">{orderRef}</span></p>}
          <p className="mt-3 text-muted-foreground">
            Thanks! Thato will be in touch on WhatsApp shortly to confirm payment and dispatch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {isMessageThato && (
              <a href={waLink} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <MessageCircle className="h-4 w-4" /> Message Thato now
              </a>
            )}
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-3 text-sm font-semibold hover:border-primary">
              Continue shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Checkout</div>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Your bag</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {items.length === 0
            ? "Your bag is empty. Browse the catalogue and add a pair you love."
            : `${items.length} ${items.length === 1 ? "item" : "items"} ready for checkout.`}
        </p>

        {items.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-sm border border-border bg-card p-12 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <Link to="/shop" className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Shop the catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-8">
              {/* Items */}
              <div className="divide-y divide-border rounded-sm border border-border bg-card">
                {items.map((i) => (
                  <div key={i.slug + i.size} className="flex gap-4 p-5">
                    <Link to="/product/$slug" params={{ slug: i.product.slug }} className="h-28 w-28 shrink-0 overflow-hidden rounded-sm border border-border bg-background">
                      <img src={i.product.image} alt={i.product.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to="/product/$slug" params={{ slug: i.product.slug }} className="text-sm font-medium hover:text-primary">
                            {i.product.name}
                          </Link>
                          <div className="text-xs text-muted-foreground">{i.product.colorway}</div>
                          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">UK {i.size}</div>
                        </div>
                        <button type="button" onClick={() => removeFromCart(i.slug, i.size)} className="text-muted-foreground hover:text-foreground" aria-label="Remove">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-sm border border-border">
                          <button type="button" onClick={() => updateQty(i.slug, i.size, i.qty - 1)} className="grid h-9 w-9 place-items-center hover:bg-surface" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                          <span className="w-9 text-center text-sm">{i.qty}</span>
                          <button type="button" onClick={() => updateQty(i.slug, i.size, i.qty + 1)} className="grid h-9 w-9 place-items-center hover:bg-surface" aria-label="Increase"><Plus className="h-3 w-3" /></button>
                        </div>
                        <div className="font-display text-base font-semibold">{formatPrice(i.product.price * i.qty)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div className="rounded-sm border border-border bg-card p-6">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-lg uppercase tracking-[0.16em]">Shipping</h2>
                </div>

                {qualifiesForFree ? (
                  <div className="mt-4 rounded-sm border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
                    <div className="font-semibold text-primary">Free nationwide shipping unlocked</div>
                    <p className="mt-1 text-muted-foreground">Your order is over {formatPrice(FREE_SHIPPING_THRESHOLD)} — shipping is on us.</p>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 text-xs text-muted-foreground">Choose a method. Free shipping kicks in over {formatPrice(FREE_SHIPPING_THRESHOLD)}.</p>
                    <div className="mt-5 grid gap-3">
                      {SHIPPING_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const selected = shippingId === opt.id;
                        return (
                          <label key={opt.id}
                            className={`flex cursor-pointer items-center gap-4 rounded-sm border p-4 transition ${selected ? "border-primary bg-primary/5" : "border-border hover:border-border-strong"}`}>
                            <input type="radio" name="shipping" checked={selected} onChange={() => setShippingId(opt.id)} className="sr-only" />
                            <span className={`grid h-10 w-10 place-items-center rounded-sm ${selected ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}>
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="flex-1">
                              <div className="text-sm font-semibold">{opt.label}</div>
                              <div className="text-xs text-muted-foreground">{opt.sub}</div>
                            </div>
                            <div className="font-display text-base font-bold">{opt.price === 0 ? "—" : formatPrice(opt.price)}</div>
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}

                {selectedOption && (
                  <div className="mt-6 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
                    <Field label="Name" value={firstName} onChange={setFirstName} required />
                    <Field label="Surname" value={lastName} onChange={setLastName} required />
                    <Field label="Phone number" value={phone} onChange={setPhone} required type="tel" placeholder="e.g. 078 014 8476" />
                    {selectedOption.needsPep && (
                      <Field label="PEP store for collection" value={pepStore} onChange={setPepStore} required
                        placeholder="e.g. PEP Soweto Maponya Mall" className="md:col-span-2" />
                    )}
                    {selectedOption.needsAddress && (
                      <Field label="Delivery address" value={address} onChange={setAddress} required
                        placeholder="Street, suburb, city, postcode" className="md:col-span-2" />
                    )}
                    {selectedOption.id === "message-thato" && (
                      <Field label="Anything Thato should know? (optional)" value={notes} onChange={setNotes}
                        placeholder="Preferred courier, location, drop-off time…" className="md:col-span-2" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <aside className="h-fit rounded-sm border border-border bg-card p-6 lg:sticky lg:top-24">
              <div className="font-display text-lg uppercase tracking-[0.18em]">Order summary</div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {qualifiesForFree
                      ? "Free"
                      : effectiveShippingId === "message-thato"
                      ? "To confirm"
                      : selectedOption
                      ? formatPrice(shipping)
                      : <span className="text-muted-foreground">Select method</span>}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 font-display text-xl font-bold">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              {!qualifiesForFree && (
                <p className="mt-3 text-xs text-muted-foreground">Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} for free nationwide shipping.</p>
              )}
              <button type="submit" disabled={!canCheckout || submitting}
                className="mt-5 w-full rounded-sm bg-primary py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
                {submitting ? "Placing…" : "Place order"}
              </button>
              <Link to="/shop" className="mt-2 block w-full rounded-sm border border-border py-2.5 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
                Continue shopping
              </Link>
            </aside>
          </form>
        )}

        {upsell.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">You might also like</div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Complete the rotation</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {upsell.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, required, type = "text", placeholder, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string; className?: string;
}) {
  return (
    <label className={`grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground ${className}`}>
      {label}
      <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={300}
        className="rounded-sm border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary" />
    </label>
  );
}
