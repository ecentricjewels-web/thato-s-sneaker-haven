import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "./products";

export type CartItem = {
  slug: string;
  size: string;
  qty: number;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string; // ISO
};

type StoreCtx = {
  cart: CartItem[];
  reviews: Review[];
  cartCount: number;
  lastAddedAt: number;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (slug: string, size: string) => void;
  updateQty: (slug: string, size: string, qty: number) => void;
  clearCart: () => void;
  addReview: (r: Omit<Review, "id" | "date">) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = "thato:cart";
const REVIEWS_KEY = "thato:reviews:v2";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const r = localStorage.getItem(REVIEWS_KEY);
      if (c) {
        const parsed: CartItem[] = JSON.parse(c);
        setCart(parsed.filter((i) => !!getProduct(i.slug) && i.qty > 0));
      }
      if (r) setReviews(JSON.parse(r));
      // Clear legacy seeded reviews from older storage key
      localStorage.removeItem("thato:reviews");
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)); }, [reviews, hydrated]);

  const value = useMemo<StoreCtx>(
    () => ({
      cart,
      reviews,
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      lastAddedAt,
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
        setLastAddedAt(Date.now());
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
      addReview: (r) =>
        setReviews((prev) => [
          { ...r, id: Math.random().toString(36).slice(2, 9), date: new Date().toISOString() },
          ...prev,
        ]),
    }),
    [cart, reviews, lastAddedAt],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
