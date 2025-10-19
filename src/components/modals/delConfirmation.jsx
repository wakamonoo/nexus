"use client";
import { PostContext } from "@/context/postContext";
import { useContext } from "react";
import { MdClose } from "react-icons/md";
import RegularButtons from "../buttons/regBtns";

export default function DelConfirm({ onDelete }) {
  const { setDelModal } = useContext(PostContext);

  return (
    <div
      onClick={() => setDelModal(false)}
      className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDelModal(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 p-2 h-full w-full">
          <p className="text-center text-normal font-bold py-2">
            Are you sure you want to delete this post?
          </p>
          <div className="w-full flex gap-2">
            <RegularButtons onClick={() => onDelete()}>
              <p className="font-bold text-normal text-base">Confirm</p>
            </RegularButtons>
            <RegularButtons onClick={() => setDelModal(false)}>
              <p className="font-bold text-normal text-base">Cancel</p>
            </RegularButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
