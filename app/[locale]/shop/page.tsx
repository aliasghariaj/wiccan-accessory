"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import ProductCard from "@/components/product/ProductCard";
import { supabase } from "@/lib/supabase";
import { useLocale } from "next-intl";
import { getDisplayTitle, getDisplayMaterials } from "@/lib/productDisplay";

type Product = {
  id: string;
  code: string;
  title: string;
  materials: string[] | null;
  material: string | null;
  price_value: number;
  realm: string;
  type: string;
  image_url: string | null;
  crafting_days: number;
  in_stock: boolean;
  discount_percent: number | null;
  created_at: string;
};

const realms = ["همه", "Wiccan", "Gothic", "Mermaid", "Grunge", "Decorative"];
const types = [
  "همه",
  "دستبند",
  "گردنبند",
  "گوشواره",
  "سنگ",
  "چین‌میل",
  "استخوان",
];
const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheap-first", label: "ارزان به گران" },
  { value: "expensive-first", label: "گران به ارزان" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  const [selectedRealm, setSelectedRealm] = useState("همه");
  const [selectedType, setSelectedType] = useState("همه");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const realmMatch = selectedRealm === "همه" || p.realm === selectedRealm;
      const typeMatch = selectedType === "همه" || p.type === selectedType;
      const searchMatch = p.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return realmMatch && typeMatch && searchMatch;
    });

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
  }, [products, selectedRealm, selectedType, sortBy, searchQuery]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
        <Container>
          <h1 className="mb-8 text-center text-5xl font-bold">فروشگاه</h1>

          <div className="mb-12 flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-gray-500 focus:border-yellow-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-10 md:flex-row">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="mb-4 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm md:hidden"
            >
              <span>فیلترها و مرتب‌سازی</span>
              <span>{filtersOpen ? "▲" : "▼"}</span>
            </button>

            <aside
              className={`w-full shrink-0 space-y-8 md:w-56 md:block ${filtersOpen ? "block" : "hidden"}`}
            >
              <div>
                <h2 className="mb-4 text-lg font-bold text-yellow-600">
                  دسته‌بندی
                </h2>
                <div className="flex flex-row flex-wrap gap-2 md:flex-col">
                  {realms.map((realm) => (
                    <button
                      key={realm}
                      onClick={() => setSelectedRealm(realm)}
                      className={`rounded-lg border px-4 py-2 text-right transition ${
                        selectedRealm === realm
                          ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                          : "border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      {realm}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-yellow-600">
                  نوع محصول
                </h2>
                <div className="flex flex-row flex-wrap gap-2 md:flex-col">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`rounded-lg border px-4 py-2 text-right transition ${
                        selectedType === type
                          ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                          : "border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-yellow-600">
                  مرتب‌سازی
                </h2>
                <div className="flex flex-row flex-wrap gap-2 md:flex-col">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`rounded-lg border px-4 py-2 text-right transition ${
                        sortBy === option.value
                          ? "border-yellow-600 bg-yellow-700/20 text-yellow-500"
                          : "border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {loading ? (
              <p className="w-full py-20 text-center text-gray-400">
                در حال بارگذاری...
              </p>
            ) : filteredProducts.length > 0 ? (
              <div className="grid w-full justify-items-center gap-10 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={
                      product.image_url ?? "/images/products/placeholder.jpg"
                    }
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
            ) : (
              <p className="w-full py-20 text-center text-gray-400">
                محصولی با این فیلتر پیدا نشد.
              </p>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
