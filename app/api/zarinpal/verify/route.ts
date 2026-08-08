import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { authority, amount } = await req.json();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const response = await fetch(
    "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        MerchantID: settings?.zarinpal_merchant_id,
        Authority: authority,
        Amount: amount,
      }),
    }
  );

  const data = await response.json();

  if (data.Status === 100 || data.Status === 101) {
    return NextResponse.json({ success: true, refId: data.RefID });
  }

  return NextResponse.json({ success: false });
}