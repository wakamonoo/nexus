"use client";
import PostLightBox from "@/components/lightBoxes/postLightBox";
import { createContext, useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "./userContext";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { LoaderContext } from "./loaderContext";
import DelConfirm from "@/components/modals/delConfirmation";
export const PostContext = createContext();

const APP_ENV = process.env.APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export const PostProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [postLightBoxOpen, setPostLightBoxOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState([]);
  const [currentPostInfo, setCurrentPostInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);
  const [coldLoad, setColdLoad] = useState(true);
  const { setIsLoading } = useContext(LoaderContext);
  const [delModal, setDelModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const postLightboxRef = useRef();
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    postFetch();
  }, []);

  const handleFileClick = (files, index, post) => {
    setCurrentPost(files);
    setInitialIndex(index);
    setCurrentPostInfo(post);
    setPostLightBoxOpen(true);

    const scrollToIndex = () => {
      postLightboxRef.current.scrollTo({
        left: postLightboxRef.current.clientWidth * index,
        behavior: "instant",
      });
    };

    const timeout = setTimeout(() => {
      scrollToIndex();
    }, 0);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    if (postLightBoxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [postLightBoxOpen]);

  const handleEnergize = async (post) => {
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

  const handleEcho = async (post) => {
    try {
      const userId = user.uid;

      const res = await fetch(`${BASE_URL}/api/reacts/postEcho`, {
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
                echoed: data.echoed,
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/posts/deletePost/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.uid }),
      });
      await postFetch();
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "RPost deletion failed, please try again later!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
      console.error(err);
    } finally {
      setPostLightBoxOpen(false);
      if (pathname.startsWith("/post")) {
        router.back();
      }
      setIsLoading(false);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Post deleted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };

  return (
    <PostContext.Provider
      value={{
        postFetch,
        posts,
        handleEnergize,
        handleEcho,
        handleFileClick,
        currentPost,
        currentPostInfo,
        showDetails,
        setShowDetails,
        initialIndex,
        postLightBoxOpen,
        setPostLightBoxOpen,
        postLightboxRef,
        coldLoad,
        handlePostDelete,
        delModal,
        setDelModal,
        selectedPost,
        setSelectedPost,
        setPostToDelete,
      }}
    >
      {children}
      {postLightBoxOpen && <PostLightBox />}
      {delModal && (
        <DelConfirm
          onDelete={() => {
            handlePostDelete(postToDelete);
            setDelModal(false);
          }}
        />
      )}
    </PostContext.Provider>
  );
};
