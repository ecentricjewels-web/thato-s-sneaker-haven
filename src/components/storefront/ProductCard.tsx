import { Link } from "@tanstack/react-router";
import { formatPrice, getColorways, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const colorwayCount = getColorways(product).length;
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
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            New
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-sm bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          {product.brand}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="line-clamp-1 text-sm font-medium">{product.name}</div>
        <div className="line-clamp-1 text-xs text-muted-foreground">
          {product.colorway}
          {colorwayCount > 1 && (
            <span className="ml-2 text-foreground/60">· {colorwayCount} colours</span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
          <div className="font-display text-lg font-semibold">
            {formatPrice(product.price)}
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-primary">
            Shop
          </div>
        </div>
      </div>
    </Link>
  );
}
