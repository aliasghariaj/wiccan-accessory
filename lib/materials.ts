export const materialTranslations: Record<string, string> = {
  Bone: "استخوان",
  Wood: "چوب",
  Leather: "چرم",
  Silver: "نقره",
  Onyx: "آنیکس",
  Pearl: "مروارید",
  Chain: "زنجیر",
  Amethyst: "آمیتیست",
  Crystal: "کریستال",
  Feather: "پر",
  Garnet: "گارنت",
};

export function translateMaterial(materialString: string): string {
  return materialString
    .split("•")
    .map((m) => m.trim())
    .map((m) => materialTranslations[m] ?? m)
    .join(" • ");
}