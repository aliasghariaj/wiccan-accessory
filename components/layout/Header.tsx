export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 pl-4 pr-6 md:pl-10 md:pr-16">

        {/* لوگو */}

        <div className="shrink-0 whitespace-nowrap text-lg font-bold tracking-widest md:text-2xl">

          ☾ WICCAN

        </div>

        {/* منو */}

        <nav className="hidden shrink-0 gap-8 md:flex">

          <a href="#">خانه</a>

          <a href="/collections">کالکشن‌ها</a>

          <a href="#">پورتفولیو</a>

          <a href="#">درباره ما</a>

        </nav>

        {/* زبان */}

        <button className="shrink-0 rounded-lg border border-yellow-700 px-3 py-2 text-sm hover:bg-yellow-700 hover:text-black transition md:px-4 md:text-base">

          🇮🇷 فارسی

        </button>

      </div>

    </header>
  );
}