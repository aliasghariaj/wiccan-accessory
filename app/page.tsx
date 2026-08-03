import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Footer from "@/components/layout/Footer";
import BrandStory from "@/components/home/BrandStory";
import WiccanRealm from "@/components/realm/wiccan/WiccanRealm";
import GothicRealm from "@/components/realm/gothic/GothicRealm";
import MermaidRealm from "@/components/realm/mermaid/MermaidRealm";
import GrungeRealm from "@/components/realm/grunge/GrungeRealm";
import DecorativeRealm from "@/components/realm/decorative/DecorativeRealm";


export default function Home() {
  return (
    <>
      <Header />
      <main>

        <Hero />

        <BrandStory />

        <WiccanRealm />

        <GothicRealm />

        <MermaidRealm />

        <GrungeRealm />

        <DecorativeRealm />

      </main>
      <Footer />
    </>
  );
}