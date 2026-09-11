import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { getLocalizedField } from "@/lib/localizedField";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
        <Container>

          <h1 className="mb-16 text-center text-5xl font-bold">
            {tNav("blog")}
          </h1>

          {!posts || posts.length === 0 ? (
            <p className="text-center text-gray-400">{t("empty")}</p>
          ) : (
            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
              {posts.map((post) => {
                const title = getLocalizedField(post.title, post.title_en, locale);
                const excerpt = getLocalizedField(post.excerpt, post.excerpt_en, locale);

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-yellow-600"
                  >
                    {post.cover_image_url && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={post.cover_image_url}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="mb-2 text-xl font-bold">{title}</h2>
                      {excerpt && (
                        <p className="text-sm text-gray-400">{excerpt}</p>
                      )}
                      <p className="mt-4 text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString(
                          locale === "fa" ? "fa-IR" : "en-US"
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </Container>
      </main>

      <Footer />
    </>
  );
}