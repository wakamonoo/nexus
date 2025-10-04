"use client";
import Loader from "@/components/loader";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";

export default function Posting() {
  const { user } = useContext(UserContext);
  const { posts } = useContext(PostContext);

  const isLoading = !user || !posts;

  if (isLoading) {
    return <Loader />;
  }

  const userPosts = posts.filter((p) => p.userId === user?.uid);
  return (
    <div>
      {userPosts.length === 0 ? (
        <div></div>
      ) : (
        userPosts.map((post, i) => (
          <div key={i}>
            <p>{post.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
