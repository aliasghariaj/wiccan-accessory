"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function SuccessPage() {
  const t = useTranslations("checkoutSuccess");

  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <Container>
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-yellow-600">
              {t("title")}
            </h1>
            <p className="mb-8 text-gray-400">
              {t("message")}
            </p>
            <Link href="/shop" className="text-yellow-600 hover:underline">
              {t("backToShop")}
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}