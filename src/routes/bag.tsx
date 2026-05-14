import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useStore } from "@/lib/store";
import { formatPrice, getProduct, products } from "@/lib/products";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Your bag — Thato's Storefront" },
      { name: "description", content: "Review your bag and check out securely." },
    ],
  }),
  component: BagPage,
});

function BagPage() {
  const { cart, updateQty, removeFromCart } = useStore();

  const items = cart
    .map((c) => {
      const product = getProduct(c.slug);
      return product ? { ...c, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 2800 ? 0 : 99;
  const total = subtotal + shipping;

  const inBagSlugs = new Set(items.map((i) => i.product.slug));
  const upsell = products.filter((p) => !inBagSlugs.has(p.slug)).slice(0, 4);

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
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Shop the catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="divide-y divide-border rounded-sm border border-border bg-card">
              {items.map((i) => (
                <div key={i.slug + i.size} className="flex gap-4 p-5">
                  <Link
                    to="/product/$slug"
                    params={{ slug: i.product.slug }}
                    className="h-28 w-28 shrink-0 overflow-hidden rounded-sm border border-border bg-background"
                  >
                    <img src={i.product.image} alt={i.product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to="/product/$slug" params={{ slug: i.product.slug }} className="text-sm font-medium hover:text-primary">
                          {i.product.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">{i.product.colorway}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          UK {i.size}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(i.slug, i.size)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center rounded-sm border border-border">
                        <button
                          onClick={() => updateQty(i.slug, i.size, i.qty - 1)}
                          className="grid h-9 w-9 place-items-center hover:bg-surface"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-9 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => updateQty(i.slug, i.size, i.qty + 1)}
                          className="grid h-9 w-9 place-items-center hover:bg-surface"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-display text-base font-semibold">
                        {formatPrice(i.product.price * i.qty)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-sm border border-border bg-card p-6">
              <div className="font-display text-lg uppercase tracking-[0.18em]">Order summary</div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between border-t border-border pt-3 font-display text-xl font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {subtotal >= 2800
                  ? "Free nationwide shipping included."
                  : `Add ${formatPrice(2800 - subtotal)} for free shipping.`}
              </p>
              <button className="mt-5 w-full rounded-sm bg-primary py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90">
                Checkout
              </button>
              <Link to="/shop" className="mt-2 block w-full rounded-sm border border-border py-2.5 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}

        {upsell.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                You might also like
              </div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Complete the rotation</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {upsell.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
