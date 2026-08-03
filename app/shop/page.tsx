"use client";

import { useState, useMemo } from "react";
import Container from "@/components/common/Container";
import ProductCard from "@/components/product/ProductCard";
import Header from "@/components/layout/Header";

const allProducts = [
  {
    image: "/images/products/wiccan-necklace.jpg",
    title: "Sacred Grove",
    code: "WI-001",
    material: "Bone • Wood • Leather",
    materials: ["استخون", "چوب", "چرم"],
    price: "1,950,000 تومان",
    priceValue: 1950000,
    realm: "Wiccan",
    type: "گردنبند",
    dateAdded: 5,
  },
  {
    image: "/images/products/gothic-necklace.jpg",
    title: "Midnight Lace",
    code: "GT-001",
    material: "Silver • Onyx",
    materials: ["سنگ", "مفتول"],
    price: "2,100,000 تومان",
    priceValue: 2100000,
    realm: "Gothic",
    type: "گردنبند",
    dateAdded: 4,
  },
  {
    image: "/images/products/mermaid-necklace.jpg",
    title: "Siren's Pearl",
    code: "MM-001",
    material: "Pearl • Silver",
    materials: ["سنگ", "مفتول"],
    price: "2,100,000 تومان",
    priceValue: 2100000,
    realm: "Mermaid",
    type: "گردنبند",
    dateAdded: 3,
  },
  {
    image: "/images/products/grunge-necklace.jpg",
    title: "Flannel Nights",
    code: "GR-001",
    material: "Leather • Chain",
    materials: ["چرم", "چین‌میل"],
    price: "1,750,000 تومان",
    priceValue: 1750000,
    realm: "Grunge",
    type: "دستبند",
    dateAdded: 2,
  },
  {
    image: "/images/products/decorative-item.jpg",
    title: "Crystal Cluster",
    code: "DC-001",
    material: "Amethyst • Wood",
    materials: ["سنگ", "چوب"],
    price: "1,600,000 تومان",
    priceValue: 1600000,
    realm: "Decorative",
    type: "سنگ",
    dateAdded: 1,
  },
];

const realms = ["همه", "Wiccan", "Gothic", "Mermaid", "Grunge", "Decorative"];
const types = ["همه", "دستبند", "گردنبند", "گوشواره", "سنگ", "چین‌میل", "استخوان"];
const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheap-first", label: "ارزان به گران" },
  { value: "expensive-first", label: "گران به ارزان" },
];

export default function ShopPage() {
  const [selectedRealm, setSelectedRealm] = useState("همه");
  const [selectedType, setSelectedType] = useState("همه");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((p) => {
      const realmMatch = selectedRealm === "همه" || p.realm === selectedRealm;
      const typeMatch = selectedType === "همه" || p.type === selectedType;
      const searchMatch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return realmMatch && typeMatch && searchMatch;
    });

    if (sortBy === "cheap-first") {
      result = [...result].sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortBy === "expensive-first") {
      result = [...result].sort((a, b) => b.priceValue - a.priceValue);
    } else {
      result = [...result].sort((a, b) => b.dateAdded - a.dateAdded);
    }

    return result;
}, [selectedRealm, selectedType, sortBy, searchQuery]);

  return (
  <>
    <Header />
    <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
      <Container>

        <h1 className="mb-8 text-center text-5xl font-bold">
          فروشگاه
        </h1>

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

          {/* سایدبار فیلتر */}
          <aside className="w-full shrink-0 space-y-8 md:w-56">

            {/* دسته‌بندی سبک (Realm) */}
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

            {/* نوع محصول */}
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

            {/* مرتب‌سازی */}
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

          {/* لیست محصولات */}
          {filteredProducts.length > 0 ? (
            <div className="grid w-full justify-items-center gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.code} {...product} />
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
  </>
  );
}