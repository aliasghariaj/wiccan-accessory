"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
        <Container>
          <div className="mx-auto max-w-2xl">

            <p className="mb-4 text-center uppercase tracking-[0.6em] text-yellow-600">
              OUR STORY
            </p>

            <h1 className="mb-12 text-center text-5xl font-bold">
              {t("title")}
            </h1>

            <div className="space-y-6 text-lg leading-10 text-gray-300">
              <p>
                {t("paragraph1")}
              </p>

              <p>
                {t("paragraph2Start")}{" "}
                <span dir="ltr" className="font-bold text-yellow-500">
                  Wiccan
                </span>{" "}
                {t("paragraph2End")}
              </p>

              <p>
                {t("paragraph3Start")}{" "}
                <span dir="ltr">witchcraft</span>
                {t("paragraph3End")}
              </p>

              <p>
                {t("paragraph4")}
              </p>
            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}