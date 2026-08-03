"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import RealmButton from "@/components/ui/RealmButton";

type Props = {
  code: string;
  title: string;
  image: string;
  priceValue: number;
};

export default function AddToCartButton({ code, title, image, priceValue }: Props) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart({ code, title, image, price: priceValue });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <RealmButton onClick={handleClick}>
      {added ? "✅ اضافه شد" : "افزودن به سبد خرید"}
    </RealmButton>
  );
}