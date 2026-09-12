"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/formatPrice";
import { buildOrderPlacedMessage } from "@/lib/telegramMessages";

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

export default function PaymentPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("payment");
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("pendingOrder");
    return stored ? (JSON.parse(stored) as OrderInfo) : null;
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [zarinpalEnabled, setZarinpalEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "card-to-card" | "zarinpal"
  >("card-to-card");
  const [redirecting, setRedirecting] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwner, setCardOwner] = useState("");

  useEffect(() => {
    if (!orderInfo) {
      router.push("/cart");
      return;
    }

    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data?.zarinpal_enabled) setZarinpalEnabled(true);
        setCardNumber(data?.card_number ?? "");
        setCardOwner(data?.card_owner_name ?? "");
      });
  }, [orderInfo, router]);

  async function handleSubmit() {
    if (!orderInfo) return;

    if (!receiptFile) {
      setMessage(t("uploadReceiptError"));
      return;
    }

    setSubmitting(true);
    setMessage("");

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

    const fileExt = receiptFile.name.split(".").pop();
    const fileName = `${userId ?? "guest"}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(fileName, receiptFile);

    if (uploadError) {
      setMessage(`${t("uploadError")}: ${uploadError.message}`);
      setSubmitting(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("receipts")
      .getPublicUrl(fileName);

    const { data: insertedOrder, error: insertError } = await supabase
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
        payment_method: "card-to-card",
        payment_receipt_url: urlData.publicUrl,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      setMessage(`${t("orderError")}: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    fetch("/api/telegram/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: buildOrderPlacedMessage({
          fullName: orderInfo.fullName,
          username,
          phone: orderInfo.phone,
          city: orderInfo.city,
          postalCode: orderInfo.postalCode,
          address: orderInfo.address,
          items: orderInfo.items,
          grandTotal: orderInfo.grandTotal,
          paid: false,
        }),
        photoUrl: urlData.publicUrl,
      }),
    });

    localStorage.removeItem("wiccan_cart");
    router.push(`/checkout/success?order=${insertedOrder.id}`);
  }

  async function handleZarinpalPayment() {
    if (!orderInfo) return;

    setRedirecting(true);
    setMessage("");

    const res = await fetch("/api/zarinpal/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: orderInfo.grandTotal,
        description: `سفارش از Wiccan Accessory`,
        locale,
      }),
    });

    const data = await res.json();

    if (data.gatewayUrl) {
      sessionStorage.setItem("pendingOrder", JSON.stringify(orderInfo));
      window.location.href = data.gatewayUrl;
    } else {
      setMessage(data.error || t("gatewayError"));
      setRedirecting(false);
    }
  }

  if (!orderInfo) return null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white">
        <Container>
          <h1 className="mb-12 text-center text-4xl font-bold">{t("title")}</h1>

          <div className="mx-auto max-w-xl space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="rounded-xl border border-yellow-700 bg-yellow-900/10 p-6 text-center">
              <p className="mb-2 text-sm text-gray-400">{t("amountLabel")}</p>
              <p className="mb-4 text-3xl font-bold text-yellow-500">
                {formatPrice(orderInfo.grandTotal, locale)}
              </p>
              {paymentMethod === "card-to-card" && (
                <>
                  <p className="mb-1 text-sm text-gray-400">{t("cardNumberLabel")}</p>
                  <p className="mb-2 text-xl font-mono tracking-wider">
                    {cardNumber || t("notSetYet")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t("cardOwnerPrefix")} {cardOwner || "—"}
                  </p>
                </>
              )}
            </div>

            {zarinpalEnabled && (
              <div className="flex gap-4">
                <button
                  onClick={() => setPaymentMethod("card-to-card")}
                  className={`flex-1 rounded-lg border px-4 py-3 transition ${
                    paymentMethod === "card-to-card"
                      ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  {t("cardToCard")}
                </button>
                <button
                  onClick={() => setPaymentMethod("zarinpal")}
                  className={`flex-1 rounded-lg border px-4 py-3 transition ${
                    paymentMethod === "zarinpal"
                      ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  {t("onlinePayment")}
                </button>
              </div>
            )}

            {paymentMethod === "card-to-card" ? (
              <>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    {t("uploadReceiptLabel")} *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setReceiptFile(e.target.files?.[0] ?? null)
                    }
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-700 file:px-4 file:py-2 file:text-black"
                  />
                </div>

                {message && <p className="text-sm text-red-400">{message}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
                >
                  {submitting ? t("submitting") : t("submitOrder")}
                </button>
              </>
            ) : (
              <>
                {message && <p className="text-sm text-red-400">{message}</p>}

                <button
                  onClick={handleZarinpalPayment}
                  disabled={redirecting}
                  className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
                >
                  {redirecting ? t("redirecting") : t("payAndContinue")}
                </button>
              </>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}