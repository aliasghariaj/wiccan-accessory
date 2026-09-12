"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { iranCities } from "@/lib/iranCities";
import { translateCityToEnglish } from "@/lib/citiesEn";
import { Link } from "@/i18n/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("profile");
  const tCheckout = useTranslations("checkout");
  const tCommon = useTranslations("common");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [instagramId, setInstagramId] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const userId = sessionData.session.user.id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile) {
        setUsername(profile.username ?? "");
        setPhone(profile.phone ?? "");
        setPostalCode(profile.postal_code ?? "");
        setCity(profile.city ?? "");
        setPostalAddress(profile.postal_address ?? "");
        setInstagramId(profile.instagram_id ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        phone,
        postal_code: postalCode,
        city,
        postal_address: postalAddress,
        instagram_id: instagramId,
      })
      .eq("id", userId);

    setMessage(error ? `${t("saveError")}: ${error.message}` : t("saveSuccess"));
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <p>{tCommon("loading")}</p>
      </main>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white">
        <Container>
          <div className="mx-auto max-w-md">

            <h1 className="mb-10 text-center text-3xl font-bold">
              {t("title")}
            </h1>

            <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8">

              <div>
                <label className="mb-2 block text-sm text-gray-400">{t("usernameLabel")}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  {tCheckout("phoneLabel")} <span className="text-xs text-gray-500">{tCheckout("phoneHint")}</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">{tCheckout("cityLabel")}</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                >
                  <option value="">{tCheckout("cityPlaceholder")}</option>
                  {iranCities.map((c) => (
                    <option key={c} value={c}>
                      {locale === "fa" ? c : translateCityToEnglish(c)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">{tCheckout("postalCodeLabel")}</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">{t("postalAddressLabel")}</label>
                <textarea
                  value={postalAddress}
                  onChange={(e) => setPostalAddress(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">{t("instagramLabel")}</label>
                <input
                  type="text"
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              {message && (
                <p className="text-sm text-yellow-500">{message}</p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
              >
                {saving ? t("saving") : t("saveChanges")}
              </button>

              <Link
                href="/orders"
                className="block w-full rounded-xl border border-white/10 px-8 py-4 text-center text-gray-300 transition-all duration-300 hover:border-yellow-600 hover:text-yellow-500"
              >
                {t("myOrders")}
              </Link>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-red-800 px-8 py-4 text-red-400 transition-all duration-300 hover:bg-red-900/30"
              >
                {t("logout")}
              </button>

            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}