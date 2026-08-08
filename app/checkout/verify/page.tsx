"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");

  useEffect(() => {
    async function verify() {
      const authority = searchParams.get("Authority");
      const zpStatus = searchParams.get("Status");

      const stored = sessionStorage.getItem("pendingOrder");
      if (!stored || !authority || zpStatus !== "OK") {
        setStatus("failed");
        return;
      }

      const orderInfo = JSON.parse(stored);

      const res = await fetch("/api/zarinpal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authority,
          amount: orderInfo.grandTotal,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setStatus("failed");
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id ?? null;

      await supabase.from("orders").insert({
        user_id: userId,
        full_name: orderInfo.fullName,
        phone: orderInfo.phone,
        postal_code: orderInfo.postalCode,
        city: orderInfo.city,
        address: orderInfo.address,
        shipping_method: orderInfo.shippingMethod,
        items: orderInfo.items,
        products_total: orderInfo.productsTotal,
        shipping_cost: orderInfo.shippingCost,
        grand_total: orderInfo.grandTotal,
        payment_method: "zarinpal",
        status: "confirmed",
      });

      sessionStorage.removeItem("pendingOrder");
      localStorage.removeItem("wiccan_cart");
      setStatus("success");

      setTimeout(() => router.push("/checkout/success"), 1500);
    }

    verify();
  }, [searchParams, router]);

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white" dir="rtl">
        <Container>
          <div className="text-center">
            {status === "checking" && <p>در حال بررسی پرداخت...</p>}
            {status === "success" && <p className="text-green-500">پرداخت موفق بود ✅ در حال انتقال...</p>}
            {status === "failed" && (
              <div>
                <p className="mb-4 text-red-400">پرداخت ناموفق بود یا لغو شد.</p>
                <a href="/cart" className="text-yellow-600 hover:underline">بازگشت به سبد خرید</a>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}