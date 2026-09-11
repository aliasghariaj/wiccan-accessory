"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function InternationalPage() {
  const t = useTranslations("international");
  const tNav = useTranslations("nav");

  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <Container>
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold">{tNav("international")}</h1>
            <p className="text-gray-400">
              {t("message")}
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}