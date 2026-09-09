"use client";

import { useTranslations } from "next-intl";
import { BRAND } from "@/lib/constants";
import Container from "@/components/common/Container";
import RealmButton from "@/components/ui/RealmButton";
import Link from "next/link";

export default function Hero() {
  const t = useTranslations("home");

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${BRAND.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Content */}
      <Container className="relative z-10">
        <div className="flex flex-col items-center px-6 text-center text-white">
          <h1
            className="
              mb-6
              text-6xl
              font-bold
              tracking-[0.25em]
              drop-shadow-[0_0_25px_rgba(198,161,91,0.45)]
            "
          >
            {BRAND.name}
          </h1>

          <p className="mb-3 text-2xl">{BRAND.slogan}</p>

          <p className="max-w-2xl text-lg opacity-90">{BRAND.description}</p>

          <Link
            href="#brand-story"
            className="mt-8 inline-block rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-yellow-500 hover:bg-yellow-700 hover:text-black hover:shadow-[0_0_30px_rgba(198,161,91,0.55)]"
          >
            {t("heroEnter")}
          </Link>

          <p className="mt-16 animate-bounce text-3xl opacity-60">↓</p>
        </div>
      </Container>
    </section>
  );
}
