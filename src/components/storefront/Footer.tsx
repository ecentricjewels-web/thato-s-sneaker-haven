export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-bold">
            THATO<span className="text-primary">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Thato's Storefront — a curated catalogue of Nike, Jordan, Adidas,
            Puma and New Balance sneakers. Hand-picked, fairly priced, shipped
            from Johannesburg.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Open for orders
          </div>
        </div>
        {[
          { h: "Shop", l: ["Nike", "Jordan", "Adidas", "Puma", "New Balance"] },
          { h: "Help", l: ["Shipping", "Returns", "Size guide", "Contact"] },
          { h: "Storefront", l: ["About Thato", "Track order", "Wishlist", "FAQ"] },
        ].map((col) => (
          <div key={col.h}>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {col.h}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {col.l.map((i) => (
                <li key={i} className="text-foreground/80 hover:text-foreground">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Thato's Storefront. All rights reserved.</span>
          <span>Johannesburg ↔ Worldwide</span>
        </div>
      </div>
    </footer>
  );
}
