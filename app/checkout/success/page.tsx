import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function SuccessPage() {
  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white" dir="rtl">
        <Container>
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-yellow-600">
              سفارش با موفقیت ثبت شد ✅
            </h1>
            <p className="mb-8 text-gray-400">
              رسیدت رو بررسی می‌کنیم و به‌زودی سفارشت رو تایید می‌کنیم.
            </p>
            <Link href="/shop" className="text-yellow-600 hover:underline">
              بازگشت به فروشگاه
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}