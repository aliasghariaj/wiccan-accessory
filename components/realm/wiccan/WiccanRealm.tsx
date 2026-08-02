import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import RealmButton from "@/components/ui/RealmButton";
import ProductCard from "@/components/product/ProductCard";

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
        <div className="flex w-full flex-col items-center px-6 text-center text-white">

          <SectionTitle eyebrow="REALM I" title="Wiccan Realm" />

          <p
            dir="rtl"
            className="max-w-3xl text-xl leading-10 text-gray-300"
          >
            جادوی طبیعت، سنگ‌های مقدس و آیین‌های باستانی ویکن.
            هر قطعه از این مجموعه بازتابی از ارتباط انسان با
            زمین، ماه و عناصر طبیعت است.
          </p>

          <div className="mt-12">
            <RealmButton>
              ورود به Wiccan Realm
            </RealmButton>
          </div>

          <div className="mt-24 grid w-full max-w-6xl justify-items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
            <ProductCard
              image="/images/products/wiccan-necklace.jpg"
              title="Sacred Grove"
              code="WI-001"
              material="Bone • Wood • Leather"
              price="1,950,000 تومان"
            />

            <ProductCard
              image="/images/products/wiccan-necklace.jpg"
              title="Earth Ritual"
              code="WI-002"
              material="Bone • Crystal"
              price="2,250,000 تومان"
            />

            <ProductCard
              image="/images/products/wiccan-necklace.jpg"
              title="Ancient Grove"
              code="WI-003"
              material="Bone • Feather"
              price="2,450,000 تومان"
            />
          </div>

        </div>
      </Container>
    </section>
  );
}