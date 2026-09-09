import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WiccanRealm from "@/components/realm/wiccan/WiccanRealm";
import RealmShopSection from "@/components/realm/RealmShopSection";

export default function WiccanRealmPage() {
  return (
    <>
      <Header />
      <WiccanRealm />
      <RealmShopSection realm="Wiccan" />
      <Footer />
    </>
  );
}