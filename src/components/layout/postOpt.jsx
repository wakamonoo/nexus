import { PostContext } from "@/context/postContext";
import { useContext, useEffect, useRef } from "react";
import { FaPen, FaTrash } from "react-icons/fa";

export default function PostOpt({ postId }) {
  const {
    posts,
    setShowDelModal,
    setShowEditModal,
    setSelectedPost,
    setPostToDelete,
    setPostToEdit,
  } = useContext(PostContext);
  const optRef = useRef();

  useEffect(() => {
    const btn = document.getElementById(`btn-${postId}`);
    const handleOutClick = (e) => {
      if (
        optRef.current &&
        !optRef.current.contains(e.target) &&
        btn &&
        !btn.contains(e.target)
      ) {
        setSelectedPost(null);
      }
    };

    document.addEventListener("mousedown", handleOutClick);
    return () => {
      document.removeEventListener("mousedown", handleOutClick);
    };
  }, [postId, setSelectedPost]);

  return (
    <div
      ref={optRef}
      className="flex flex-col absolute top-full right-0 w-60 border-1 border-panel bg-second rounded shadow-2xl p-2 z-50"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setPostToEdit(posts?.find((p) => p.postId === postId));
          setShowEditModal(true);
        }}
        className="flex w-full items-center gap-2 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded cursor-pointer hidden"
      >
        <FaPen className="text-xl shrink-0" />
        <p className="text-base font-bold">Edit post</p>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setPostToDelete(postId);
          setShowDelModal(true);
        }}
        className="flex w-full items-center gap-2 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded cursor-pointer"
      >
        <FaTrash className="text-xl shrink-0" />
        <p className="text-base font-bold">Delete post</p>
      </button>
    </div>
  );
}
