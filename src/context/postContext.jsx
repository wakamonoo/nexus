"use client";
import LightBox from "@/components/lightBox";
import { createContext, useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "./userContext";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState([]);
  const [currentPostInfo, setCurrentPostInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);
  const [coldLoad, setColdLoad] = useState(true);
  const lightboxRef = useRef();

  useEffect(() => {
    const postFetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/posts/postGet`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setColdLoad(false);
      }
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

  const handleLike = async (post) => {
    try {
      const userId = user.uid;

      const res = await fetch(`${BASE_URL}/api/reacts/postEnergize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.postId,
          userId,
        }),
      });
      const data = await res.json();

      setPosts(
        posts.map((p) =>
          p.postId === post.postId
            ? {
                ...p,
                energized: data.energized,
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        handleLike,
        handleFileClick,
        currentPost,
        currentPostInfo,
        showDetails,
        setShowDetails,
        initialIndex,
        lightboxOpen,
        setLightboxOpen,
        lightboxRef,
        coldLoad,
      }}
    >
      {children}
      {lightboxOpen && <LightBox />}
    </PostContext.Provider>
  );
};
