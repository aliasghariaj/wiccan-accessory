"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { getCart, CartItem } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import { iranCities } from "@/lib/iranCities";
import { translateCityToEnglish } from "@/lib/citiesEn";

export default function CheckoutPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const [cart] = useState<CartItem[]>(() => getCart());
  const [savedProfile, setSavedProfile] = useState<{ username: string | null; phone: string | null; postal_address: string | null; postal_code: string | null; city: string | null } | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("tipax");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (getCart().length === 0) {
      router.push("/cart");
      return;
    }

    // اگه کاربر پروفایل داشته باشه، نگهش می‌داریم تا خودش بخواد پر کنه
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (profile && (profile.phone || profile.postal_address || profile.city || profile.postal_code)) {
          setSavedProfile(profile);
        }
      }
    });
  }, [router]);

  function useProfileInfo() {
    if (!savedProfile) return;
    if (savedProfile.username) setFullName(savedProfile.username);
    if (savedProfile.phone) setPhone(savedProfile.phone);
    if (savedProfile.postal_address) setAddress(savedProfile.postal_address);
    if (savedProfile.postal_code) setPostalCode(savedProfile.postal_code);
    if (savedProfile.city) setCity(savedProfile.city);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isInCity = city === "رشت";
  const shippingCost = city ? (isInCity ? 50000 : 80000) : 0;
  const grandTotal = total + shippingCost;

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = t("fullNameRequired");
    if (!phone.trim()) newErrors.phone = t("phoneRequired");
    if (!postalCode.trim()) newErrors.postalCode = t("postalCodeRequired");
    if (!city) newErrors.city = t("cityRequired");
    if (!address.trim()) newErrors.address = t("addressRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleContinue() {
    if (!validate()) return;

    const orderInfo = {
      fullName,
      phone,
      postalCode,
      city,
      address,
      shippingMethod,
      isInCity,
      shippingCost,
      productsTotal: total,
      grandTotal,
      items: cart,
    };

    sessionStorage.setItem("pendingOrder", JSON.stringify(orderInfo));
    router.push("/checkout/payment");
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white">
        <Container>

          <h1 className="mb-12 text-center text-4xl font-bold">
            {t("title")}
          </h1>

          <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">

            {savedProfile && (
              <button
                type="button"
                onClick={useProfileInfo}
                className="w-full rounded-lg border border-yellow-700/60 bg-yellow-900/10 px-4 py-3 text-sm text-yellow-500 transition hover:bg-yellow-900/20"
              >
                {t("useProfileButton")}
              </button>
            )}

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t("fullNameLabel")} *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t("phoneLabel")} *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t("postalCodeLabel")} *
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-400">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t("cityLabel")} *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              >
                <option value="">{t("cityPlaceholder")}</option>
                {iranCities.map((c) => (
                  <option key={c} value={c}>
                    {locale === "fa" ? c : translateCityToEnglish(c)}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-400">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t("addressLabel")} *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-400">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t("shippingMethodLabel")}
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setShippingMethod("tipax")}
                  className={`flex-1 rounded-lg border px-4 py-3 transition ${
                    shippingMethod === "tipax"
                      ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  {t("tipax")}
                </button>
                <button
                  onClick={() => setShippingMethod("post")}
                  className={`flex-1 rounded-lg border px-4 py-3 transition ${
                    shippingMethod === "post"
                      ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  {t("post")}
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between text-gray-400">
                <span>{t("productsTotal")}</span>
                <span>{total.toLocaleString()} {tCart("currency")}</span>
              </div>
              {city && (
                <div className="flex items-center justify-between text-gray-400">
                  <span>{t("shippingCost")} ({isInCity ? t("inCity") : t("betweenCity")})</span>
                  <span>{shippingCost.toLocaleString()} {tCart("currency")}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xl font-bold">
                <span>{tCommon("total")}</span>
                <span className="text-yellow-600">
                  {grandTotal.toLocaleString()} {tCart("currency")}
                </span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black"
            >
              {t("continueToPayment")}
            </button>

          </div>

        </Container>
      </main>

      <Footer />
    </>
  );
}