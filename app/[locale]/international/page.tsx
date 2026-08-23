import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function InternationalPage() {
  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white" dir="rtl">
        <Container>
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold">سفارش خارجی</h1>
            <p className="text-gray-400">
              این بخش به‌زودی برای مشتریان خارج از ایران فعال می‌شود.
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}