export function getLocalizedField(
  value: string | null | undefined,
  valueEn: string | null | undefined,
  locale: string
): string {
  if (locale === "fa") return value || "";
  return valueEn || value || "";
}