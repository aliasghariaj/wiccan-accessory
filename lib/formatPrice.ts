export function formatPriceFa(value: number): string {
  return value.toLocaleString("fa-IR") + " تومان";
}

export function formatPrice(value: number, locale: string): string {
  const formattedNumber = value.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
  const unit = locale === "fa" ? "تومان" : "Toman";
  return `${formattedNumber} ${unit}`;
}