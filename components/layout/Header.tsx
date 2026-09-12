"use client";

import { useEffect, useState } from "react";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { getCartCount } from "@/lib/cart";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function updateCount() {
      setCartCount(getCartCount());
    }

    updateCount();

    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  function switchLocale() {
    const newLocale = locale === "fa" ? "en" : "fa";
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 pl-4 pr-6 md:pl-10 md:pr-16">

        <div className="shrink-0 whitespace-nowrap text-lg font-bold tracking-widest md:text-2xl">
          ☾ WICCAN
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="menu"
        >
          <span className="h-0.5 w-6 bg-white" />
          <span className="h-0.5 w-6 bg-white" />
          <span className="h-0.5 w-6 bg-white" />
        </button>

        <nav className="hidden shrink-0 items-center gap-6 md:flex">
          <Link href="/">{t("home")}</Link>
          <Link href="/shop">{t("shop")}</Link>

          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button className="flex items-center gap-1">{t("collections")}</button>

            {collectionsOpen && (
              <div className="absolute top-full right-0 pt-2">
                <div className="min-w-[180px] rounded-lg border border-white/10 bg-black/90 p-2 backdrop-blur-md">
                  <Link href="/realms/wiccan" className="block rounded px-3 py-2 hover:bg-white/10">Wiccan</Link>
                  <Link href="/realms/gothic" className="block rounded px-3 py-2 hover:bg-white/10">Gothic</Link>
                  <Link href="/realms/mermaid" className="block rounded px-3 py-2 hover:bg-white/10">Mermaid</Link>
                  <Link href="/realms/grunge" className="block rounded px-3 py-2 hover:bg-white/10">Grunge</Link>
                  <Link href="/realms/decorative" className="block rounded px-3 py-2 hover:bg-white/10">Decorative</Link>
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setPortfolioOpen(true)}
            onMouseLeave={() => setPortfolioOpen(false)}
          >
            <button className="flex items-center gap-1">{t("portfolio")}</button>

            {portfolioOpen && (
              <div className="absolute top-full right-0 pt-2">
                <div className="min-w-[160px] rounded-lg border border-white/10 bg-black/90 p-2 backdrop-blur-md">
                  <Link href="/portfolio/accessory" className="block rounded px-3 py-2 hover:bg-white/10">{t("portfolioAccessory")}</Link>
                  <Link href="/portfolio/music" className="block rounded px-3 py-2 hover:bg-white/10">{t("portfolioMusic")}</Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/blog">{t("blog")}</Link>
          <Link href="/contact">{t("contact")}</Link>
          <Link href="/about">{t("about")}</Link>
          <Link href="/international">{t("international")}</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition">
                👤 {t("profile")}
              </Link>
              <Link href="/orders" className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition">
                📦 {t("orders")}
              </Link>
              <Link href="/cart" className="relative rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition">
                🛒 {t("cart")}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link href="/login" className="rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition">
              {t("login")}
            </Link>
          )}

          <button
            onClick={switchLocale}
            className="shrink-0 rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition md:px-4 md:text-base"
          >
            {locale === "fa" ? "🇬🇧 EN" : "🇮🇷 فارسی"}
          </button>
        </div>

      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-black/95 px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-right">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>{t("home")}</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>{t("shop")}</Link>
            <Link href="/realms/wiccan" onClick={() => setMobileMenuOpen(false)}>Wiccan</Link>
            <Link href="/realms/gothic" onClick={() => setMobileMenuOpen(false)}>Gothic</Link>
            <Link href="/realms/mermaid" onClick={() => setMobileMenuOpen(false)}>Mermaid</Link>
            <Link href="/realms/grunge" onClick={() => setMobileMenuOpen(false)}>Grunge</Link>
            <Link href="/realms/decorative" onClick={() => setMobileMenuOpen(false)}>Decorative</Link>
            <Link href="/portfolio/accessory" onClick={() => setMobileMenuOpen(false)}>{t("portfolioAccessory")}</Link>
            <Link href="/portfolio/music" onClick={() => setMobileMenuOpen(false)}>{t("portfolioMusic")}</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>{t("blog")}</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>{t("contact")}</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>{t("about")}</Link>
            <Link href="/international" onClick={() => setMobileMenuOpen(false)}>{t("international")}</Link>

            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
              {isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>👤 {t("profile")}</Link>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>📦 {t("orders")}</Link>
                  <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>🛒 {t("cart")} ({cartCount})</Link>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>{t("login")}</Link>
              )}

              <button onClick={switchLocale} className="text-right">
                {locale === "fa" ? "🇬🇧 English" : "🇮🇷 فارسی"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}