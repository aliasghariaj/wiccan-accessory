"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { formatPriceFa } from "@/lib/formatPrice";
import AdminNav from "@/components/admin/AdminNav";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

type Order = {
  id: string;
  full_name: string;
  phone: string;
  postal_code: string;
  city: string;
  address: string;
  shipping_method: string;
  items: { title: string; quantity: number; price: number }[];
  products_total: number;
  shipping_cost: number;
  grand_total: number;
  payment_method: string;
  payment_receipt_url: string | null;
  status: string;
  completed: boolean;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تایید شده",
  shipped: "ارسال شده",
  cancelled: "لغو شده",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email;
      if (email && email === ADMIN_EMAIL) {
        setAuthorized(true);
        loadOrders();
      } else {
        router.push("/");
      }
      setChecking(false);
    });
  }, [router]);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }

  async function updateStatus(orderId: string, newStatus: string) {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  }

  async function toggleCompleted(orderId: string, current: boolean) {
    await supabase
      .from("orders")
      .update({ completed: !current })
      .eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, completed: !current } : o)),
    );
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
          <h1 className="mb-12 text-center text-4xl font-bold">
            لیست سفارش‌ها
          </h1>

          <AdminNav />

          {loading ? (
            <p className="text-center text-gray-400">در حال بارگذاری...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-400">هنوز سفارشی ثبت نشده.</p>
          ) : (
            <div className="mx-auto max-w-4xl space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={order.completed}
                        onChange={() =>
                          toggleCompleted(order.id, order.completed)
                        }
                        className="h-5 w-5 accent-green-600"
                      />
                      تکمیل و تحویل داده شد
                    </label>
                    <div>
                      <p className="font-bold">{order.full_name}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleString("fa-IR")}
                      </p>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-2 text-sm text-gray-300 sm:grid-cols-2">
                    <p>📞 {order.phone}</p>
                    <p>📮 کد پستی: {order.postal_code}</p>
                    <p>🏙️ شهر: {order.city}</p>
                    <p>
                      🚚 روش ارسال:{" "}
                      {order.shipping_method === "tipax"
                        ? "تیپاکس"
                        : "اداره پست"}
                    </p>
                    <p className="sm:col-span-2">🏠 آدرس: {order.address}</p>
                  </div>

                  <div className="mb-4 border-t border-white/10 pt-4">
                    <p className="mb-2 text-sm text-gray-400">محصولات:</p>
                    <ul className="space-y-1 text-sm">
                      {order.items?.map((item, i) => (
                        <li key={i}>
                          {item.title} × {item.quantity} —{" "}
                          {formatPriceFa(item.price * item.quantity)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="font-bold text-yellow-600">
                      جمع کل: {formatPriceFa(order.grand_total)}
                    </p>

                    {order.payment_receipt_url && (
                      <a
                        href={order.payment_receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-yellow-500 hover:underline"
                      >
                        مشاهده رسید پرداخت
                      </a>
                    )}
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
