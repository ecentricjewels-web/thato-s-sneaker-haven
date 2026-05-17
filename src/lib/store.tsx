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

export type OrderStatus =
  | "Order Received"
  | "Processing"
  | "Ready for Dispatch"
  | "Out for Delivery"
  | "Delivered"
  | "On Hold";

export type Order = {
  id: string;
  status: OrderStatus;
  updatedAt: string; // ISO
  createdAt: string; // ISO
  itemName: string;
  size: string;
  note?: string;
};

type StoreCtx = {
  cart: CartItem[];
  wishlist: string[];
  reviews: Review[];
  cartCount: number;
  lastAddedAt: number;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (slug: string, size: string) => void;
  updateQty: (slug: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  addReview: (r: Omit<Review, "id" | "date">) => void;
  findOrder: (id: string) => Order | null;
};

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = "thato:cart";
const WISH_KEY = "thato:wishlist";
const REVIEWS_KEY = "thato:reviews";

const SEED_REVIEWS: Review[] = [
  { id: "r1", name: "Lerato M.", rating: 5, text: "Got my Jordan 4s in 3 days, packaged like a museum piece. Real ones only.", date: "2026-04-12" },
  { id: "r2", name: "Kyle D.", rating: 5, text: "Clean website, easy checkout, fair prices. Will be back for the TNs.", date: "2026-04-22" },
  { id: "r3", name: "Aisha K.", rating: 5, text: "First time ordering — comms, condition and delivery all 10/10.", date: "2026-05-02" },
];

const DEMO_ORDERS: Order[] = [
  { id: "12345", status: "Processing", updatedAt: "2026-05-12T14:03:00Z", createdAt: "2026-05-10T09:12:00Z", itemName: "Air Jordan 4 Retro — Black Cat", size: "UK 8" },
  { id: "12346", status: "Out for Delivery", updatedAt: "2026-05-12T08:21:00Z", createdAt: "2026-05-09T11:00:00Z", itemName: "Nike Shox TL — Triple Black", size: "UK 9" },
  { id: "12347", status: "Delivered", updatedAt: "2026-05-08T16:40:00Z", createdAt: "2026-05-04T10:30:00Z", itemName: "Puma Suede XL — Royal Blue", size: "UK 7" },
  { id: "12348", status: "Order Received", updatedAt: "2026-05-12T10:00:00Z", createdAt: "2026-05-12T10:00:00Z", itemName: "New Balance 530", size: "UK 8" },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      const r = localStorage.getItem(REVIEWS_KEY);
      if (c) {
        const parsed: CartItem[] = JSON.parse(c);
        // Drop any items whose product no longer exists in the catalogue
        setCart(parsed.filter((i) => !!getProduct(i.slug) && i.qty > 0));
      }
      if (w) setWishlist(JSON.parse(w));
      if (r) setReviews(JSON.parse(r));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)); }, [reviews, hydrated]);

  const value = useMemo<StoreCtx>(
    () => ({
      cart,
      wishlist,
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
      toggleWishlist: (slug) =>
        setWishlist((prev) =>
          prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
        ),
      isWishlisted: (slug) => wishlist.includes(slug),
      addReview: (r) =>
        setReviews((prev) => [
          { ...r, id: Math.random().toString(36).slice(2, 9), date: new Date().toISOString() },
          ...prev,
        ]),
      findOrder: (id) => {
        const trimmed = id.trim().replace(/^#/, "");
        return DEMO_ORDERS.find((o) => o.id === trimmed) ?? null;
      },
    }),
    [cart, wishlist, reviews, lastAddedAt],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const ORDER_STAGES: OrderStatus[] = [
  "Order Received",
  "Processing",
  "Ready for Dispatch",
  "Out for Delivery",
  "Delivered",
];
