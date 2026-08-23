import Container from "@/components/common/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/product/AddToCartButton";
import { supabase } from "@/lib/supabase";
import { formatPriceFa } from "@/lib/formatPrice";
import Image from "next/image";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("code", code)
    .single();

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
          <p>محصول پیدا نشد.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
        <Container>
          <div className="flex flex-col gap-12 md:flex-row">

            <div className="relative h-[500px] w-full overflow-hidden rounded-3xl md:w-1/2">
              <Image
                src={product.image_url ?? "/images/products/placeholder.jpg"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex w-full flex-col text-right md:w-1/2" dir="rtl">

              <p className="mb-2 text-sm text-gray-400">
                Product Code : {product.code}
              </p>

              <h1 className="mb-4 text-4xl font-bold">
                {product.title}
              </h1>

              <p className="mb-6 text-3xl font-bold text-yellow-600">
                {formatPriceFa(product.price_value)}
              </p>

              {product.description && (
                <p className="mb-6 leading-9 text-gray-300">
                  {product.description}
                </p>
              )}

              {product.materials && product.materials.length > 0 && (
                <div className="mb-2 text-gray-400">
                  جنس: {product.materials.join(" • ")}
                </div>
              )}

              {product.color && (
                <div className="mb-2 text-gray-400">
                  رنگ: {product.color}
                </div>
              )}

              <div className="mb-8 text-gray-400">
                زمان ساخت: {product.crafting_days} روز کاری + زمان تحویل: {product.delivery_days} روز کاری
              </div>

              <AddToCartButton
                code={product.code}
                title={product.title}
                image={product.image_url ?? "/images/products/placeholder.jpg"}
                priceValue={product.price_value}
              />

            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}