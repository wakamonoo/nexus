"use client";
import LightBox from "@/components/lightBox";
import { createContext, useEffect, useState, useRef } from "react";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState([]);
  const [currentPostInfo, setCurrentPostInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);
  const lightboxRef = useRef();

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

  const handleFileClick = (files, index, post) => {
    setCurrentPost(files);
    setInitialIndex(index);
    setCurrentPostInfo(post);
    setLightboxOpen(true);

    setTimeout(() => {
      if (lightboxRef.current) {
        const fileWidth = lightboxRef.current.children[0].offsetWidth;
        lightboxRef.current.scrollLeft = fileWidth * index;
      }
    }, 50);
  };

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <PostContext.Provider
      value={{
        posts,
        handleFileClick,
        currentPost,
        currentPostInfo,
        showDetails,
        setShowDetails,
        initialIndex,
        lightboxOpen,
        setLightboxOpen,
        lightboxRef,
      }}
    >
      {children}
      {lightboxOpen && <LightBox />}
    </PostContext.Provider>
  );
};
