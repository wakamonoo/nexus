import { PostContext } from "@/context/postContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import CircledButtons from "../buttons/circledBtns";
import DeleteList from "../modals/deleteList";
import EditList from "../modals/editList";

export default function ListOpt({
  setShowListOpt,
  setShowEditListModal,
  setShowDeleteListModal,
}) {
  return (
    <div
      onClick={() => setShowListOpt(false)}
      className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowListOpt(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 p-2 h-full w-full">
          <div className="w-full flex gap-2">
            <CircledButtons
              onClick={() => {
                setShowEditListModal(true);
                setShowListOpt(false);
              }}
            >
              <p className="font-bold text-normal text-base">Edit list</p>
            </CircledButtons>
            <CircledButtons
              onClick={() => {
                setShowDeleteListModal(true);
                setShowListOpt(false);
              }}
            >
              <p className="font-bold text-normal text-base">Delete list</p>
            </CircledButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
