import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white" dir="rtl">
        <Container>
          <div className="mx-auto max-w-2xl">

            <p className="mb-4 text-center uppercase tracking-[0.6em] text-yellow-600">
              OUR STORY
            </p>

            <h1 className="mb-12 text-center text-5xl font-bold">
              درباره‌ی ارکیده
            </h1>

            <div className="space-y-6 text-lg leading-10 text-gray-300">
              <p>
                ارکیده نزدیک به دو سال است که در زمینه‌ی تجربه‌ی مشتری، فروش،
                و ساخت اکسسوری‌های جادویی فعالیت می‌کند؛ اکسسوری‌هایی که با
                سنگ‌های جادویی و در سبک‌های گاتیک، مدیوال و استخوان ساخته می‌شوند.
              </p>

              <p>
                او متولد و اهل رشت است. فعالیت خودش را از سال ۱۴۰۳ آغاز کرد و
                پس از مسیری پر از تغییر و آزمون، در نهایت نام{" "}
                <span dir="ltr" className="font-bold text-yellow-500">
                  Wiccan
                </span>{" "}
                را برای سبک کاری‌اش برگزید؛ ترکیبی خاص از استخوان و سنگ‌های
                جادویی که هویت اصلی برند را می‌سازد.
              </p>

              <p>
                علاقه‌ی عمیق ارکیده به دنیای{" "}
                <span dir="ltr">witchcraft</span>، نمادها و جادوگری، الهام‌بخش
                اصلی طراحی‌های اوست؛ دنیایی که در جزئیات هر قطعه‌ی دست‌ساز
                قابل مشاهده است.
              </p>

              <p>
                در کنار اکسسوری‌سازی، ارکیده خواننده‌ی سوپرانو در سبک فولکلور
                اروپایی، متال، راک، بلوز و جز است. علاقه‌ی موسیقایی او همچنین
                شامل گرانج، پراگرسیو راک، بلوز، فولکلور و کانتری آمریکایی هم
                می‌شود — دنیایی که در کنار اکسسوری‌سازی، بخش دیگری از هویت
                هنری او را شکل می‌دهد.
              </p>
            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}