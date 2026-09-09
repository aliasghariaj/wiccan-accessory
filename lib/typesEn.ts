export const typeToEnglish: Record<string, string> = {
  "دستبند": "Bracelet",
  "گردنبند": "Necklace",
  "گوشواره": "Earring",
  "سنگ": "Stone",
  "چین‌میل": "Chainmail",
  "استخوان": "Bone",
};

export function translateTypeToEnglish(type: string): string {
  return typeToEnglish[type] ?? type;
}