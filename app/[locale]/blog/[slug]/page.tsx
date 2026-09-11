import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { getLocalizedField } from "@/lib/localizedField";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
          <p>{t("notFound")}</p>
        </main>
        <Footer />
      </>
    );
  }

  const title = getLocalizedField(post.title, post.title_en, locale);
  const content = getLocalizedField(post.content, post.content_en, locale);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
        <Container>
          <div className="mx-auto max-w-2xl">

            {post.cover_image_url && (
              <div className="relative mb-8 h-72 w-full overflow-hidden rounded-2xl">
                <Image
                  src={post.cover_image_url}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <p className="mb-4 text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString(
                locale === "fa" ? "fa-IR" : "en-US"
              )}
            </p>

            <h1 className="mb-8 text-4xl font-bold">{title}</h1>

            <div className="space-y-4 leading-9 text-gray-300 whitespace-pre-line">
              {content}
            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}