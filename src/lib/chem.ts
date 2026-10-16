import type { Product, ProductCategory } from "@/data/products";

export type HazardClass = "8" | "5.1" | "2.3";

/** Primary ADR / UN transport class, read from the product's UN string. */
export function hazardClass(product: Product): HazardClass | null {
  const un = product.unNumber.toLowerCase();
  if (un.includes("class 2.3")) return "2.3";
  if (un.includes("class 5.1")) return "5.1";
  if (un.includes("class 8")) return "8";
  return null;
}

export function unCode(product: Product): string | null {
  const match = product.unNumber.match(/^UN\s?\d{4}/);
  return match ? match[0] : null;
}

/** Short symbol shown large on the periodic-style product tile. */
const tileSymbols: Record<string, string> = {
  "caustic-soda-flakes": "NaOH",
  "caustic-soda-lye": "NaOH",
  "aluminium-chloride-anhydrous": "AlCl₃",
  "sodium-sulphate-anhydrous": "Na₂SO₄",
  "calcium-chloride": "CaCl₂",
  "stable-bleaching-powder": "CaOCl₂",
  "phosphoric-acid": "H₃PO₄",
  "caustic-potash-flakes": "KOH",
  "potassium-carbonate": "K₂CO₃",
  "soda-ash-dense-light": "Na₂CO₃",
  "sodium-bicarbonate": "NaHCO₃",
  "sodium-bisulphite": "NaHSO₃",
  "sodium-metabisulphite": "Na₂S₂O₅",
  "sodium-nitrite": "NaNO₂",
  "hydrogen-peroxide": "H₂O₂",
  "thionyl-chloride": "SOCl₂",
};

export function tileSymbol(product: Product): string {
  return tileSymbols[product.slug] ?? product.chemicalFormula.split(" ")[0];
}

/** Physical state, inferred from appearance text. */
export function physicalState(product: Product): "Solid" | "Liquid" | "Gas" {
  const text = `${product.name} ${product.physicalAppearance}`.toLowerCase();
  if (text.includes("liquid") || text.includes("lye") || text.includes("solution")) return "Liquid";
  return "Solid";
}

export const productCategories: ProductCategory[] = ["Chlor-Alkali", "Alkalis & Carbonates", "Sodium Salts", "Acids & Reagents"];

/** Periodic-table style colour family per category. */
export const categoryTone: Record<
  ProductCategory,
  { label: string; dot: string; tile: string; text: string; ring: string; hex: string }
> = {
  "Chlor-Alkali": {
    label: "Chlor-Alkali",
    dot: "bg-sky-500",
    tile: "from-sky-50 to-white",
    text: "text-sky-700",
    ring: "group-hover:ring-sky-300",
    hex: "#0ea5e9",
  },
  "Alkalis & Carbonates": {
    label: "Alkalis & Carbonates",
    dot: "bg-teal-500",
    tile: "from-teal-50 to-white",
    text: "text-teal-700",
    ring: "group-hover:ring-teal-300",
    hex: "#14b8a6",
  },
  "Sodium Salts": {
    label: "Sodium Salts",
    dot: "bg-violet-500",
    tile: "from-violet-50 to-white",
    text: "text-violet-700",
    ring: "group-hover:ring-violet-300",
    hex: "#8b5cf6",
  },
  "Acids & Reagents": {
    label: "Acids & Reagents",
    dot: "bg-rose-500",
    tile: "from-rose-50 to-white",
    text: "text-rose-700",
    ring: "group-hover:ring-rose-300",
    hex: "#f43f5e",
  },
};
