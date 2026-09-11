import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wiccanaccessory.com";
const locales = ["fa", "en"];

const staticPaths = [
  "",
  "/shop",
  "/collections",
  "/about",
  "/contact",
  "/international",
  "/blog",
  "/portfolio/accessory",
  "/portfolio/music",
  "/realms/gothic",
  "/realms/wiccan",
  "/realms/mermaid",
  "/realms/grunge",
  "/realms/decorative",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
      });
    }
  }

  const { data: products } = await supabase
    .from("products")
    .select("code, created_at");

  if (products) {
    for (const product of products) {
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}/product/${product.code}`,
          lastModified: product.created_at ? new Date(product.created_at) : new Date(),
        });
      }
    }
  }

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, created_at")
    .eq("published", true);

  if (posts) {
    for (const post of posts) {
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.created_at ? new Date(post.created_at) : new Date(),
        });
      }
    }
  }

  return entries;
}