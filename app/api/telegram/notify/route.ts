import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, photoUrl } = await req.json();

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: "تلگرام تنظیم نشده" }, { status: 400 });
  }

  const endpoint = photoUrl ? "sendPhoto" : "sendMessage";
  const body = photoUrl
    ? { chat_id: chatId, photo: photoUrl, caption: message, parse_mode: "HTML" }
    : { chat_id: chatId, text: message, parse_mode: "HTML" };

  const res = await fetch(`https://api.telegram.org/bot${token}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}