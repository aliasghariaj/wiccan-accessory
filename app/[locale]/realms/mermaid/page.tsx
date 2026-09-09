import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MermaidRealm from "@/components/realm/mermaid/MermaidRealm";
import RealmShopSection from "@/components/realm/RealmShopSection";

export default function MermaidRealmPage() {
  return (
    <>
      <Header />
      <MermaidRealm />
      <RealmShopSection realm="Mermaid" />
      <Footer />
    </>
  );
}