import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { formatPrice, getProduct } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart } = useStore();

  const items = cart
    .map((c) => {
      const product = getProduct(c.slug);
      return product ? { ...c, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col gap-0 border-border bg-background p-0 text-foreground sm:max-w-md">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="font-display text-lg uppercase tracking-[0.18em]">
            Your bag · {items.length}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <div className="font-display text-lg">Your bag is empty</div>
            <p className="text-sm text-muted-foreground">
              Browse the catalogue and add a pair you love.
            </p>
            <Link
              to="/shop"
              onClick={() => setCartOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Shop the catalogue
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto">
              {items.map((i) => (
                <div key={i.slug + i.size} className="flex gap-3 p-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-border bg-card">
                    <img src={i.product.image} alt={i.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium">{i.product.name}</div>
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
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-sm border border-border">
                        <button
                          onClick={() => updateQty(i.slug, i.size, i.qty - 1)}
                          className="grid h-8 w-8 place-items-center hover:bg-surface"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => updateQty(i.slug, i.size, i.qty + 1)}
                          className="grid h-8 w-8 place-items-center hover:bg-surface"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-display text-sm font-semibold">
                        {formatPrice(i.product.price * i.qty)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {subtotal >= 2800
                  ? "Free nationwide shipping included."
                  : `Add ${formatPrice(2800 - subtotal)} for free shipping.`}
              </p>
              <button className="mt-4 w-full rounded-sm bg-primary py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90">
                Checkout
              </button>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-2 w-full rounded-sm border border-border py-2.5 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
