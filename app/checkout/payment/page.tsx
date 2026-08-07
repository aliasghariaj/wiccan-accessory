"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { formatPriceFa } from "@/lib/formatPrice";

const CARD_NUMBER = "6037-XXXX-XXXX-XXXX"; // شماره کارت واقعی ارکیده بعداً جایگزین میشه
const CARD_OWNER = "ارکیده ..."; // اسم صاحب کارت

export default function PaymentPage() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingOrder");
    if (!stored) {
      router.push("/cart");
      return;
    }
    setOrderInfo(JSON.parse(stored));
  }, [router]);

  async function handleSubmit() {
    if (!receiptFile) {
      setMessage("لطفاً عکس رسید پرداخت رو آپلود کن.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id ?? null;

    // آپلود عکس رسید
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

    // ثبت سفارش توی جدول orders
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

    sessionStorage.removeItem("pendingOrder");
    localStorage.removeItem("wiccan_cart");
    router.push("/checkout/success");
  }

  if (!orderInfo) return null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white" dir="rtl">
        <Container>

          <h1 className="mb-12 text-center text-4xl font-bold">
            پرداخت کارت‌به‌کارت
          </h1>

          <div className="mx-auto max-w-xl space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8">

            <div className="rounded-xl border border-yellow-700 bg-yellow-900/10 p-6 text-center">
              <p className="mb-2 text-sm text-gray-400">مبلغ قابل پرداخت</p>
              <p className="mb-4 text-3xl font-bold text-yellow-500">
                {formatPriceFa(orderInfo.grandTotal)}
              </p>
              <p className="mb-1 text-sm text-gray-400">شماره کارت</p>
              <p className="mb-2 text-xl font-mono tracking-wider">{CARD_NUMBER}</p>
              <p className="text-sm text-gray-400">به نام {CARD_OWNER}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                آپلود عکس رسید پرداخت *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-700 file:px-4 file:py-2 file:text-black"
              />
            </div>

            {message && (
              <p className="text-sm text-red-400">{message}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
            >
              {submitting ? "در حال ثبت سفارش..." : "ثبت سفارش"}
            </button>

          </div>

        </Container>
      </main>

      <Footer />
    </>
  );
}