"use client";
import { PostContext } from "@/context/postContext";
import { useContext } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import PostStructure from "../post/postStructure";
import { UserContext } from "@/context/userContext";
import PostLoader from "@/components/loaders/postLoader";

export default function ProfilePosts({ profileUser }) {
  const { posts, coldLoad } = useContext(PostContext);
  const { user, allUsersLoading } = useContext(UserContext);

  const isLoading = coldLoad || allUsersLoading || !profileUser;

  const profileUserPosts = posts.filter((p) => p.userId === profileUser?.uid);

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8 lg:px-16">
          <PostLoader />
        </div>
      ) : profileUserPosts.length === 0 ? (
        <div className="mt-16">
          <div className="flex flex-col items-center justify-center">
            <FaRegFileAlt className="text-4xl text-vibe opacity-40" />
            <p className="text-xs text-vibe opacity-40">
              {`${profileUser?.uid === user?.uid ? "you" : profileUser.name} have no posts yet`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8 lg:px-16">
          {profileUserPosts.map((post, index) => (
            <PostStructure key={index} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
