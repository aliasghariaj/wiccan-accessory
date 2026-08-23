"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { formatPriceFa } from "@/lib/formatPrice";

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
      setMessage("لطفاً عکس رسید پرداخت رو آپلود کن.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id ?? null;

    const fileExt = receiptFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(fileName, receiptFile);

    if (uploadError) {
      setMessage("خطا در آپلود رسید: " + uploadError.message);
      setSubmitting(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("receipts")
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("orders").insert({
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
    });

    if (insertError) {
      setMessage("خطا در ثبت سفارش: " + insertError.message);
      setSubmitting(false);
      return;
    }

    const itemsList = orderInfo.items
      .map((i) => `• ${i.title} × ${i.quantity}`)
      .join("\n");

    fetch("/api/telegram/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `🛍 <b>سفارش جدید (کارت‌به‌کارت)</b>\n\n👤 ${orderInfo.fullName}\n📞 ${orderInfo.phone}\n🏙 ${orderInfo.city}\n\n${itemsList}\n\n💰 مبلغ: ${orderInfo.grandTotal.toLocaleString()} تومان\n\n⚠️ رسید پرداخت رو توی پنل ادمین بررسی کن.`,
      }),
    });

    sessionStorage.removeItem("pendingOrder");
    localStorage.removeItem("wiccan_cart");
    router.push("/checkout/success");
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
      }),
    });

    const data = await res.json();

    if (data.gatewayUrl) {
      sessionStorage.setItem("pendingOrder", JSON.stringify(orderInfo));
      window.location.href = data.gatewayUrl;
    } else {
      setMessage(data.error || "خطا در اتصال به درگاه پرداخت.");
      setRedirecting(false);
    }
  }

  if (!orderInfo) return null;

  return (
    <>
      <Header />

      <main
        className="min-h-screen bg-[#090909] pt-40 pb-24 text-white"
        dir="rtl"
      >
        <Container>
          <h1 className="mb-12 text-center text-4xl font-bold">پرداخت</h1>

          <div className="mx-auto max-w-xl space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="rounded-xl border border-yellow-700 bg-yellow-900/10 p-6 text-center">
              <p className="mb-2 text-sm text-gray-400">مبلغ قابل پرداخت</p>
              <p className="mb-4 text-3xl font-bold text-yellow-500">
                {formatPriceFa(orderInfo.grandTotal)}
              </p>
              {paymentMethod === "card-to-card" && (
                <>
                  <p className="mb-1 text-sm text-gray-400">شماره کارت</p>
                  <p className="mb-2 text-xl font-mono tracking-wider">
                    {cardNumber || "هنوز تنظیم نشده"}
                  </p>
                  <p className="text-sm text-gray-400">
                    به نام {cardOwner || "—"}
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
                  کارت‌به‌کارت
                </button>
                <button
                  onClick={() => setPaymentMethod("zarinpal")}
                  className={`flex-1 rounded-lg border px-4 py-3 transition ${
                    paymentMethod === "zarinpal"
                      ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  پرداخت آنلاین (زرین‌پال)
                </button>
              </div>
            )}

            {paymentMethod === "card-to-card" ? (
              <>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    آپلود عکس رسید پرداخت *
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
                  {submitting ? "در حال ثبت سفارش..." : "ثبت سفارش"}
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
                  {redirecting ? "در حال انتقال به درگاه..." : "پرداخت و ادامه"}
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
