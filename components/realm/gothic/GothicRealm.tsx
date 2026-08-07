import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import RealmButton from "@/components/ui/RealmButton";
import ProductCard from "@/components/product/ProductCard";
import RealmProducts from "@/components/realm/RealmProducts";

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

          <RealmProducts realm="Gothic" />

        </div>
      </Container>
    </section>
  );
}