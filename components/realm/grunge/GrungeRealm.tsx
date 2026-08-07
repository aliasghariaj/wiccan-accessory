import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import RealmButton from "@/components/ui/RealmButton";
import ProductCard from "@/components/product/ProductCard";
import RealmProducts from "@/components/realm/RealmProducts";

export default function GrungeRealm() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/realms/grunge/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-zinc-900/60 to-black/90" />

      <Container className="relative z-10">
        <div className="flex w-full flex-col items-center px-6 text-center text-white">

          <SectionTitle eyebrow="REALM IV" title="90s Grunge Realm" />

          <p
            dir="rtl"
            className="max-w-3xl text-xl leading-10 text-gray-300"
          >
            روح سرکش دهه‌ی نود، فلانل‌های پاره و صدای گیتارهای خشن.
            این مجموعه از فرهنگ گرانج و آزادی خام آن دوران
            الهام گرفته شده است.
          </p>

          <div className="mt-12">
            <RealmButton>
              ورود به Grunge Realm
            </RealmButton>
          </div>

          <RealmProducts realm="Grunge" />

        </div>
      </Container>
    </section>
  );
}