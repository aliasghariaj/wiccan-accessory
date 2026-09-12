"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/formatPrice";
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

type Order = {
  id: string;
  items: OrderItem[];
  grand_total: number;
  status: string;
  payment_receipt_url: string | null;
  created_at: string;
};

export default function OrdersPage() {
  const locale = useLocale();
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [makerByCode, setMakerByCode] = useState<Record<string, string | null>>({});
  const [defaultMakerTelegram, setDefaultMakerTelegram] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", sessionData.session.user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setOrders(data as Order[]);

        const codes = Array.from(
          new Set((data as Order[]).flatMap((o) => o.items.map((i) => i.code)))
        );

        if (codes.length > 0) {
          const { data: products } = await supabase
            .from("products")
            .select("code, maker_telegram")
            .in("code", codes);

          if (products) {
            const map: Record<string, string | null> = {};
            for (const p of products) map[p.code] = p.maker_telegram;
            setMakerByCode(map);
          }
        }
      }

      const { data: settings } = await supabase
        .from("site_settings")
        .select("default_maker_telegram")
        .eq("id", 1)
        .single();
      setDefaultMakerTelegram(settings?.default_maker_telegram ?? null);

      setLoading(false);
    }

    loadOrders();
  }, []);

  const statusLabel: Record<string, string> = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    shipped: t("statusShipped"),
    cancelled: t("statusCancelled"),
  };

  const statusColor: Record<string, string> = {
    pending: "text-yellow-500 border-yellow-600",
    confirmed: "text-green-500 border-green-700",
    shipped: "text-blue-400 border-blue-700",
    cancelled: "text-red-400 border-red-800",
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white">
        <Container>
          <h1 className="mb-12 text-center text-4xl font-bold">{t("title")}</h1>

          {loading ? (
            <p className="text-center text-gray-400">{tCommon("loading")}</p>
          ) : !loggedIn ? (
            <div className="mx-auto max-w-md text-center">
              <p className="mb-6 text-gray-400">{t("loginRequired")}</p>
              <Link href="/login" className="text-yellow-600 hover:underline">
                {t("goToLogin")}
              </Link>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-400">{t("empty")}</p>
          ) : (
            <div className="mx-auto max-w-2xl space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-gray-500">
                      {t("orderDate")}: {new Date(order.created_at).toLocaleDateString(
                        locale === "fa" ? "fa-IR" : "en-US"
                      )}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${statusColor[order.status] ?? "text-gray-400 border-white/20"}`}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>

                  <p className="mb-2 text-sm text-gray-400">{t("itemsLabel")}:</p>
                  <ul className="mb-4 space-y-2 text-sm text-gray-300">
                    {order.items.map((item, i) => {
                      const makerLink = getMakerTelegramLink(
                        makerByCode[item.code],
                        defaultMakerTelegram
                      );
                      return (
                        <li key={i} className="flex flex-wrap items-center justify-between gap-2">
                          <span>{item.title} × {item.quantity}</span>
                          {makerLink && (
                            <a
                              href={makerLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-yellow-600 hover:underline"
                            >
                              💬 {t("messageMaker")}
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                    <span className="text-lg font-bold text-yellow-600">
                      {formatPrice(order.grand_total, locale)}
                    </span>

                    {order.payment_receipt_url && (
                      <a
                        href={order.payment_receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-yellow-600 hover:underline"
                      >
                        {t("viewReceipt")}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}