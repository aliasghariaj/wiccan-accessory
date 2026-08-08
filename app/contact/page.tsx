import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center bg-[#090909] pt-32 pb-24 text-white" dir="rtl">
        <Container>
          <div className="mx-auto max-w-xl text-center">

            <p className="mb-4 uppercase tracking-[0.6em] text-yellow-600">
              GET IN TOUCH
            </p>

            <h1 className="mb-12 text-5xl font-bold">
              تماس با ما
            </h1>

            <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-10">

              <div>
                <p className="mb-1 text-sm text-gray-400">ایمیل</p>
                <p className="text-lg text-gray-500">به‌زودی</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-400">شماره تماس</p>
                <p className="text-lg text-gray-500">به‌زودی</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-400">اینستاگرام</p>
                <p className="text-lg text-gray-500">به‌زودی</p>
              </div>

            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}