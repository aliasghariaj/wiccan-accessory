"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";

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

      await supabase.from("orders").insert({
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
      });

      const itemsList = orderInfo.items
        .map((i) => `• ${i.title} × ${i.quantity}`)
        .join("\n");

      await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `✅ <b>سفارش جدید (پرداخت آنلاین موفق)</b>\n\n👤 ${orderInfo.fullName}\n📞 ${orderInfo.phone}\n🏙 ${orderInfo.city}\n\n${itemsList}\n\n💰 مبلغ: ${orderInfo.grandTotal.toLocaleString()} تومان\n\nپرداخت تایید شده، آماده‌ی ساخت کن! 🌙`,
        }),
      });

      sessionStorage.removeItem("pendingOrder");
      localStorage.removeItem("wiccan_cart");
      setStatus("success");

      setTimeout(() => router.push("/checkout/success"), 1500);
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