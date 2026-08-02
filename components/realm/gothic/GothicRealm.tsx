import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import RealmButton from "@/components/ui/RealmButton";
import ProductCard from "@/components/product/ProductCard";

export default function GothicRealm() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/realms/gothic/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90" />

      <Container className="relative z-10">
        <div className="flex w-full flex-col items-center px-6 text-center text-white">

          <SectionTitle eyebrow="REALM II" title="Gothic Realm" />

          <p
            dir="rtl"
            className="max-w-3xl text-xl leading-10 text-gray-300"
          >
            سایه‌ها، دانتل‌های تیره و زیبایی تاریک.
            هر قطعه از این مجموعه الهام‌گرفته از رمانتیسم گاتیک
            و شب‌های بی‌پایان است.
          </p>

          <div className="mt-12">
            <RealmButton>
              ورود به Gothic Realm
            </RealmButton>
          </div>

          <div className="mt-24 grid w-full max-w-6xl justify-items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
            <ProductCard
              image="/images/products/gothic-necklace.jpg"
              title="Midnight Lace"
              code="GT-001"
              material="Silver • Onyx"
              price="2,100,000 تومان"
            />

            <ProductCard
              image="/images/products/gothic-necklace.jpg"
              title="Shadow Rose"
              code="GT-002"
              material="Silver • Garnet"
              price="2,350,000 تومان"
            />

            <ProductCard
              image="/images/products/gothic-necklace.jpg"
              title="Veil of Night"
              code="GT-003"
              material="Silver • Obsidian"
              price="2,500,000 تومان"
            />
          </div>

        </div>
      </Container>
    </section>
  );
}