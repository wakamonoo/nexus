"use client";
import PostStructure from "@/components/layout/postStructure";
import { LoaderContext } from "@/context/loaderContext";
import { PostContext } from "@/context/postContext";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import GoatTitlesStructureMin from "@/components/layout/goatTitlesStructureMin";
import GoatTitlesStructureMax from "@/components/layout/goatTitlesStructureMax";
import PostsLoader from "@/components/loaders/postsLoader";

export default function TopicPostings() {
  const { topic } = useParams();
  const { posts } = useContext(PostContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const currentTopic = posts?.filter(
    (p) => p.topic === decodeURIComponent(topic)
  );
  return (
    <div className="bg-brand w-full">
      <div className="relative bg-panel border-b-1 border-[var(--color-secondary)] p-6 flex justify-center items-center">
        <FaAngleLeft
          onClick={() => router.back()}
          className="absolute left-2 sm:left-4 md:left-8 lg:left-16 xl:left-32 text-2xl cursor-pointer"
        />
        <p className="absolute left-1/2 -translate-x-1/2 uppercase font-bold text-normal truncate">
          Posts from "{decodeURIComponent(topic)}"
        </p>
      </div>
      <aside className="p-2 md:hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <GoatTitlesStructureMin />
        </div>
      </aside>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr] md:gap-4 items-start md:px-8 lg:px-16 xl:px-32">
        <main className="md:py-2 md:sticky md:top-0">
          <div className="p-2 flex flex-col gap-1">
            {!currentTopic ? (
              <PostsLoader />
            ) : (
              currentTopic?.map((post, index) => (
                <PostStructure key={index} post={post} />
              ))
            )}
          </div>
        </main>
        <aside className="w-full h-full hidden md:block">
          <div className="w-full md:py-4">
            <GoatTitlesStructureMax />
          </div>
        </aside>
      </div>
    </div>
  );
}
