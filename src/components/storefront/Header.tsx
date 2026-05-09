import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Heart } from "lucide-react";
import { brands } from "@/lib/products";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="border-b border-border/60 bg-surface">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center px-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Free delivery on orders over R2 500 · Shipped from Johannesburg</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-sm bg-primary font-display text-sm font-bold text-primary-foreground">
            T
          </div>
          <div className="leading-none">
            <div className="font-display text-base font-bold tracking-tight">
              THATO<span className="text-primary">.</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Storefront
            </div>
          </div>
        </Link>

        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search sneakers, brands, colourways"
            className="h-10 w-full rounded-sm border border-border bg-surface pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <Link
            to="/shop"
            className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            About
          </Link>
          <button className="hidden h-9 w-9 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground md:inline-flex">
            <Heart className="h-4 w-4" />
          </button>
          <button className="hidden h-9 w-9 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground md:inline-flex">
            <User className="h-4 w-4" />
          </button>
          <button className="relative inline-flex h-9 items-center gap-2 rounded-sm bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            <ShoppingBag className="h-4 w-4" />
            Bag · 0
          </button>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex h-11 max-w-[1400px] items-center gap-6 px-4 text-sm">
          <Link
            to="/shop"
            className="text-muted-foreground transition hover:text-foreground"
          >
            All sneakers
          </Link>
          {brands.map((b) => (
            <Link
              key={b}
              to="/shop"
              search={{ brand: b }}
              className="text-muted-foreground transition hover:text-foreground"
            >
              {b}
            </Link>
          ))}
          <span className="ml-auto text-[11px] uppercase tracking-[0.2em] text-primary">
            New arrivals weekly
          </span>
        </div>
      </div>
    </header>
  );
}
