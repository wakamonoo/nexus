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

export default function MostWatchedTitlesStructureMax() {
  const { setIsLoading } = useContext(LoaderContext);
  const { popular } = useContext(TitleContext);
  const { isTitleWatched, } = useContext(WatchContext);
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
        <div className="flex flex-col w-full justify-center items-center">
          <FaBoxOpen className="text-6xl text-panel" />
          <p className="text-sm text-panel font-normal">
            Sorry, no data to display!
          </p>
        </div>
      )}
    </div>
  );
}
