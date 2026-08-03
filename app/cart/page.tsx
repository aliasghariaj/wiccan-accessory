"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { getCart, removeFromCart, updateQuantity, CartItem } from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function handleRemove(code: string) {
    removeFromCart(code);
    setCart(getCart());
  }

  function handleQuantityChange(code: string, quantity: number) {
    updateQuantity(code, quantity);
    setCart(getCart());
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-40 pb-24 text-white" dir="rtl">
        <Container>

          <h1 className="mb-12 text-center text-4xl font-bold">
            سبد خرید
          </h1>

          {cart.length === 0 ? (
            <div className="text-center text-gray-400">
              <p className="mb-6">سبد خریدت خالیه.</p>
              <Link href="/shop" className="text-yellow-600 hover:underline">
                برو به فروشگاه
              </Link>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-6">

              {cart.map((item) => (
                <div
                  key={item.code}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.code}</p>
                    <p className="mt-1 text-yellow-600">
                      {item.price.toLocaleString()} تومان
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.code, item.quantity - 1)}
                      className="h-8 w-8 rounded-lg border border-white/20 hover:border-yellow-600"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.code, item.quantity + 1)}
                      className="h-8 w-8 rounded-lg border border-white/20 hover:border-yellow-600"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.code)}
                    className="text-red-400 hover:text-red-300"
                  >
                    حذف
                  </button>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xl font-bold">
                <span>جمع کل</span>
                <span className="text-yellow-600">
                  {total.toLocaleString()} تومان
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full rounded-xl border border-yellow-600 bg-black/30 px-8 py-4 text-center text-white transition-all duration-300 hover:bg-yellow-700 hover:text-black"
              >
                ادامه‌ی خرید
              </Link>

            </div>
          )}

        </Container>
      </main>

      <Footer />
    </>
  );
}