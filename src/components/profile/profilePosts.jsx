"use client";
import { PostContext } from "@/context/postContext";
import { useContext } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import PostStructure from "../layout/postStructure";

export default function ProfilePosts({ profileUser }) {
  const { posts } = useContext(PostContext);

  const profileUserPosts = posts.filter((p) => p.userId === profileUser?.uid);

  return (
     <div className="w-full">
      {profileUserPosts.length === 0 ? (
        <div className="mt-16">
          <div className="flex flex-col items-center justify-center">
            <FaRegFileAlt className="text-4xl text-vibe opacity-40" />
            <p className="text-xs text-vibe opacity-40">
              You have no posts yet
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
          {profileUserPosts.map((post, index) => (
            <PostStructure key={index} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}