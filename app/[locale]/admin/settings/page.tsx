"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import AdminNav from "@/components/admin/AdminNav";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminSettingsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [merchantId, setMerchantId] = useState("");
  const [zarinpalEnabled, setZarinpalEnabled] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwnerName, setCardOwnerName] = useState("");
  const [inCityCost, setInCityCost] = useState("50000");
  const [outOfCityCost, setOutOfCityCost] = useState("80000");
  const [defaultMakerTelegram, setDefaultMakerTelegram] = useState("");

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const email = data.session?.user.email;
      if (email && email === ADMIN_EMAIL) {
        setAuthorized(true);

        const { data: settings } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .single();

        if (settings) {
          setMerchantId(settings.zarinpal_merchant_id ?? "");
          setZarinpalEnabled(settings.zarinpal_enabled ?? false);
          setCardNumber(settings.card_number ?? "");
          setCardOwnerName(settings.card_owner_name ?? "");
          setInCityCost(String(settings.in_city_shipping_cost ?? 50000));
          setOutOfCityCost(String(settings.out_of_city_shipping_cost ?? 80000));
          setDefaultMakerTelegram(settings.default_maker_telegram ?? "");
        }
      } else {
        router.push("/");
      }
      setChecking(false);
    });
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .update({
        zarinpal_merchant_id: merchantId,
        zarinpal_enabled: zarinpalEnabled,
        card_number: cardNumber,
        card_owner_name: cardOwnerName,
        in_city_shipping_cost: Number(inCityCost),
        out_of_city_shipping_cost: Number(outOfCityCost),
        default_maker_telegram: defaultMakerTelegram,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setMessage(error ? "خطا در ذخیره‌سازی: " + error.message : "تنظیمات ذخیره شد ✅");
    setSaving(false);
  }

  if (checking || !authorized) return null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white" dir="rtl">
        <Container>

          <h1 className="mb-6 text-center text-4xl font-bold">
            تنظیمات سایت
          </h1>

          <AdminNav />

          <div className="mx-auto max-w-xl space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8">

            <div>
              <h2 className="mb-4 text-lg font-bold text-yellow-600">پرداخت کارت‌به‌کارت</h2>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-400">شماره کارت</label>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="6037-XXXX-XXXX-XXXX"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">نام صاحب کارت</label>
                <input
                  value={cardOwnerName}
                  onChange={(e) => setCardOwnerName(e.target.value)}
                  placeholder="مثلاً ارکیده ..."
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="mb-4 text-lg font-bold text-yellow-600">درگاه پرداخت زرین‌پال</h2>

              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="zarinpalEnabled"
                  checked={zarinpalEnabled}
                  onChange={(e) => setZarinpalEnabled(e.target.checked)}
                  className="h-5 w-5 accent-yellow-600"
                />
                <label htmlFor="zarinpalEnabled" className="text-sm text-gray-300">
                  پرداخت آنلاین زرین‌پال فعال باشه
                </label>
              </div>

              <label className="mb-2 block text-sm text-gray-400">Merchant ID</label>
              <input
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="کد پذیرندگی زرین‌پال"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                dir="ltr"
              />
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="mb-4 text-lg font-bold text-yellow-600">هزینه‌ی ارسال</h2>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-400">هزینه‌ی ارسال داخل‌شهری (تومان)</label>
                <input
                  value={inCityCost}
                  onChange={(e) => setInCityCost(e.target.value)}
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">هزینه‌ی ارسال بین‌شهری (تومان)</label>
                <input
                  value={outOfCityCost}
                  onChange={(e) => setOutOfCityCost(e.target.value)}
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="mb-4 text-lg font-bold text-yellow-600">پیام به سازنده</h2>
              <label className="mb-2 block text-sm text-gray-400">
                آیدی تلگرام پیش‌فرض سازنده (بدون @) — برای محصولاتی که آیدی سازنده‌ی جدا ندارن
              </label>
              <input
                dir="ltr"
                value={defaultMakerTelegram}
                onChange={(e) => setDefaultMakerTelegram(e.target.value)}
                placeholder="مثلاً orkideh_wiccan"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            {message && <p className="text-sm text-yellow-500">{message}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </button>

          </div>

        </Container>
      </main>

      <Footer />
    </>
  );
}