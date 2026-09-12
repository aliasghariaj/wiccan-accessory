export function getMakerTelegramLink(
  makerTelegram: string | null | undefined,
  defaultTelegram: string | null | undefined
): string | null {
  const username = makerTelegram || defaultTelegram;
  if (!username) return null;
  return `https://t.me/${username.replace(/^@/, "").trim()}`;
}