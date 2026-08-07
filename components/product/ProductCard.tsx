"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { translateMaterial } from "@/lib/materials";
import { formatPriceFa } from "@/lib/formatPrice";
import { addToCart } from "@/lib/cart";

type ProductCardProps = {
  image: string;
  title: string;
  code: string;
  material: string;
  priceValue: number;
  craftingDays?: number;
  inStock?: boolean;
  discountPercent?: number;
};

export default function ProductCard({
  image,
  title,
  code,
  material,
  priceValue,
  craftingDays,
  inStock = true,
  discountPercent,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ code, title, image, price: priceValue });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Link
      href={`/product/${code}`}
      className="
      group
      relative
      block
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-[#111]
      transition-all
      duration-500
      hover:border-yellow-600
      hover:shadow-[0_0_35px_rgba(198,161,91,0.25)]
      "
    >
      {/* نشان‌ها (بالای عکس) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {!inStock && (
          <span className="rounded-full bg-red-900/80 px-3 py-1 text-xs text-white">
            ناموجود
          </span>
        )}
        {discountPercent && (
          <span className="rounded-full bg-yellow-700/90 px-3 py-1 text-xs text-black">
            {discountPercent}% تخفیف
          </span>
        )}
      </div>

      <div className="relative h-80 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="
          object-cover
          transition-transform
          duration-700
          group-hover:scale-110
          "
        />
      </div>

      <div className="space-y-4 p-6">

        <h3 className="text-2xl font-bold">{title}</h3>

        <p className="text-sm text-gray-400">
          Product Code : {code}
        </p>

        <p className="text-gray-300">
          جنس: {translateMaterial(material)}
        </p>

        {craftingDays && (
          <p className="text-sm text-gray-400">
            زمان ساخت: {craftingDays} روز کاری
          </p>
        )}

        <p className="text-2xl font-bold text-yellow-600">
          {formatPriceFa(priceValue)}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="w-full rounded-xl border border-yellow-600 bg-black/30 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all duration-300 hover:bg-yellow-700 hover:text-black disabled:opacity-40"
        >
          {added ? "✅ اضافه شد" : inStock ? "افزودن به سبد" : "ناموجود"}
        </button>

      </div>
    </Link>
  );
}