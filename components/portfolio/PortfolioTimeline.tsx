"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

type Post = {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  image_url: string | null;
  video_url: string | null;
  activity_date: string;
};

function getEmbedUrl(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.includes("youtu.be")
      ? url.split("/").pop()
      : new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

export default function PortfolioTimeline({ category }: { category: "music" | "accessory" }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const { data } = await supabase
        .from("portfolio_posts")
        .select("*")
        .eq("category", category)
        .eq("published", true)
        .order("activity_date", { ascending: false });

      if (data) setPosts(data as Post[]);
      setLoading(false);
    }
    loadPosts();
  }, [category]);

  if (loading) return <p className="text-center text-gray-400">در حال بارگذاری...</p>;

  if (posts.length === 0) {
    return <p className="text-center text-gray-400">هنوز پستی اضافه نشده.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-12">
      {posts.map((post) => (
        <div key={post.id} className="relative border-r-2 border-yellow-700/40 pr-8">

          <div className="absolute right-[-9px] top-1 h-4 w-4 rounded-full bg-yellow-600" />

          <p className="mb-2 text-sm text-yellow-600">
            {new Date(post.activity_date).toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "long",
            })}
          </p>

          <h3 className="mb-4 text-2xl font-bold">{post.title}</h3>

          {post.media_type === "photo" && post.image_url && (
            <div className="relative mb-4 h-72 w-full overflow-hidden rounded-2xl">
              <Image src={post.image_url} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {post.media_type === "video" && post.video_url && (
            <div className="mb-4 aspect-video w-full overflow-hidden rounded-2xl">
              <iframe
                src={getEmbedUrl(post.video_url)}
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          )}

          {post.description && (
            <p className="leading-8 text-gray-300">{post.description}</p>
          )}

        </div>
      ))}
    </div>
  );
}