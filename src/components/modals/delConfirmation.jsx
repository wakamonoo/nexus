"use client";
import { PostContext } from "@/context/postContext";
import { useContext } from "react";
import { MdClose } from "react-icons/md";
import RegularButtons from "../buttons/regBtns";
import SecondaryButtons from "../buttons/secBtns";

export default function DelConfirm({ onDelete }) {
  const { setShowDelModal } = useContext(PostContext);

  return (
    <div
      onClick={() => setShowDelModal(false)}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-normal">Delete post</h1>
            <p className="mt-0.5 text-xs text-vibe opacity-60 truncate">
              This action cannot be undone.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDelModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-center text-normal font-bold leading-5">
            Are you sure you want to delete this post?
          </p>
        </div>
        <div className="flex gap-2 border-t border-panel p-4">
          <SecondaryButtons onClick={() => onDelete()}>
            <p className="font-bold text-normal text-base">Confirm</p>
          </SecondaryButtons>
          <RegularButtons onClick={() => setShowDelModal(false)}>
            <p className="font-bold text-normal text-base">Cancel</p>
          </RegularButtons>
        </div>
      </div>
    </div>
  );
}
