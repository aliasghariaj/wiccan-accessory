"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import Container from "@/components/common/Container";
import { useLocale, useTranslations } from "next-intl";
import { getDisplayTitle, getDisplayMaterials } from "@/lib/productDisplay";
import { translateTypeToEnglish } from "@/lib/typesEn";

type Product = {
  id: string;
  code: string;
  title: string;
  materials: string[] | null;
  title_en?: string | null;
  materials_en?: string[] | null;
  price_value: number;
  type: string;
  image_url: string | null;
  crafting_days: number;
  in_stock: boolean;
  discount_percent: number | null;
  created_at: string;
};

const types = [
  "all",
  "دستبند",
  "گردنبند",
  "گوشواره",
  "سنگ",
  "چین‌میل",
  "استخوان",
];
const sortOptions = [
  { value: "newest", labelKey: "sortNewest" },
  { value: "cheap-first", labelKey: "sortCheapFirst" },
  { value: "expensive-first", labelKey: "sortExpensiveFirst" },
] as const;

export default function RealmShopSection({ realm }: { realm: string }) {
  const locale = useLocale();
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("realm", realm);
      if (data) setProducts(data as Product[]);
      setLoading(false);
    }
    loadProducts();
  }, [realm]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (p) => selectedType === "all" || p.type === selectedType,
    );

    if (sortBy === "cheap-first") {
      result = [...result].sort((a, b) => a.price_value - b.price_value);
    } else if (sortBy === "expensive-first") {
      result = [...result].sort((a, b) => b.price_value - a.price_value);
    } else {
      result = [...result].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return result;
  }, [products, selectedType, sortBy]);

  return (
    <section id="shop-section" className="bg-[#090909] py-24 text-white">
      <Container>
        <h2 className="mb-12 text-center text-4xl font-bold">
          {t("realmHeading")}
        </h2>

        <div className="mb-10 flex flex-wrap justify-center gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  selectedType === type
                    ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                    : "border-white/10 text-gray-300"
                }`}
              >
                {type === "all"
                  ? tCommon("all")
                  : locale === "fa"
                    ? type
                    : translateTypeToEnglish(type)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  sortBy === option.value
                    ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                    : "border-white/10 text-gray-300"
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">{tCommon("loading")}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-400">{t("noResults")}</p>
        ) : (
          <div className="grid justify-items-center gap-10 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image_url ?? "/images/products/placeholder.jpg"}
                title={getDisplayTitle(product, locale)}
                code={product.code}
                material={getDisplayMaterials(product, locale).join(" • ")}
                priceValue={product.price_value}
                craftingDays={product.crafting_days}
                inStock={product.in_stock}
                discountPercent={product.discount_percent ?? undefined}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}