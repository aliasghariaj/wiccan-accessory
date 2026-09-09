import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DecorativeRealm from "@/components/realm/decorative/DecorativeRealm";
import RealmShopSection from "@/components/realm/RealmShopSection";

export default function DecorativeRealmPage() {
  return (
    <>
      <Header />
      <DecorativeRealm />
      <RealmShopSection realm="Decorative" />
      <Footer />
    </>
  );
}