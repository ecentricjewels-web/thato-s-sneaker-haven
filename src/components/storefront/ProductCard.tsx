import { Link } from "@tanstack/react-router";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const up = product.changePct >= 0;
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition hover:border-border-strong hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-background">
        <img
          src={product.image}
          alt={`${product.name} ${product.colorway}`}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-sm bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          {product.brand}
        </span>
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-medium ${
            up ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
          }`}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {up ? "+" : ""}
          {product.changePct.toFixed(1)}%
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="line-clamp-1 text-sm font-medium">{product.name}</div>
          <div className="line-clamp-1 text-xs text-muted-foreground">
            {product.colorway}
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Lowest Ask
            </div>
            <div className="font-display text-lg font-semibold">
              {formatPrice(product.lowestAsk)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Last Sale
            </div>
            <div className="font-mono text-sm text-foreground/80">
              {formatPrice(product.lastSale)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
