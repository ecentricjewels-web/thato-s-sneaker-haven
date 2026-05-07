import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, BadgeCheck } from "lucide-react";
import { brands } from "@/lib/products";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="border-b border-border/60">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Authenticated. Verified. Shipped from Johannesburg.</span>
          <div className="hidden gap-6 md:flex">
            <span>Help</span>
            <span>Sell</span>
            <span>EN / USD</span>
          </div>
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
            placeholder="Search by brand, model, colorway, or SKU"
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
            About Thato
          </Link>
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
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-primary">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified Seller · 4.97★ (2,184)
          </span>
        </div>
      </div>
    </header>
  );
}
