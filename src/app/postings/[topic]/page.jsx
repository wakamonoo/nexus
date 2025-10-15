"use client";
import PostStructure from "@/components/layout/postStructure";
import { LoaderContext } from "@/context/loaderContext";
import { PostContext } from "@/context/postContext";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";

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
      <div className="bg-panel p-4 flex items-center justify-between">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <p className="uppercase font-bold text-normal text-base truncate w-62">
          Posts from "{decodeURIComponent(topic)}"
        </p>
        <div />
      </div>
      <div className="p-2 flex flex-col gap-1">
        {currentTopic?.map((post, index) => (
          <PostStructure key={index} post={post} />
        ))}
      </div>
    </div>
  );
}
