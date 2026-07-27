import Container from "@/components/common/Container";
import RealmButton from "@/components/ui/RealmButton";
import ProductCard from "@/components/product/ProductCard";

export default function BoneRealm() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/realms/bone/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center px-6 text-center text-white">
        
        {/* Hero */}
        <p className="mb-4 uppercase tracking-[0.6em] text-yellow-600">
          REALM I
        </p>

        <h2 className="mb-8 text-6xl font-bold drop-shadow-[0_0_25px_rgba(198,161,91,0.35)] lg:text-7xl">
          Bone Realm
        </h2>

        <p
          dir="rtl"
          className="max-w-3xl text-xl leading-10 text-gray-300"
        >
          جایی که استخوان، چوب‌های کهن، پرهای کلاغ و سنگ‌های طبیعی
          به آثار دست‌ساز تبدیل می‌شوند.
          هر قطعه بخشی از یک داستان فراموش‌شده است.
        </p>

        <div className="mt-12">
          <RealmButton>
            ورود به Bone Realm
          </RealmButton>
        </div>

        {/* Products */}
        <div className="mt-24 grid w-full max-w-6xl justify-items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
          <ProductCard
            image="/images/products/bone-necklace.jpg"
            title="Raven Bone Necklace"
            code="BN-001"
            material="Bone • Wood • Leather"
            price="1,950,000 تومان"
          />

          <ProductCard
            image="/images/products/bone-necklace.jpg"
            title="Forest Ritual"
            code="BN-002"
            material="Bone • Crystal"
            price="2,250,000 تومان"
          />

          <ProductCard
            image="/images/products/bone-necklace.jpg"
            title="Ancient Crow"
            code="BN-003"
            material="Bone • Feather"
            price="2,450,000 تومان"
          />
        </div>

      </div>
    </section>
  );
}