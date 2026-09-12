"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { buildOrderPlacedMessage, generateTrackingCode } from "@/lib/telegramMessages";

type OrderItem = {
  code: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type OrderInfo = {
  fullName: string;
  phone: string;
  postalCode: string;
  city: string;
  address: string;
  shippingMethod: string;
  isInCity: boolean;
  shippingCost: number;
  productsTotal: number;
  grandTotal: number;
  items: OrderItem[];
};

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("verify");
  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");

  useEffect(() => {
    async function verify() {
      const authority = searchParams.get("Authority");
      const zpStatus = searchParams.get("Status");

      const stored = sessionStorage.getItem("pendingOrder");
      if (!stored || !authority || zpStatus !== "OK") {
        setStatus("failed");
        return;
      }

      const orderInfo = JSON.parse(stored) as OrderInfo;

      const res = await fetch("/api/zarinpal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authority,
          amount: orderInfo.grandTotal,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setStatus("failed");
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id ?? null;

      let username: string | null = null;
      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", userId)
          .single();
        username = profile?.username ?? null;
      }

      const { data: insertedOrder } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          full_name: orderInfo.fullName,
          phone: orderInfo.phone,
          postal_code: orderInfo.postalCode,
          city: orderInfo.city,
          address: orderInfo.address,
          shipping_method: orderInfo.shippingMethod,
          items: orderInfo.items,
          products_total: orderInfo.productsTotal,
          shipping_cost: orderInfo.shippingCost,
          grand_total: orderInfo.grandTotal,
          payment_method: "zarinpal",
          status: "confirmed",
          tracking_code: generateTrackingCode(),
        })
        .select("id, tracking_code")
        .single();

      await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: buildOrderPlacedMessage({
            trackingCode: insertedOrder?.tracking_code ?? "----",
            fullName: orderInfo.fullName,
            username,
            phone: orderInfo.phone,
            city: orderInfo.city,
            postalCode: orderInfo.postalCode,
            address: orderInfo.address,
            items: orderInfo.items,
            grandTotal: orderInfo.grandTotal,
            paid: true,
          }),
        }),
      });

      localStorage.removeItem("wiccan_cart");
      setStatus("success");

      setTimeout(
        () => router.push(`/checkout/success?order=${insertedOrder?.id ?? ""}&tracking=${insertedOrder?.tracking_code ?? ""}`),
        1500
      );
    }

    verify();
  }, [searchParams, router]);

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <Container>
          <div className="text-center">
            {status === "checking" && <p>{t("checking")}</p>}
            {status === "success" && <p className="text-green-500">{t("success")}</p>}
            {status === "failed" && (
              <div>
                <p className="mb-4 text-red-400">{t("failed")}</p>
                <Link href="/cart" className="text-yellow-600 hover:underline">{t("backToCart")}</Link>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}