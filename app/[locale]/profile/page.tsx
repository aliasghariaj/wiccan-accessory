"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
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
        setLocationAddress(profile.location_address ?? "");
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
        location_address: locationAddress,
        postal_address: postalAddress,
        instagram_id: instagramId,
      })
      .eq("id", userId);

    setMessage(error ? "خطا در ذخیره‌سازی" : "اطلاعات ذخیره شد ✅");
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <p>در حال بارگذاری...</p>
      </main>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white">
        <Container>
          <div className="mx-auto max-w-md" dir="rtl">

            <h1 className="mb-10 text-center text-3xl font-bold">
              پروفایل من
            </h1>

            <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8">

              <div>
                <label className="mb-2 block text-sm text-gray-400">یوزرنیم</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">شماره تماس</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">آدرس لوکیشن</label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">آدرس پستی</label>
                <textarea
                  value={postalAddress}
                  onChange={(e) => setPostalAddress(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">آیدی اینستاگرام</label>
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
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-red-800 px-8 py-4 text-red-400 transition-all duration-300 hover:bg-red-900/30"
              >
                خروج از حساب
              </button>

            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}