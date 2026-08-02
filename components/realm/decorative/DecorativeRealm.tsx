import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import RealmButton from "@/components/ui/RealmButton";
import ProductCard from "@/components/product/ProductCard";

export default function DecorativeRealm() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/realms/decorative/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-neutral-900/60 to-black/90" />

      <Container className="relative z-10">
        <div className="flex w-full flex-col items-center px-6 text-center text-white">

          <SectionTitle eyebrow="REALM V" title="Decorative Realm" />

          <p
            dir="rtl"
            className="max-w-3xl text-xl leading-10 text-gray-300"
          >
            سنگ‌های تزیینی، ظروف کوچک و آثاری برای آراستن فضای زندگی.
            این مجموعه از هنر دست‌ساز برای دکوراسیون و جزئیات
            خاص خانه الهام گرفته شده است.
          </p>

          <div className="mt-12">
            <RealmButton>
              ورود به Decorative Realm
            </RealmButton>
          </div>

          <div className="mt-24 grid w-full max-w-6xl justify-items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
            <ProductCard
              image="/images/products/decorative-item.jpg"
              title="Crystal Cluster"
              code="DC-001"
              material="Amethyst • Wood"
              price="1,600,000 تومان"
            />

            <ProductCard
              image="/images/products/decorative-item.jpg"
              title="Moonlit Bowl"
              code="DC-002"
              material="Ceramic • Silver"
              price="1,450,000 تومان"
            />

            <ProductCard
              image="/images/products/decorative-item.jpg"
              title="Ritual Candle Holder"
              code="DC-003"
              material="Iron • Stone"
              price="1,700,000 تومان"
            />
          </div>

        </div>
      </Container>
    </section>
  );
}