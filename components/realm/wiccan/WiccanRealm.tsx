import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import RealmButton from "@/components/ui/RealmButton";
import ProductCard from "@/components/product/ProductCard";
import RealmProducts from "@/components/realm/RealmProducts";
import Link from "next/link";

export default function WiccanRealm() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/realms/wiccan/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      <Container className="relative z-10">
        <div className="flex w-full flex-col items-center px-6 py-24 text-center text-white md:py-32">
          <SectionTitle eyebrow="REALM I" title="Wiccan Realm" />

          <p dir="rtl" className="max-w-3xl text-xl leading-10 text-gray-300">
            جادوی طبیعت، سنگ‌های مقدس و آیین‌های باستانی ویکن. هر قطعه از این
            مجموعه بازتابی از ارتباط انسان با زمین، ماه و عناصر طبیعت است.
          </p>

          <div className="mt-12">
            <Link
              href="/realms/wiccan"
              className="mt-8 inline-block rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-yellow-500 hover:bg-yellow-700 hover:text-black hover:shadow-[0_0_30px_rgba(198,161,91,0.55)]"
            >
              ورود به Wiccan Realm
            </Link>
          </div>

          <RealmProducts realm="Wiccan" />
        </div>
      </Container>
    </section>
  );
}
