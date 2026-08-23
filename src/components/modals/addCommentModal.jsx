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
      className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
      >
        <button
          onClick={() => setShowAddCommentModal(false)}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-4 p-2 h-full w-full">
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
            />
            <RegularButtons onClick={() => handleSendComment()}>
              <p className="font-bold text-normal text-base">Add</p>
            </RegularButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
