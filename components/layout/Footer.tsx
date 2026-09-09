"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/common/Container";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-white/10 bg-black/60 text-white">
      <Container>
        <div className="flex flex-col items-center gap-8 py-16 text-center md:flex-row md:justify-between md:text-right">

          {/* لوگو و توضیح کوتاه */}
          <div className="max-w-xs">
            <p className="mb-3 text-xl font-bold tracking-widest">☾ WICCAN</p>
            <p className="text-sm text-gray-400">
              {t("tagline")}
            </p>
          </div>

          {/* لینک‌های سریع */}
          <nav className="flex flex-col gap-2 text-sm text-gray-300">
            <Link href="/" className="hover:text-yellow-600">{tNav("home")}</Link>
            <Link href="/shop" className="hover:text-yellow-600">{tNav("shop")}</Link>
            <Link href="/blog" className="hover:text-yellow-600">{tNav("blog")}</Link>
            <Link href="/contact" className="hover:text-yellow-600">{tNav("contact")}</Link>
          </nav>

          {/* شبکه‌های اجتماعی */}
          <div className="flex gap-4 text-sm text-gray-300">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600">
              {t("instagram")}
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600">
              {t("telegram")}
            </a>
          </div>

        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Wiccan Accessory. {t("rights")}
        </div>
      </Container>
    </footer>
  );
}