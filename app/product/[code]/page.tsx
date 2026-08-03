import Container from "@/components/common/Container";
import RealmButton from "@/components/ui/RealmButton";
import Image from "next/image";
import { addToCart } from "@/lib/cart";
import AddToCartButton from "@/components/product/AddToCartButton";

const allProducts = [
  {
    image: "/images/products/wiccan-necklace.jpg",
    title: "Sacred Grove",
    code: "WI-001",
    material: "Bone • Wood • Leather",
    materials: ["استخون", "چوب", "چرم"],
    price: "1,950,000 تومان",
    realm: "Wiccan",
    type: "گردنبند",
    description:
      "این گردنبند دست‌ساز از استخوان طبیعی، چوب کهن و چرم دست‌دوز ساخته شده و الهام‌گرفته از آیین‌های باستانی ویکن است.",
    craftingDays: 5,
  },
  {
    image: "/images/products/gothic-necklace.jpg",
    title: "Midnight Lace",
    code: "GT-001",
    material: "Silver • Onyx",
    materials: ["سنگ", "مفتول"],
    price: "2,100,000 تومان",
    realm: "Gothic",
    type: "گردنبند",
    description:
      "طراحی‌شده با نقره و سنگ آنیکس، این قطعه روح گاتیک و رمانتیسم تاریک را به تصویر می‌کشد.",
    craftingDays: 4,
  },
  {
    image: "/images/products/mermaid-necklace.jpg",
    title: "Siren's Pearl",
    code: "MM-001",
    material: "Pearl • Silver",
    materials: ["سنگ", "مفتول"],
    price: "2,100,000 تومان",
    realm: "Mermaid",
    type: "گردنبند",
    description:
      "با مروارید طبیعی و نقره، این طرح از زیبایی رمزآلود اعماق دریا الهام گرفته است.",
    craftingDays: 6,
  },
  {
    image: "/images/products/grunge-necklace.jpg",
    title: "Flannel Nights",
    code: "GR-001",
    material: "Leather • Chain",
    materials: ["چرم", "چین‌میل"],
    price: "1,750,000 تومان",
    realm: "Grunge",
    type: "دستبند",
    description:
      "دستبندی خشن و راک با چرم و زنجیر، برگرفته از روح سرکش دهه‌ی نود.",
    craftingDays: 3,
  },
  {
    image: "/images/products/decorative-item.jpg",
    title: "Crystal Cluster",
    code: "DC-001",
    material: "Amethyst • Wood",
    materials: ["سنگ", "چوب"],
    price: "1,600,000 تومان",
    realm: "Decorative",
    type: "سنگ",
    description:
      "قطعه‌ای تزیینی از سنگ آمیتیست و چوب طبیعی، مناسب برای آراستن فضای خانه.",
    craftingDays: 2,
  },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const product = allProducts.find((p) => p.code === code);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <p>محصول پیدا نشد.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
      <Container>
        <div className="flex flex-col gap-12 md:flex-row">

          {/* عکس محصول */}
          <div className="relative h-[500px] w-full overflow-hidden rounded-3xl md:w-1/2">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* اطلاعات محصول */}
          <div className="flex w-full flex-col text-right md:w-1/2" dir="rtl">

            <p className="mb-2 text-sm text-gray-400">
              Product Code : {product.code}
            </p>

            <h1 className="mb-4 text-4xl font-bold">
              {product.title}
            </h1>

            <p className="mb-6 text-3xl font-bold text-yellow-600">
              {product.price}
            </p>

            <p className="mb-6 leading-9 text-gray-300">
              {product.description}
            </p>

            <div className="mb-2 text-gray-400">
              جنس: {product.material}
            </div>

            <div className="mb-8 text-gray-400">
              زمان ساخت: {product.craftingDays} روز کاری
            </div>

            <AddToCartButton
            code={product.code}
            title={product.title}
            image={product.image}
            priceValue={Number(product.price.replace(/[^\d]/g, ""))}
            />

          </div>

        </div>
      </Container>
    </main>
  );
}