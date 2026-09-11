"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setErrorMsg("");
    setLoading(true);

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          username,
        });

        const { count } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        fetch("/api/telegram/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `🆕 <b>ثبت‌نام جدید</b>\n\n👤 یوزرنیم: ${username || "—"}\n📧 ${email}\n\n👥 تعداد کل کاربران: ${count ?? "?"}`,
          }),
        });
      }

      setErrorMsg(t("registerSuccess"));
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      window.location.href = "/";
    }

    setLoading(false);
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white">
        <Container>
          <div className="mx-auto max-w-md">
            {/* تب‌های ورود/ثبت‌نام */}
            <div className="mb-10 flex justify-center gap-4">
              <button
                onClick={() => setMode("login")}
                className={`rounded-lg px-6 py-2 transition ${
                  mode === "login"
                    ? "bg-yellow-700 text-black"
                    : "border border-white/10 text-gray-300"
                }`}
              >
                {t("loginTab")}
              </button>
              <button
                onClick={() => setMode("register")}
                className={`rounded-lg px-6 py-2 transition ${
                  mode === "register"
                    ? "bg-yellow-700 text-black"
                    : "border border-white/10 text-gray-300"
                }`}
              >
                {t("registerTab")}
              </button>
            </div>

            <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8">
              {mode === "register" && (
                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    {t("usernameLabel")}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  {t("emailLabel")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  {t("passwordLabel")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-8 w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-yellow-500 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
              >
                {loading
                  ? t("pleaseWait")
                  : mode === "login"
                    ? t("loginTab")
                    : t("createAccount")}
              </button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}