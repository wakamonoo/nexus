"use client";
import { createContext, useEffect, useState } from "react";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postFetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/posts/postGet`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {}
    };

    postFetch();
  }, []);

  return (
    <PostContext.Provider value={{ posts }}>{children}</PostContext.Provider>
  );
};
