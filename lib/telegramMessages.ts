type OrderItemForMessage = {
  title: string;
  quantity: number;
};

export function buildOrderPlacedMessage(params: {
  fullName: string;
  username: string | null;
  phone: string;
  items: OrderItemForMessage[];
  grandTotal: number;
  paid: boolean;
}): string {
  const now = new Date();
  const date = now.toLocaleDateString("fa-IR");
  const time = now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  const itemsList = params.items.map((i) => `• ${i.title} × ${i.quantity}`).join("\n");
  const paymentStatus = params.paid ? "پرداخت شده ✅" : "در انتظار بررسی رسید ⏳";

  return (
    `🛍 <b>سفارش جدید</b>\n\n` +
    `سفارشی در تاریخ ${date} ساعت ${time} با یوزرنیم «${params.username ?? "مهمان"}»، شماره ${params.phone} و نام ${params.fullName} ثبت گردیده است (${paymentStatus}).\n\n` +
    `${itemsList}\n\n` +
    `💰 مبلغ کل: ${params.grandTotal.toLocaleString()} تومان`
  );
}

const statusLabels: Record<string, string> = {
  confirmed: "تایید شد ✅",
  shipped: "ارسال شد 📦",
  cancelled: "لغو شد ❌",
};

export function buildOrderStatusMessage(params: {
  fullName: string;
  status: string;
}): string {
  const label = statusLabels[params.status] ?? params.status;
  return `🔔 وضعیت سفارش «${params.fullName}» تغییر کرد: ${label}`;
}