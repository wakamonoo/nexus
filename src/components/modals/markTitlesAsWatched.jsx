"use client";
import { MdClose } from "react-icons/md";

export default function MarkTitlesAsWatched({ setMarkTitles }) {
  return (
    <div className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed">
      <div className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMarkTitles(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 p-2 h-full w-full">
          <p className="text-center text-normal font-bold py-2">
            Are you sure you want to permanently delete your account?
            <br />
            <span className="text-sm text-vibe opacity-80">
              All data associated with this account will also be deleted,
              including your posts, comments, reviews, reactions (Energized and
              Echoed), watch count and list, and pings in the database. Do you
              still wish to continue?
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
