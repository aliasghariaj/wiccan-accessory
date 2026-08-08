export default function AdminNav() {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-3">
      <a
        href="/admin"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        ➕ افزودن محصول
      </a>
      <a
        href="/admin/blog"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        📝 وبلاگ
      </a>

      <a
        href="/admin/portfolio"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        🎨 پورتفولیو
      </a>
      
      <a
        href="/admin/orders"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        📦 سفارش‌ها
      </a>
      <a
        href="/admin/analytics"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        📊 آمار و درآمد
      </a>
      <a
        href="/admin/users"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        👥 کاربران
      </a>
      <a
        href="/admin/settings"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        ⚙️ تنظیمات
      </a>
    </div>
  );
}
