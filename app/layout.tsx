import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import SupportButton from "@/components/common/SupportButton";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "Wiccan Accessory",
  description: "Handmade Gothic, Medieval and Fantasy Accessories by Orkideh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
