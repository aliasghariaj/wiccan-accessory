"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import RealmProducts from "@/components/realm/RealmProducts";
import Link from "next/link";

export default function GothicRealm() {
  const t = useTranslations("realmDetail");

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/realms/gothic/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90" />

      <Container className="relative z-10">
        <div className="flex w-full flex-col items-center px-6 py-24 text-center text-white md:py-32">
          <SectionTitle eyebrow="REALM II" title="Gothic Realm" />

          <p className="max-w-3xl text-xl leading-10 text-gray-300">
            {t("gothicText")}
          </p>

          <div className="mt-12">
            <Link
              href="/realms/gothic"
              className="mt-8 inline-block rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-yellow-500 hover:bg-yellow-700 hover:text-black hover:shadow-[0_0_30px_rgba(198,161,91,0.55)]"
            >
              {t("enter", { realm: "Gothic Realm" })}
            </Link>
          </div>

          <RealmProducts realm="Gothic" />
        </div>
      </Container>
    </section>
  );
}