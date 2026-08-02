import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

export default function BrandStory() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909]">

      <Container className="relative z-10">

        <div className="flex flex-col items-center px-6 text-center text-white">

          <SectionTitle eyebrow="OUR WORLD" title="داستان Wiccan Accessory" />

          <p
            dir="rtl"
            className="max-w-3xl text-xl leading-10 text-gray-300 px-4"
          >
            Wiccan Accessory تنها یک فروشگاه نیست.
            اینجا هر سنگ، هر زنجیر و هر اکسسوری بخشی از یک داستان است.
            ما از دنیای گاتیک، مدیوال، فولکلور، طبیعت و موسیقی الهام می‌گیریم
            تا آثاری دست‌ساز خلق کنیم که هر کدام شخصیت و روایت مخصوص خودشان را دارند.
          </p>

        </div>

      </Container>

    </section>
  );
}