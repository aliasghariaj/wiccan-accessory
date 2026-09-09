"use client";

import { useTranslations } from "next-intl";

export default function SupportButton() {
  const t = useTranslations("support");

  return (
    <a
      href="https://t.me/Wic_coven"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-yellow-600 bg-black/80 px-5 py-3 text-sm text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-yellow-700 hover:text-black hover:shadow-[0_0_25px_rgba(198,161,91,0.5)]"
    >
      💬 {t("button")}
    </a>
  );
}