"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import { getDisplayTitle, getDisplayMaterials } from "@/lib/productDisplay";

type Product = {
  id: string;
  code: string;
  title: string;
  materials: string[] | null;
  price_value: number;
  image_url: string | null;
  crafting_days: number;
  in_stock: boolean;
  discount_percent: number | null;
};

export default function RealmProducts({ realm }: { realm: string }) {
  const locale = useLocale();
  const t = useTranslations("shop");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("realm", realm)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    }
    loadProducts();
  }, [realm]);

  if (loading) return null;

  if (products.length === 0) {
    return (
      <p className="mt-24 text-gray-500">
        {t("realmEmpty")}
      </p>
    );
  }

  return (
    <div className="mt-24 grid w-full max-w-6xl justify-items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
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
  );
}