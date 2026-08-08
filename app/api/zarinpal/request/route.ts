import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { amount, description } = await req.json();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (!settings?.zarinpal_enabled || !settings?.zarinpal_merchant_id) {
    return NextResponse.json(
      { error: "پرداخت آنلاین فعلاً فعال نیست." },
      { status: 400 }
    );
  }

  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/verify`;

  const response = await fetch(
    "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        MerchantID: settings.zarinpal_merchant_id,
        Amount: amount,
        Description: description,
        CallbackURL: callbackUrl,
      }),
    }
  );

  const data = await response.json();

  if (data.Status === 100) {
    return NextResponse.json({
      authority: data.Authority,
      gatewayUrl: `https://sandbox.zarinpal.com/pg/StartPay/${data.Authority}`,
    });
  }

  return NextResponse.json(
    { error: "خطا در ایجاد تراکنش زرین‌پال" },
    { status: 400 }
  );
}