"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getCartCount } from "@/lib/cart";

export default function Header() {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      },
    );

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

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 pl-4 pr-6 md:pl-10 md:pr-16">
        {/* لوگو */}
        <div className="shrink-0 whitespace-nowrap text-lg font-bold tracking-widest md:text-2xl">
          ☾ WICCAN
        </div>

        {/* منو */}
        <nav className="hidden shrink-0 items-center gap-6 md:flex">
          <Link href="/">خانه</Link>
          <Link href="/shop">فروشگاه</Link>

          {/* کالکشن‌ها با دراپ‌داون */}
          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button className="flex items-center gap-1">کالکشن‌ها</button>
            
            {collectionsOpen && (
              <div className="absolute top-full right-0 pt-2">
                <div className="min-w-[180px] rounded-lg border border-white/10 bg-black/90 p-2 backdrop-blur-md">
                  <Link
                    href="/realms/wiccan"
                    className="block rounded px-3 py-2 hover:bg-white/10"
                  >
                    Wiccan
                  </Link>
                  <Link
                    href="/realms/gothic"
                    className="block rounded px-3 py-2 hover:bg-white/10"
                  >
                    Gothic
                  </Link>
                  <Link
                    href="/realms/mermaid"
                    className="block rounded px-3 py-2 hover:bg-white/10"
                  >
                    Mermaid
                  </Link>
                  <Link
                    href="/realms/grunge"
                    className="block rounded px-3 py-2 hover:bg-white/10"
                  >
                    Grunge
                  </Link>
                  <Link
                    href="/realms/decorative"
                    className="block rounded px-3 py-2 hover:bg-white/10"
                  >
                    Decorative
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* پورتفولیو با دراپ‌داون */}
          <div
            className="relative"
            onMouseEnter={() => setPortfolioOpen(true)}
            onMouseLeave={() => setPortfolioOpen(false)}
          >
            <button className="flex items-center gap-1">پورتفولیو</button>

            {portfolioOpen && (
              <div className="absolute top-full right-0 pt-2">
                <div className="min-w-[160px] rounded-lg border border-white/10 bg-black/90 p-2 backdrop-blur-md">
                  <Link
                    href="/portfolio/accessory"
                    className="block rounded px-3 py-2 hover:bg-white/10"
                  >
                    اکسسوری
                  </Link>
                  <Link
                    href="/portfolio/music"
                    className="block rounded px-3 py-2 hover:bg-white/10"
                  >
                    موسیقی
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/blog">وبلاگ</Link>
          <Link href="/contact">تماس با ما</Link>
          <Link href="/about">درباره ما</Link>
          <Link href="/international">سفارش خارجی</Link>
        </nav>

        {/* بخش راست: ورود/سبد خرید + زبان */}
        <div className="flex shrink-0 items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
              >
                👤 پروفایل
              </Link>
              <Link
                href="/cart"
                className="relative rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition"
              >
                🛒 سبد خرید
                {cartCount > 0 && (
                  <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition"
            >
              ثبت‌نام | ورود
            </Link>
          )}

          <button className="shrink-0 rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition md:px-4 md:text-base">
            🇮🇷 فارسی
          </button>
        </div>
      </div>
    </header>
  );
}
