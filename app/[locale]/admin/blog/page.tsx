"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import AdminNav from "@/components/admin/AdminNav";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminBlogPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email;
      if (email && email === ADMIN_EMAIL) {
        setAuthorized(true);
      } else {
        router.push("/");
      }
      setChecking(false);
    });
  }, [router]);

  async function handlePublish() {
    if (!title || !content) {
      setMessage("عنوان و متن پست الزامی هستن.");
      return;
    }

    setSaving(true);
    setMessage("");

    const slug = `post-${Date.now()}`;
    let coverImageUrl = "";

    if (coverFile) {
      const fileExt = coverFile.name.split(".").pop();
      const randomId = Math.random().toString(36).substring(2, 10);
      const fileName = `post-${Date.now()}-${randomId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog")
        .upload(fileName, coverFile);

      if (uploadError) {
        setMessage("خطا در آپلود عکس: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("blog")
        .getPublicUrl(fileName);
      coverImageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("blog_posts").insert({
      slug,
      title,
      excerpt,
      content,
      cover_image_url: coverImageUrl,
    });

    if (error) {
      setMessage("خطا: " + error.message);
    } else {
      setMessage("پست با موفقیت منتشر شد ✅");
      setTitle("");
      setExcerpt("");
      setContent("");
      setCoverFile(null);
    }

    setSaving(false);
  }

  if (checking || !authorized) return null;

  return (
    <>
      <Header />

      <main
        className="min-h-screen bg-[#090909] pt-40 pb-24 text-white"
        dir="rtl"
      >
        <Container>
          <h1 className="mb-6 text-center text-4xl font-bold">
            نوشتن پست وبلاگ
          </h1>

          <AdminNav />

          <div className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                عنوان پست
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                خلاصه‌ی کوتاه (برای نمایش توی لیست وبلاگ)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                متن کامل پست
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                عکس کاور
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-700 file:px-4 file:py-2 file:text-black"
              />
            </div>

            {message && <p className="text-sm text-yellow-500">{message}</p>}

            <button
              onClick={handlePublish}
              disabled={saving}
              className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
            >
              {saving ? "در حال انتشار..." : "انتشار پست"}
            </button>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
