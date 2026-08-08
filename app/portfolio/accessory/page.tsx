import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import PortfolioTimeline from "@/components/portfolio/PortfolioTimeline";

export default function AccessoryPortfolioPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white" dir="rtl">
        <Container>
          <h1 className="mb-16 text-center text-5xl font-bold">پورتفولیوی اکسسوری</h1>
          <PortfolioTimeline category="accessory" />
        </Container>
      </main>
      <Footer />
    </>
  );
}