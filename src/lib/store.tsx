import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = {
  slug: string;
  size: string;
  qty: number;
};

type StoreCtx = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (slug: string, size: string) => void;
  updateQty: (slug: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
};

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = "thato:cart";
const WISH_KEY = "thato:wishlist";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const value = useMemo<StoreCtx>(
    () => ({
      cart,
      wishlist,
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      cartOpen,
      setCartOpen,
      addToCart: (product, size) => {
        setCart((prev) => {
          const i = prev.findIndex((c) => c.slug === product.slug && c.size === size);
          if (i >= 0) {
            const next = [...prev];
            next[i] = { ...next[i], qty: next[i].qty + 1 };
            return next;
          }
          return [...prev, { slug: product.slug, size, qty: 1 }];
        });
        setCartOpen(true);
      },
      removeFromCart: (slug, size) =>
        setCart((prev) => prev.filter((c) => !(c.slug === slug && c.size === size))),
      updateQty: (slug, size, qty) =>
        setCart((prev) =>
          prev
            .map((c) => (c.slug === slug && c.size === size ? { ...c, qty } : c))
            .filter((c) => c.qty > 0),
        ),
      clearCart: () => setCart([]),
      toggleWishlist: (slug) =>
        setWishlist((prev) =>
          prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
        ),
      isWishlisted: (slug) => wishlist.includes(slug),
    }),
    [cart, wishlist, cartOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
