import { Link } from "@tanstack/react-router";
import { Flame, Sparkles } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const lowStock = product.inStock <= 5;
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
        {product.isHot && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm bg-destructive/15 px-2 py-1 text-[10px] font-medium text-destructive">
            <Flame className="h-3 w-3" /> Hot
          </span>
        )}
        {product.isNew && !product.isHot && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm bg-primary/15 px-2 py-1 text-[10px] font-medium text-primary">
            <Sparkles className="h-3 w-3" /> New
          </span>
        )}
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
              Price
            </div>
            <div className="font-display text-lg font-semibold">
              {formatPrice(product.price)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Stock
            </div>
            <div className={`font-mono text-sm ${lowStock ? "text-destructive" : "text-foreground/80"}`}>
              {lowStock ? `Only ${product.inStock} left` : `${product.inStock} pairs`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
