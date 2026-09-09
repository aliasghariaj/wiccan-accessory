import Container from "@/components/common/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/product/AddToCartButton";
import { supabase } from "@/lib/supabase";
import { formatPriceFa } from "@/lib/formatPrice";
import { getDisplayTitle, getDisplayDescription, getDisplayMaterials } from "@/lib/productDisplay";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const t = await getTranslations({ locale, namespace: "product" });

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
          <p>{t("notFound")}</p>
        </main>
        <Footer />
      </>
    );
  }

  const title = getDisplayTitle(product, locale);
  const description = getDisplayDescription(product, locale);
  const materials = getDisplayMaterials(product, locale);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
        <Container>
          <div className="flex flex-col gap-12 md:flex-row">

            <div className="relative h-[500px] w-full overflow-hidden rounded-3xl md:w-1/2">
              <Image
                src={product.image_url ?? "/images/products/placeholder.jpg"}
                alt={title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex w-full flex-col text-right md:w-1/2">

              <p className="mb-2 text-sm text-gray-400">
                {t("codeLabel")} : {product.code}
              </p>

              <h1 className="mb-4 text-4xl font-bold">
                {title}
              </h1>

              <p className="mb-6 text-3xl font-bold text-yellow-600">
                {formatPriceFa(product.price_value)}
              </p>

              {description && (
                <p className="mb-6 leading-9 text-gray-300">
                  {description}
                </p>
              )}

              {materials.length > 0 && (
                <div className="mb-2 text-gray-400">
                  {t("material")}: {materials.join(" • ")}
                </div>
              )}

              {product.color && (
                <div className="mb-2 text-gray-400">
                  {t("color")}: {product.color}
                </div>
              )}

              <div className="mb-8 text-gray-400">
                {t("craftingDays")}: {product.crafting_days} {t("days")} + {t("deliveryDays")}: {product.delivery_days} {t("days")}
              </div>

              <AddToCartButton
                code={product.code}
                title={title}
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