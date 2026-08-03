export type CartItem = {
  code: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

const CART_KEY = "wiccan_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = getCart();
  const existing = cart.find((i) => i.code === item.code);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeFromCart(code: string) {
  const cart = getCart().filter((i) => i.code !== code);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function updateQuantity(code: string, quantity: number) {
  const cart = getCart();
  const item = cart.find((i) => i.code === code);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}