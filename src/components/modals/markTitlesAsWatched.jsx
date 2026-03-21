"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import CircledButtons from "../buttons/circledBtns";
import { UserContext } from "@/context/userContext";
import { LoaderContext } from "@/context/loaderContext";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function MarkTitlesAsWatched({ setMarkTitles }) {
  const { user } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [marked, SetMarked] = useState([]);

  const toggleMarked = (title) => {
    SetMarked((prev) =>
      prev.some((t) => t.titleId === title.titleId)
        ? prev.filter((t) => t.titleId !== title.titleId)
        : [...prev, title],
    );
  };

  const handleBulkWatch = async () => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/watched/watchBulk`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.userName,
          titles: marked,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
            <CircledButtons onClick={handleBulkWatch}>
              <p>Mark as watched</p>
            </CircledButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
