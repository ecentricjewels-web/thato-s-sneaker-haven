import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { formatPrice, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Thato's Storefront" },
      { name: "description", content: "Your saved sneakers from Thato's Storefront." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, toggleWishlist } = useStore();
  const items = wishlist
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Saved for later
            </div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Your wishlist
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "pair" : "pairs"} saved
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-border bg-card py-24 text-center">
            <Heart className="h-10 w-10 text-muted-foreground" />
            <div className="font-display text-xl">No saved sneakers yet</div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Tap the heart on any pair to save it here for later.
            </p>
            <Link
              to="/shop"
              className="mt-2 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Browse the catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div
                key={p.slug}
                className="group flex gap-4 rounded-sm border border-border bg-card p-3 transition hover:border-border-strong"
              >
                <Link
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  className="h-32 w-32 shrink-0 overflow-hidden rounded-sm bg-background"
                >
                  <img
                    src={p.image}
                    alt={`${p.name} ${p.colorway}`}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {p.brand}
                  </div>
                  <Link
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    className="mt-0.5 line-clamp-1 text-sm font-medium hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <div className="line-clamp-1 text-xs text-muted-foreground">
                    {p.colorway}
                  </div>
                  <div className="mt-2 font-display text-lg font-semibold">
                    {formatPrice(p.price)}
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> Shop
                    </Link>
                    <button
                      onClick={() => toggleWishlist(p.slug)}
                      aria-label="Remove from wishlist"
                      className="grid h-9 w-9 place-items-center rounded-sm border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
