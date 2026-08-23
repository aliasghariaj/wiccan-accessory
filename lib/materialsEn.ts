export const materialToEnglish: Record<string, string> = {
  "چرم": "Leather",
  "سنگ": "Stone",
  "نخ": "Cord",
  "استخوان": "Bone",
  "چین‌میل": "Chainmail",
  "مفتول": "Wire",
  "طلا": "Gold",
  "نقره": "Silver",
  "فلز": "Metal",
};

export function translateMaterialsToEnglish(materials: string[]): string[] {
  return materials.map((m) => materialToEnglish[m] ?? m);
}