import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Collections from "@/components/home/Collections";
import BrandStory from "@/components/home/BrandStory";
import BoneRealm from "@/components/realm/bone/BoneRealm";

export default function Home() {
  return (
    <>
      <Header />
        <main>

          <Hero />

          <BrandStory />

          <BoneRealm />

        </main>
    </>
  );
}