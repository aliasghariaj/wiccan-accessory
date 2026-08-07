"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

type Profile = {
  id: string;
  username: string | null;
  phone: string | null;
  location_address: string | null;
  postal_address: string | null;
  instagram_id: string | null;
  created_at: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const email = data.session?.user.email;
      if (email && email === ADMIN_EMAIL) {
        setAuthorized(true);

        const { data: profilesData } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesData) setProfiles(profilesData as Profile[]);
      } else {
        router.push("/");
      }
      setChecking(false);
      setLoading(false);
    });
  }, [router]);

  if (checking || !authorized) return null;

  return (
    <>
      <Header />

      <main
        className="min-h-screen bg-[#090909] pt-40 pb-24 text-white"
        dir="rtl"
      >
        <Container>
          <h1 className="mb-12 text-center text-4xl font-bold">
            کاربران ثبت‌نام‌شده
          </h1>

          {loading ? (
            <p className="text-center text-gray-400">در حال بارگذاری...</p>
          ) : profiles.length === 0 ? (
            <p className="text-center text-gray-400">
              هنوز کاربری ثبت‌نام نکرده.
            </p>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="mb-2 font-bold">
                    {p.username || "بدون یوزرنیم"}
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-sm text-gray-300 sm:grid-cols-2">
                    <p>📞 {p.phone || "—"}</p>
                    <p>📷 {p.instagram_id || "—"}</p>
                    <p className="sm:col-span-2">
                      📍 لوکیشن: {p.location_address || "—"}
                    </p>
                    <p className="sm:col-span-2">
                      📮 آدرس پستی: {p.postal_address || "—"}
                    </p>
                    <p className="sm:col-span-2 text-gray-500">
                      عضویت:{" "}
                      {new Date(p.created_at).toLocaleDateString("fa-IR")}
                    </p>
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
