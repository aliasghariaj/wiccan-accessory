"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { getCart, CartItem } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import { iranCities } from "@/lib/iranCities";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("tipax");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
    setCart(items);

    // اگه کاربر پروفایل داشته باشه، فیلدها رو از قبل پر می‌کنیم
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (profile) {
          setPhone(profile.phone ?? "");
          setAddress(profile.postal_address ?? "");
        }
      }
    });
  }, [router]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isInCity = city === "رشت";
  const shippingCost = city ? (isInCity ? 50000 : 80000) : 0;
  const grandTotal = total + shippingCost;

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "نام و نام خانوادگی الزامیه";
    if (!phone.trim()) newErrors.phone = "شماره تماس الزامیه";
    if (!postalCode.trim()) newErrors.postalCode = "کد پستی الزامیه";
    if (!city) newErrors.city = "انتخاب شهر الزامیه";
    if (!address.trim()) newErrors.address = "آدرس کامل الزامیه";

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

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white" dir="rtl">
        <Container>

          <h1 className="mb-12 text-center text-4xl font-bold">
            تکمیل سفارش
          </h1>

          <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                نام و نام خانوادگی *
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
                شماره تماس *
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
                کد پستی *
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
                شهر *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-yellow-600 focus:outline-none"
              >
                <option value="">انتخاب کن...</option>
                {iranCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-400">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                آدرس کامل *
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
                روش ارسال
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
                  تیپاکس
                </button>
                <button
                  onClick={() => setShippingMethod("post")}
                  className={`flex-1 rounded-lg border px-4 py-3 transition ${
                    shippingMethod === "post"
                      ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  اداره پست
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between text-gray-400">
                <span>جمع محصولات</span>
                <span>{total.toLocaleString()} تومان</span>
              </div>
              {city && (
                <div className="flex items-center justify-between text-gray-400">
                  <span>هزینه ارسال ({isInCity ? "داخل‌شهری" : "بین‌شهری"})</span>
                  <span>{shippingCost.toLocaleString()} تومان</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xl font-bold">
                <span>جمع کل</span>
                <span className="text-yellow-600">
                  {grandTotal.toLocaleString()} تومان
                </span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black"
            >
              ادامه به پرداخت
            </button>

          </div>

        </Container>
      </main>

      <Footer />
    </>
  );
}