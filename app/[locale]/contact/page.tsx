"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tNav = useTranslations("nav");
  const tCheckout = useTranslations("checkout");
  const tFooter = useTranslations("footer");

  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center bg-[#090909] pt-32 pb-24 text-white">
        <Container>
          <div className="mx-auto max-w-xl text-center">

            <p className="mb-4 uppercase tracking-[0.6em] text-yellow-600">
              GET IN TOUCH
            </p>

            <h1 className="mb-12 text-5xl font-bold">
              {tNav("contact")}
            </h1>

            <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-10">

              <div>
                <p className="mb-1 text-sm text-gray-400">{t("emailLabel")}</p>
                <p className="text-lg text-gray-500">{t("comingSoon")}</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-400">{tCheckout("phoneLabel")}</p>
                <p className="text-lg text-gray-500">{t("comingSoon")}</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-400">{tFooter("instagram")}</p>
                <p className="text-lg text-gray-500">{t("comingSoon")}</p>
              </div>

            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}