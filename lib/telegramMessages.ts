type OrderItemForMessage = {
  code: string;
  title: string;
  quantity: number;
};

export function generateTrackingCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function formatDateTime(d: Date) {
  return {
    date: d.toLocaleDateString("fa-IR"),
    time: d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function buildOrderPlacedMessage(params: {
  trackingCode: string;
  fullName: string;
  username: string | null;
  phone: string;
  city: string;
  postalCode: string;
  address: string;
  items: OrderItemForMessage[];
  grandTotal: number;
  paid: boolean;
}): string {
  const { date, time } = formatDateTime(new Date());
  const itemsList = params.items
    .map((i) => `• [${i.code}] ${i.title} × ${i.quantity}`)
    .join("\n");
  const paymentStatus = params.paid ? "پرداخت شده ✅" : "در انتظار بررسی رسید ⏳";

  return (
    `🛍 <b>سفارش جدید</b>\n\n` +
    `🔖 کد رهگیری: <b>${params.trackingCode}</b>\n` +
    `📅 تاریخ: ${date} — ساعت ${time}\n` +
    `👤 نام: ${params.fullName}\n` +
    `🆔 یوزرنیم: ${params.username ?? "مهمان"}\n` +
    `📞 شماره تماس: ${params.phone}\n` +
    `💳 وضعیت پرداخت: ${paymentStatus}\n\n` +
    `🛒 <b>اقلام سفارش:</b>\n${itemsList}\n\n` +
    `💰 مبلغ کل: ${params.grandTotal.toLocaleString()} تومان\n\n` +
    `📍 <b>آدرس:</b>\nشهر: ${params.city}\nکد پستی: ${params.postalCode}\n${params.address}`
  );
}

const statusMeta: Record<string, { label: string; emoji: string }> = {
  confirmed: { label: "تایید شد", emoji: "✅" },
  shipped: { label: "ارسال شد", emoji: "📦" },
  cancelled: { label: "لغو شد", emoji: "❌" },
};

export function buildOrderStatusMessage(params: {
  trackingCode: string;
  fullName: string;
  phone: string;
  orderCreatedAt: string;
  status: string;
}): string {
  const meta = statusMeta[params.status] ?? { label: params.status, emoji: "🔔" };
  const { date: orderDate } = formatDateTime(new Date(params.orderCreatedAt));
  const { date: changeDate, time: changeTime } = formatDateTime(new Date());

  return (
    `${meta.emoji} <b>تغییر وضعیت سفارش</b>\n\n` +
    `🔖 کد رهگیری: <b>${params.trackingCode}</b>\n` +
    `👤 نام: ${params.fullName}\n` +
    `📞 شماره تماس: ${params.phone}\n` +
    `📅 تاریخ ثبت سفارش: ${orderDate}\n\n` +
    `📌 وضعیت جدید: <b>${meta.label} ${meta.emoji}</b>\n` +
    `⏰ زمان تغییر: ${changeDate} — ساعت ${changeTime}`
  );
}