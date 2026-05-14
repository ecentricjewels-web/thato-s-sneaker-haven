import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { brands } from "@/lib/products";
import { useStore } from "@/lib/store";

export function Header() {
  const { cartCount, wishlist } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    navigate({ to: "/shop", search: query ? { q: query } : {} });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="border-b border-border/60 bg-surface">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center px-4 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
          <span>Free delivery on orders over R2 800 · Nationwide shipping</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 md:gap-6">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="grid h-9 w-9 place-items-center rounded-sm border border-border md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <form onSubmit={submitSearch} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sneakers, brands, colourways"
            className="h-10 w-full rounded-sm border border-border bg-surface pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </form>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <Link to="/" className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/shop" className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Shop</Link>
          <Link to="/about" className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>About</Link>
          <Link to="/wishlist" className="relative inline-flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground" aria-label="Wishlist" activeProps={{ className: "text-foreground" }}>
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">{wishlist.length}</span>
            )}
          </Link>
          <Link to="/bag" className="relative inline-flex h-9 items-center gap-2 rounded-sm bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            <ShoppingBag className="h-4 w-4" />
            Bag · {cartCount}
          </Link>
        </nav>

        {/* Mobile bag + wishlist quick access */}
        <div className="flex items-center gap-1 md:hidden">
          <Link to="/wishlist" className="relative grid h-9 w-9 place-items-center rounded-sm text-muted-foreground" aria-label="Wishlist">
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">{wishlist.length}</span>
            )}
          </Link>
          <Link to="/bag" className="relative inline-flex h-9 items-center gap-1.5 rounded-sm bg-primary px-2.5 text-xs font-medium text-primary-foreground">
            <ShoppingBag className="h-3.5 w-3.5" /> {cartCount}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-4 py-2 text-sm">
            {[
              { to: "/", label: "Home", exact: true },
              { to: "/shop", label: "Shop" },
              { to: "/about", label: "About" },
              { to: "/wishlist", label: "Wishlist" },
              { to: "/track-order", label: "Track order" },
              { to: "/shipping", label: "Shipping" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={l.exact ? { exact: true } : undefined}
                activeProps={{ className: "text-foreground" }}
                className="border-b border-border py-3 text-muted-foreground last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <div className="hidden border-t border-border/60 md:block">
        <div className="mx-auto flex h-11 max-w-[1400px] items-center gap-6 px-4 text-sm">
          <Link to="/shop" className="text-muted-foreground transition hover:text-foreground">All sneakers</Link>
          {brands.map((b) => (
            <Link key={b} to="/shop" search={{ brand: b }} className="text-muted-foreground transition hover:text-foreground">
              {b}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
