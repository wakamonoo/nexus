import { PostContext } from "@/context/postContext";
import { useContext, useEffect, useRef } from "react";
import { FaTrash } from "react-icons/fa";

export default function PostOpt({ postId }) {
  const { setDelModal, setSelectedPost, setPostToDelete } =
    useContext(PostContext);
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
      className="absolute top-10 right-4 w-fit bg-accent rounded shadow-2xl px-4 py-2 z-50"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setPostToDelete(postId);
          setDelModal(true);
        }}
        className="cursor-pointer flex items-center justify-center text-base font-bold gap-1"
      >
        <FaTrash className="text-xl" />
        <p className="text-base font-bold">Delete Post</p>
      </button>
    </div>
  );
}
