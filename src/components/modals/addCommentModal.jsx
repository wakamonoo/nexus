"use client";
import { UserContext } from "@/context/userContext";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";
import { LoaderContext } from "@/context/loaderContext";
import { ListContext } from "@/context/listContext";
import Avatar from "@/assets/defaultAvatar.png";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function AddCommentModal({
  listId,
  user,
  setShowAddCommentModal,
}) {
  const [commentText, setCommentText] = useState("");
  const { setLists } = useContext(ListContext);
  const { setIsLoading } = useContext(LoaderContext);

  const handleSendComment = async () => {
    try {
      setIsLoading(true);

      if (!commentText.trim()) return;

      const newComment = {
        userId: user.uid,
        textComment: commentText,
      };

      const response = await fetch(
        `${BASE_URL}/api/lists/addComment/${listId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();

      setLists((prev) =>
        prev.map((list) =>
          list.listId === listId
            ? { ...list, comments: [...(list.comments || []), data.comment] }
            : list,
        ),
      );

      setCommentText("");

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Comment succesfully added!",
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
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed adding comment!",
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
    } finally {
      setIsLoading(false);
      setShowAddCommentModal(false);
    }
  };

  return (
    <div
      onClick={() => setShowAddCommentModal(false)}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-normal">Add comment</h1>
            <p className="mt-0.5 text-xs text-vibe opacity-60 truncate">
              Add your thoughts on this list.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddCommentModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex py-2 justify-start items-center gap-2">
            <img
              src={user?.picture || Avatar.src.src}
              alt={user?.name}
              loading="lazy"
              decoding="async"
              className="w-10 h-10 rounded-full"
            />
            <p className="text-base text-normal font-bold">{user?.name}</p>
          </div>
          <div className="w-full h-full py-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What's your thoughts about this list?"
              className="bg-text text-base text-brand w-full h-64 rounded p-2"
            />{" "}
          </div>
        </div>
        <div className="flex border-t border-panel p-4">
          <RegularButtons onClick={() => handleSendComment()}>
            <p className="font-bold text-normal text-base">Add</p>
          </RegularButtons>
        </div>
      </div>
    </div>
  );
}
