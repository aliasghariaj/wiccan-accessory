import { Link } from "@/i18n/navigation";

export default function AdminNav() {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-3">
      <Link
        href="/admin"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        ➕ افزودن محصول
      </Link>
      <Link
        href="/admin/blog"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        📝 وبلاگ
      </Link>

      <Link
        href="/admin/portfolio"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        🎨 پورتفولیو
      </Link>

      <Link
        href="/admin/orders"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        📦 سفارش‌ها
      </Link>
      <Link
        href="/admin/analytics"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        📊 آمار و درآمد
      </Link>
      <Link
        href="/admin/users"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        👥 کاربران
      </Link>
      <Link
        href="/admin/settings"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        ⚙️ تنظیمات
      </Link>
    </div>
  );
}