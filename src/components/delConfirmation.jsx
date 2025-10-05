"use client";
import { PostContext } from "@/context/postContext";
import { useContext } from "react";
import { MdClose } from "react-icons/md";

export default function DelConfirm({ postId }) {
  const { handlePostDelete, setDelModal } = useContext(PostContext);

  return (
    <div
      onClick={() => setDelModal(false)}
      className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-panel w-[95%] h-[30%] rounded-2xl overflow-hidden"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDelModal(false);
          }}
          className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose />
        </button>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-4">
          <p className="text-center text-normal font-bold py-2">
            Are you sure you want to delete this post?
          </p>
          <div className="w-full flex gap-2">
            <button
              onClick={() => {
                handlePostDelete(postId);
                setDelModal(false);
              }}
              className="flex-1 flex justify-center px-4 py-2 bg-accent rounded-full cursor-pointer"
            >
              <p>Confirm</p>
            </button>
            <button
              onClick={() => setDelModal(false)}
              className="flex-1 flex justify-center px-4 py-2 bg-accent rounded-full cursor-pointer"
            >
              <p>Cancel</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
