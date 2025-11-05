"use client";
import { FaRegFileAlt } from "react-icons/fa";
import { useContext } from "react";
import { PostContext } from "@/context/postContext";
import HeroLoader from "@/components/loaders/postsLoader";
import PostStructure from "@/components/layout/postStructure";

export default function Hero() {
  const { posts, coldLoad } = useContext(PostContext);

  return (
    <div>
      <div className="bg-brand w-full">
        {coldLoad ? (
          <div className="py-2">
            <HeroLoader />
          </div>
        ) : posts.length === 0 ? (
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center justify-center">
              <FaRegFileAlt className="text-4xl text-vibe opacity-40" />
              <p className="text-xs text-vibe opacity-40">jajaja</p>
            </div>
          </div>
        ) : (
          <div className="py-2 flex flex-col gap-1">
            {posts.map((post, index) => (
              <PostStructure key={index} post={post} />
            ))}
            <div className="flex justify-center py-8">
              <p className="text-xs text-vibe text-normal opacity-25">
                oopss, that's the end of time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
