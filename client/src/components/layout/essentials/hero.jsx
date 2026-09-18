"use client";
import { FaRegFileAlt } from "react-icons/fa";
import { useContext } from "react";
import { PostContext } from "@/context/postContext";
import PostsLoader from "@/components/loaders/postsLoader";
import PostStructure from "@/components/layout/post/postStructure";
import { TitleContext } from "@/context/titleContext";
import { UserContext } from "@/context/userContext";

export default function Hero() {
  const { posts, postLoading } = useContext(PostContext);
  const { titlesLoad } = useContext(TitleContext);
  const { allUsersLoading } = useContext(UserContext);

  const isLoading = postLoading || titlesLoad || allUsersLoading;

  return (
    <div>
      <div className="bg-brand w-full">
        <div className="flex items-center gap-2 my-2">
          <p className="text-base font-bold text-vibe opacity-60">
            The Collective
          </p>
          <div className="flex-1 border-t-2 border-panel" />
        </div>
        {isLoading ? (
          <PostsLoader />
        ) : posts.length === 0 ? (
          <div className="flex h-full w-full justify-center items-center my-16">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-panel flex items-center justify-center">
                <FaRegFileAlt className="text-5xl text-vibe opacity-60 p-2" />
              </div>
              <div className="w-40 text-center">
                <p className="text-xs text-vibe opacity-60 leading-tight">
                  No posts yet.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
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
