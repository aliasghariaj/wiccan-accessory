import Container from "@/components/common/Container";

export default function BrandStory() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909]">
      
      {/* Content - بدون Container اضافی */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        
        <p className="mb-4 uppercase tracking-[0.6em] text-yellow-600">
          OUR WORLD
        </p>

        <h2 className="mb-8 text-5xl font-bold lg:text-6xl">
          داستان Wiccan Accessory
        </h2>

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
      
    </section>
  );
}