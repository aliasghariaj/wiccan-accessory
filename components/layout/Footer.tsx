import Link from "next/link";
import Container from "@/components/common/Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/60 text-white">
      <Container>
        <div className="flex flex-col items-center gap-8 py-16 text-center md:flex-row md:justify-between md:text-right">

          {/* لوگو و توضیح کوتاه */}
          <div className="max-w-xs">
            <p className="mb-3 text-xl font-bold tracking-widest">☾ WICCAN</p>
            <p className="text-sm text-gray-400">
              اکسسوری دست‌ساز گاتیک، مدیوال و فانتزی
            </p>
          </div>

          {/* لینک‌های سریع */}
          <nav className="flex flex-col gap-2 text-sm text-gray-300">
            <Link href="/" className="hover:text-yellow-600">خانه</Link>
            <Link href="/shop" className="hover:text-yellow-600">فروشگاه</Link>
            <Link href="/blog" className="hover:text-yellow-600">وبلاگ</Link>
            <Link href="/contact" className="hover:text-yellow-600">تماس با ما</Link>
          </nav>

          {/* شبکه‌های اجتماعی */}
          <div className="flex gap-4 text-sm text-gray-300">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600">
              اینستاگرام
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600">
              تلگرام
            </a>
          </div>

        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Wiccan Accessory. تمام حقوق محفوظ است.
        </div>
      </Container>
    </footer>
  );
}