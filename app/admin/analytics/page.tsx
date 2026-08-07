"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { formatPriceFa } from "@/lib/formatPrice";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

type Order = {
  id: string;
  items: { title: string; quantity: number; price: number }[];
  products_total: number;
  shipping_cost: number;
  grand_total: number;
  completed: boolean;
  created_at: string;
};

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const email = data.session?.user.email;
      if (email && email === ADMIN_EMAIL) {
        setAuthorized(true);

        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("completed", true)
          .order("created_at", { ascending: false });

        if (ordersData) setOrders(ordersData as Order[]);
      } else {
        router.push("/");
      }
      setChecking(false);
      setLoading(false);
    });
  }, [router]);

  if (checking || !authorized) return null;

  const netProductRevenue = orders.reduce(
    (sum, o) => sum + o.products_total,
    0,
  );
  const totalShippingCollected = orders.reduce(
    (sum, o) => sum + o.shipping_cost,
    0,
  );
  const grandTotalCollected = orders.reduce((sum, o) => sum + o.grand_total, 0);
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) ?? 0),
    0,
  );

  // گروه‌بندی بر اساس تاریخ
  const byDate: Record<string, { items: number; revenue: number }> = {};
  orders.forEach((o) => {
    const date = new Date(o.created_at).toLocaleDateString("fa-IR");
    const itemCount = o.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    if (!byDate[date]) byDate[date] = { items: 0, revenue: 0 };
    byDate[date].items += itemCount;
    byDate[date].revenue += o.grand_total;
  });

  return (
    <>
      <Header />

      <main
        className="min-h-screen bg-[#090909] pt-40 pb-24 text-white"
        dir="rtl"
      >
        <Container>
          <h1 className="mb-12 text-center text-4xl font-bold">آمار و درآمد</h1>

          {loading ? (
            <p className="text-center text-gray-400">در حال بارگذاری...</p>
          ) : (
            <div className="mx-auto max-w-4xl space-y-10">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="mb-2 text-sm text-gray-400">
                    سفارش‌های تکمیل‌شده
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="mb-2 text-sm text-gray-400">
                    تعداد محصول فروخته‌شده
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {totalItemsSold}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="mb-2 text-sm text-gray-400">
                    درآمد خالص محصولات
                  </p>
                  <p className="text-lg font-bold text-yellow-600">
                    {formatPriceFa(netProductRevenue)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="mb-2 text-sm text-gray-400">
                    جمع کل دریافتی (با ارسال)
                  </p>
                  <p className="text-lg font-bold text-yellow-600">
                    {formatPriceFa(grandTotalCollected)}
                  </p>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                هزینه‌ی ارسال دریافتی (جدا از درآمد محصول):{" "}
                {formatPriceFa(totalShippingCollected)}
              </p>

              <div>
                <h2 className="mb-4 text-lg font-bold text-yellow-600">
                  فروش بر اساس تاریخ
                </h2>
                <div className="space-y-2">
                  {Object.entries(byDate).map(([date, info]) => (
                    <div
                      key={date}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm"
                    >
                      <span>{date}</span>
                      <span>{info.items} محصول</span>
                      <span className="text-yellow-600">
                        {formatPriceFa(info.revenue)}
                      </span>
                    </div>
                  ))}
                  {Object.keys(byDate).length === 0 && (
                    <p className="text-center text-gray-500">
                      هنوز سفارش تکمیل‌شده‌ای ثبت نشده.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
