"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/admin/AdminNav";
import { translateMaterialsToEnglish } from "@/lib/materialsEn";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const typeOptions = [
  { label: "گردنبند", prefix: "NK" },
  { label: "دستبند", prefix: "BR" },
  { label: "گوشواره", prefix: "ER" },
  { label: "سنگ", prefix: "ST" },
  { label: "چین‌میل", prefix: "CM" },
  { label: "استخوان", prefix: "BN" },
];

const materialOptions = [
  "چرم",
  "سنگ",
  "نخ",
  "استخوان",
  "چین‌میل",
  "مفتول",
  "طلا",
  "نقره",
  "فلز",
];

const realmOptions = ["Wiccan", "Gothic", "Mermaid", "Grunge", "Decorative"];

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [codeNumber, setCodeNumber] = useState("");
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [color, setColor] = useState("");
  const [colorEn, setColorEn] = useState("");
  const [makerTelegram, setMakerTelegram] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [realm, setRealm] = useState("Wiccan");
  const [type, setType] = useState(typeOptions[0]);
  const [craftingDays, setCraftingDays] = useState("3");
  const [deliveryDays, setDeliveryDays] = useState("2");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  function toggleMaterial(m: string) {
    setSelectedMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }

  async function handleAddProduct() {
    if (!codeNumber || !title || !priceValue) {
      setMessage("کد، عنوان و قیمت الزامی هستن.");
      return;
    }

    setSaving(true);
    setMessage("");

    const fullCode = `${type.prefix}-${codeNumber.padStart(3, "0")}`;

    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${fullCode}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage("خطا در آپلود عکس: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("products").insert({
      code: fullCode,
      title,
      description,
      materials: selectedMaterials,
      title_en: titleEn,
      description_en: descriptionEn,
      materials_en: translateMaterialsToEnglish(selectedMaterials),
      color,
      color_en: colorEn || null,
      maker_telegram: makerTelegram || null,
      price_value: Number(priceValue),
      realm,
      type: type.label,
      image_url: imageUrl,
      crafting_days: Number(craftingDays),
      delivery_days: Number(deliveryDays),
      featured,
    });

    if (error) {
      setMessage("خطا: " + error.message);
    } else {
      setMessage(`محصول با کد ${fullCode} با موفقیت اضافه شد ✅`);
      setCodeNumber("");
      setTitle("");
      setDescription("");
      setSelectedMaterials([]);
      setTitleEn("");
      setDescriptionEn("");
      setColor("");
      setColorEn("");
      setMakerTelegram("");
      setPriceValue("");
      setImageFile(null);
      setFeatured(false);
    }

    setSaving(false);
  }

  if (checking) return null;
  if (!authorized) return null;

  return (
    <>
      <Header />

      <main
        className="min-h-screen bg-[#090909] pt-40 pb-24 text-white"
        dir="rtl"
      >
        <Container>
          <h1 className="mb-12 text-center text-4xl font-bold">
            پنل مدیریت — افزودن محصول
          </h1>

          <AdminNav />

          <div className="mx-auto max-w-xl space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                نوع محصول
              </label>
              <select
                value={type.label}
                onChange={(e) =>
                  setType(typeOptions.find((t) => t.label === e.target.value)!)
                }
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              >
                {typeOptions.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                شماره محصول (کد کامل: {type.prefix}-
                {codeNumber.padStart(3, "0") || "XXX"})
              </label>
              <input
                value={codeNumber}
                onChange={(e) =>
                  setCodeNumber(e.target.value.replace(/\D/g, ""))
                }
                placeholder="مثلاً 1"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                عنوان محصول
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                عنوان محصول (انگلیسی)
              </label>
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                توضیحات
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                توضیحات (انگلیسی)
              </label>
              <textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={3}
                dir="ltr"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                جنس (چند مورد قابل انتخابه)
              </label>
              <div className="flex flex-wrap gap-2">
                {materialOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMaterial(m)}
                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                      selectedMaterials.includes(m)
                        ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                        : "border-white/10 text-gray-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">رنگ</label>
              <input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="مثلاً مشکی، طلایی، نقره‌ای..."
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400" dir="ltr">
                Color (English) <span className="text-xs text-gray-500">— optional</span>
              </label>
              <input
                dir="ltr"
                value={colorEn}
                onChange={(e) => setColorEn(e.target.value)}
                placeholder="e.g. Black, Gold, Silver..."
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                آیدی تلگرام سازنده‌ی این محصول <span className="text-xs text-gray-500">(اختیاری — اگه خالی بذاری، آیدی پیش‌فرض که توی تنظیمات سایت هست استفاده می‌شه)</span>
              </label>
              <input
                dir="ltr"
                value={makerTelegram}
                onChange={(e) => setMakerTelegram(e.target.value)}
                placeholder="مثلاً orkideh_wiccan (بدون @)"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                قیمت (تومان، فقط عدد)
              </label>
              <input
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                type="number"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Realm</label>
              <select
                value={realm}
                onChange={(e) => setRealm(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              >
                {realmOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-sm text-gray-400">
                  زمان ساخت (روز)
                </label>
                <input
                  value={craftingDays}
                  onChange={(e) => setCraftingDays(e.target.value)}
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-sm text-gray-400">
                  زمان تحویل (روز)
                </label>
                <input
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                عکس محصول
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-700 file:px-4 file:py-2 file:text-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-5 w-5 accent-yellow-600"
              />
              <label htmlFor="featured" className="text-sm text-gray-300">
                این محصول توی صفحه‌ی اصلی (بخش Realm مربوطه) نمایش داده بشه
              </label>
            </div>

            {message && <p className="text-sm text-yellow-500">{message}</p>}

            <button
              onClick={handleAddProduct}
              disabled={saving}
              className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "افزودن محصول"}
            </button>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}