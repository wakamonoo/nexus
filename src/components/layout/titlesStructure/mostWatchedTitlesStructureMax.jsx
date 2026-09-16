"use client";
import { LoaderContext } from "@/context/loaderContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titleNavContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useContext, useEffect } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import TitleCard from "../title/titleCard";
import { FaClapperboard } from "react-icons/fa6";

export default function MostWatchedTitlesStructureMax() {
  const { setIsLoading } = useContext(LoaderContext);
  const { popular } = useContext(TitleContext);
  const { isTitleWatched } = useContext(WatchContext);
  const { handleShowNav } = useContext(TitleNavContext);

  let previousCount = null;
  let currentRank = 0;

  const ranked = popular.map((t, index) => {
    if (t.watchCount !== previousCount) {
      currentRank = index + 1;
      previousCount = t.watchCount;
    }
    return { ...t, rank: currentRank };
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,104px)] md:grid-cols-[repeat(auto-fill,128px)] justify-center gap-2">
      {ranked.length > 0 ? (
        ranked.map((unit) => (
          <TitleCard
            key={unit.titleId}
            unit={unit}
            isWatched={isTitleWatched(unit.titleId)}
            onOpen={() => handleShowNav(unit.titleId)}
            popular={true}
          />
        ))
      ) : (
        <div className="flex h-full w-full justify-center items-center my-16">
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-panel flex items-center justify-center">
              <FaClapperboard className="text-5xl text-vibe opacity-60 p-2" />
            </div>
            <div className="w-40 text-center">
              <p className="text-xs text-vibe opacity-60 leading-tight">
                Nothing here to explore yet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
