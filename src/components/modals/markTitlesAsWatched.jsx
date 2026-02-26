"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext } from "react";
import { MdClose } from "react-icons/md";

export default function MarkTitlesAsWatched({ setMarkTitles }) {
  const { titles } = useContext(TitleContext);

  return (
    <div className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed">
      <div className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-[80%] rounded-2xl overflow-hidden p-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMarkTitles(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 p-2 h-full w-full overflow-auto">
          {titles.map((title) => {
            return (
              <div className="">
                <p>{title.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}