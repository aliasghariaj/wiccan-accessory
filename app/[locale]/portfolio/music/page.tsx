"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import PortfolioTimeline from "@/components/portfolio/PortfolioTimeline";

export default function MusicPortfolioPage() {
  const t = useTranslations("portfolio");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
        <Container>
          <h1 className="mb-16 text-center text-5xl font-bold">{t("musicTitle")}</h1>
          <PortfolioTimeline category="music" />
        </Container>
      </main>
      <Footer />
    </>
  );
}