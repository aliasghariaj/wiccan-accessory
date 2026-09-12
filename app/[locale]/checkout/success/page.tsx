"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { getMakerTelegramLink } from "@/lib/maker";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

type OrderItem = {
  code: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type OrderInfo = {
  fullName: string;
  items: OrderItem[];
  grandTotal: number;
};

type ItemDetails = {
  crafting_days: number;
  delivery_days: number;
  maker_telegram: string | null;
};

export default function SuccessPage() {
  const t = useTranslations("checkoutSuccess");
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get("tracking");

  const [orderInfo] = useState<OrderInfo | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("pendingOrder");
    return stored ? (JSON.parse(stored) as OrderInfo) : null;
  });
  const [itemDetails, setItemDetails] = useState<Record<string, ItemDetails>>({});
  const [defaultMakerTelegram, setDefaultMakerTelegram] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.removeItem("pendingOrder");

    if (orderInfo) {
      const codes = orderInfo.items.map((i) => i.code);

      supabase
        .from("products")
        .select("code, crafting_days, delivery_days, maker_telegram")
        .in("code", codes)
        .then(({ data }) => {
          if (!data) return;
          const map: Record<string, ItemDetails> = {};
          for (const p of data) {
            map[p.code] = {
              crafting_days: p.crafting_days,
              delivery_days: p.delivery_days,
              maker_telegram: p.maker_telegram,
            };
          }
          setItemDetails(map);
        });
    }

    supabase
      .from("site_settings")
      .select("default_maker_telegram")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        setDefaultMakerTelegram(data?.default_maker_telegram ?? null);
      });
  }, [orderInfo]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-yellow-600">
              {t("title")}
            </h1>
            <p className="mb-4 text-gray-400">
              {t("message")}
            </p>

            {trackingCode && (
              <div className="mb-6 inline-block rounded-xl border border-yellow-700 bg-yellow-900/10 px-6 py-3">
                <p className="text-sm text-gray-400">{t("trackingCodeLabel")}</p>
                <p className="text-2xl font-bold tracking-widest text-yellow-500">{trackingCode}</p>
              </div>
            )}

            <p className="mb-10 text-sm text-yellow-500">
              {t("instructionMessage")}
            </p>

            {orderInfo && (
              <div className="mb-10 space-y-4 text-right">
                {orderInfo.items.map((item) => {
                  const details = itemDetails[item.code];
                  const makerLink = getMakerTelegramLink(
                    details?.maker_telegram,
                    defaultMakerTelegram
                  );

                  return (
                    <div
                      key={item.code}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="mb-1 font-bold">
                        {item.title} × {item.quantity}
                      </p>
                      {details && (
                        <p className="mb-3 text-sm text-gray-400">
                          {t("deliveryEstimate", {
                            crafting: details.crafting_days,
                            delivery: details.delivery_days,
                          })}
                        </p>
                      )}
                      {makerLink && (
                        <a
                          href={makerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block rounded-lg border border-yellow-700 px-4 py-2 text-sm text-yellow-500 transition hover:bg-yellow-700 hover:text-black"
                        >
                          💬 {t("messageMakerButton")}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

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