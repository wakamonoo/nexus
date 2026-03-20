"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import CircledButtons from "../buttons/circledBtns";

export default function MarkTitlesAsWatched({ setMarkTitles }) {
  const { titles } = useContext(TitleContext);
  const [marked, SetMarked] = useState([]);

  const toggleMarked = (title) => {
    SetMarked((prev) =>
      prev.some((t) => t.titleId === title.titleId)
        ? prev.filter((t) => t.titleId !== title.titleId)
        : [...prev, title],
    );
  };

  return (
    <div
      onClick={() => setMarkTitles(false)}
      className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-[80%] rounded-2xl overflow-hidden p-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMarkTitles(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 px-2 py-8 h-full w-full overflow-auto custom-scroll">
          {titles.map((title) => {
            const isChecked = marked.some((t) => t.titleId === title.titleId);

            return (
              <div key={title.titleId} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMarked(title)}
                  className="w-4 h-4 accent-[var(--color-accent)]"
                />
                <p className="truncate w-full text-base">{title.title}</p>
              </div>
            );
          })}
          <div className="py-4">
            <CircledButtons>
              <p>Mark as watched</p>
            </CircledButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
