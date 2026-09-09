"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

export default function BrandStory() {
  const t = useTranslations("home");

  return (
    <section id="brand-story" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909]">

      <Container className="relative z-10">

        <div className="flex flex-col items-center px-6 text-center text-white">

          <SectionTitle eyebrow={t("storyEyebrow")} title={t("storyTitle")} />

          <p className="max-w-3xl text-xl leading-10 text-gray-300 px-4">
            {t("storyText")}
          </p>

        </div>

      </Container>

    </section>
  );
}