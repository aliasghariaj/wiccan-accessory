import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
          <p>پست پیدا نشد.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white" dir="rtl">
        <Container>
          <div className="mx-auto max-w-2xl">

            {post.cover_image_url && (
              <div className="relative mb-8 h-72 w-full overflow-hidden rounded-2xl">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <p className="mb-4 text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString("fa-IR")}
            </p>

            <h1 className="mb-8 text-4xl font-bold">{post.title}</h1>

            <div className="space-y-4 leading-9 text-gray-300 whitespace-pre-line">
              {post.content}
            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}