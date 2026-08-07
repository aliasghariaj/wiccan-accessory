import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import RealmButton from "@/components/ui/RealmButton";
import ProductCard from "@/components/product/ProductCard";
import RealmProducts from "@/components/realm/RealmProducts";

export default function MermaidRealm() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/realms/mermaid/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-teal-950/50 to-black/90" />

      <Container className="relative z-10">
        <div className="flex w-full flex-col items-center px-6 text-center text-white">

          <SectionTitle eyebrow="REALM III" title="Mermaid Realm" />

          <p
            dir="rtl"
            className="max-w-3xl text-xl leading-10 text-gray-300"
          >
            صدف‌های دریایی، مروارید و رازهای اعماق اقیانوس.
            این مجموعه از افسانه‌های پری‌دریایی و زیبایی
            رمزآلود آب‌های ژرف الهام گرفته شده است.
          </p>

          <div className="mt-12">
            <RealmButton>
              ورود به Mermaid Realm
            </RealmButton>
          </div>

          <RealmProducts realm="Mermaid" />

        </div>
      </Container>
    </section>
  );
}