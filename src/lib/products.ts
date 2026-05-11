import p6000 from "@/assets/nike-p6000-silver.jpg";
import tnWhite from "@/assets/nike-tn-white.jpg";
import tnBlackSilver from "@/assets/nike-tn-black-metallic-silver.jpg";
import tnPink from "@/assets/nike-tn-pink.jpg";
import j4Fire from "@/assets/jordan4-fire-red.jpg";
import j4Pine from "@/assets/jordan4-pine-green.jpg";
import j4BlackCat from "@/assets/jordan4-black-cat.jpg";
import j4Military from "@/assets/jordan4-military-black.jpg";
import am95 from "@/assets/airmax95-cool-grey.jpg";
import shoxBlack from "@/assets/shox-tl-black.jpg";
import shoxWhite from "@/assets/shox-tl-white.jpg";
import shoxSilver from "@/assets/shox-tl-silver.jpg";
import nb530 from "@/assets/nb-530.jpg";
import pumaBlack from "@/assets/puma-suede-xl-black.jpg";
import pumaRed from "@/assets/puma-suede-xl-red.jpg";
import pumaBlue from "@/assets/puma-suede-xl-blue.jpg";
import campusBlack from "@/assets/adidas-campus-black.jpg";
import campusGrey from "@/assets/adidas-campus-grey.jpg";
import af1Black from "@/assets/airforce-black.jpg";
import af1White from "@/assets/airforce-white.jpg";

export type Brand = "Nike" | "Jordan" | "Adidas" | "Puma" | "New Balance";

export type Product = {
  slug: string;
  name: string;
  brand: Brand;
  colorway: string;
  image: string;
  price: number;
  category: "Lifestyle" | "Basketball" | "Running";
  sizes: string[];
  isNew?: boolean;
  inStock?: boolean;
};

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => String(start + i));

const SIZE_3_10 = range(3, 10);
const SIZE_3_9 = range(3, 9);
const SIZE_3_6 = range(3, 6);
const SIZE_6_10 = range(6, 10);

export const products: Product[] = [
  // Featured 8 (in order)
  { slug: "nike-shox-tl-black", name: "Nike Shox TL", brand: "Nike", colorway: "Triple Black", image: shoxBlack, price: 1999, category: "Running", sizes: SIZE_3_9, inStock: true },
  { slug: "nike-shox-tl-white", name: "Nike Shox TL", brand: "Nike", colorway: "Triple White", image: shoxWhite, price: 1999, category: "Running", sizes: SIZE_3_10, inStock: true },
  { slug: "nike-airmax-95-cool-grey", name: "Nike Air Max 95", brand: "Nike", colorway: "Cool Grey / University Blue", image: am95, price: 2099, category: "Lifestyle", sizes: SIZE_3_10, inStock: true },
  { slug: "nike-tn-black-metallic-silver", name: "Nike Air Max Plus TN", brand: "Nike", colorway: "Black Metallic Silver", image: tnBlackSilver, price: 1899, category: "Lifestyle", sizes: SIZE_3_9, inStock: true },
  { slug: "new-balance-530", name: "New Balance 530", brand: "New Balance", colorway: "White / Silver", image: nb530, price: 1600, category: "Lifestyle", sizes: SIZE_3_10, isNew: true, inStock: true },
  { slug: "nike-p6000-silver", name: "Nike P-6000", brand: "Nike", colorway: "Silver", image: p6000, price: 1699, category: "Lifestyle", sizes: SIZE_6_10, inStock: true },
  { slug: "puma-suede-xl-black", name: "Puma Suede XL", brand: "Puma", colorway: "Black", image: pumaBlack, price: 1299, category: "Lifestyle", sizes: SIZE_3_9, inStock: true },
  { slug: "adidas-campus-grey", name: "Adidas Campus 00s", brand: "Adidas", colorway: "Grey", image: campusGrey, price: 1250, category: "Lifestyle", sizes: SIZE_3_10, inStock: true },

  // Rest of catalogue
  { slug: "nike-shox-tl-silver", name: "Nike Shox TL", brand: "Nike", colorway: "Metallic Silver", image: shoxSilver, price: 1999, category: "Running", sizes: SIZE_3_10, inStock: true },
  { slug: "nike-tn-white", name: "Nike Air Max Plus TN", brand: "Nike", colorway: "Triple White", image: tnWhite, price: 1899, category: "Lifestyle", sizes: SIZE_3_9, inStock: true },
  { slug: "nike-tn-pink-rise", name: "Nike Air Max Plus TN", brand: "Nike", colorway: "Pink Rise", image: tnPink, price: 1899, category: "Lifestyle", sizes: SIZE_3_6, isNew: true, inStock: true },
  { slug: "nike-air-force-1-black", name: "Nike Air Force 1 Low", brand: "Nike", colorway: "Triple Black", image: af1Black, price: 1400, category: "Lifestyle", sizes: SIZE_3_10, inStock: true },
  { slug: "nike-air-force-1-white", name: "Nike Air Force 1 Low", brand: "Nike", colorway: "Triple White", image: af1White, price: 1400, category: "Lifestyle", sizes: SIZE_3_10, inStock: true },

  { slug: "jordan-4-fire-red", name: "Air Jordan 4 Retro", brand: "Jordan", colorway: "Fire Red", image: j4Fire, price: 1599, category: "Basketball", sizes: SIZE_3_10, inStock: true },
  { slug: "jordan-4-pine-green", name: "Air Jordan 4 Retro", brand: "Jordan", colorway: "Pine Green", image: j4Pine, price: 1599, category: "Basketball", sizes: SIZE_3_10, inStock: true },
  { slug: "jordan-4-black-cat", name: "Air Jordan 4 Retro", brand: "Jordan", colorway: "Black Cat", image: j4BlackCat, price: 1599, category: "Basketball", sizes: SIZE_3_10, inStock: true },
  { slug: "jordan-4-military-black", name: "Air Jordan 4 Retro", brand: "Jordan", colorway: "Military Black", image: j4Military, price: 1599, category: "Basketball", sizes: SIZE_3_10, isNew: true, inStock: true },

  { slug: "adidas-campus-black", name: "Adidas Campus 00s", brand: "Adidas", colorway: "Core Black", image: campusBlack, price: 1250, category: "Lifestyle", sizes: SIZE_3_10, inStock: true },

  { slug: "puma-suede-xl-red", name: "Puma Suede XL", brand: "Puma", colorway: "Red", image: pumaRed, price: 1299, category: "Lifestyle", sizes: SIZE_3_9, inStock: true },
  { slug: "puma-suede-xl-blue", name: "Puma Suede XL", brand: "Puma", colorway: "Royal Blue", image: pumaBlue, price: 1299, category: "Lifestyle", sizes: SIZE_3_9, inStock: true },
];

export const brands: Brand[] = ["Nike", "Jordan", "Adidas", "Puma", "New Balance"];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getColorways = (product: Product) =>
  products.filter((p) => p.name === product.name && p.brand === product.brand);

export const formatPrice = (n: number) =>
  "R" + new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 }).format(n);
