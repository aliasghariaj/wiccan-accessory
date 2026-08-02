"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  // این متغیر موقتاً دستیه — بعداً وقتی ورود واقعی ساختیم، از سیستم Auth میاد
  const isLoggedIn = false;

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
          <a href="/shop">فروشگاه</a>

          {/* کالکشن‌ها با دراپ‌داون */}
          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button className="flex items-center gap-1">
              کالکشن‌ها
            </button>

            {collectionsOpen && (
              <div className="absolute top-full right-0 mt-2 min-w-[180px] rounded-lg border border-white/10 bg-black/90 p-2 backdrop-blur-md">
                <a href="/collections/gothic" className="block rounded px-3 py-2 hover:bg-white/10">گاتیک</a>
                <a href="/collections/bone" className="block rounded px-3 py-2 hover:bg-white/10">استخوان</a>
                <a href="/collections/chainmail" className="block rounded px-3 py-2 hover:bg-white/10">چین‌میل</a>
                <a href="/collections/medieval" className="block rounded px-3 py-2 hover:bg-white/10">مدیوال</a>
                <a href="/collections/crystal" className="block rounded px-3 py-2 hover:bg-white/10">سنگ‌های جادویی</a>
              </div>
            )}
          </div>

          {/* پورتفولیو با دراپ‌داون */}
          <div
            className="relative"
            onMouseEnter={() => setPortfolioOpen(true)}
            onMouseLeave={() => setPortfolioOpen(false)}
          >
            <button className="flex items-center gap-1">
              پورتفولیو
            </button>

            {portfolioOpen && (
              <div className="absolute top-full right-0 mt-2 min-w-[160px] rounded-lg border border-white/10 bg-black/90 p-2 backdrop-blur-md">
                <a href="/portfolio/accessory" className="block rounded px-3 py-2 hover:bg-white/10">اکسسوری</a>
                <a href="/portfolio/music" className="block rounded px-3 py-2 hover:bg-white/10">موسیقی</a>
              </div>
            )}
          </div>

          <a href="/blog">وبلاگ</a>
          <a href="/contact">تماس با ما</a>
          <a href="/about">درباره ما</a>

        </nav>

        {/* بخش راست: ورود/سبد خرید + زبان */}
        <div className="flex shrink-0 items-center gap-3">

          {isLoggedIn ? (
            <a href="/cart" className="rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition">
              🛒 سبد خرید
            </a>
          ) : (
            <a href="/login" className="rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition">
              ثبت‌نام | ورود
            </a>
          )}

          <button className="shrink-0 rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition md:px-4 md:text-base">
            🇮🇷 فارسی
          </button>

        </div>

      </div>

    </header>
  );
}