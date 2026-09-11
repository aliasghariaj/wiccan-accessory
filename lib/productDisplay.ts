import { translateMaterialsToEnglish } from "@/lib/materialsEn";

type ProductLike = {
  title: string;
  title_en?: string | null;
  description?: string | null;
  description_en?: string | null;
  materials?: string[] | null;
  materials_en?: string[] | null;
};

export function getDisplayTitle(product: ProductLike, locale: string): string {
  if (locale === "fa") return product.title;
  return product.title_en || product.title;
}

export function getDisplayDescription(product: ProductLike, locale: string): string {
  if (locale === "fa") return product.description || "";
  return product.description_en || product.description || "";
}

export function getDisplayMaterials(product: ProductLike, locale: string): string[] {
  if (locale === "fa") return product.materials || [];
  if (product.materials_en && product.materials_en.length > 0) return product.materials_en;
  return translateMaterialsToEnglish(product.materials || []);
}