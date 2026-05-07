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
  price: number;
  retail: number;
  releaseYear: number;
  inStock: number;
  isNew?: boolean;
  isHot?: boolean;
  category: "Lifestyle" | "Basketball" | "Running" | "Skate";
};

export const products: Product[] = [
  {
    slug: "air-jordan-1-retro-high-panda",
    name: "Air Jordan 1 Retro High",
    brand: "Jordan",
    colorway: "Black / White",
    image: jordan1,
    price: 325,
    retail: 180,
    releaseYear: 2024,
    inStock: 8,
    isHot: true,
    category: "Basketball",
  },
  {
    slug: "air-jordan-4-retro-bred",
    name: "Air Jordan 4 Retro",
    brand: "Jordan",
    colorway: "Bred Reimagined",
    image: jordan4,
    price: 449,
    retail: 215,
    releaseYear: 2024,
    inStock: 3,
    isHot: true,
    category: "Basketball",
  },
  {
    slug: "nike-dunk-low-metallic-silver",
    name: "Nike Dunk Low",
    brand: "Nike",
    colorway: "Metallic Silver",
    image: dunk,
    price: 175,
    retail: 115,
    releaseYear: 2023,
    inStock: 12,
    category: "Lifestyle",
  },
  {
    slug: "yeezy-boost-350-v2-steel-grey",
    name: "Yeezy Boost 350 V2",
    brand: "Adidas",
    colorway: "Steel Grey",
    image: yeezy,
    price: 305,
    retail: 230,
    releaseYear: 2023,
    inStock: 5,
    category: "Lifestyle",
  },
  {
    slug: "adidas-samba-og-night-indigo",
    name: "Adidas Samba OG",
    brand: "Adidas",
    colorway: "Night Indigo",
    image: samba,
    price: 149,
    retail: 100,
    releaseYear: 2024,
    inStock: 14,
    isNew: true,
    category: "Lifestyle",
  },
  {
    slug: "puma-suede-classic-high-risk-red",
    name: "Puma Suede Classic",
    brand: "Puma",
    colorway: "High Risk Red",
    image: puma,
    price: 105,
    retail: 80,
    releaseYear: 2024,
    inStock: 20,
    isNew: true,
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
