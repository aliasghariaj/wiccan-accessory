"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import AdminNav from "@/components/admin/AdminNav";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [category, setCategory] = useState<"music" | "accessory">("music");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video" | "text">("photo");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [activityDate, setActivityDate] = useState("");

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
    if (!title || !activityDate) {
      setMessage("عنوان و تاریخ فعالیت الزامی هستن.");
      return;
    }

    setSaving(true);
    setMessage("");

    let imageUrl = "";

    if (mediaType === "photo" && imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const randomId = Math.random().toString(36).substring(2, 10);
      const fileName = `portfolio-${Date.now()}-${randomId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage("خطا در آپلود عکس: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("portfolio_posts").insert({
      category,
      title,
      description,
      title_en: titleEn || null,
      description_en: descriptionEn || null,
      media_type: mediaType,
      image_url: imageUrl || null,
      video_url: mediaType === "video" ? videoUrl : null,
      activity_date: activityDate,
    });

    if (error) {
      setMessage("خطا: " + error.message);
    } else {
      setMessage("پست با موفقیت اضافه شد ✅");
      setTitle("");
      setDescription("");
      setTitleEn("");
      setDescriptionEn("");
      setImageFile(null);
      setVideoUrl("");
      setActivityDate("");
    }

    setSaving(false);
  }

  if (checking || !authorized) return null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white" dir="rtl">
        <Container>

          <h1 className="mb-6 text-center text-4xl font-bold">
            افزودن پست پورتفولیو
          </h1>

          <AdminNav />

          <div className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8">

            <div>
              <label className="mb-2 block text-sm text-gray-400">دسته</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setCategory("music")}
                  className={`flex-1 rounded-lg border px-4 py-3 transition ${
                    category === "music"
                      ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  موسیقی
                </button>
                <button
                  onClick={() => setCategory("accessory")}
                  className={`flex-1 rounded-lg border px-4 py-3 transition ${
                    category === "accessory"
                      ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  اکسسوری
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">عنوان</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">تاریخ فعالیت</label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">نوع محتوا</label>
              <div className="flex gap-3">
                {(["photo", "video", "text"] as const).map((mt) => (
                  <button
                    key={mt}
                    onClick={() => setMediaType(mt)}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm transition ${
                      mediaType === mt
                        ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                        : "border-white/10 text-gray-300"
                    }`}
                  >
                    {mt === "photo" ? "عکس" : mt === "video" ? "ویدیو" : "فقط متن"}
                  </button>
                ))}
              </div>
            </div>

            {mediaType === "photo" && (
              <div>
                <label className="mb-2 block text-sm text-gray-400">عکس</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-700 file:px-4 file:py-2 file:text-black"
                />
              </div>
            )}

            {mediaType === "video" && (
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  لینک ویدیو (یوتیوب، اینستاگرام یا لینک مستقیم فایل)
                </label>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                  dir="ltr"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-gray-400">توضیحات / متن</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div className="space-y-5 border-t border-white/10 pt-8">
              <h2 className="text-lg font-bold text-yellow-600">
                انگلیسی <span className="text-sm font-normal text-gray-500">(اختیاری)</span>
              </h2>

              <div>
                <label className="mb-2 block text-sm text-gray-400" dir="ltr">Title (English)</label>
                <input
                  dir="ltr"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400" dir="ltr">Description (English)</label>
                <textarea
                  dir="ltr"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>
            </div>

            {message && <p className="text-sm text-yellow-500">{message}</p>}

            <button
              onClick={handlePublish}
              disabled={saving}
              className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "افزودن پست"}
            </button>

          </div>

        </Container>
      </main>

      <Footer />
    </>
  );
}