"use client";
import PostLightBox from "@/components/lightBoxes/postLightBox";
import { createContext, useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "./userContext";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { LoaderContext } from "./loaderContext";
import ConfirmPostDeleteModal from "@/components/modals/confirmPostDeleteModal";
import EditPostModal from "@/components/modals/editPostModal";
export const PostContext = createContext();

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

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
  const [userPosts, setUserPosts] = useState(null);
  const [userEchoes, setUserEchoes] = useState(null);
  const [postLightBoxOpen, setPostLightBoxOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState([]);
  const [currentPostInfo, setCurrentPostInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);
  const [postLoading, setPostLoading] = useState(true);
  const [showConfirmPostDeleteModal, setShowConfirmPostDeleteModal] =
    useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const postLightboxRef = useRef();

  const postFetch = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/postGet`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPostLoading(false);
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
            : p,
        ),
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
            : p,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getUserPosts = async (userId) => {
    setPostLoading(true);
    setUserPosts(null);
    try {
      const res = await fetch(`${BASE_URL}/api/posts/postGet/user/${userId}`);

      if (!res.ok) {
        throw new Error("failed to fetch posts");
      }

      const data = await res.json();

      setUserPosts(data);
    } catch (err) {
      console.error(err);
      setUserPosts(null);
    } finally {
      setPostLoading(false);
    }
  };

  const getUserEchoes = async (userId) => {
    setPostLoading(true);
    setUserEchoes(null);
    try {
      const res = await fetch(`${BASE_URL}/api/posts/postGet/echoes/${userId}`);

      if (!res.ok) {
        throw new Error("failed to fetch posts");
      }

      const data = await res.json();

      setUserEchoes(data);
    } catch (err) {
      console.error(err);
      setUserEchoes(null);
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <PostContext.Provider
      value={{
        postFetch,
        posts,
        setPosts,
        getUserPosts,
        userPosts,
        getUserEchoes,
        userEchoes,
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
        postLoading,
        showConfirmPostDeleteModal,
        setShowConfirmPostDeleteModal,
        setShowEditPostModal,
        selectedPost,
        setSelectedPost,
        setPostToDelete,
        setPostToEdit,
      }}
    >
      {children}
      {postLightBoxOpen && <PostLightBox />}
      {showConfirmPostDeleteModal && (
        <ConfirmPostDeleteModal postToDelete={postToDelete} />
      )}
      {showEditPostModal && (
        <EditPostModal
          setShowEditPostModal={setShowEditPostModal}
          postToEdit={postToEdit}
        />
      )}
    </PostContext.Provider>
  );
};
