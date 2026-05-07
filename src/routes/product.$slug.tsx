import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { formatPrice, getProduct, products } from "@/lib/products";
import { useState } from "react";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name} — Thato's Storefront` },
      {
        name: "description",
        content: `${loaderData?.product.name} ${loaderData?.product.colorway}. Authenticated by Thato. Shipped worldwide.`,
      },
      { property: "og:image", content: loaderData?.product.image ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="font-display text-3xl">Sneaker not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary">
          Back to shop
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="grid min-h-screen place-items-center bg-background p-8 text-center">
      <div>
        <p className="text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-4 rounded-sm bg-primary px-4 py-2 text-primary-foreground">
          Try again
        </button>
      </div>
    </div>
  ),
  component: ProductPage,
});

const SIZES = ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState<string | null>(null);
  const lowStock = product.inStock <= 5;

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to shop
        </Link>
      </div>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-sm border border-border bg-card">
            <img
              src={product.image}
              alt={`${product.name} ${product.colorway}`}
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`aspect-square overflow-hidden rounded-sm border bg-card ${
                  i === 0 ? "border-primary" : "border-border opacity-70"
                }`}
              >
                <img src={product.image} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {product.brand} · {product.category}
            </div>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-1 text-muted-foreground">{product.colorway}</div>
          </div>

          <div className="flex items-end gap-4 border-y border-border py-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Price
              </div>
              <div className="font-display text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Availability
              </div>
              <div className={`font-mono text-sm ${lowStock ? "text-destructive" : "text-foreground"}`}>
                {lowStock ? `Only ${product.inStock} left` : `In stock · ${product.inStock} pairs`}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="uppercase tracking-[0.18em]">Select size · US M</span>
              <span>Size guide</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-sm border px-2 py-3 text-sm transition ${
                    size === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface hover:border-border-strong"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <button
              disabled={!size}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag className="h-4 w-4" />
              {size ? `Add to bag — Size ${size}` : "Select a size"}
            </button>
            <button className="rounded-sm border border-border-strong bg-surface px-5 py-4 text-sm font-medium hover:border-primary">
              ♡ Save
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <Trust icon={ShieldCheck} label="Authenticated" />
            <Trust icon={BadgeCheck} label="Fixed price" />
            <Trust icon={Truck} label="Ships worldwide" />
          </div>

          <div className="rounded-sm border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-foreground">
              Product details
            </div>
            Released {product.releaseYear} · Original retail {formatPrice(product.retail)}.
            A staple of the {product.brand} lineup, this {product.colorway} colorway is
            one of Thato's hand-picked favourites — sourced fresh, inspected end-to-end,
            and shipped ready to wear.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] border-t border-border px-4 py-12">
        <h2 className="mb-6 font-display text-2xl font-bold">You might also like</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <Link
              key={p.slug}
              to="/product/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-sm border border-border bg-card transition hover:border-border-strong"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="aspect-square w-full object-cover transition group-hover:scale-105"
              />
              <div className="p-3">
                <div className="truncate text-sm">{p.name}</div>
                <div className="text-xs text-primary">{formatPrice(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Trust({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-sm border border-border bg-surface px-3 py-2">
      <Icon className="h-4 w-4 text-primary" />
      <span>{label}</span>
    </div>
  );
}
