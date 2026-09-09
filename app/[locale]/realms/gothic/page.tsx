import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GothicRealm from "@/components/realm/gothic/GothicRealm";
import RealmShopSection from "@/components/realm/RealmShopSection";

export default function GothicRealmPage() {
  return (
    <>
      <Header />
      <GothicRealm />
      <RealmShopSection realm="Gothic" />
      <Footer />
    </>
  );
}