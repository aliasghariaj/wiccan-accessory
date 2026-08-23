import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white" dir="rtl">
        <Container>

          <h1 className="mb-16 text-center text-5xl font-bold">
            وبلاگ
          </h1>

          {!posts || posts.length === 0 ? (
            <p className="text-center text-gray-400">هنوز پستی منتشر نشده.</p>
          ) : (
            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-yellow-600"
                >
                  {post.cover_image_url && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-400">{post.excerpt}</p>
                    )}
                    <p className="mt-4 text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </Container>
      </main>

      <Footer />
    </>
  );
}