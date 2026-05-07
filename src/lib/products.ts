import jordan1 from "@/assets/sneaker-jordan1.jpg";
import jordan4 from "@/assets/sneaker-jordan4.jpg";
import dunk from "@/assets/sneaker-dunk.jpg";
import yeezy from "@/assets/sneaker-yeezy.jpg";
import samba from "@/assets/sneaker-samba.jpg";
import puma from "@/assets/sneaker-puma.jpg";

export type Brand = "Nike" | "Jordan" | "Adidas" | "Puma";

export type Product = {
  slug: string;
  name: string;
  brand: Brand;
  colorway: string;
  image: string;
  lastSale: number;
  lowestAsk: number;
  highestBid: number;
  retail: number;
  releaseYear: number;
  changePct: number;
  premiumPct: number;
  category: "Lifestyle" | "Basketball" | "Running" | "Skate";
};

export const products: Product[] = [
  {
    slug: "air-jordan-1-retro-high-panda",
    name: "Air Jordan 1 Retro High",
    brand: "Jordan",
    colorway: "Black / White",
    image: jordan1,
    lastSale: 312,
    lowestAsk: 325,
    highestBid: 298,
    retail: 180,
    releaseYear: 2024,
    changePct: 4.2,
    premiumPct: 73,
    category: "Basketball",
  },
  {
    slug: "air-jordan-4-retro-bred",
    name: "Air Jordan 4 Retro",
    brand: "Jordan",
    colorway: "Bred Reimagined",
    image: jordan4,
    lastSale: 425,
    lowestAsk: 449,
    highestBid: 410,
    retail: 215,
    releaseYear: 2024,
    changePct: 8.1,
    premiumPct: 109,
    category: "Basketball",
  },
  {
    slug: "nike-dunk-low-metallic-silver",
    name: "Nike Dunk Low",
    brand: "Nike",
    colorway: "Metallic Silver",
    image: dunk,
    lastSale: 168,
    lowestAsk: 175,
    highestBid: 155,
    retail: 115,
    releaseYear: 2023,
    changePct: -2.3,
    premiumPct: 46,
    category: "Lifestyle",
  },
  {
    slug: "yeezy-boost-350-v2-steel-grey",
    name: "Yeezy Boost 350 V2",
    brand: "Adidas",
    colorway: "Steel Grey",
    image: yeezy,
    lastSale: 289,
    lowestAsk: 305,
    highestBid: 270,
    retail: 230,
    releaseYear: 2023,
    changePct: 1.4,
    premiumPct: 26,
    category: "Lifestyle",
  },
  {
    slug: "adidas-samba-og-night-indigo",
    name: "Adidas Samba OG",
    brand: "Adidas",
    colorway: "Night Indigo",
    image: samba,
    lastSale: 142,
    lowestAsk: 149,
    highestBid: 130,
    retail: 100,
    releaseYear: 2024,
    changePct: 12.5,
    premiumPct: 42,
    category: "Lifestyle",
  },
  {
    slug: "puma-suede-classic-high-risk-red",
    name: "Puma Suede Classic",
    brand: "Puma",
    colorway: "High Risk Red",
    image: puma,
    lastSale: 98,
    lowestAsk: 105,
    highestBid: 88,
    retail: 80,
    releaseYear: 2024,
    changePct: 3.7,
    premiumPct: 22,
    category: "Lifestyle",
  },
];

export const brands: Brand[] = ["Nike", "Jordan", "Adidas", "Puma"];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
